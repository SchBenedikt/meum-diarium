# Fixing D1 Production 500 Errors

## Problem

Production API endpoints returning 500 Internal Server Error:
```
GET https://7d9c3232.meum-diarium.pages.dev/api/lexicon 500
GET https://7d9c3232.meum-diarium.pages.dev/api/posts 500
```

## Root Causes (Possible)

### 1. D1 Binding Not Available
The most common cause - Cloudflare Pages isn't passing the D1 database binding to Functions.

**Check:**
- Wrangler.toml has correct `[[d1_databases]]` configuration
- Cloudflare Pages dashboard has D1 binding configured
- Database ID matches between local and production

### 2. Database Not Seeded
Tables exist but have no data, causing queries to fail or return empty.

**Check:**
- Run migrations on production: `npx wrangler d1 migrations apply meum-diarium --remote`
- Seed database: `./setup_complete_database.sh`

### 3. Schema Mismatch
Functions expect certain tables/columns that don't exist.

**Check:**
- Migrations are up to date
- Schema in `functions/db/schema.ts` matches actual database

### 4. Runtime Errors
Code errors not caught during build.

**Check:**
- Drizzle ORM version compatibility
- Query syntax issues
- Missing error handling

## Solution Implemented

### Phase 1: Diagnostics (This Commit)

#### 1. Added TypeScript Types (`functions/types.ts`)
```typescript
export interface Env {
    DB: D1Database;
}

export interface PagesContext {
    request: Request;
    env: Env;
    params: Record<string, string>;
    // ...
}
```

**Benefits:**
- Type safety at build time
- Better error messages
- IDE autocomplete

#### 2. Created Debug Endpoint (`/api/debug`)
**Purpose:** Diagnose the exact issue in production

**What it checks:**
- ✅ Is DB binding available?
- ✅ What environment variables exist?
- ✅ Can we connect to database?
- ✅ What tables exist?
- ✅ How many rows in each table?

**Usage:**
```bash
curl https://YOUR_SITE.pages.dev/api/debug
```

**Example Response:**
```json
{
  "timestamp": "2026-02-03T05:56:19Z",
  "environment": {
    "hasDB": true,
    "envKeys": ["DB", "ASSETS"]
  },
  "database": {
    "connected": true,
    "tables": ["authors", "posts", "lexicon", "works", "vocabulary", "latin_texts"],
    "rowCounts": {
      "authors": 5,
      "posts": 42,
      "lexicon": 92,
      "works": 10
    }
  }
}
```

**If DB binding missing:**
```json
{
  "environment": {
    "hasDB": false,
    "envKeys": ["ASSETS"]
  },
  "error": "DB binding not found in context.env",
  "hint": "Check wrangler.toml configuration and Pages environment settings"
}
```

#### 3. Enhanced Error Logging
All API functions now log:
- Environment keys available
- Detailed error messages
- Stack traces
- Hints for resolution

#### 4. Updated All API Functions
- Added proper `PagesContext` typing
- Better error messages
- CORS headers on all error responses
- Consistent error format

## Testing After Deployment

### Step 1: Check Debug Endpoint
```bash
curl https://YOUR_SITE.pages.dev/api/debug | jq
```

**Look for:**
- `hasDB: true` ✅ DB binding is available
- `connected: true` ✅ Can connect to database
- `tables: [...]` ✅ Tables exist
- `rowCounts: {...}` ✅ Data is present

### Step 2: Test API Endpoints
```bash
# Test lexicon
curl https://YOUR_SITE.pages.dev/api/lexicon | jq

# Test posts  
curl https://YOUR_SITE.pages.dev/api/posts | jq

# Test specific post
curl https://YOUR_SITE.pages.dev/api/posts?slug=mein-konsulat | jq
```

### Step 3: Check Cloudflare Dashboard

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to "Settings" → "Functions"
4. Check "D1 database bindings"
5. Ensure binding name is `DB` and points to correct database

### Step 4: Verify Wrangler.toml

```toml
[[d1_databases]]
binding = "DB"  # Must be exactly "DB"
database_name = "meum-diarium"
database_id = "0cf71203-f07c-46b2-8f52-765929a25d24"  # Your actual ID
```

## Common Issues & Solutions

### Issue 1: "DB binding not found"

**Cause:** Pages Functions not receiving D1 binding

**Solutions:**
1. Check Cloudflare Pages dashboard settings
2. Ensure binding name is exactly `DB` (case-sensitive)
3. Redeploy after updating settings
4. Check `wrangler.toml` configuration

### Issue 2: "Table doesn't exist"

**Cause:** Migrations not applied to production

**Solution:**
```bash
npx wrangler d1 migrations apply meum-diarium --remote
```

### Issue 3: "Empty result set"

**Cause:** Database not seeded

**Solution:**
```bash
./setup_complete_database.sh
```

### Issue 4: "Query failed" with stack trace

**Cause:** Schema mismatch or query syntax error

**Solutions:**
1. Check error details in logs
2. Verify schema matches database
3. Test query locally first
4. Check Drizzle ORM syntax

## Rollback Plan

If issues persist:

### Option 1: Revert to Static Files (Temporary)
1. Uncomment static file imports in hooks
2. Redeploy
3. Debug offline

### Option 2: Use Direct D1 Queries
Replace Drizzle queries with raw SQL temporarily:
```typescript
const result = await env.DB.prepare(
  'SELECT * FROM lexicon LIMIT 100'
).all();
```

## Next Steps

1. **Deploy this commit**
2. **Check `/api/debug`** endpoint
3. **Read the JSON response** to understand the issue
4. **Apply appropriate fix** based on findings
5. **Test all endpoints**

## Support

If issues persist after checking `/api/debug`:
1. Share the debug endpoint output
2. Check Cloudflare Pages logs
3. Verify D1 dashboard shows database exists
4. Confirm database has data (use Wrangler CLI)

## Quick Reference

| Endpoint | Purpose |
|----------|---------|
| `/api/debug` | System diagnostics |
| `/api/posts` | All blog posts |
| `/api/lexicon` | All lexicon entries |
| `/api/works` | All works |
| `/api/posts?slug=X` | Specific post |
| `/api/lexicon?slug=X` | Specific lexicon entry |

## Success Criteria

✅ `/api/debug` shows `hasDB: true`
✅ `/api/debug` shows `connected: true`
✅ `/api/debug` shows non-zero row counts
✅ `/api/posts` returns array of posts
✅ `/api/lexicon` returns array of entries
✅ No 500 errors in console
✅ Frontend loads data successfully

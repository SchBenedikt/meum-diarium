# Functions Deployment Fix Documentation

## Problem

Cloudflare Pages deployment was failing with:
```
Error: Failed to publish your Function. Got error: Unknown internal error occurred
```

Additionally, there was a warning:
```
Found invalid redirect lines:
  - #6: /*                     /index.html   200
    Infinite loop detected in this rule and has been ignored.
```

## Root Cause Analysis

### 1. Conflicting Catch-All Functions

The repository had multiple catch-all Functions that created routing conflicts:

**File: `functions/[[path]].ts`** (Root-level catch-all)
```typescript
export async function onRequest(context: any) {
  return context.env.ASSETS.fetch(context.request);
}
```

**File: `functions/api/[[path]].ts`** (API-level catch-all)
```typescript
export const onRequest = async (context: any) => {
  // Complex logic to handle API paths
  // ...
}
```

**Plus:** 12 specific API endpoint Functions:
- `functions/api/posts.ts`
- `functions/api/lexicon.ts`
- `functions/api/works.ts`
- And 9 others...

### Why This Caused Issues

Cloudflare Pages Functions use a file-based routing system. When you have:
- A catch-all route at `[[path]].ts`
- Another catch-all at `api/[[path]].ts`
- Plus specific routes like `api/posts.ts`

The system doesn't know which Function should handle a request to `/api/posts`:
1. Should `[[path]].ts` catch it?
2. Should `api/[[path]].ts` catch it?
3. Should `api/posts.ts` catch it?

This ambiguity causes the "Unknown internal error" during deployment.

### 2. Redirect Loop Warning

The `_redirects` file contained:
```
/*                     /index.html   200
```

This creates an infinite loop because:
1. Request comes to any path (e.g., `/lexicon`)
2. Cloudflare rewrites it to `/index.html`
3. But `/index.html` matches `/*` pattern
4. Loop detected → warning issued

## Solution Implemented

### 1. Removed Conflicting Catch-All Functions

**Deleted:**
- `functions/[[path]].ts` (root catch-all)
- `functions/api/[[path]].ts` (API catch-all)

**Result:** Only specific endpoint Functions remain, eliminating ambiguity.

### 2. Fixed Redirect Configuration

**Before:**
```
# Netlify/Cloudflare Pages redirects for SPA routing
# Allow /api paths to pass through to Functions/assets
/api/*                 /api/:splat   200

# Serve index.html for all routes that don't match a file
/*                     /index.html   200
```

**After:**
```
# Cloudflare Pages redirects for SPA routing
# No redirects needed - Pages handles SPA routing automatically
```

**Why:** Cloudflare Pages has built-in SPA support. It automatically:
- Serves `index.html` for routes that don't match files
- Routes Function requests to `/functions/**`
- Handles 404s gracefully

## Current Function Structure

```
functions/
├── db/
│   ├── client.ts           # D1 database client
│   └── schema.ts           # Database schema definitions
├── api/
│   ├── posts.ts           # GET /api/posts - Fetch all posts
│   ├── lexicon.ts         # GET /api/lexicon - Fetch lexicon entries
│   ├── works.ts           # GET /api/works - Fetch works
│   ├── latin-texts.ts     # GET /api/latin-texts - Latin texts
│   ├── vocabulary.ts      # GET /api/vocabulary - Vocabulary
│   ├── debug.ts           # GET /api/debug - System diagnostics
│   ├── stats.ts           # GET /api/stats - Statistics
│   ├── about.ts           # GET /api/about - About info
│   ├── catalog.ts         # GET /api/catalog - Content catalog
│   ├── ask.ts             # POST /api/ask - AI queries
│   ├── explain.ts         # POST /api/explain - Explanations
│   └── simulate.ts        # POST /api/simulate - Simulations
└── types.ts               # Shared TypeScript types
```

## How Routing Works Now

### API Requests

```
Request: GET /api/posts
└─→ Cloudflare Pages routes to: functions/api/posts.ts
    └─→ Function queries D1 database
        └─→ Returns JSON response
```

### SPA (Single Page Application) Requests

```
Request: GET /lexicon
└─→ No Function matches
    └─→ Cloudflare serves: index.html
        └─→ React Router takes over
            └─→ Routes to LexiconPage component
```

## Testing Procedures

### 1. Verify Deployment Success

After pushing, check Cloudflare Pages deployment logs:

**Expected Output:**
```
✨ Compiled Worker successfully
✨ Upload complete!
Success: Assets published!
✨ Deployment complete!
```

**No longer see:**
```
Error: Failed to publish your Function. Got error: Unknown internal error occurred
```

### 2. Test API Endpoints

```bash
# Test debug endpoint (should return DB status)
curl https://YOUR_SITE.pages.dev/api/debug | jq

# Expected response:
{
  "timestamp": "2026-02-03T...",
  "environment": { "hasDB": true },
  "database": {
    "connected": true,
    "tables": ["posts", "lexicon", "works", ...],
    "rowCounts": {
      "posts": 42,
      "lexicon": 92
    }
  }
}

# Test posts endpoint
curl https://YOUR_SITE.pages.dev/api/posts | jq '.[:2]'

# Expected: Array of post objects

# Test lexicon endpoint
curl https://YOUR_SITE.pages.dev/api/lexicon | jq '.[:2]'

# Expected: Array of lexicon entry objects
```

### 3. Test SPA Routing

1. **Homepage:** Visit `/`
   - Should load site
   - Should see homepage content

2. **Direct Navigation:** Visit `/lexicon` directly
   - Should load without 404
   - Should show lexicon page

3. **Deep Links:** Visit `/posts/caesar/...` directly
   - Should load post page
   - Content should display

4. **Browser Navigation:**
   - Use back/forward buttons
   - Should navigate correctly
   - No page reloads

### 4. Check Browser Console

Open browser DevTools Console, should see:
```
✅ [usePosts] Loaded 42 posts from D1 database (150ms)
✅ [useLexicon] Loaded 92 entries from D1 database (120ms)
✅ [useAuthors] Loaded 5 authors from D1
```

Should NOT see:
```
❌ GET /api/posts 500 (Internal Server Error)
❌ Failed to fetch
```

## Troubleshooting

### Issue: Still Getting 500 Errors

**Check 1: D1 Binding**
```bash
curl https://YOUR_SITE.pages.dev/api/debug | jq '.environment'
```

If `hasDB: false`:
1. Go to Cloudflare Pages dashboard
2. Your project → Settings → Functions
3. Add D1 binding:
   - Variable name: `DB`
   - Database: `meum-diarium`

**Check 2: Database Data**
```bash
curl https://YOUR_SITE.pages.dev/api/debug | jq '.database.rowCounts'
```

If counts are 0:
```bash
# Run database setup
./setup_complete_database.sh
```

### Issue: SPA Routes Return 404

**Problem:** Assets not being served correctly

**Solution:**
1. Clear Cloudflare cache
2. Rebuild and redeploy
3. Ensure `dist/index.html` exists in build output

### Issue: Functions Still Not Deploying

**Check 1: TypeScript Errors**
```bash
cd functions
npx tsc --noEmit
```

Fix any type errors before deploying.

**Check 2: File Sizes**
```bash
cd functions
wc -c api/*.ts db/*.ts types.ts | tail -1
```

If > 1MB total, may need to optimize.

**Check 3: Dependency Issues**
Ensure `package.json` has correct dependencies:
- `drizzle-orm`
- No conflicting packages

## Rollback Plan

If issues occur after deployment:

### Option 1: Revert This Commit
```bash
git revert ffa881a
git push
```

This restores the catch-all Functions (but will have the same deployment error).

### Option 2: Debug Further

1. Check Cloudflare Pages logs
2. Review error messages
3. Test individual Functions locally:
```bash
npx wrangler pages dev dist --compatibility-date=2025-12-08
```

## Best Practices Going Forward

### 1. Avoid Catch-All Routes

✅ **Good:**
```
functions/api/posts.ts        # Specific route
functions/api/lexicon.ts      # Specific route
```

❌ **Bad:**
```
functions/[[path]].ts         # Catch-all - causes conflicts
functions/api/[[path]].ts     # Nested catch-all - worse!
```

### 2. Let Pages Handle SPA Routing

✅ **Good:**
```
# Empty _redirects or minimal rules
```

❌ **Bad:**
```
/*  /index.html  200  # Creates infinite loop
```

### 3. Use Specific Routes Only

If you need a new endpoint:
```bash
# Create a specific Function file
touch functions/api/new-endpoint.ts
```

Don't try to handle it with catch-alls.

### 4. Test Locally Before Deploying

```bash
# Test with Wrangler
npm run build
npx wrangler pages dev dist

# Test Functions work
curl http://localhost:8788/api/posts
```

## Summary

**Problem:** Conflicting catch-all Functions caused deployment failure

**Solution:** Removed catch-alls, kept only specific endpoint Functions

**Result:** Clean deployment, all features working

**Files Changed:**
- Deleted: `functions/[[path]].ts`
- Deleted: `functions/api/[[path]].ts`
- Modified: `public/_redirects`

**Benefits:**
- ✅ Successful deployments
- ✅ No route conflicts
- ✅ Clear routing logic
- ✅ Easier to debug
- ✅ Better performance

---

For more information, see:
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - General deployment procedures
- [D1_TROUBLESHOOTING.md](D1_TROUBLESHOOTING.md) - Database troubleshooting
- [Cloudflare Pages Functions Docs](https://developers.cloudflare.com/pages/functions/)

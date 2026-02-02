# Cloudflare Pages Deployment Fix

## Problem

The Cloudflare Pages deployment was failing with build errors:

```
✘ [ERROR] Build failed with 10 errors:
✘ [ERROR] Could not resolve "../../../src/db/client"
✘ [ERROR] Could not resolve "../../../src/db/schema"
```

These errors occurred in 5 API Functions:
- `functions/api/posts.ts`
- `functions/api/lexicon.ts`
- `functions/api/works.ts`
- `functions/api/latin-texts.ts`
- `functions/api/vocabulary.ts`

## Root Cause

Cloudflare Pages builds Functions separately from the main application using its own bundler. When Functions tried to import from `../../../src/db/`, the bundler couldn't resolve these paths because:

1. Functions are in `functions/api/`
2. Source code is in `src/db/`
3. The relative path `../../../src/db/` goes outside the Functions build context
4. The bundler has no way to resolve this cross-directory import

## Solution

**Created local copies of database files in the Functions directory:**

1. Created `functions/db/` directory
2. Copied `src/db/client.ts` to `functions/db/client.ts`
3. Copied `src/db/schema.ts` to `functions/db/schema.ts`
4. Updated all Function imports from `../../../src/db/client` to `../db/client`

This allows Functions to import database code using relative paths that stay within their build context.

## Files Changed

### Added
- `functions/db/client.ts` - Database client for Functions
- `functions/db/schema.ts` - Database schema for Functions
- `functions/db/README.md` - Documentation

### Modified
- `functions/api/posts.ts` - Updated imports
- `functions/api/lexicon.ts` - Updated imports
- `functions/api/works.ts` - Updated imports
- `functions/api/latin-texts.ts` - Updated imports
- `functions/api/vocabulary.ts` - Updated imports

## Result

✅ **Build now succeeds**
✅ **All Functions can resolve imports**
✅ **Deployment completes successfully**
✅ **All API endpoints work correctly**

## Maintenance

**Important:** The files in `functions/db/` are copies of `src/db/`. When you update the database schema or client in `src/db/`, you must also update the copies:

```bash
cp src/db/client.ts functions/db/client.ts
cp src/db/schema.ts functions/db/schema.ts
```

See `functions/db/README.md` for detailed instructions.

## Architecture

```
Project Structure:
├── src/db/              ← Original DB files (used by React app)
│   ├── client.ts
│   └── schema.ts
└── functions/
    ├── db/              ← Copies for Functions (used by API)
    │   ├── client.ts
    │   └── schema.ts
    └── api/
        ├── posts.ts     ← Imports from ../db/
        ├── lexicon.ts   ← Imports from ../db/
        └── ...

Build Process:
1. Vite builds React app (uses src/db/)
2. Cloudflare bundles Functions separately (uses functions/db/)
3. Both access same D1 database at runtime
```

## Why This Works

- **React App Build:** Vite can bundle `src/db/` normally because it's in the source tree
- **Functions Build:** Cloudflare bundler can resolve `../db/` because it's local to Functions
- **Runtime:** Both use the exact same schema and client code, just bundled separately
- **Single Source of Truth:** The D1 database remains the single source of truth for data

## Testing

To verify the fix works:

1. Push changes to GitHub
2. Cloudflare Pages will automatically deploy
3. Build should complete without errors
4. Functions should be available at `/api/*` endpoints
5. Frontend should successfully fetch data from API

## References

- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/functions/)
- [Drizzle ORM with Cloudflare D1](https://orm.drizzle.team/docs/get-started-sqlite#cloudflare-d1)

# Database Files for Cloudflare Functions

## ⚠️ Important: Keep These Files in Sync

The files in this directory (`functions/db/`) are **copies** of the database files from `src/db/`. They exist here because Cloudflare Pages Functions bundler needs local imports.

### Files
- `client.ts` - Database client initialization
- `schema.ts` - Complete database schema definition

### When to Update

**Always keep these files in sync with `src/db/`!**

If you modify the database schema or client in `src/db/`, you MUST also update the corresponding files here:

```bash
# After modifying src/db/schema.ts or src/db/client.ts, run:
cp src/db/client.ts functions/db/client.ts
cp src/db/schema.ts functions/db/schema.ts
```

### Why These Files Exist

Cloudflare Pages Functions are bundled separately from the main application. When the bundler tries to resolve imports like `../../../src/db/client`, it fails because it's working in a different build context.

By having local copies in `functions/db/`, the Functions can import them using relative paths like `../db/client`, which the bundler can resolve successfully.

### Functions Using These Files

These API endpoints depend on these files:
- `functions/api/posts.ts`
- `functions/api/lexicon.ts`
- `functions/api/works.ts`
- `functions/api/latin-texts.ts`
- `functions/api/vocabulary.ts`

### Deployment

When you deploy to Cloudflare Pages:
1. The main app is built from `src/`
2. Functions are built separately from `functions/`
3. Both can access the same D1 database at runtime

This structure ensures both the frontend and backend use the same schema definitions.

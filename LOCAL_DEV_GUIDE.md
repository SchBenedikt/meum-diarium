# Local Development Guide

## Overview

The application has been migrated to use **Cloudflare D1** as the primary database. This means local development behaves differently than production.

## System Architecture

```
Production (Cloudflare Pages):
Browser → Frontend → Cloudflare Functions → D1 Database

Local Development:
Browser → Frontend → Local Server → Empty/Stub Data
```

## Running Locally

```bash
npm run dev
```

**What happens:**
- Frontend starts on `http://localhost:9002`
- Backend server starts on `http://localhost:3001`
- Server provides SEO endpoints (robots.txt, sitemap)
- API endpoints return empty data (no local D1 database)

## Expected Behavior

### ✅ Works Locally
- Site loads without errors
- Admin login works (password: "benedikt")
- Navigation between pages
- UI components display correctly
- No crashes or server errors

### ⚠️ Limited in Local Dev
- **Posts**: Empty list (no data without D1)
- **Lexicon**: Empty list (no data without D1)
- **Authors**: Stub data (hardcoded IDs)
- **Search**: No results (no data to search)

### ✅ Works in Production (Cloudflare)
- All posts loaded from D1
- All lexicon entries from D1
- All authors from D1
- Full search functionality
- Admin CMS fully functional

## Development Workflow

### 1. UI/Frontend Development
Work on components, layouts, and styling locally:
```bash
npm run dev
# Work on UI - all components visible even with empty data
```

### 2. Testing with Real Data
Deploy to Cloudflare Pages to test with D1 database:
```bash
npm run build
# Then deploy to Cloudflare Pages
```

### 3. Database Changes
Update database via Cloudflare Wrangler:
```bash
# Apply migrations
npx wrangler d1 migrations apply meum-diarium --remote

# Seed database
./setup_complete_database.sh

# Verify
npm run db:verify:remote
```

## Admin CMS

The admin panel is protected with password authentication.

**Access:**
1. Navigate to `/admin/login`
2. Enter password: `benedikt`
3. Access admin dashboard

**Features:**
- Create/edit/delete posts
- Manage lexicon entries
- Edit author profiles
- Manage works and translations
- Tag management

## File Structure Changes

### Removed (No Longer Needed)
- `src/content/posts/*` - 42 files removed
- `src/content/lexicon/*` - 92 files removed
- All static content now in D1 database

### Kept (Essential)
- `src/data/*.ts` - Type definitions and minimal stubs
- `src/hooks/*` - React Query hooks for D1 data
- `functions/api/*` - Cloudflare Function API endpoints
- `server/index.ts` - Simplified local dev server

## Troubleshooting

### "No posts found" locally
**Expected behavior.** Local dev has no D1 database. Deploy to Cloudflare to see data.

### "API 500 errors" locally
**Fixed.** If you still see these, make sure you're running the latest code with the simplified server.

### Changes don't show in production
1. Make sure database is seeded: `./setup_complete_database.sh`
2. Clear Cloudflare cache
3. Verify data in database: `npm run db:verify:remote`

### React Router deprecation warnings
**Fixed.** Future flags added to BrowserRouter for React Router v7 compatibility.

## Deployment Checklist

Before deploying to production:

1. **Database Setup**
   ```bash
   # 1. Apply migrations
   npx wrangler d1 migrations apply meum-diarium --remote
   
   # 2. Seed database
   ./setup_complete_database.sh
   
   # 3. Verify
   npm run db:verify:remote
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Deploy to Cloudflare Pages**
   - Connect GitHub repository
   - Configure build command: `npm run build`
   - Configure build output: `dist`
   - Add environment variables (if any)

4. **Verify Production**
   - Check console logs show D1 usage
   - Verify all posts load
   - Verify lexicon works
   - Test admin login and CMS

## Console Logs

### Production (Expected)
```
✅ [usePosts] Loaded 42 posts from D1 database (150ms)
   Data source: Cloudflare D1 via API

✅ [useLexicon] Loaded 92 entries from D1 database (120ms)
   Data source: Cloudflare D1 via API
```

### Local Dev (Expected)
```
⚠️ [usePosts] D1 database returned empty result
📁 Empty state displayed

⚠️ [useLexicon] D1 database returned empty result
📁 Empty state displayed
```

## Summary

**Local Development:**
- Great for UI/component work
- No real data (stub/empty)
- Fast iteration
- No database setup needed

**Production (Cloudflare):**
- Full functionality
- Real data from D1
- Admin CMS works
- All features available

**The app is designed to be deployed to Cloudflare Pages for full functionality.**

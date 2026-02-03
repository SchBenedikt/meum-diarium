# Cloudflare Pages Deployment Guide

Complete guide for deploying Meum Diarium to Cloudflare Pages.

## Pre-Deployment Checklist

### 1. Database Setup

Ensure D1 database is configured and populated:

```bash
# Apply migrations (creates tables)
npx wrangler d1 migrations apply meum-diarium --remote

# Seed data (adds content)
./setup_complete_database.sh

# Verify
npm run db:verify:remote
```

**Expected output:**
```
✓ Authors: 5/5
✓ Posts: 42/42
✓ Lexicon: 92/92
```

### 2. Build Test

Verify the project builds successfully:

```bash
# Clean install
rm -rf node_modules dist
npm ci

# Build
npm run build

# Verify dist/ directory
ls -la dist/
```

**Should see:**
- `index.html`
- `assets/` directory with JS and CSS files
- No errors during build

### 3. Functions Check

Verify Functions are valid:

```bash
# Check TypeScript
cd functions
npx tsc --noEmit

# List Functions
find . -name "*.ts" -type f

# Check file sizes
wc -c api/*.ts db/*.ts types.ts | tail -1
```

**Should see:**
- No TypeScript errors
- 14 Function files
- Total size < 1MB

### 4. Local Test

Test locally before deploying:

```bash
# Build first
npm run build

# Run local Pages server
npx wrangler pages dev dist --compatibility-date=2025-12-08

# In another terminal, test endpoints
curl http://localhost:8788/api/debug | jq
curl http://localhost:8788/api/posts | jq '.[:2]'
```

## Deployment Methods

### Method 1: Git Push (Recommended)

**Automatic deployment via Git:**

```bash
# Commit changes
git add .
git commit -m "Your commit message"

# Push to trigger deployment
git push origin main
```

Cloudflare will automatically:
1. Detect the push
2. Run `npm run build`
3. Deploy to production
4. Update URL

### Method 2: Manual Deploy with Wrangler

**Deploy directly using Wrangler CLI:**

```bash
# Build first
npm run build

# Deploy
npx wrangler pages deploy dist --project-name=meum-diarium
```

### Method 3: Cloudflare Dashboard

**Manual upload via dashboard:**

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Click "Create deployment"
4. Upload `dist/` directory
5. Click "Deploy"

## Monitoring Deployment

### 1. Watch Deployment Logs

In Cloudflare Pages dashboard:
1. Go to your project
2. Click "Deployments"
3. Click on the latest deployment
4. Watch logs in real-time

### 2. Expected Log Output

**Successful deployment:**
```
Initializing build environment...
✓ Installing dependencies
✓ Building application
✓ Compiling Functions
✨ Compiled Worker successfully
✓ Uploading assets
✨ Upload complete!
Success: Assets published!
✨ Deployment complete!
```

**Failed deployment:**
```
✘ [ERROR] Build failed...
```
or
```
Error: Failed to publish your Function...
```

### 3. Check Deployment Status

```bash
# Using Wrangler
npx wrangler pages deployments list --project-name=meum-diarium

# Shows:
# - Deployment ID
# - Status (Active/Failed)
# - Created date
# - URL
```

## Post-Deployment Verification

### 1. Test API Endpoints

```bash
# Get your site URL
SITE_URL="https://YOUR_SITE.pages.dev"

# Test debug endpoint
curl $SITE_URL/api/debug | jq

# Expected: DB status with connected: true

# Test posts endpoint
curl $SITE_URL/api/posts | jq '.[:2]'

# Expected: Array of 2 posts

# Test lexicon endpoint
curl $SITE_URL/api/lexicon | jq '.[:2]'

# Expected: Array of 2 lexicon entries
```

### 2. Test Website in Browser

**Homepage:**
1. Visit your site URL
2. Should load without errors
3. Check console (F12) - should see success messages

**Navigation:**
1. Click "Lexicon" link
2. Should load lexicon page
3. Click on an entry
4. Should show entry details

**Direct URLs:**
1. Visit `/lexicon` directly
2. Visit `/posts/caesar/...` directly
3. Both should work without 404

### 3. Verify Database Connection

In browser console (F12), look for:
```
✅ [usePosts] Loaded 42 posts from D1 database (150ms)
   Data source: Cloudflare D1 via API
```

If you see:
```
⚠️ [usePosts] D1 database returned empty result
```

Then check `/api/debug` endpoint.

### 4. Test Admin Functions

1. Visit `/admin/login`
2. Enter password: `benedikt`
3. Should access admin dashboard
4. Try creating/editing content
5. Changes should save to database

## Common Deployment Issues

### Issue 1: "Failed to publish your Function"

**Cause:** Route conflicts or Function errors

**Solution:**
1. Check for catch-all Functions (`[[path]].ts`)
2. Remove conflicting routes
3. See [FUNCTIONS_FIX.md](FUNCTIONS_FIX.md)

### Issue 2: "Build failed"

**Cause:** TypeScript errors or missing dependencies

**Solution:**
```bash
# Check TypeScript
npx tsc --noEmit

# Reinstall dependencies
rm -rf node_modules
npm ci

# Try build again
npm run build
```

### Issue 3: "500 Internal Server Error" on API

**Cause:** D1 binding not configured

**Solution:**
1. Go to Cloudflare Pages dashboard
2. Your project → Settings → Functions
3. Add D1 binding:
   - Variable name: `DB`
   - Database: `meum-diarium`
4. Redeploy

### Issue 4: Empty Data (0 posts/lexicon)

**Cause:** Database not seeded

**Solution:**
```bash
# Seed database
./setup_complete_database.sh

# Verify
npm run db:verify:remote
```

### Issue 5: SPA Routes Return 404

**Cause:** Missing index.html or incorrect routing

**Solution:**
1. Check `dist/index.html` exists
2. Ensure `_redirects` file is minimal
3. Clear Cloudflare cache
4. Redeploy

### Issue 6: "Infinite loop detected"

**Cause:** Problematic redirect rule

**Solution:**
Check `public/_redirects`:
```
# Should be empty or minimal
# Do NOT include:
/*  /index.html  200  # ← This causes loop
```

## Rollback Procedures

### Option 1: Rollback via Dashboard

1. Go to Cloudflare Pages dashboard
2. Your project → Deployments
3. Find previous working deployment
4. Click "..." menu → "Rollback to this deployment"
5. Confirm

### Option 2: Rollback via Git

```bash
# Find commit to rollback to
git log --oneline

# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>

# Push
git push origin main --force  # Use with caution!
```

### Option 3: Emergency Rollback

If site is broken:

1. Go to Pages dashboard
2. Pause deployments
3. Rollback to last working version
4. Fix issues locally
5. Test thoroughly
6. Resume deployments
7. Push fix

## Performance Optimization

### 1. Asset Optimization

```bash
# Before deployment, optimize assets
npm run build

# Check sizes
du -sh dist/assets/*

# Large files? Consider:
# - Code splitting
# - Lazy loading
# - Image optimization
```

### 2. Cache Configuration

Add `_headers` file:
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: no-store

/*.html
  Cache-Control: no-cache
```

### 3. Function Optimization

Keep Functions small:
- Split large Functions
- Remove unused imports
- Use tree shaking
- Minimize dependencies

## Continuous Deployment

### Setup GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: meum-diarium
          directory: dist
```

## Best Practices

### 1. Always Test Locally First

```bash
npm run build
npx wrangler pages dev dist
# Test thoroughly before deploying
```

### 2. Use Staging Environment

Consider:
- `main` branch → Production
- `staging` branch → Staging environment
- Test in staging before merging to main

### 3. Monitor After Deployment

- Check Cloudflare Analytics
- Monitor error rates
- Review user feedback
- Watch for issues

### 4. Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update carefully
npm update

# Test after updating
npm run build
npm test
```

### 5. Document Changes

- Update CHANGELOG.md
- Document breaking changes
- Note migration steps
- Update README.md

## Useful Commands

```bash
# List deployments
npx wrangler pages deployments list --project-name=meum-diarium

# View specific deployment
npx wrangler pages deployment tail <deployment-id>

# List projects
npx wrangler pages projects list

# View project details
npx wrangler pages projects view meum-diarium

# Delete deployment (careful!)
npx wrangler pages deployments delete <deployment-id>
```

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Functions Docs](https://developers.cloudflare.com/pages/functions/)

## Related Documentation

- [FUNCTIONS_FIX.md](FUNCTIONS_FIX.md) - Functions deployment fix
- [D1_TROUBLESHOOTING.md](D1_TROUBLESHOOTING.md) - Database issues
- [DEPLOYMENT_FIX.md](DEPLOYMENT_FIX.md) - Build configuration fixes
- [LOCAL_DEV_GUIDE.md](LOCAL_DEV_GUIDE.md) - Local development

---

**Quick Reference:**

Pre-deploy: `npm ci && npm run build && npm test`
Deploy: `git push origin main`
Verify: Check `/api/debug` endpoint
Issues: See troubleshooting section above

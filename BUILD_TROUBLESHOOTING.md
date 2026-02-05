# Build Troubleshooting Guide

## Issue: "tsx: not found" error during build

### Problem
When deploying to Cloudflare Pages, the build fails with the error:
```
sh: 1: tsx: not found
```

This happens during the `prebuild` script execution, which runs before the main `vite build` command.

### Root Cause
The issue occurs when:
1. Cloudflare Pages restores dependencies from cache
2. The cache is incomplete or corrupted (missing the `tsx` executable)
3. The PATH doesn't include `node_modules/.bin`
4. The `tsx` command is called directly without using `npx`

### Solution
All npm scripts that use `tsx` now use `npx tsx` instead of just `tsx`. This ensures that the `tsx` executable is properly resolved from `node_modules/.bin/`, even when the PATH is not correctly configured.

### Changed Scripts
The following scripts in `package.json` have been updated to use `npx tsx`:
- `server`: Run the development server
- `prebuild`: Generate sitemap and export API data before building
- `api:export`: Export API data
- `sitemap`: Generate sitemap
- `sitemap:watch`: Watch and regenerate sitemap
- `db:verify`: Verify database (local)
- `db:verify:remote`: Verify database (remote)
- `db:check-duplicates`: Check for duplicate entries

### Cloudflare Pages Configuration

To ensure successful builds on Cloudflare Pages, use these settings:

**Build Configuration:**
- Build command: `npm run build`
- Build output directory: `/dist`
- Root directory: `/` (or leave empty)
- Node version: 18 or higher

**Environment Variables (if needed):**
- `NODE_VERSION`: `18` (or higher)
- `NPM_FLAGS`: `--legacy-peer-deps` (only if needed for dependency conflicts)

### Build Process

The build process runs in the following order:

1. **Install Dependencies** (automatic by Cloudflare Pages)
   ```bash
   npm install
   ```

2. **Pre-build Scripts** (runs automatically before `vite build`)
   ```bash
   npx tsx scripts/generate-sitemap.ts
   npx tsx scripts/export-api-data.ts
   ```

3. **Vite Build**
   ```bash
   vite build
   ```

4. **Output**
   - Static files are generated in `/dist`
   - API data is exported to `/public/api`
   - Sitemap is generated at `/public/sitemap.xml`

### Local Development

To build locally:
```bash
# Install dependencies
npm install

# Run full build
npm run build

# Run development server
npm run dev
```

### Troubleshooting Steps

If the build still fails:

1. **Clear Cloudflare Pages cache:**
   - Go to Cloudflare Pages dashboard
   - Navigate to your project
   - Go to Settings → Builds & deployments
   - Click "Clear build cache"
   - Retry deployment

2. **Check Node version:**
   - Ensure Node.js version is 18 or higher
   - Set `NODE_VERSION` environment variable in Cloudflare Pages settings

3. **Verify dependencies:**
   - Check that `tsx` is listed in `devDependencies` in `package.json`
   - Current version should be `^4.21.0` or higher

4. **Manual verification:**
   ```bash
   # Test if tsx works locally
   npx tsx --version
   
   # Test prebuild scripts
   npm run sitemap
   npm run api:export
   ```

### Common Errors

**Error: "Cannot find module 'tsx'"**
- Solution: Run `npm install` to install all dependencies

**Error: "prebuild exited with code 1"**
- Solution: Check the prebuild logs for specific script errors
- Verify that all TypeScript files in `scripts/` directory are valid

**Error: "vite build failed"**
- Solution: This is a different issue from the tsx problem
- Check Vite configuration in `vite.config.ts`
- Verify all source files are valid TypeScript/React code

### Related Files
- `package.json`: npm scripts configuration
- `scripts/generate-sitemap.ts`: Sitemap generation script
- `scripts/export-api-data.ts`: API data export script
- `vite.config.ts`: Vite build configuration
- `wrangler.toml`: Cloudflare Pages configuration

### Additional Notes

- The `npx` command is recommended over direct binary calls because it:
  - Automatically finds executables in `node_modules/.bin`
  - Works consistently across different environments
  - Doesn't require PATH configuration
  - Is more reliable with cached dependencies

- All scripts should continue to work in local development, CI/CD pipelines, and Cloudflare Pages deployments.

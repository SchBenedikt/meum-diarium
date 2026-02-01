# Troubleshooting: UNIQUE Constraint Errors

## Problem

When seeding the database, you get errors like:

```
✘ [ERROR] UNIQUE constraint failed: lexicon.slug: SQLITE_CONSTRAINT
✘ [ERROR] UNIQUE constraint failed: posts.slug: SQLITE_CONSTRAINT
```

## Why This Happens

This error occurs when trying to insert entries with duplicate primary keys (slugs/IDs). Common causes:

1. **Running seed scripts multiple times** without cleanup
2. **Duplicate entries** in the seed files themselves
3. **Incomplete cleanup** before re-seeding
4. **Script interrupted** mid-execution, leaving partial data

## Quick Fix

### Option 1: Use the New Improved Script (Recommended)

The new `seed_database.sh` script handles errors better and always cleans up first:

```bash
chmod +x seed_database.sh
./seed_database.sh
```

This script will:
- ✅ Always cleanup before seeding
- ✅ Show detailed error messages
- ✅ Ask if you want to continue on errors
- ✅ Provide a summary of what was inserted

### Option 2: Manual Cleanup + Old Script

```bash
# Step 1: Clean the database
npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes

# Step 2: Wait a moment
sleep 5

# Step 3: Run the seed script
./apply_seeds.sh
```

### Option 3: Force Fresh Start

```bash
# Delete all data manually
npx wrangler d1 execute meum-diarium --remote --command "
PRAGMA foreign_keys = OFF;
DELETE FROM latin_texts;
DELETE FROM vocabulary;
DELETE FROM posts;
DELETE FROM lexicon;
DELETE FROM works;
DELETE FROM authors;
PRAGMA foreign_keys = ON;
" --yes

# Then run the seed script
./seed_database.sh
```

## Check for Duplicates in Seed Files

Before seeding, check if your seed files contain duplicates:

```bash
npx tsx scripts/check-duplicates.ts
```

This will scan all seed files and report any duplicate IDs/slugs.

**Example output:**
```
🔍 Checking lexicon table...
  Found 10 seed file(s)
  ❌ Found 2 duplicate(s):
     • "legion" appears in:
       - seed_lexicon_1.sql
       - seed_lexicon_5.sql
```

## Step-by-Step Resolution

### 1. Verify Database State

Check what's currently in the database:

```bash
npm run db:verify:remote
```

### 2. Clean the Database

```bash
npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes
```

**Verify cleanup worked:**
```bash
npx wrangler d1 execute meum-diarium --remote --command "
SELECT 'authors' as table_name, COUNT(*) as count FROM authors
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'lexicon', COUNT(*) FROM lexicon
UNION ALL SELECT 'works', COUNT(*) FROM works
" --json
```

Expected result: All counts should be 0.

### 3. Run Seed Script

Use the new improved script:

```bash
./seed_database.sh
```

**Or** use the old script if you prefer:

```bash
./apply_seeds.sh
```

### 4. Verify Success

```bash
npm run db:verify:remote
```

Expected result:
- Authors: 5
- Posts: 42
- Lexicon: 92
- Works: multiple

## Common Issues

### Issue: "PRAGMA foreign_keys = OFF" not working

**Solution:** SQLite in D1 might not support PRAGMA commands the same way. The DELETE statements should still work.

### Issue: Cleanup script runs but data still exists

**Solution:** Wait a few seconds between cleanup and seeding:

```bash
npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes
sleep 10
./apply_seeds.sh
```

### Issue: Only some seed files fail

**Solution:** The new `seed_database.sh` script asks if you want to continue. You can:
- Continue to insert what you can
- Or abort and investigate the specific file

Check which file has the issue:
```bash
npx tsx scripts/check-duplicates.ts
```

### Issue: Error says "table does not exist"

**Solution:** You need to run migrations first:

```bash
npx wrangler d1 migrations apply meum-diarium --remote
```

Then try seeding again.

## Prevention

### Before Each Seed:

1. **Always cleanup first**:
   ```bash
   npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes
   ```

2. **Check for duplicates**:
   ```bash
   npx tsx scripts/check-duplicates.ts
   ```

3. **Use the improved script**:
   ```bash
   ./seed_database.sh  # This always cleans up first
   ```

### When Editing Seed Files:

- Never create duplicate slugs/IDs
- Use unique identifiers for each entry
- Check with the duplicate checker before committing

## Advanced: Upsert Instead of Insert

If you frequently need to re-seed without cleanup, you could modify seed files to use INSERT OR REPLACE:

```sql
-- Instead of:
INSERT INTO lexicon (slug, term, ...) VALUES ('legion', 'Legion', ...);

-- Use:
INSERT OR REPLACE INTO lexicon (slug, term, ...) VALUES ('legion', 'Legion', ...);
```

**Note:** This will overwrite existing entries with the same slug.

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `seed_database.sh` | **Recommended** - Improved seeding with error handling |
| `apply_seeds.sh` | Original seeding script |
| `cleanup_db.sql` | Clear all data from database |
| `scripts/check-duplicates.ts` | Check seed files for duplicates |
| `scripts/verify-database.ts` | Verify database contents |

## Quick Commands Cheat Sheet

```bash
# Check for duplicates in seed files
npx tsx scripts/check-duplicates.ts

# Clean database
npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes

# Seed database (improved script)
./seed_database.sh

# Seed database (original script)
./apply_seeds.sh

# Verify database
npm run db:verify:remote

# Count entries
npx wrangler d1 execute meum-diarium --remote --command "SELECT COUNT(*) FROM posts"
npx wrangler d1 execute meum-diarium --remote --command "SELECT COUNT(*) FROM lexicon"
```

## Need Help?

If errors persist:

1. Share the exact error message
2. Run `npx tsx scripts/check-duplicates.ts` and share output
3. Check if cleanup is working: `npm run db:verify:remote` should show 0 entries after cleanup
4. Try the "Force Fresh Start" option above

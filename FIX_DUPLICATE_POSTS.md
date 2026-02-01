# Fix: Duplicate Post Seeding Issue

## Problem

When running `./seed_database.sh`, the database was only partially populated:
- Expected: 5 authors, 42 posts, 92 lexicon entries
- Actual: 0 authors, 11 posts, 20 lexicon entries

The script reported "success" but verification showed incomplete data.

## Root Cause

The repository contains two sets of post seed files:
1. `seed_posts.sql` - Contains 41 post INSERT statements
2. `seed_posts_1.sql` through `seed_posts_9.sql` - Contains the SAME 41 posts split across 9 files

The `seed_database.sh` script was processing **BOTH** sets of files:
```bash
# Old logic (WRONG)
if [ -f "seed_posts.sql" ]; then
    # Process seed_posts.sql (41 posts)
fi
for file in seed_posts_*.sql; do
    # ALSO process seed_posts_*.sql (same 41 posts again!)
done
```

This caused UNIQUE constraint failures when trying to insert duplicate posts. Some posts succeeded (11), others failed silently.

## Solution

Updated `seed_database.sh` to use **ONLY** the split files (preferred approach):

```bash
# New logic (CORRECT)
if ls seed_posts_*.sql 1> /dev/null 2>&1; then
    # Use split files (preferred)
    for file in seed_posts_*.sql; do
        # Process split files
    done
elif [ -f "seed_posts.sql" ]; then
    # Fallback to main file if split files don't exist
    # Process seed_posts.sql
fi
```

### Additional Improvements

1. **Better Verification**
   - Fixed JSON parsing to actually show counts
   - Validates against expected values (5 authors, 42 posts, 92 lexicon)
   - Shows missing counts: "⚠️ Posts: 11/42 (missing 31)"

2. **Clear Success Criteria**
   ```
   ✓ Database seeding completed successfully!
   
   Validation:
     ✓ Authors: 5/5
     ✓ Posts: 42/42
     ✓ Lexicon: 92/92
   ```

3. **Documentation Updates**
   - Updated `DATABASE_SETUP.md` to clarify split files are used
   - Updated `TROUBLESHOOTING_DUPLICATES.md` with this specific issue

## Files Changed

- `seed_database.sh` - Fixed duplicate processing logic
- `DATABASE_SETUP.md` - Clarified which files are used
- `TROUBLESHOOTING_DUPLICATES.md` - Added this issue to troubleshooting

## How to Apply Fix

If you've already run the script and have partial data:

```bash
# 1. Clean the database
npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes

# 2. Wait a moment
sleep 5

# 3. Run the fixed script
./seed_database.sh
```

Expected output:
```
━━━ Step 4: Seeding Blog Posts ━━━
Using split post files (seed_posts_*.sql)
[1/9] Processing seed_posts_1.sql...
✓ Success
...
[9/9] Processing seed_posts_9.sql...
✓ Success

━━━ Step 5: Verification ━━━
Authors: 5
Posts: 42
Lexicon entries: 92
Works: 8

✓ Database seeding completed successfully!

Validation:
  ✓ Authors: 5/5
  ✓ Posts: 42/42
  ✓ Lexicon: 92/92
```

## Prevention

The script now:
- ✅ Prefers split files over main file
- ✅ Never processes both sets
- ✅ Validates counts after seeding
- ✅ Reports missing entries clearly

## Related Issues

This also explains why users might see UNIQUE constraint errors if they:
- Run seeding multiple times without cleanup
- Have both `seed_posts.sql` and split files present
- Interrupt the script mid-execution

The improved script handles all these cases better.

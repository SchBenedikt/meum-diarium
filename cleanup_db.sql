-- Cleanup script: Remove all data before re-seeding
-- IMPORTANT: Delete in correct order to avoid FK constraint violations

-- Temporarily disable foreign key checks (SQLite specific)
PRAGMA foreign_keys = OFF;

-- Delete all data
DELETE FROM posts;
DELETE FROM lexicon;
DELETE FROM works;
DELETE FROM authors;

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;

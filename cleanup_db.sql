-- Cleanup script: Remove all data before re-seeding
-- IMPORTANT: Delete in correct order to avoid FK constraint violations

-- Temporarily disable foreign key checks (SQLite specific)
PRAGMA foreign_keys = OFF;

-- Delete all data (in correct order to respect foreign keys)
DELETE FROM latin_texts;
DELETE FROM vocabulary;
DELETE FROM posts;
DELETE FROM lexicon;
DELETE FROM works;
DELETE FROM authors;

-- Verify cleanup (optional, for debugging)
-- SELECT 'authors', COUNT(*) FROM authors
-- UNION ALL SELECT 'works', COUNT(*) FROM works
-- UNION ALL SELECT 'posts', COUNT(*) FROM posts
-- UNION ALL SELECT 'lexicon', COUNT(*) FROM lexicon;

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;

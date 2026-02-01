-- Cleanup script: Remove all data before re-seeding
-- Note: Foreign keys are disabled so deletion order doesn't matter for constraints
-- Order is maintained for readability (child tables before parent tables)

-- Temporarily disable foreign key checks
PRAGMA foreign_keys = OFF;

-- Delete data from all tables
-- These will silently fail if tables don't exist (which is fine for cleanup)
DELETE FROM latin_texts;
DELETE FROM vocabulary;
DELETE FROM posts;
DELETE FROM lexicon;
DELETE FROM works;
DELETE FROM authors;

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;

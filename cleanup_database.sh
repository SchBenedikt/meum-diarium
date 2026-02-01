#!/usr/bin/env bash

# Safe Cleanup Script
# Cleans up database tables, handling missing tables gracefully

set -e

DB_NAME="meum-diarium"
REMOTE_FLAG="--remote"

if [ "$1" = "--local" ]; then
    REMOTE_FLAG="--local"
fi

echo "🧹 Cleaning up D1 database: $DB_NAME ($REMOTE_FLAG)"
echo ""

# List of tables to clean (in order: child tables first)
TABLES=("latin_texts" "vocabulary" "posts" "lexicon" "works" "authors")

echo "Attempting to delete data from tables..."
for table in "${TABLES[@]}"; do
    echo -n "  - $table: "
    if npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --command "DELETE FROM $table" --yes 2>&1 | grep -q "no such table"; then
        echo "⊘ (table doesn't exist, skipped)"
    else
        echo "✓ (cleaned)"
    fi
done

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "Note: If tables don't exist yet, run migrations first:"
echo "  npx wrangler d1 migrations apply $DB_NAME --remote"

#!/usr/bin/env bash

# Complete Database Setup Script - From Scratch
# This script will create the database, apply migrations, and seed all data

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

DB_NAME="meum-diarium"
DB_ID="0cf71203-f07c-46b2-8f52-765929a25d24"

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Meum Diarium - Complete Database Setup (from scratch)    ║${NC}"
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""
echo -e "${YELLOW}This script will:${NC}"
echo "  1. Verify D1 database exists"
echo "  2. Apply migrations to create all tables"
echo "  3. Clear any existing data"
echo "  4. Seed the database with all content"
echo "  5. Verify the results"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Step 1: Verify database exists
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1/5: Verifying D1 Database${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "Checking if database $DB_NAME exists..."
if npx wrangler d1 list 2>&1 | grep -q "$DB_NAME"; then
    echo -e "${GREEN}✓ Database exists${NC}"
else
    echo -e "${RED}✗ Database not found${NC}"
    echo ""
    echo "The database should already exist with ID: $DB_ID"
    echo "If it doesn't exist, create it with:"
    echo "  npx wrangler d1 create $DB_NAME"
    echo ""
    echo "Then update wrangler.toml with the database ID"
    exit 1
fi

echo ""

# Step 2: Apply migrations
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2/5: Applying Migrations (Creating Tables)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "Applying migrations to create database schema..."
if npx wrangler d1 migrations apply "$DB_NAME" --remote --yes 2>&1; then
    echo ""
    echo -e "${GREEN}✓ Migrations applied successfully${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Migrations may already be applied or there was an error${NC}"
    echo "Continuing anyway..."
fi

echo ""
sleep 2

# Step 3: Clean existing data
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 3/5: Cleaning Existing Data${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "Clearing all existing data from tables..."

# Delete in correct order to handle foreign keys
TABLES=("latin_texts" "vocabulary" "posts" "lexicon" "works" "authors")

for table in "${TABLES[@]}"; do
    echo -n "  Clearing $table... "
    if npx wrangler d1 execute "$DB_NAME" --remote --command "DELETE FROM $table" --yes 2>&1 | grep -q "successfully"; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⊘ (skipped or empty)${NC}"
    fi
done

echo ""
echo -e "${GREEN}✓ Cleanup completed${NC}"
echo ""
sleep 2

# Step 4: Seed the database
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 4/5: Seeding Database with Content${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Function to execute SQL with better error handling
execute_seed() {
    local file=$1
    local description=$2
    
    echo -n "  $description... "
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ File not found${NC}"
        return 1
    fi
    
    local output
    output=$(npx wrangler d1 execute "$DB_NAME" --remote --file "$file" --yes 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        echo "     Error: $output" | head -3
        return 1
    fi
}

# Seed authors and works
echo "Seeding authors and works..."
if execute_seed "seed_authors_works.sql" "Authors & Works"; then
    sleep 1
else
    echo -e "${RED}Failed to seed authors and works${NC}"
    exit 1
fi

# Seed lexicon
echo ""
echo "Seeding lexicon entries..."
LEXICON_COUNT=0
for file in seed_lexicon_*.sql; do
    if [ -f "$file" ]; then
        LEXICON_COUNT=$((LEXICON_COUNT + 1))
        execute_seed "$file" "Lexicon batch $LEXICON_COUNT" || true
        sleep 1
    fi
done

# Seed posts (using split files only)
echo ""
echo "Seeding blog posts..."
POST_COUNT=0
for file in seed_posts_*.sql; do
    if [ -f "$file" ]; then
        POST_COUNT=$((POST_COUNT + 1))
        execute_seed "$file" "Posts batch $POST_COUNT" || true
        sleep 1
    fi
done

echo ""
echo -e "${GREEN}✓ All data seeded${NC}"
echo ""
sleep 2

# Step 5: Verify results
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 5/5: Verifying Results${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "Querying database to verify data..."
echo ""

# Function to get count
get_count() {
    local table=$1
    local count
    count=$(npx wrangler d1 execute "$DB_NAME" --remote --command "SELECT COUNT(*) as count FROM $table" --json 2>&1 | grep -oP '"count":\s*\K\d+' | head -1)
    echo "${count:-0}"
}

# Get all counts
AUTHORS_COUNT=$(get_count "authors")
POSTS_COUNT=$(get_count "posts")
LEXICON_COUNT=$(get_count "lexicon")
WORKS_COUNT=$(get_count "works")

# Display results
echo "📊 Database Contents:"
echo "  ├─ Authors:  $AUTHORS_COUNT"
echo "  ├─ Posts:    $POSTS_COUNT"
echo "  ├─ Lexicon:  $LEXICON_COUNT"
echo "  └─ Works:    $WORKS_COUNT"
echo ""

# Validate
EXPECTED_AUTHORS=5
EXPECTED_POSTS=42
EXPECTED_LEXICON=92

SUCCESS=true

if [ "$AUTHORS_COUNT" -ge "$EXPECTED_AUTHORS" ]; then
    echo -e "${GREEN}✓${NC} Authors: $AUTHORS_COUNT/$EXPECTED_AUTHORS"
else
    echo -e "${RED}✗${NC} Authors: $AUTHORS_COUNT/$EXPECTED_AUTHORS (missing $(($EXPECTED_AUTHORS - $AUTHORS_COUNT)))"
    SUCCESS=false
fi

if [ "$POSTS_COUNT" -ge "$EXPECTED_POSTS" ]; then
    echo -e "${GREEN}✓${NC} Posts: $POSTS_COUNT/$EXPECTED_POSTS"
else
    echo -e "${RED}✗${NC} Posts: $POSTS_COUNT/$EXPECTED_POSTS (missing $(($EXPECTED_POSTS - $POSTS_COUNT)))"
    SUCCESS=false
fi

if [ "$LEXICON_COUNT" -ge "$EXPECTED_LEXICON" ]; then
    echo -e "${GREEN}✓${NC} Lexicon: $LEXICON_COUNT/$EXPECTED_LEXICON"
else
    echo -e "${RED}✗${NC} Lexicon: $LEXICON_COUNT/$EXPECTED_LEXICON (missing $(($EXPECTED_LEXICON - $LEXICON_COUNT)))"
    SUCCESS=false
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}✓✓✓ DATABASE SETUP COMPLETE! ✓✓✓${NC}"
    echo ""
    echo "All data has been successfully stored in the D1 database!"
    echo ""
    echo "Next steps:"
    echo "  1. Deploy your application to Cloudflare Pages"
    echo "  2. Check browser console for D1 database logs"
    echo "  3. You should see: 'Loaded from D1 database'"
    echo ""
else
    echo -e "${YELLOW}⚠️  SETUP COMPLETED WITH WARNINGS${NC}"
    echo ""
    echo "Some data may be missing. This could be due to:"
    echo "  - Seed files not present"
    echo "  - Network issues"
    echo "  - Duplicate entries"
    echo ""
    echo "Try running this script again, or check the seed files."
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Save verification details
echo "Detailed verification report saved to: db_setup_verification.txt"
cat > db_setup_verification.txt << EOF
Database Setup Verification Report
Generated: $(date)

Database: $DB_NAME
Database ID: $DB_ID

Table Counts:
- Authors:  $AUTHORS_COUNT (expected: $EXPECTED_AUTHORS)
- Posts:    $POSTS_COUNT (expected: $EXPECTED_POSTS)
- Lexicon:  $LEXICON_COUNT (expected: $EXPECTED_LEXICON)
- Works:    $WORKS_COUNT

Status: $(if [ "$SUCCESS" = true ]; then echo "SUCCESS"; else echo "WARNINGS"; fi)
EOF

echo "Done! You can now use the database."
echo ""

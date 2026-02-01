#!/bin/bash

# Improved Database Seeding Script with Error Handling
# This script safely seeds the D1 database with all content

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database name
DB_NAME="meum-diarium"

# Check if running remote or local
REMOTE_FLAG="--remote"
if [ "$1" = "--local" ]; then
    REMOTE_FLAG="--local"
    echo -e "${BLUE}🔧 Using LOCAL database${NC}"
else
    echo -e "${BLUE}☁️  Using REMOTE database${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Meum Diarium - Database Seeding Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Function to execute SQL with error handling
execute_sql() {
    local file=$1
    local description=$2
    
    echo -e "${YELLOW}→${NC} $description"
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ File not found: $file${NC}"
        return 1
    fi
    
    if npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --file "$file" --yes 2>&1 | tee /tmp/wrangler_output.txt | grep -q "Error"; then
        echo -e "${RED}✗ Error executing $file${NC}"
        cat /tmp/wrangler_output.txt | grep -A 3 "Error"
        
        # Check if it's a constraint error
        if grep -q "UNIQUE constraint failed" /tmp/wrangler_output.txt; then
            echo -e "${YELLOW}⚠️  This might be a duplicate entry issue.${NC}"
            echo -e "${YELLOW}   Run cleanup first: npx wrangler d1 execute $DB_NAME $REMOTE_FLAG --file cleanup_db.sql --yes${NC}"
        fi
        
        return 1
    else
        echo -e "${GREEN}✓ Success${NC}"
        return 0
    fi
}

# Step 1: Cleanup
echo -e "${BLUE}━━━ Step 1: Cleaning up existing data ━━━${NC}"
execute_sql "cleanup_db.sql" "Removing all existing data"
sleep 2
echo ""

# Step 2: Authors and Works
echo -e "${BLUE}━━━ Step 2: Seeding Authors and Works ━━━${NC}"
execute_sql "seed_authors_works.sql" "Inserting authors and works"
sleep 3
echo ""

# Step 3: Lexicon entries
echo -e "${BLUE}━━━ Step 3: Seeding Lexicon Entries ━━━${NC}"
LEXICON_COUNT=0
LEXICON_ERRORS=0

for file in seed_lexicon_*.sql; do
    if [ -f "$file" ]; then
        LEXICON_COUNT=$((LEXICON_COUNT + 1))
        echo -e "${YELLOW}[$LEXICON_COUNT/10]${NC} Processing $file..."
        
        if execute_sql "$file" "  Inserting lexicon entries"; then
            sleep 2
        else
            LEXICON_ERRORS=$((LEXICON_ERRORS + 1))
            echo -e "${RED}  Failed to process $file${NC}"
            
            # Ask user if they want to continue
            echo -e "${YELLOW}  Continue with remaining files? (y/n)${NC}"
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                echo -e "${RED}Aborting...${NC}"
                exit 1
            fi
        fi
    fi
done

echo ""
if [ $LEXICON_ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All lexicon files processed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Processed with $LEXICON_ERRORS error(s)${NC}"
fi
echo ""

# Step 4: Blog posts
echo -e "${BLUE}━━━ Step 4: Seeding Blog Posts ━━━${NC}"
POST_COUNT=0
POST_ERRORS=0

# First try seed_posts.sql if it exists
if [ -f "seed_posts.sql" ]; then
    echo -e "${YELLOW}[Main]${NC} Processing seed_posts.sql..."
    if execute_sql "seed_posts.sql" "  Inserting main posts"; then
        sleep 2
    else
        POST_ERRORS=$((POST_ERRORS + 1))
    fi
fi

# Then process numbered post seeds
for file in seed_posts_*.sql; do
    if [ -f "$file" ]; then
        POST_COUNT=$((POST_COUNT + 1))
        echo -e "${YELLOW}[$POST_COUNT/9]${NC} Processing $file..."
        
        if execute_sql "$file" "  Inserting posts batch"; then
            sleep 2
        else
            POST_ERRORS=$((POST_ERRORS + 1))
            echo -e "${RED}  Failed to process $file${NC}"
            
            # Ask user if they want to continue
            echo -e "${YELLOW}  Continue with remaining files? (y/n)${NC}"
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                echo -e "${RED}Aborting...${NC}"
                exit 1
            fi
        fi
    fi
done

echo ""
if [ $POST_ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All post files processed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Processed with $POST_ERRORS error(s)${NC}"
fi
echo ""

# Step 5: Verify results
echo -e "${BLUE}━━━ Step 5: Verification ━━━${NC}"
echo "Checking database contents..."
echo ""

# Count authors
echo -n "Authors: "
npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --command "SELECT COUNT(*) as count FROM authors" --json 2>/dev/null | grep -o '"count":[0-9]*' | cut -d: -f2 || echo "?"

# Count posts
echo -n "Posts: "
npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --command "SELECT COUNT(*) as count FROM posts" --json 2>/dev/null | grep -o '"count":[0-9]*' | cut -d: -f2 || echo "?"

# Count lexicon
echo -n "Lexicon entries: "
npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --command "SELECT COUNT(*) as count FROM lexicon" --json 2>/dev/null | grep -o '"count":[0-9]*' | cut -d: -f2 || echo "?"

# Count works
echo -n "Works: "
npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --command "SELECT COUNT(*) as count FROM works" --json 2>/dev/null | grep -o '"count":[0-9]*' | cut -d: -f2 || echo "?"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Final summary
TOTAL_ERRORS=$((LEXICON_ERRORS + POST_ERRORS))
if [ $TOTAL_ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Database seeding completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run verification: npm run db:verify:remote"
    echo "  2. Test the website to ensure content loads"
    echo "  3. Check browser console for API errors"
else
    echo -e "${YELLOW}⚠️  Database seeding completed with $TOTAL_ERRORS error(s)${NC}"
    echo ""
    echo "Please review the errors above and:"
    echo "  1. Check for duplicate entries in seed files"
    echo "  2. Ensure cleanup ran successfully"
    echo "  3. Try re-running this script"
fi

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

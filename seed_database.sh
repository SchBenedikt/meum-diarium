#!/usr/bin/env bash

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
    
    # Execute and capture both stdout and exit code
    local output
    output=$(npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --file "$file" --yes 2>&1)
    local exit_code=$?
    
    # Check exit code first (most reliable)
    if [ $exit_code -ne 0 ]; then
        echo -e "${RED}✗ Error executing $file${NC}"
        echo "$output" | grep -A 3 "ERROR" || echo "$output"
        
        # Check if it's a constraint error
        if echo "$output" | grep -q "UNIQUE constraint failed"; then
            echo -e "${YELLOW}⚠️  This is a duplicate entry issue.${NC}"
            echo -e "${YELLOW}   Run cleanup first: npx wrangler d1 execute $DB_NAME $REMOTE_FLAG --file cleanup_db.sql --yes${NC}"
        fi
        
        return 1
    fi
    
    echo -e "${GREEN}✓ Success${NC}"
    return 0
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

# Check if split post files exist (preferred method)
if ls seed_posts_*.sql 1> /dev/null 2>&1; then
    echo -e "${YELLOW}Using split post files (seed_posts_*.sql)${NC}"
    
    # Process numbered post seeds
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
elif [ -f "seed_posts.sql" ]; then
    echo -e "${YELLOW}Using main post file (seed_posts.sql)${NC}"
    echo -e "${YELLOW}[Main]${NC} Processing seed_posts.sql..."
    if execute_sql "seed_posts.sql" "  Inserting main posts"; then
        sleep 2
    else
        POST_ERRORS=$((POST_ERRORS + 1))
    fi
else
    echo -e "${RED}⚠️  No post seed files found${NC}"
    POST_ERRORS=$((POST_ERRORS + 1))
fi

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

# Function to get count from D1
get_count() {
    local table=$1
    npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --command "SELECT COUNT(*) as count FROM $table" --json 2>&1 | \
        grep -oP '"count":\s*\K\d+' | head -1 || echo "0"
}

# Count and display
AUTHORS_COUNT=$(get_count "authors")
POSTS_COUNT=$(get_count "posts")
LEXICON_COUNT=$(get_count "lexicon")
WORKS_COUNT=$(get_count "works")

echo "Authors: $AUTHORS_COUNT"
echo "Posts: $POSTS_COUNT"
echo "Lexicon entries: $LEXICON_COUNT"
echo "Works: $WORKS_COUNT"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Final summary with validation
TOTAL_ERRORS=$((LEXICON_ERRORS + POST_ERRORS))

# Validate expected counts
EXPECTED_AUTHORS=5
EXPECTED_POSTS=42
EXPECTED_LEXICON=92

if [ $TOTAL_ERRORS -eq 0 ] && [ "$AUTHORS_COUNT" -ge "$EXPECTED_AUTHORS" ] && [ "$POSTS_COUNT" -ge "$EXPECTED_POSTS" ] && [ "$LEXICON_COUNT" -ge "$EXPECTED_LEXICON" ]; then
    echo -e "${GREEN}✓ Database seeding completed successfully!${NC}"
    echo ""
    echo "Validation:"
    echo "  ✓ Authors: $AUTHORS_COUNT/$EXPECTED_AUTHORS"
    echo "  ✓ Posts: $POSTS_COUNT/$EXPECTED_POSTS"
    echo "  ✓ Lexicon: $LEXICON_COUNT/$EXPECTED_LEXICON"
    echo ""
    echo "Next steps:"
    echo "  1. Test the website to ensure content loads"
    echo "  2. Check browser console for D1 database logs"
else
    echo -e "${YELLOW}⚠️  Database seeding completed with issues${NC}"
    echo ""
    if [ $TOTAL_ERRORS -gt 0 ]; then
        echo "Errors during seeding: $TOTAL_ERRORS"
    fi
    echo "Validation:"
    if [ "$AUTHORS_COUNT" -lt "$EXPECTED_AUTHORS" ]; then
        echo "  ⚠️  Authors: $AUTHORS_COUNT/$EXPECTED_AUTHORS (missing $(($EXPECTED_AUTHORS - $AUTHORS_COUNT)))"
    else
        echo "  ✓ Authors: $AUTHORS_COUNT/$EXPECTED_AUTHORS"
    fi
    if [ "$POSTS_COUNT" -lt "$EXPECTED_POSTS" ]; then
        echo "  ⚠️  Posts: $POSTS_COUNT/$EXPECTED_POSTS (missing $(($EXPECTED_POSTS - $POSTS_COUNT)))"
    else
        echo "  ✓ Posts: $POSTS_COUNT/$EXPECTED_POSTS"
    fi
    if [ "$LEXICON_COUNT" -lt "$EXPECTED_LEXICON" ]; then
        echo "  ⚠️  Lexicon: $LEXICON_COUNT/$EXPECTED_LEXICON (missing $(($EXPECTED_LEXICON - $LEXICON_COUNT)))"
    else
        echo "  ✓ Lexicon: $LEXICON_COUNT/$EXPECTED_LEXICON"
    fi
    echo ""
    echo "Recommended actions:"
    echo "  1. Run verification: npm run db:verify:remote"
    echo "  2. Check for duplicate entries: npm run db:check-duplicates"
    echo "  3. Try running cleanup and re-seeding"
fi

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

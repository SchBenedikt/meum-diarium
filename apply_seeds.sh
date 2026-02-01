#!/bin/zsh

echo "Cleaning up existing data..."
npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes

echo ""
echo "Applying Authors and Works..."
npx wrangler d1 execute meum-diarium --remote --file seed_authors_works.sql --yes

echo "Applying Lexicon..."
# Use zsh sorting or just rely on glob. For lexicon it doesn't matter essentially.
# But to be safe, I'll loop.
for file in seed_lexicon_*.sql; do
    echo "Applying $file..."
    npx wrangler d1 execute meum-diarium --remote --file $file --yes
    sleep 10
done

echo "Applying Posts..."
# First apply seed_posts.sql if it exists
if [ -f seed_posts.sql ]; then
    echo "Applying seed_posts.sql..."
    npx wrangler d1 execute meum-diarium --remote --file seed_posts.sql --yes
    sleep 10
fi

# Then apply numbered post seeds
for file in seed_posts_*.sql; do
    echo "Applying $file..."
    npx wrangler d1 execute meum-diarium --remote --file $file --yes
    sleep 10
done

echo "All Done!"

# Database Setup Guide - Cloudflare D1

## Overview

This application uses **Cloudflare D1** (SQLite-based edge database) as the primary data source for all blog posts and lexicon entries. The file-based content in `src/content/` is kept as a backup and for local development.

## Architecture

### Database Tables

The D1 database contains the following tables:

1. **authors** - Information about historical figures (Caesar, Cicero, etc.)
   - Fields: id, name, latin_name, title, years, birth/death_year, description, hero_image, theme, color, highlights
   
2. **posts** - Blog posts and diary entries
   - Fields: id, slug, author_id, title, excerpt, historical_date, historical_year, date, reading_time, tags, cover_image, content, translations
   - Content stored as JSON: `{ diary: "...", scientific: "..." }`
   
3. **lexicon** - Lexicon entries for terms and concepts
   - Fields: slug, term, variants, definition, category, etymology, related_terms, translations
   
4. **works** - Literary works (De Bello Gallico, etc.)
   - Fields: id, title, author_id, description, type, date, cover_image, content
   
5. **vocabulary** - Latin vocabulary with translations
   
6. **latin_texts** - Full Latin texts with translations

### API Endpoints

All data is accessed through Cloudflare Functions at `/api/*`:

- `GET /api/posts` - Get all posts
- `GET /api/posts?slug=xxx` - Get specific post
- `GET /api/lexicon` - Get all lexicon entries  
- `GET /api/lexicon?slug=xxx` - Get specific entry
- `GET /api/authors` - Get all authors
- `GET /api/works` - Get all works

## Database Population

### Initial Setup

1. **Apply migrations** (creates tables):
   ```bash
   npx wrangler d1 migrations apply meum-diarium --remote
   ```

2. **Seed the database** (populates with content):
   ```bash
   chmod +x apply_seeds.sh
   ./apply_seeds.sh
   ```

The `apply_seeds.sh` script will:
- Clean up any existing data
- Insert all authors and works
- Insert all lexicon entries (92 entries across 10 files)
- Insert all blog posts (42 posts across multiple files)

### Database Contents

After seeding, the database contains:

- **5 Authors**: Caesar, Cicero, Augustus, Catilina, Seneca
- **42 Blog Posts**: Diary entries and historical articles
- **92 Lexicon Entries**: Terms, concepts, and explanations
- **Multiple Works**: De Bello Gallico, De Bello Civili, etc.

### Seed Files Structure

- `cleanup_db.sql` - Clears all data (run first)
- `seed_authors_works.sql` - Authors and their works
- `seed_lexicon_1.sql` to `seed_lexicon_10.sql` - Lexicon entries
- `seed_posts_1.sql` to `seed_posts_9.sql` - Blog posts

## Data Flow

### Production (Cloudflare Pages)

```
User Request → Cloudflare Function (/api/*) → D1 Database → Response
```

### Development (Local)

```
User Request → Express Server (localhost:3001/api/*) → D1 Database or JSON files
```

The frontend automatically detects the environment:
- Production: Uses `/api/*` endpoints (served by Cloudflare Functions)
- Development: Uses `http://localhost:3001/api/*` (served by Express server)

### Fallback Mechanism

The frontend includes a fallback mechanism in `src/hooks/`:

```typescript
// use-posts.ts
const { data: posts } = useQuery({
  queryFn: async () => {
    try {
      const apiPosts = await fetchPosts(); // Try API first
      if (apiPosts && apiPosts.length > 0) return apiPosts;
    } catch (e) {
      console.warn('API fetch failed, falling back to static content');
    }
    return await getAllPosts(); // Fallback to file-based content
  }
});
```

This ensures the app works even if:
- The database is not yet seeded
- There are network issues
- You're working in local development

## File Backup

The original content files are preserved in:

- `src/content/posts/[author]/[slug].ts` - Blog posts
- `src/content/lexicon/[slug].ts` - Lexicon entries  
- `src/data/authors.ts` - Author information
- `src/data/works.ts` - Works information

These files serve as:
1. **Backup** - Original source of truth
2. **Development fallback** - Used when DB is unavailable
3. **Content reference** - For editing and updates

## Updating Content

### Option 1: Update Database Directly

Use Wrangler CLI to execute SQL:

```bash
npx wrangler d1 execute meum-diarium --remote --command "UPDATE posts SET title='New Title' WHERE slug='some-slug'"
```

### Option 2: Regenerate and Re-seed

1. Update the TypeScript files in `src/content/`
2. Regenerate seed files (if you have a script for this)
3. Re-run `./apply_seeds.sh`

### Option 3: Use CMS (Recommended)

The application includes a CMS at `/admin`:
- Edit posts and lexicon entries
- Changes are saved directly to D1
- No need to touch seed files

## Verification

### Check Database Contents

```bash
# Count posts
npx wrangler d1 execute meum-diarium --remote --command "SELECT COUNT(*) as count FROM posts"

# Count lexicon entries  
npx wrangler d1 execute meum-diarium --remote --command "SELECT COUNT(*) as count FROM lexicon"

# List all authors
npx wrangler d1 execute meum-diarium --remote --command "SELECT id, name FROM authors"
```

### Expected Results

- Authors: 5
- Posts: 42
- Lexicon: 92
- Works: Multiple (varies)

## Troubleshooting

### "Database not found"

Ensure the database is created:
```bash
npx wrangler d1 create meum-diarium
```

Then update `wrangler.toml` with the database ID.

### "Table does not exist"

Run migrations:
```bash
npx wrangler d1 migrations apply meum-diarium --remote
```

### "Empty database"

Run the seed script:
```bash
./apply_seeds.sh
```

### Frontend shows no content

Check:
1. Database is seeded (see verification commands)
2. Cloudflare Functions are deployed
3. API endpoints return data (check Network tab)
4. Fallback to file-based content is working

## Schema

The database schema is defined in `src/db/schema.ts` using Drizzle ORM. Migrations are in `drizzle/` directory.

To generate new migrations after schema changes:

```bash
npx drizzle-kit generate:sqlite
```

## Performance

- All API responses include cache headers (`max-age=3600`)
- D1 is globally distributed on Cloudflare's edge
- Queries are optimized with proper indexes
- Frontend includes request caching (5 minutes)

## Backup Strategy

1. **File-based backup**: All content exists in TypeScript files
2. **Export from D1**: Can export database to SQL
3. **Version control**: Seed files are committed to Git
4. **CMS changes**: Should be periodically exported back to seed files

## Future Enhancements

- Automatic sync between CMS changes and seed files
- Database migrations for content updates
- Backup automation
- Content versioning

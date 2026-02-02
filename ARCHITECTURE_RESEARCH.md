# Meum Diarium - Current Architecture Research Report

**Date:** February 2, 2026  
**Focus:** Understanding the current data loading architecture and preparing for migration from file-based to database-driven data

---

## Executive Summary

The **meum-diarium** application currently uses a **hybrid architecture**:
- **Frontend:** React SPA with TypeScript, deployed on Vite
- **Backend:** Express.js development server + Cloudflare Pages Functions for production
- **Database:** Cloudflare D1 (SQLite) configured but **partially integrated** (only posts, lexicon, works have D1 APIs)
- **Data Storage:** Mix of TypeScript files (posts, authors, works, lexicon) and JSON files (pages, details)
- **State Management:** React Context + TanStack Query (React Query) for caching

---

## 1. Current Data Loading Architecture

### 1.1 File-Based Data Sources

#### Posts (Primary Content)
- **Location:** `src/content/posts/{author}/` (e.g., `caesar/`, `cicero/`, `augustus/`, `seneca/`, `catilina/`)
- **Format:** TypeScript files exporting `BlogPost` objects
- **Structure:** Each post contains:
  - Metadata: `id`, `slug`, `author`, `title`, `date`, `historicalDate`, `historicalYear`
  - Dual content: `content.diary` and `content.scientific` (perspective-based)
  - Translations: `translations.en`, `translations.la`, `translations.de`
  - UI metadata: `coverImage`, `readingTime`, `tags`, `tagsWithTranslations`
  - Optional: `diaryTitle`, `scientificTitle`, `latinTitle`, `sidebar` (facts/quotes)
- **Count:** 21 posts for Caesar, multiple for other authors

#### Authors Data
- **Location:** `src/data/authors.ts`
- **Format:** TypeScript object with author IDs as keys
- **Structure:** 
  ```typescript
  caesar: {
    id, name, latinName, title, years, birthYear, deathYear,
    description, heroImage, theme, color, highlights[]
    translations: { en: {...}, la: {...} }
  }
  ```
- **Authors:** caesar, cicero, augustus, seneca, catilina

#### Lexicon (Latin Dictionary)
- **Location:** `src/content/lexicon/{slug}.ts`
- **Format:** TypeScript files exporting `LexiconEntry`
- **Structure:** `term`, `slug`, `variants`, `definition`, `category`, `etymology`, `relatedTerms`, `translations`

#### Works (Classical Literature)
- **Location:** `src/content/works/{slug}.ts`
- **Format:** TypeScript exporting `Work` object
- **Structure:** `title`, `author`, `year`, `summary`, `takeaway`, `structure[]`, `translations`
- **Details:** Stored separately in `src/content/works-details/{slug}.json`

#### Pages
- **Location:** `src/content/pages/{slug}.json`
- **Format:** JSON files
- **Contents:** Static content pages (about, cookies, imprint, privacy, etc.)

#### Translations
- **Location:** `src/locales/{de|en|la}.ts`
- **Format:** TypeScript objects with key-value translation strings
- **Scope:** UI strings, navigation labels, metadata translations

---

### 1.2 Frontend Data Loading Flow

```
User Browser (React SPA)
    ↓
usePosts() Hook (src/hooks/use-posts.ts)
    ↓
    ├─→ [Attempt] fetchPosts() → /api/posts (D1 DB)
    │       ├─ SUCCESS: Use D1 data (logs: "✅ Loaded X posts from D1")
    │       └─ FAILURE: Fall through to static files
    │
    └─→ [Fallback] getAllPosts() → import.meta.glob('src/content/posts/**/*.ts')
            └─ Loads all .ts files from filesystem → Returns BlogPost[]
                ↓
                Translation Step (per language)
                └─ getTranslatedPosts() → Applies translations from state
```

**Key Features:**
- Uses TanStack Query for caching (5-minute cache duration for API calls)
- Graceful fallback: If D1 API fails → uses static TypeScript files
- Translation happens AFTER data loading (client-side)
- In-memory request cache to avoid redundant network calls

---

### 1.3 Backend Data Loading & API Endpoints

#### Express.js Development Server (`server/index.ts`)
Runs on `localhost:3001` during development, provides file-based REST API:

**Posts API:**
- `GET /api/posts` → Scans all author directories, regex-parses `.ts` files
- `GET /api/posts/:author/:slug` → Reads single post, parses TS syntax
- `POST /api/posts` → Creates new post file with TS template
- `DELETE /api/posts/:author/:slug` → Deletes post file

**Authors API:**
- `GET /api/authors` → Regex-extracts author objects from `authors.ts`
- `POST /api/authors` → Adds author to `authors.ts` file
- `PUT /api/authors/:id` → Updates author block
- `DELETE /api/authors/:id` → Removes author with brace-matching

**Lexicon API:**
- `GET /api/lexicon` → Lists all lexicon entries
- `GET /api/lexicon/:slug` → Fetches single entry with translations
- `POST /api/lexicon` → Creates new entry file + updates index
- `DELETE /api/lexicon/:slug` → Removes entry file

**Works API:**
- `GET /api/works` → Lists all works
- `GET /api/works/:slug` → Fetches single work
- `GET/POST/DELETE /api/works/:slug/details` → Manages work detail files

**Pages API:**
- `GET /api/pages` → Lists all pages
- `GET /api/pages/:slug` → Fetches page content
- `POST /api/pages` → Creates/updates page JSON

**Tags API:**
- `GET /api/tags` → Extracts unique tags from all posts
- `PATCH /api/tags` → Renames tag across all posts
- `DELETE /api/tags/:tag` → Removes tag from all posts

**Translations API:**
- `GET /api/translations` → Returns all translations (de/en/la)
- `GET /api/translations/:lang` → Returns single language
- `PUT /api/translations/:lang/:key` → Updates translation value
- `POST /api/translations` → Adds new translation key

#### Cloudflare Pages Functions (Production)
Deploy to Cloudflare Workers for production:

**Implemented D1 APIs (Database-backed):**
- `functions/api/posts.ts` → Queries posts from D1, supports slug/tag filtering
- `functions/api/lexicon.ts` → Queries lexicon from D1 with search support
- `functions/api/works.ts` → Queries works from D1 with author joins

**Static Asset APIs (serve from public/):**
- `functions/api/catalog.ts` → Serves `/api/catalog.json`
- `functions/api/about.ts` → Serves `/api/about.json`

**Catch-All Routing:**
- `functions/api/[[path]].ts` → Tries to serve `/api/{path}.json` from static assets
- Falls back with 404 if file not found

---

## 2. Frontend Data Flow & Components

### Component Architecture

**Pages that load data:**
- `src/pages/Index.tsx` → Home page with author selector + BlogList
- `src/pages/PostPage.tsx` → Single post display with perspective toggle
- `src/pages/LexiconPage.tsx` → Lexicon listing with search
- `src/pages/LexiconEntryPage.tsx` → Single lexicon entry
- `src/pages/WorkPage.tsx` → Single work display

**Components that consume data:**
- `BlogList.tsx` → Filters & displays posts by author, filters by perspective (diary/scientific), renders BlogCard components
- `BlogCard.tsx` → Renders individual post summary card
- `BlogSidebar.tsx` → Shows post facts & quotes from `post.sidebar`
- `HeroSection.tsx` → Displays author hero image from `authors[authorId]`
- `AuthorIntro.tsx` → Shows author metadata & bio
- `TableOfContents.tsx` → Generates from markdown headers in post.content

### Context Providers (State Management)

**AuthorContext** (`src/context/AuthorContext.tsx`):
- Stores `currentAuthor: Author | null`
- Updates document theme class when author changes
- Integrates with React Router params: `/:authorId`

**LanguageContext** (`src/context/LanguageContext.tsx`):
- Stores `language: 'de' | 'en' | 'la'`
- Used by all components for translation lookup
- Triggers re-translation of posts when language changes

### Data Transformation

**Post Translation Timing:**
1. Raw posts loaded from API/files (contains `translations` object)
2. `getTranslatedPost()` / `translatePostInPlace()` applies translations based on language context
3. Components receive already-translated content to display

**Tag Translation:**
- `tagsWithTranslations: TagWithTranslations[]` object contains tag + multilingual variants
- `getPostTags()` extracts German variant from current language context

---

## 3. API Endpoints & Conventions

### Request/Response Patterns

**Successful API Response:**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Cache-Control: public, max-age=3600
X-Data-Source: cloudflare-d1 (or custom header)
X-Post-Count: N (optional, for list endpoints)

Body: JSON object or array
```

**Error Response:**
```json
{
  "error": "Database Error" | "Not Found" | "Validation Error",
  "message": "Human-readable error message",
  "hint": "Diagnostic hint (in development)"
}
```

### Caching Strategy

**Development Server:**
- In-memory cache in `src/lib/api.ts` (5-minute duration)
- Service Worker caches successful responses
- `requestCache.clear()` called on POST/DELETE to invalidate

**Production (Cloudflare):**
- HTTP cache headers: `max-age=3600` (1 hour)
- D1 database queries are fast; caching mainly for bandwidth reduction

**API Base URLs:**
- **Dev:** `http://localhost:3001/api` (proxied via vite.config.ts)
- **Production:** `/api` (relative to domain origin)

---

## 4. Database Schema (Cloudflare D1)

### Configured with Drizzle ORM (`src/db/schema.ts`)

**SQLite Tables (Defined but not all populated):**

#### `authors` table
```typescript
CREATE TABLE authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latin_name TEXT,
  title TEXT,
  years TEXT,
  birth_year INTEGER,
  death_year INTEGER,
  description TEXT,
  hero_image TEXT,
  theme TEXT,
  color TEXT,
  highlights JSON
);
```

#### `posts` table ✅ (Actively seeded)
```typescript
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  author_id TEXT REFERENCES authors(id),
  title TEXT NOT NULL,
  excerpt TEXT,
  historical_date TEXT,
  historical_year INTEGER,
  date TEXT,
  reading_time INTEGER,
  tags JSON,
  cover_image TEXT,
  content JSON, // { diary: "...", scientific: "..." }
  translations JSON
);
```

#### `lexicon` table ✅ (Actively seeded)
```typescript
CREATE TABLE lexicon (
  slug TEXT PRIMARY KEY,
  term TEXT NOT NULL,
  variants JSON,
  definition TEXT NOT NULL,
  category TEXT,
  etymology TEXT,
  related_terms JSON,
  translations JSON
);
```

#### `works` table ✅ (Actively seeded)
```typescript
CREATE TABLE works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author_id TEXT REFERENCES authors(id),
  description TEXT,
  type TEXT,
  date TEXT,
  cover_image TEXT,
  content JSON
);
```

#### `vocabulary` table (Learning words)
```typescript
CREATE TABLE vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latin TEXT NOT NULL,
  german TEXT NOT NULL,
  english TEXT,
  type TEXT, // noun, verb, adjective...
  gender TEXT, // m, f, n
  conjugation TEXT,
  declination TEXT,
  forms JSON,
  example_sentence TEXT,
  example_translation TEXT,
  tags JSON
);
```

#### `latin_texts` table (Full classical texts)
```typescript
CREATE TABLE latin_texts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id TEXT REFERENCES works(id),
  book INTEGER,
  chapter INTEGER,
  section INTEGER,
  verse INTEGER,
  latin_text TEXT NOT NULL,
  german_translation TEXT,
  english_translation TEXT,
  annotations JSON
);
```

### Database Configuration (`wrangler.toml`)
```
[[d1_databases]]
binding = "DB"
database_name = "meum-diarium"
database_id = "0cf71203-f07c-46b2-8f52-765929a25d24"
migrations_dir = "drizzle"
```

### Database Client (`src/db/client.ts`)
```typescript
export const getDb = (env: any) => {
  return drizzle(env.DB, { schema });
};
```

---

## 5. Build & Deployment Configuration

### Vite Build (`vite.config.ts`)
- **Target:** esnext
- **Port:** 9002 (dev), with proxy to `localhost:3001/api`
- **Minify:** terser with console dropping in production
- **Code splitting:**
  - `react-vendor` (React, Router)
  - `query-vendor` (TanStack Query)
  - `ui-components` (Radix UI)
  - `motion` (Framer Motion)
  - `icons` (Lucide)
  - Manual chunks for chunking large libs
- **CSS:** Split per component
- **Compression:** gzip + brotli
- **Sourcemaps:** inline in dev, none in production

### Package.json Scripts
```json
{
  "dev": "concurrently \"vite --host\" \"npm run server\"",
  "server": "tsx watch server/index.ts",
  "build": "vite build",
  "prebuild": "tsx scripts/generate-sitemap.ts && tsx scripts/export-api-data.ts",
  "api:export": "tsx scripts/export-api-data.ts",
  "db:verify": "tsx scripts/verify-database.ts",
  "db:check-duplicates": "tsx scripts/check-duplicates.ts"
}
```

### Admin/Tools
- `tools/content_wizard.py` - Python script for bulk content operations
- `scripts/generate-sitemap.ts` - Generates XML sitemap dynamically
- `scripts/export-api-data.ts` - Exports data to public/api/*.json
- `scripts/verify-database.ts` - Checks D1 connectivity and data integrity

---

## 6. Key Unique Patterns & Constraints

### Pattern #1: Perspective-Based Content
Posts support two parallel narratives:
- **Diary:** First-person historical narrative (e.g., Caesar's perspective)
- **Scientific:** Third-person scholarly analysis

Components toggle between perspectives via `PerspectiveToggle` component and URL param `?p=scientific|diary`.

### Pattern #2: Multilingual Support (3 Languages)
- **de** (German) - primary language, most complete
- **en** (English) - marketing/English-speaking audience
- **la** (Latin) - authentic historical flavor

Translation happens at:
- **UI level:** `src/locales/{language}.ts` for UI strings
- **Post level:** `post.translations[language]` for content
- **Metadata level:** `tagsWithTranslations[]` for tag labels

### Pattern #3: Dual Storage During Transition
Currently experiencing gradual migration:
- **Posts, Lexicon, Works** → Dual mode (file-based primary, D1 secondary)
  - Dev server queries files via regex parsing
  - Prod functions query D1
  - Frontend has fallback logic
- **Authors** → File-based only (no D1 API yet)
- **Pages** → File-based JSON only
- **Translations** → File-based TypeScript only

### Pattern #4: Regex/File-Based Parsing
Express server doesn't import TS files directly; instead **regex-parses** them:
```typescript
const extractString = (content: string, key: string): string => {
  const regex = new RegExp(`['"]?${key}['"]?:\\s*(["'\`])([\\s\\S]*?)(?<!\\\\)\\1,?`);
  const match = content.match(regex);
  return match ? match[2] : '';
};
```
**Why?** Avoids build/import cycles, allows hot-reloading of file changes without server restart.

### Pattern #5: Cache Invalidation
- Dev: Manual cache clear via `requestCache.clear()` on mutations
- Prod: Relies on HTTP caching headers + Service Worker
- No database query result caching (assume D1 is fast enough)

### Pattern #6: Sidebar Metadata
Posts can include optional `sidebar` object with:
- `facts: SidebarFact[]` (labeled facts about the era)
- `quote: { text, translations, author, date, source }`

Displayed in sticky sidebar on desktop, below content on mobile.

---

## 7. Critical Files for Data Flow

### Frontend Data Loading
| File | Purpose | Status |
|------|---------|--------|
| `src/hooks/use-posts.ts` | Main hook for loading posts with fallback logic | 🟢 Active |
| `src/lib/api.ts` | API client functions with caching | 🟢 Active |
| `src/data/posts.ts` | Glob-based static post loader | 🟢 Active (fallback) |
| `src/data/authors.ts` | Author metadata object | 🟢 Active |
| `src/lib/translator.ts` | Post translation/localization | 🟢 Active |
| `src/context/AuthorContext.tsx` | Selected author state | 🟢 Active |
| `src/context/LanguageContext.tsx` | Language selection state | 🟢 Active |

### Backend APIs
| File | Purpose | Status |
|------|---------|--------|
| `server/index.ts` | Express dev server (file-based parsing) | 🟢 Active |
| `functions/api/posts.ts` | D1 posts endpoint (production) | 🟢 Active |
| `functions/api/lexicon.ts` | D1 lexicon endpoint | 🟢 Active |
| `functions/api/works.ts` | D1 works endpoint | 🟢 Active |
| `src/db/schema.ts` | Drizzle ORM schema definition | 🟢 Active |
| `src/db/client.ts` | D1 database client factory | 🟢 Active |

### Configuration
| File | Purpose |
|------|---------|
| `vite.config.ts` | Frontend build + dev server proxy |
| `wrangler.toml` | Cloudflare Pages deployment + D1 binding |
| `drizzle.config.ts` | Drizzle ORM migration settings |
| `tsconfig.app.json` | Frontend TypeScript config |
| `tsconfig.json` | Root TypeScript config |

---

## 8. Data Organization by Content Type

### Posts (Most Complex)
```
src/content/posts/
├── caesar/
│   ├── de-me.ts (self-introduction)
│   ├── das-1-triumvirat.ts (political alliance)
│   ├── die-verschworung-gegen-mich.ts (conspiracy)
│   ├── casar-verschlusselung.ts (cipher)
│   ├── ausweitung-des-burgerrechts.ts (citizenship)
│   └── ... (21 total)
├── cicero/
│   └── ... (posts)
├── augustus/
│   └── ... (posts)
├── seneca/
│   └── ... (posts)
└── catilina/
    └── ... (posts)
```

### Lexicon (Alphabetical by slug)
```
src/content/lexicon/
├── aeneas.ts
├── amphitheater.ts
├── amphora.ts
├── annotatio.ts
└── ... (100+ entries)
```

### Works (Classical Texts)
```
src/content/works/
├── de-bello-civili.ts (Caesar's Civil War)
├── de-bello-gallico.ts (Caesar's Gallic War)
├── caesar-gallia-maps.ts (Map resource)
└── ... (others)

src/content/works-details/
├── de-bello-civili.json (key moments, quotes)
├── de-bello-gallico.json
└── ...
```

### Pages (Static Content)
```
src/content/pages/
├── about.json (General about page)
├── author-about-caesar.json (Author-specific about)
├── author-about-cicero.json
└── ... (privacy, cookies, imprint)
```

---

## 9. Technical Constraints & Quirks

### Constraint #1: Import.meta.glob for Static Content
Frontend loads posts via Vite's `import.meta.glob()`:
```typescript
const postImports = import.meta.glob('/src/content/posts/**/*.ts');
```
- **Pro:** Dynamic loading at bundle time, works in browser
- **Con:** Requires all posts to be `.ts` files, cannot use dynamic imports at runtime

### Constraint #2: TypeScript File Parsing in Express
Express server regex-parses TypeScript files instead of importing:
- **Pro:** Fast, can hot-reload without restarting
- **Con:** Fragile to syntax variations, needs maintenance if file format changes

### Constraint #3: JSON Content Storage in SQLite
Posts store content as JSON:
```typescript
content: text('content', { mode: 'json' }) // Stored as JSON text
```
- **Pro:** Single column, preserves structure
- **Con:** Large text values; no full-text search on content

### Constraint #4: No API Authentication
All API endpoints are public (marked `Access-Control-Allow-Origin: *`):
- **Current status:** Safe for demonstration (read-mostly)
- **Future:** Need auth for admin operations (create/update/delete posts)

### Constraint #5: Dual Author Store
Authors exist in:
- **File:** `src/data/authors.ts` (single source of truth for frontend)
- **Database:** `authors` table in D1 (optional/unused for now)

No synchronization between them yet—creates risk of inconsistency.

---

## 10. Recommended Migration Path (Not Implemented)

### Phase 1: Database Foundation (✅ Mostly Done)
- [x] Define Drizzle schema
- [x] Implement D1 API endpoints (posts, lexicon, works)
- [x] Seed database with file content

### Phase 2: Consolidate Authors
- [ ] Populate `authors` table from `src/data/authors.ts`
- [ ] Create `GET /api/authors` D1 endpoint
- [ ] Update frontend to fetch authors from API
- [ ] Remove file-based author loading

### Phase 3: Pages & Translations
- [ ] Create `pages` table in D1
- [ ] Create `translations_strings` table for UI strings
- [ ] Migrate `src/locales/*.ts` to database
- [ ] Implement translation API endpoints
- [ ] Update i18n integration

### Phase 4: Remove File-Based Fallbacks
- [ ] Remove `src/data/posts.ts` glob loader
- [ ] Remove regex parsing from Express server
- [ ] Ensure D1 APIs handle 100% of traffic
- [ ] Archive TypeScript post files (or keep as backup)

### Phase 5: Full SPA Migration
- [ ] Remove Express dev server dependency
- [ ] Use Vite dev server with Cloudflare Pages Function proxies
- [ ] All data loading via REST/GraphQL API

---

## Summary Table: Current Data Sources

| Content Type | Location | Format | Loading Method | D1 Sync | Admin Edit |
|---|---|---|---|---|---|
| **Posts** | `src/content/posts/{author}/*.ts` | TS | Fallback to files | ✅ Synced | File/API |
| **Lexicon** | `src/content/lexicon/*.ts` | TS | Fallback to files | ✅ Synced | File/API |
| **Works** | `src/content/works/*.ts` | TS | Fallback to files | ✅ Synced | File/API |
| **Authors** | `src/data/authors.ts` | TS Object | Direct import | ❌ Not synced | File only |
| **Pages** | `src/content/pages/*.json` | JSON | REST API | ❌ Not synced | File/API |
| **Translations** | `src/locales/{lang}.ts` | TS Object | i18next | ❌ Not synced | File only |
| **Work Details** | `src/content/works-details/*.json` | JSON | REST API | ❌ Not synced | File/API |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     React SPA Frontend (Vite)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Pages: Index, PostPage, LexiconPage, WorkPage             │ │
│  │ Context: AuthorContext, LanguageContext, ThemeProvider    │ │
│  └────────────────────┬───────────────────────────────────────┘ │
│                       │ useQuery, usePosts()                    │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ├───────────────────────┬──────────────────┐
                        ▼                       ▼                  ▼
              ┌──────────────────┐   ┌──────────────────┐  ┌──────────────┐
              │  Dev Server      │   │   Production     │  │  Static      │
              │  Express.js      │   │  Cloudflare      │  │  Assets      │
              │  localhost:3001  │   │  Pages Functions │  │  /public     │
              │                  │   │                  │  │              │
              │ - /api/posts     │   │ - /api/posts     │  │ - catalog    │
              │ - /api/lexicon   │   │ - /api/lexicon   │  │ - about      │
              │ - /api/works     │   │ - /api/works     │  │ - robots.txt │
              │                  │   │                  │  │ - sitemap    │
              │ (Regex-parses TS)│   │                  │  │              │
              └────────┬─────────┘   └────────┬─────────┘  └──────────────┘
                       │                      │
                       └──────────┬───────────┘
                                  ▼
                    ┌──────────────────────────┐
                    │   SQLite via Cloudflare  │
                    │        D1 Database       │
                    │                          │
                    │ - posts                  │
                    │ - lexicon                │
                    │ - works                  │
                    │ - vocabulary             │
                    │ - latin_texts            │
                    │ - (others unused yet)    │
                    └──────────────────────────┘
                                  ▲
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
        ┌──────────────────────────┐  ┌──────────────────────┐
        │  File-Based Seed Data    │  │  Drizzle ORM Client  │
        │                          │  │ (src/db/client.ts)   │
        │ - src/content/posts/     │  │                      │
        │ - src/content/lexicon/   │  │ drizzle(env.DB, {    │
        │ - src/content/works/     │  │   schema             │
        │                          │  │ })                   │
        └──────────────────────────┘  └──────────────────────┘
```

---

## Conclusion

The meum-diarium application is in a **transition phase** between file-based and database-driven architecture. The codebase is well-structured with:

✅ **Strengths:**
- Clear separation of concerns (frontend/backend/database)
- Graceful fallback mechanisms for resilience
- Comprehensive i18n/i10n infrastructure
- Dual content perspective model (diary/scientific)
- Type-safe TypeScript throughout

⚠️ **Areas Needing Attention:**
- Authors and translations still file-based only
- No admin authentication for write operations
- Regex parsing is fragile for file reading
- Database <→ file synchronization not automated

📋 **Recommended Next Steps:**
1. Consolidate authors into D1 + API
2. Migrate translations to database
3. Implement admin authentication
4. Remove file-based fallbacks once stable
5. Create admin UI for content management


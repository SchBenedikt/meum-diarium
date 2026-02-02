# Meum Diarium - Quick Reference: Data Flow Summary

## At a Glance

**Current Status:** Hybrid (file-based frontend/backend + partial D1 database)

---

## How Data Flows: Post Load Sequence

```
User visits /caesar/de-me → PostPage.tsx
                ↓
usePosts() hook triggered
                ↓
    ┌───────────────────────────────────────────┐
    │  fetchPosts() via TanStack Query          │
    │  Tries: GET /api/posts                    │
    └──────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
    D1 Database API      Dev File Parser
    (Production)         (server/index.ts)
    functions/api/       Express.js
    posts.ts             localhost:3001
        │                     │
        └──────────┬──────────┘
                   ▼
            Backend Response
            JSON array of posts
                   │
                   ↓
    Frontend caches for 5 minutes
    User selects perspective (diary/scientific)
    Translations applied per language
    PostContent rendered
```

---

## Data By Content Type

### 📄 Posts
- **Stored:** `src/content/posts/{author}/*.ts` (21× caesar, others)
- **Structure:** Contains dual content (diary + scientific narratives)
- **Loaded via:** 
  - Dev: Express regex parsing
  - Prod: D1 query
  - Fallback: Static Vite glob
- **Unique:** Perspectives + translations built-in

### 📚 Lexicon
- **Stored:** `src/content/lexicon/*.ts` (130+ entries)
- **Loaded via:**
  - Dev: Express file scan
  - Prod: D1 with search support
- **Features:** Multilingual definitions, etymology, related terms

### 📖 Works (Classical Texts)
- **Stored:** `src/content/works/*.ts` + details in `works-details/*.json`
- **Loaded via:** Dev/Prod same as lexicon
- **Features:** Structure outline, translations, separated metadata

### 👤 Authors
- **Stored:** `src/data/authors.ts` (hardcoded object)
- **Loaded via:** Direct TypeScript import only
- **Status:** NOT in D1 yet, file-based only
- **Includes:** Biographical info, theme color, highlights links

### 📄 Pages
- **Stored:** `src/content/pages/*.json`
- **Loaded via:** Express file system
- **Types:** About pages, privacy policy, imprint, cookies

### 🌍 Translations
- **Stored:** `src/locales/{de|en|la}.ts` (UI strings)
- **Loaded via:** i18next from TypeScript imports
- **Status:** NOT in database, file-only

---

## Key API Endpoints

### Development Server (localhost:3001)
```
GET    /api/posts                    # All posts
GET    /api/posts/:author/:slug      # Single post
POST   /api/posts                    # Create post
DELETE /api/posts/:author/:slug      # Delete post

GET    /api/lexicon                  # All entries
GET    /api/lexicon/:slug            # Single entry
POST   /api/lexicon                  # Create entry
DELETE /api/lexicon/:slug            # Delete entry

GET    /api/works                    # All works
GET    /api/works/:slug              # Single work
GET/POST/DELETE /api/works/:slug/details

GET    /api/authors                  # All authors
POST   /api/authors                  # Create author
PUT    /api/authors/:id              # Update author
DELETE /api/authors/:id              # Delete author

GET    /api/pages                    # List pages
GET    /api/pages/:slug              # Get page
POST   /api/pages                    # Save page

GET    /api/tags                     # All unique tags
PATCH  /api/tags                     # Rename tag
DELETE /api/tags/:tag                # Delete tag

GET    /api/translations[/:lang]     # Get translations
PUT    /api/translations/:lang/:key  # Update translation
POST   /api/translations             # Add new key
```

### Production (Cloudflare Pages Functions)
```
GET /api/posts               # D1 database query
GET /api/posts?slug=...      # Single post by slug
GET /api/posts?tag=...       # Posts with tag

GET /api/lexicon             # D1 database query
GET /api/lexicon?slug=...    # Single entry
GET /api/lexicon?search=...  # Search entries

GET /api/works               # D1 database query
GET /api/works?slug=...      # Single work

GET /api/catalog.json        # Static file (counts)
GET /api/about.json          # Static file
```

---

## Frontend Architecture

### Main Hooks
- `usePosts()` → Loads posts with TanStack Query, translation support, D1 fallback
- `useAuthor()` → Context hook for selected author (theme switching)
- `useLanguage()` → Context hook for UI language + post translations

### Key Pages
| Page | Component | Data Loading |
|------|-----------|---|
| `/` | Index.tsx | usePosts() + BlogList |
| `/:author` | Index.tsx | Author selector |
| `/:author/:slug` | PostPage.tsx | usePosts() + find by slug |
| `/lexicon` | LexiconPage.tsx | fetchLexicon() |
| `/lexicon/:slug` | LexiconEntryPage.tsx | fetchLexiconEntry() |
| `/:author/works/:slug` | WorkPage.tsx | fetchWork() |

### State Management
- **React Context:** Author selection, Language preference, Theme
- **TanStack Query:** API data caching (5-min cache)
- **Local State:** Perspective toggle (diary/scientific)

---

## Database Schema (D1)

### Tables Currently Used
- `posts` - All post content + translations
- `lexicon` - Dictionary entries + translations
- `works` - Classical texts + metadata
- `vocabulary` - Learning vocabulary (seeded but unused)
- `latin_texts` - Full classical text passages (unused)

### Tables NOT Yet Used
- `authors` - Defined but not populated/queried
- `pages` - Not migrated from JSON files
- `translations_*` - UI strings still in TS files

### Connection
```typescript
// src/db/client.ts
const getDb = (env: any) => drizzle(env.DB, { schema });

// Used in functions/api/*.ts
const db = getDb(context.env);
await db.query.posts.findMany(...)
```

---

## Build & Deployment

### Development
```bash
npm run dev
# Starts:
# - Vite dev server on :9002
# - Express backend on :3001
# - Watches files for changes
```

### Production Build
```bash
npm run build
# Runs:
# - Generate sitemap
# - Export API data to public/
# - Bundle with Vite
# - Output to dist/
# Deployment via Cloudflare Pages
```

---

## Caching Layers

1. **Frontend Memory Cache** (api.ts)
   - 5-minute cache for GET requests
   - Cleared on POST/DELETE
   - Automatic in browser

2. **Service Worker Cache**
   - Offline support for visited pages
   - Caches successful responses

3. **HTTP Cache Headers**
   - `Cache-Control: public, max-age=3600`
   - Cloudflare edge caching

---

## Data Migration Status

| Component | File-Based | D1 Database | Status |
|-----------|-----------|-----------|--------|
| Posts | ✅ src/content/posts/ | ✅ Synced | **Dual-mode** |
| Lexicon | ✅ src/content/lexicon/ | ✅ Synced | **Dual-mode** |
| Works | ✅ src/content/works/ | ✅ Synced | **Dual-mode** |
| Authors | ✅ src/data/authors.ts | ❌ Empty | **File-only** |
| Pages | ✅ src/content/pages/ | ❌ None | **File-only** |
| Translations | ✅ src/locales/ | ❌ None | **File-only** |

---

## Critical Files for Data Flow

### Frontend
```
src/
├── hooks/use-posts.ts          # Main data loading hook
├── lib/api.ts                   # API client + caching
├── context/AuthorContext.tsx    # Author state
├── context/LanguageContext.tsx  # Language/translation state
├── pages/
│   ├── Index.tsx                # Home + author selector
│   ├── PostPage.tsx             # Single post display
│   └── LexiconPage.tsx          # Lexicon listing
└── data/
    └── authors.ts               # Hardcoded authors (fallback)
```

### Backend
```
server/index.ts                 # Dev Express server
functions/api/
├── posts.ts                    # D1 posts endpoint
├── lexicon.ts                  # D1 lexicon endpoint
├── works.ts                    # D1 works endpoint
└── [[path]].ts                 # Catch-all for static assets

src/db/
├── schema.ts                   # Drizzle ORM definitions
└── client.ts                   # D1 client factory
```

---

## Known Quirks

### Quirk #1: Perspective Switching
Posts can display as "diary" (first-person narrative) or "scientific" (analysis).
- Toggle via `PerspectiveToggle` component
- URL param: `?p=scientific` or `?p=diary`
- Default: diary if available, else scientific

### Quirk #2: Author Theme Colors
Selecting an author updates `document.documentElement.classList`:
- `theme-caesar` → Orange tones
- `theme-cicero` → Blue tones
- `theme-augustus` → Different color...
- etc.

### Quirk #3: Tag Multilingual Support
`tagsWithTranslations[]` object provides translations:
```typescript
{
  id: "politics",
  translations: { de: "Politik", en: "Politics", la: "Res Politica" }
}
```

### Quirk #4: File-Based Regex Parsing
Express server regex-parses TS files instead of importing:
- Allows hot-reload without server restart
- Fragile if syntax changes
- Works for simple objects only

---

## What Needs to Happen Next

### To Complete Database Migration:
1. Move `authors` to D1 + create API endpoint
2. Move `translations` (UI strings) to D1
3. Move `pages` to D1
4. Add authentication for write operations
5. Remove file-based fallback logic
6. Archive/delete TypeScript post files

### To Improve Admin Experience:
1. Create admin dashboard UI
2. Real-time editing with preview
3. Bulk operations (import/export)
4. Content versioning/history
5. Access control per content type

---

## Links to Key Files

- **Architecture Deep-Dive:** [ARCHITECTURE_RESEARCH.md](./ARCHITECTURE_RESEARCH.md)
- **Frontend Data Loading:** [src/hooks/use-posts.ts](./src/hooks/use-posts.ts)
- **Backend Server:** [server/index.ts](./server/index.ts)
- **Database Schema:** [src/db/schema.ts](./src/db/schema.ts)
- **API Client:** [src/lib/api.ts](./src/lib/api.ts)


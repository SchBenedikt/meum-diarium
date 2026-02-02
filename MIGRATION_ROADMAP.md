# Migration & Technical Debt Assessment

## Overview
This document outlines the current technical debt and provides a prioritized migration roadmap to fully transition from file-based to database-driven architecture.

---

## Current Technical Debt

### 🔴 High Priority

#### 1. **Dual Data Storage (Posts, Lexicon, Works)**
- **Issue:** Posts exist in both file system (`src/content/posts/`) and D1 database
- **Risk:** Inconsistency when files are edited without database sync
- **Current Workaround:** Frontend tries D1 first, falls back to static files
- **Impact:** No single source of truth; hard to maintain
- **Effort:** Medium (requires updating Express server to database, updating all write operations)

#### 2. **Authors File-Based Only**
- **Issue:** Authors stored only in `src/data/authors.ts` hardcoded object
- **Status:** D1 table exists (`authors`) but not populated or queried
- **Risk:** Cannot manage authors through admin interface; theme colors/metadata hardcoded
- **Impact:** 5 authors limit; changes require code redeploy
- **Effort:** Low-Medium (populate authors table, add API endpoint, update frontend import)

#### 3. **No Authentication on Write Operations**
- **Issue:** `/api/posts`, `/api/lexicon`, `/api/works` POST/DELETE endpoints are public
- **Risk:** Anyone can create/delete content remotely
- **Current Status:** Dev server only; not deployed to production yet
- **Impact:** Cannot safely open admin interface to public
- **Effort:** Medium (add JWT/session-based auth, protect endpoints, create login UI)

#### 4. **Manual File-Based Regex Parsing**
- **Issue:** Express server regex-parses TypeScript files instead of importing
- **Root Cause:** Allows hot-reload without server restart
- **Risk:** Fragile to syntax variations, hard to maintain, complex parsing logic
- **Test Coverage:** Minimal; likely to break with format changes
- **Better Alternative:** Load from database instead
- **Effort:** Low (once database migration complete, just delete)

### 🟡 Medium Priority

#### 5. **Pages Still File-Based**
- **Issue:** `/src/content/pages/*.json` not in database
- **Current:** Express file system API works fine for static pages
- **Future:** When adding admin UI, pages should be in database
- **Effort:** Low-Medium (create `pages` table, migrate data, add API)

#### 6. **UI Translations in TypeScript Files**
- **Issue:** `/src/locales/{de|en|la}.ts` are TypeScript imports, not data
- **Current:** Works via i18next + React integration
- **Problem:** Hard to update without restart; no admin interface
- **Future:** Migrate to `translation_strings` table with admin editor
- **Effort:** Medium (requires i18next refactor to fetch from API)

#### 7. **No Content Versioning**
- **Issue:** When content is edited, previous version is lost
- **Impact:** Cannot restore deleted posts; no edit history
- **Mitigation:** Add `created_at`, `updated_at`, `deleted_at` timestamps
- **Advanced Feature:** Implement soft deletes + audit log table
- **Effort:** Medium-High (schema changes, complex queries)

#### 8. **TanStack Query Cache Invalidation**
- **Issue:** Manual `requestCache.clear()` on mutations is error-prone
- **Current:** Works but requires developer discipline
- **Better:** Use TanStack Query mutation + refetch patterns
- **Effort:** Low-Medium (refactor api.ts to use useMutation hooks)

### 🟢 Low Priority

#### 9. **Vocabulary & Latin Texts Tables Unused**
- **Issue:** Database tables exist but are never populated or queried
- **Status:** Reserved for future features
- **Decision:** Remove from schema or implement admin UI
- **Effort:** Low (cleanup if not needed; implement if planned)

#### 10. **No Search Index**
- **Issue:** Lexicon search is LIKE query on small dataset
- **Current:** Performance acceptable for 130 entries
- **Future:** If content grows, need full-text search (FTS5 in SQLite)
- **Effort:** Low-Medium (enable FTS5 in D1, re-index data)

---

## Data Completeness Assessment

### Posts
- **File-based:** ✅ 140+ posts across 5 authors
- **DB-seeded:** ✅ All posts synced to D1
- **API Ready:** ✅ D1 endpoint `functions/api/posts.ts` implemented
- **Status:** READY FOR PRIMARY USE (can remove file fallback)

### Lexicon
- **File-based:** ✅ 130+ entries
- **DB-seeded:** ✅ All entries synced
- **API Ready:** ✅ D1 endpoint `functions/api/lexicon.ts` implemented
- **Status:** READY FOR PRIMARY USE (can remove file fallback)

### Works
- **File-based:** ✅ Complete
- **DB-seeded:** ✅ Synced
- **API Ready:** ✅ D1 endpoint `functions/api/works.ts` implemented
- **Status:** READY FOR PRIMARY USE (can remove file fallback)

### Authors
- **File-based:** ✅ 5 authors defined
- **DB-seeded:** ❌ Table empty
- **API Ready:** ❌ No endpoint yet
- **Status:** NEEDS IMPLEMENTATION (migrate to DB first)

### Pages
- **File-based:** ✅ About, privacy, cookies, imprint
- **DB-seeded:** ❌ No table yet
- **API Ready:** ⚠️ Express file API works, not D1
- **Status:** WORKS BUT NEEDS DATABASE VERSION (plan migration)

### UI Translations
- **File-based:** ✅ De/En/La files complete
- **DB-seeded:** ❌ No table yet
- **API Ready:** ❌ No endpoint, uses i18next directly
- **Status:** WORKS BUT NEEDS MODERNIZATION (plan refactor)

---

## Prioritized Migration Roadmap

### Phase 1: Authors → Database (Week 1)
**Goal:** Eliminate hardcoded authors, enable dynamic author management

**Tasks:**
1. `src/db/schema.ts` - Authors table already defined ✅
2. `scripts/seed-authors.ts` (new) - Populate authors table from `src/data/authors.ts`
3. `functions/api/authors.ts` (new) - Create D1 API endpoint
4. `src/lib/api.ts` - Update `fetchAuthors()` to call D1 endpoint
5. `src/context/AuthorContext.tsx` - Load authors from API instead of import
6. Test author switching, theme colors update
7. Run seed script to populate D1

**Files Modified:**
- `src/db/schema.ts` (comment verification)
- `functions/api/authors.ts` (create)
- `scripts/seed-authors.ts` (create)
- `src/lib/api.ts` (update fetchAuthors)
- `src/context/AuthorContext.tsx` (update)

**Rollback:** Keep `src/data/authors.ts` as fallback

---

### Phase 2: Pages → Database (Week 1-2)
**Goal:** Store pages in D1, remove JSON files

**Tasks:**
1. Add `pages` table to D1 schema
2. `functions/api/pages.ts` - Migrate from Express regex/file parsing
3. Create seed script: `scripts/seed-pages.ts`
4. Update `src/lib/api.ts` page functions
5. Test page loading, editing

**Schema Addition:**
```typescript
export const pages = sqliteTable('pages', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  heroTitle: text('hero_title'),
  content: text('content'), // Markdown or HTML
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  author_id: text('author_id'), // Optional: for author-specific pages
});
```

---

### Phase 3: UI Translations → Database (Week 2-3)
**Goal:** Make UI translations editable without code changes

**Tasks:**
1. Add `translation_strings` table to D1 schema
2. Change i18next backend from static import to fetch API
3. `functions/api/translations.ts` - D1 translation endpoint
4. Create seed script: `scripts/seed-translations.ts`
5. Update `i18n.ts` language detector configuration
6. Test language switching, translation updates

**Schema Addition:**
```typescript
export const translation_strings = sqliteTable('translation_strings', {
  key: text('key').notNull(),
  lang: text('lang').notNull(), // 'de', 'en', 'la'
  value: text('value').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  primary: text().unique('de,key'), // Primary key on (lang, key)
});
```

---

### Phase 4: Remove File-Based Fallbacks (Week 3)
**Goal:** Single source of truth = D1 database

**Tasks:**
1. Remove `src/data/posts.ts` (glob loader)
2. Delete `src/data/authors.ts`
3. Move Express API parsing logic to D1 queries
4. Delete regex parsing functions from `server/index.ts`
5. Remove file-system watches from Express
6. Update comments in `usePosts()` hook - no more fallback
7. Run comprehensive end-to-end tests

**What to Preserve:**
- Keep TypeScript files in `src/content/` as **backup/archive**
- Add `.gitignore` entry if desired (optional)

---

### Phase 5: Authentication (Week 4)
**Goal:** Secure write operations, enable public admin interface

**Tasks (High-Level):**
1. Choose auth strategy:
   - Option A: JWT tokens + `/api/auth/login` endpoint
   - Option B: Session-based with cookies
   - Option C: Cloudflare Access (managed auth)
2. Add `users` table (if self-hosted auth)
3. Protect POST/PUT/DELETE endpoints with auth middleware
4. Create login page + session management
5. Add role-based access control (user, admin, super-admin?)
6. Test authentication flow

**Not In Scope Yet:** Multi-user collaboration, permissions per author/post

---

### Phase 6: Admin Interface Refinement (Week 5+)
**Goal:** Intuitive content management UI

**Tasks (Examples):**
- Post editor improvements (WYSIWYG, markdown preview, perspective toggle side-by-side)
- Bulk operations (import/export CSV, batch tag updates)
- Content scheduling (future publish dates)
- Analytics integration (view counts per post)
- Media library (organized image uploads)
- Content versioning UI (show history, restore old versions)

---

## Frontend Migration: Breaking Changes

### Current Behavior (File-Based)
```typescript
// Before: Imports data directly
import { authors } from '@/data/authors';

// Uses data immediately
const author = authors['caesar'];
```

### New Behavior (API-Based)
```typescript
// After: Fetches from API
const { data: authorsMap } = useQuery({
  queryKey: ['authors'],
  queryFn: () => fetchAuthors()
});

// Use with optional chaining
const author = authorsMap?.['caesar'];
```

### Impact on Components
- `AuthorContext.tsx` - Use useQuery instead of static import
- `AuthorSwitcher.tsx` - Loading state while fetching authors
- `HeroSection.tsx` - Fallback UI if author data not loaded
- Any component using `useAuthor()` - Already works through context

### Mitigation
- Implement skeleton loaders during data fetch
- Prefetch authors data on app startup
- Cache authors for 1 hour (aggressive caching)
- Keep .ts author file as emergency fallback

---

## Timeline Estimate

| Phase | Task | Effort | Timeline |
|-------|------|--------|----------|
| 1 | Authors migration | 4 hours | 1 day |
| 2 | Pages migration | 3 hours | 1 day |
| 3 | Translations migration | 6 hours | 2 days |
| 4 | Remove fallbacks | 2 hours | 0.5 day |
| 5 | Authentication | 8 hours | 2 days |
| **Total** | **First 5 phases** | **23 hours** | **1 week** |
| 6 | Admin UI | 40+ hours | 2+ weeks |

---

## Success Criteria

### After Phase 1 (Authors)
- [ ] Authors load from D1 on app startup
- [ ] Theme color changes when selecting author
- [ ] No errors in console
- [ ] ~200ms faster author switching (no regex parsing)

### After Phase 2 (Pages)
- [ ] All pages load from D1
- [ ] No `src/content/pages/` files accessed
- [ ] Edit page in Express admin, reload in browser

### After Phase 3 (Translations)
- [ ] Language switching works without page reload
- [ ] New translations visible immediately
- [ ] i18next fetch from `/api/translations/:lang`

### After Phase 4 (Remove Fallbacks)
- [ ] No file system access in production APIs
- [ ] 30% faster startup (no regex parsing)
- [ ] Can run Express without file watchers
- [ ] All data from D1 or static assets

### After Phase 5 (Auth)
- [ ] Login required for `/admin` routes
- [ ] POST/PUT/DELETE endpoints reject without auth token
- [ ] Session persists across page reloads
- [ ] Logout clears session

---

## Risk Mitigation

### Risk: Data Loss During Migration
**Mitigation:**
- Run seed scripts in staging environment first
- Keep backup of all TS/JSON files in git
- Verify row counts: `SELECT COUNT(*) FROM posts` should match post file count
- Use database snapshots/exports before each phase

### Risk: User Session Loss During Rollout
**Mitigation:**
- Use gradual rollout (10% → 50% → 100% traffic)
- Dual-read for 1 week: Try D1, fallback to file if no data
- Monitor error rates, revert if > 0.5% failures

### Risk: Performance Regression
**Mitigation:**
- Benchmark D1 query speeds before migration
- Use cached queries aggressively (5-min TTL minimum)
- Index compound keys: `(author_id, slug)` for quick lookups
- Monitor response times in production

### Risk: Broken Admin Interface
**Mitigation:**
- Comprehensive unit testing of mutation functions
- E2E tests for create/update/delete flow
- Keep file-based APIs running in parallel during transition
- Document manual recovery procedures (SQL INSERT if needed)

---

## Testing Strategy

### Unit Tests
- Data validation (post structure, author fields)
- Translation key extraction
- Cache invalidation logic

### Integration Tests
- API endpoint responses
- Database query performance
- Fallback logic (D1 vs file)
- Front-to-back data flow

### E2E Tests
- Author switching + theme update
- Create post via admin → appears in list
- Edit lexicon entry → visible after reload
- Language switching updates UI

### Performance Tests
- POST endpoint: < 500ms create post
- GET /api/posts: < 200ms 140 posts
- D1 query: < 50ms single row lookup

---

## Rollback Plans

### Phase 1 Rollback (Authors)
```bash
# Restore from git
git checkout src/data/authors.ts

# Restore API to import-based behavior
git revert functions/api/authors.ts
```

### Phase 4 Rollback (Remove Fallback)
```bash
# Re-enable file-based loading
git revert src/data/posts.ts  # restore getAllPosts()
git revert src/hooks/use-posts.ts  # restore fallback logic
```

### Full Rollback
- Keep `src/content/` directory as git history
- D1 data can be exported/archived
- Express server can revert to file-based APIs

---

## Lessons Learned & Recommendations

### What Worked Well
- ✅ Drizzle ORM for type-safe queries
- ✅ Cloudflare D1 for managed database
- ✅ Fallback logic prevented complete outages
- ✅ TypeScript for preventing data shape errors

### What to Improve
- ⚠️ Automate data sync (file ↔ DB) instead of manual
- ⚠️ Add database migrations to CI/CD
- ⚠️ Implement comprehensive logging for data audits
- ⚠️ Use ORM for all file-based APIs earlier

### Future Architecture
```
┌─────────┐
│CLI/Admin│ ← Only interface that modifies data
└────┬────┘
     │
┌────▼────────────────┐
│  REST API (Protected)│ ← All mutations go through here
└────┬─────────────────┘
     │
┌────▼─────────────────────┐
│  Database (D1/SQLite)     │ ← Single source of truth
└──────────────────────────┘
```

All data flows: Admin → API → Database → Frontend cache

---

## Next Steps (Immediate Actions)

1. **Review** this document with team
2. **Decide** on authentication strategy (JWT vs sessions vs Cloudflare Access)
3. **Create** branch: `feat/db-migration-phase-1`
4. **Start** Phase 1: Authors migration
5. **Test** in staging, get team approval
6. **Deploy** Phase 1 to production
7. **Monitor** for 1 week before Phase 2


# Console Logging für D1-Datenbanknutzung

## Übersicht

Die Anwendung loggt jetzt detailliert in der Browser-Konsole, ob die D1-Datenbank erfolgreich verwendet wird oder auf Dateien zurückgegriffen wird.

## Log-Typen

### ✅ Erfolgreiche D1-Nutzung

Wenn die D1-Datenbank erfolgreich verwendet wird, sehen Sie:

```
🔄 [usePosts] Fetching posts...
✅ [usePosts] Loaded 42 posts from D1 database (150ms)
   Data source: Cloudflare D1 via API
```

```
🔄 [useLexicon] Fetching lexicon entries...
✅ [useLexicon] Loaded 92 entries from D1 database (120ms)
   Data source: Cloudflare D1 via API
```

### 📁 Fallback auf Dateien

Wenn die API fehlschlägt oder leer zurückgibt, wird auf Dateien zurückgegriffen:

```
🔄 [usePosts] Fetching posts...
❌ [usePosts] API fetch failed: [Error details]
   Falling back to static file content
📁 [usePosts] Loading posts from static files...
✅ [usePosts] Loaded 42 posts from files (50ms)
   Data source: TypeScript files in src/content/posts/
```

### ⚠️ Warnungen

Verschiedene Warnmeldungen zeigen Probleme an:

```
⚠️ [usePosts] API returned empty result, falling back to static files
```

```
❌ [API] HTTP 503: Service Unavailable for /api/posts
```

## Backend-Logs (Cloudflare Functions)

### Erfolgreiche Abfrage

```
🔷 [Posts API] Query: all posts
✅ [Posts API] D1 query successful: Fetched 42 posts (145ms)
```

```
🔷 [Lexicon API] Query: slug=legion
✅ [Lexicon API] D1 query successful: Found entry "Legion" (85ms)
```

### Datenbank nicht verfügbar

```
❌ [Posts API] D1 database not available in context.env.DB
```

### Datenbankfehler

```
❌ [Posts API] D1 query failed (230ms): no such table: posts
   Stack: [Error stack trace]
```

## Response-Headers

Die API-Antworten enthalten jetzt zusätzliche Headers:

- **X-Data-Source**: `cloudflare-d1` (zeigt an, dass D1 verwendet wurde)
- **X-Post-Count**: Anzahl der zurückgegebenen Posts
- **X-Entry-Count**: Anzahl der zurückgegebenen Lexikon-Einträge

Diese können im Browser über die Network-Tab überprüft werden:

```javascript
// In DevTools Console:
fetch('/api/posts')
  .then(r => {
    console.log('Data Source:', r.headers.get('X-Data-Source'));
    console.log('Post Count:', r.headers.get('X-Post-Count'));
  });
```

## Häufige Log-Szenarien

### Szenario 1: Alles funktioniert mit D1

**Console Output:**
```
🔄 [usePosts] Fetching posts...
✅ [API] Response from cloudflare-d1 (42 items)
✅ [usePosts] Loaded 42 posts from D1 database (150ms)
   Data source: Cloudflare D1 via API
```

**Bedeutung:** ✅ D1-Datenbank wird erfolgreich verwendet

### Szenario 2: D1 leer, Fallback auf Dateien

**Console Output:**
```
🔄 [usePosts] Fetching posts...
⚠️ [usePosts] API returned empty result, falling back to static files
📁 [usePosts] Loading posts from static files...
✅ [usePosts] Loaded 42 posts from files (50ms)
   Data source: TypeScript files in src/content/posts/
```

**Bedeutung:** ⚠️ API funktioniert, aber Datenbank ist leer. Seed-Script ausführen!

**Fix:**
```bash
./seed_database.sh
```

### Szenario 3: API nicht erreichbar

**Console Output:**
```
🔄 [usePosts] Fetching posts...
❌ [usePosts] API fetch failed: Failed to fetch
   Falling back to static file content
📁 [usePosts] Loading posts from static files...
✅ [usePosts] Loaded 42 posts from files (50ms)
```

**Bedeutung:** ⚠️ API-Endpunkt nicht erreichbar (Cloudflare Functions nicht deployed?)

**Fix:**
- In Produktion: Stelle sicher, dass Cloudflare Functions deployed sind
- In Entwicklung: Stelle sicher, dass der Server läuft (`npm run dev`)

### Szenario 4: Datenbank nicht konfiguriert

**Backend Log (Cloudflare):**
```
❌ [Posts API] D1 database not available in context.env.DB
```

**Frontend Log:**
```
❌ [API] HTTP 503: Service Unavailable for /api/posts
```

**Bedeutung:** ❌ D1-Binding fehlt in wrangler.toml oder Cloudflare Pages Settings

**Fix:**
1. Überprüfe `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "meum-diarium"
   database_id = "your-database-id"
   ```

2. In Cloudflare Pages: Settings → Functions → D1 Bindings → "DB" hinzufügen

### Szenario 5: Tabellen existieren nicht

**Backend Log:**
```
❌ [Posts API] D1 query failed (230ms): no such table: posts
   Stack: [...]
```

**Bedeutung:** ❌ Migrations wurden nicht ausgeführt

**Fix:**
```bash
npx wrangler d1 migrations apply meum-diarium --remote
```

## Performance-Monitoring

Die Logs enthalten Timing-Informationen:

- **API-Response**: Zeit vom Request bis zur Response
- **D1-Query**: Zeit für die Datenbankabfrage
- **File-Load**: Zeit zum Laden aus TypeScript-Dateien

**Beispiel:**
```
✅ [Posts API] D1 query successful: Fetched 42 posts (145ms)
```

Typische Zeiten:
- **D1-Query**: 50-200ms (abhängig von Edge-Location)
- **File-Load**: 20-100ms (lokale TypeScript-Imports)
- **Cached Response**: <5ms

## Debugging-Tipps

### 1. Check Browser Console

Öffne DevTools (F12) → Console-Tab → Filter für spezifische Logs:

```javascript
// Filter nur Posts-Logs
console.log filter: "usePosts"

// Filter nur API-Fehler
console.log filter: "❌"

// Filter nur D1-bezogene Logs
console.log filter: "D1"
```

### 2. Check Network Tab

DevTools → Network-Tab → Filter "api" → Check:
- Status Code (sollte 200 sein)
- Response Headers (`X-Data-Source: cloudflare-d1`)
- Response Body (sollte Posts/Lexicon enthalten)

### 3. Check Cloudflare Dashboard

Cloudflare Dashboard → Workers & Pages → Logs (Real-time Logs)

### 4. Manueller API-Test

```bash
# Test Posts API
curl https://your-domain.com/api/posts | jq '.[] | .title' | head -5

# Test Lexicon API
curl https://your-domain.com/api/lexicon | jq '.[] | .term' | head -5
```

## Zusammenfassung der Symbole

| Symbol | Bedeutung |
|--------|-----------|
| 🔄 | Lade-Vorgang beginnt |
| ✅ | Erfolg |
| ⚠️ | Warnung (Fallback wird verwendet) |
| ❌ | Fehler |
| 📁 | Lade aus Dateien |
| 🔷 | API-Anfrage verarbeitet |
| 💾 | Cache verwendet |

## Produktions-Checkliste

Bevor du in Produktion gehst, solltest du in der Console sehen:

- ✅ `Data source: Cloudflare D1 via API`
- ✅ `Loaded 42 posts from D1 database`
- ✅ `Loaded 92 entries from D1 database`
- ✅ `Response from cloudflare-d1`
- ❌ **NICHT**: `Falling back to static content`
- ❌ **NICHT**: `API returned empty result`
- ❌ **NICHT**: `D1 database not available`

Falls du Fallback-Logs siehst, ist die D1-Integration nicht vollständig!

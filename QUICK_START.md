# Quick Start: D1 Database Integration

## 🚀 In 3 Steps zur D1-Datenbank

### Schritt 1: Datenbank vorbereiten

```bash
# Migrations anwenden (erstellt Tabellen) - WICHTIG: Zuerst ausführen!
npx wrangler d1 migrations apply meum-diarium --remote

# Duplikate prüfen (optional)
npm run db:check-duplicates
```

**Wichtig:** Die Migrations MÜSSEN vor dem Cleanup ausgeführt werden, sonst gibt es Fehler bei nicht existierenden Tabellen.

### Schritt 2: Daten importieren

```bash
# Datenbank mit allen Inhalten befüllen
chmod +x seed_database.sh
./seed_database.sh
```

**Erwartete Ausgabe:**
```
━━━ Step 1: Cleaning up existing data ━━━
✓ Success

━━━ Step 2: Seeding Authors and Works ━━━
✓ Success

━━━ Step 3: Seeding Lexicon Entries ━━━
[1/10] Processing seed_lexicon_1.sql...
✓ Success
...

━━━ Step 4: Seeding Blog Posts ━━━
[1/9] Processing seed_posts_1.sql...
✓ Success
...

Authors: 5
Posts: 42
Lexicon entries: 92
Works: 8

✓ Database seeding completed successfully!
```

### Schritt 3: Verifizieren

```bash
# Datenbank-Inhalt überprüfen
npm run db:verify:remote
```

**Erwartete Ausgabe:**
```
📚 Authors Table
✓ Found 5 authors
  • caesar: Gaius Julius Caesar
  • cicero: Marcus Tullius Cicero
  • augustus: Augustus
  • catilina: Lucius Sergius Catilina
  • seneca: Lucius Annaeus Seneca

📝 Posts Table
✓ Found 42 posts

📖 Lexicon Table
✓ Found 92 lexicon entries

✅ Database is fully populated and ready!
```

## 📊 Console Logs überprüfen

### Im Browser

1. **Seite öffnen**: `https://your-domain.com`
2. **DevTools öffnen**: Drücke `F12`
3. **Console-Tab**: Wähle "Console"
4. **Logs anschauen**:

**✅ Erfolg (D1 wird verwendet):**
```
🔄 [usePosts] Fetching posts...
✅ [API] Response from cloudflare-d1 (42 items)
✅ [usePosts] Loaded 42 posts from D1 database (150ms)
   Data source: Cloudflare D1 via API

🔄 [useLexicon] Fetching lexicon entries...
✅ [API] Response from cloudflare-d1 (92 items)
✅ [useLexicon] Loaded 92 entries from D1 database (120ms)
   Data source: Cloudflare D1 via API
```

**⚠️ Problem (Fallback auf Dateien):**
```
🔄 [usePosts] Fetching posts...
⚠️ [usePosts] API returned empty result, falling back to static files
📁 [usePosts] Loading posts from static files...
✅ [usePosts] Loaded 42 posts from files (50ms)
   Data source: TypeScript files in src/content/posts/
```

### Logs interpretieren

| Symbol | Bedeutung | Aktion |
|--------|-----------|---------|
| ✅ + "from D1 database" | **Perfekt!** D1 wird verwendet | Keine |
| ⚠️ + "falling back" | D1 leer oder nicht erreichbar | Seed-Script ausführen |
| ❌ + "API fetch failed" | API nicht erreichbar | Functions deployen |
| 📁 + "from files" | Fallback aktiv | D1 einrichten |

## 🔧 Häufige Probleme & Lösungen

### Problem: "UNIQUE constraint failed"

**Symptom:**
```
✘ [ERROR] UNIQUE constraint failed: lexicon.slug: SQLITE_CONSTRAINT
```

**Lösung:**
```bash
# Cleanup ausführen
npx wrangler d1 execute meum-diarium --remote --file cleanup_db.sql --yes

# Warten
sleep 5

# Erneut seeden
./seed_database.sh
```

Siehe auch: [TROUBLESHOOTING_DUPLICATES.md](TROUBLESHOOTING_DUPLICATES.md)

### Problem: Console zeigt "falling back to static files"

**Symptom:**
```
⚠️ [usePosts] API returned empty result, falling back to static files
```

**Ursache:** Datenbank ist leer

**Lösung:**
```bash
./seed_database.sh
```

### Problem: "no such table: latin_texts"

**Symptom:**
```
✘ [ERROR] no such table: latin_texts: SQLITE_ERROR
```

**Ursache:** Migrations wurden nicht ausgeführt

**Lösung:**
```bash
# 1. Migrations anwenden (erstellt alle Tabellen)
npx wrangler d1 migrations apply meum-diarium --remote

# 2. Dann erst cleanup
./cleanup_database.sh

# 3. Dann seeden
./seed_database.sh
```

**Alternative:** Verwende `cleanup_database.sh` statt `cleanup_db.sql` - das Script behandelt fehlende Tabellen automatisch.

**Symptom:**
```
❌ [Posts API] D1 database not available in context.env.DB
```

**Ursache:** D1-Binding fehlt

**Lösung:**
1. Überprüfe `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "meum-diarium"
   database_id = "your-database-id"
   ```

2. In Cloudflare Pages:
   - Settings → Functions → D1 Database Bindings
   - Variable name: `DB`
   - D1 database: `meum-diarium`

### Problem: Tabellen existieren nicht

**Symptom:**
```
❌ [Posts API] D1 query failed: no such table: posts
```

**Lösung:**
```bash
npx wrangler d1 migrations apply meum-diarium --remote
```

## 📖 Dokumentation

| Dokument | Zweck |
|----------|-------|
| [LOGGING_SUMMARY.md](LOGGING_SUMMARY.md) | Übersicht der Logging-Funktionen |
| [LOGGING_GUIDE.md](LOGGING_GUIDE.md) | Detaillierte Logging-Referenz |
| [DATABASE_SETUP.md](DATABASE_SETUP.md) | Vollständiges Setup-Guide |
| [TROUBLESHOOTING_DUPLICATES.md](TROUBLESHOOTING_DUPLICATES.md) | UNIQUE constraint Fehler |
| [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) | Migrations-Übersicht |

## ✅ Produktions-Checkliste

Vor dem Live-Gang:

- [ ] Migrations angewendet: `npx wrangler d1 migrations apply meum-diarium --remote`
- [ ] Datenbank geseeded: `./seed_database.sh`
- [ ] Verifizierung erfolgreich: `npm run db:verify:remote` zeigt alle Daten
- [ ] D1-Binding in Cloudflare Pages konfiguriert
- [ ] Browser Console zeigt: "Data source: Cloudflare D1 via API"
- [ ] Browser Console zeigt: "Loaded 42 posts from D1 database"
- [ ] Browser Console zeigt: "Loaded 92 entries from D1 database"
- [ ] KEINE "falling back" Meldungen in der Console
- [ ] API-Test erfolgreich: `curl https://your-domain.com/api/posts | jq '. | length'` gibt `42` zurück

## 🎯 Zusammenfassung

**Was wurde erreicht:**
- ✅ Alle 42 Blog-Posts sind in D1 Datenbank
- ✅ Alle 92 Lexikon-Einträge sind in D1 Datenbank
- ✅ API-Endpunkte nutzen D1 als primäre Quelle
- ✅ Automatischer Fallback auf Dateien bei Problemen
- ✅ Vollständige Logging und Transparenz
- ✅ Dateien bleiben als Backup erhalten

**Performance:**
- D1-Query: 50-200ms (Edge-optimiert)
- File-Fallback: 20-100ms (lokal)
- Globale Verfügbarkeit durch Cloudflare Edge

**Nächste Schritte:**
1. Seite laden und Console checken
2. Sicherstellen, dass D1 verwendet wird
3. Bei Problemen: Siehe Troubleshooting-Guides
4. Bei Erfolg: 🎉 Fertig!

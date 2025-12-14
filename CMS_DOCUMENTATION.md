# CMS Dokumentation - Meum Diarium

## Übersicht

Das Content Management System (CMS) unter `/admin` ermöglicht die vollständige Verwaltung aller Inhalte der Anwendung. Das System ist inspiriert von WordPress und bietet eine benutzerfreundliche Oberfläche mit vielen Bearbeitungsmöglichkeiten.

## Zugriff

- **URL**: `http://localhost:9002/admin`
- Das CMS ist direkt über die Navigation oder durch direkte URL-Eingabe erreichbar

## Hauptfunktionen

### 1. Dashboard-Übersicht

Das Admin-Dashboard bietet einen zentralen Überblick über alle Inhalte:

- **Statistiken-Karten**: Zeigt die Anzahl von Beiträgen, Autoren, Lexikon-Einträgen und Seiten
- **Schnellzugriff**: Buttons zum Erstellen neuer Inhalte
- **Einstellungen**: Direkter Zugriff auf globale Einstellungen
- **Tab-Navigation**: Wechsel zwischen verschiedenen Content-Typen

### 2. Beiträge verwalten (Posts)

#### Funktionen:
- **Übersicht**: Liste aller Blog-Beiträge mit Titel, Autor und Datum
- **Suche**: Durchsuche Beiträge nach Titel, Excerpt oder Autor
- **Filter**: Filtere nach spezifischen Autoren (Caesar, Cicero, Augustus, Seneca)
- **Erstellen**: Neuen Beitrag über "Neuer Beitrag" Button
- **Bearbeiten**: Klick auf Edit-Icon zum Bearbeiten
- **Löschen**: Lösche Beiträge mit Bestätigungsdialog
- **Vorschau**: Direkte Vorschau der veröffentlichten Beiträge

#### Beitrag erstellen/bearbeiten:
1. Grundinformationen:
   - Titel (Deutsch und optional Lateinisch)
   - Slug (URL-freundlicher Name)
   - Autor auswählen
   - Historisches Datum
   - Kurzbeschreibung

2. Mehrsprachige Inhalte:
   - **Deutsch (Hauptsprache)**
   - **English (Übersetzung)**
   - **Latinum (Übersetzung)**
   
   Für jede Sprache:
   - Titel und Excerpt
   - Tagebuch-Inhalt (persönliche Perspektive)
   - Wissenschaftlicher Kommentar (historische Einordnung)

3. Medien:
   - Cover-Bild URL oder Upload über MediaLibrary

### 3. Autoren verwalten

#### Funktionen:
- **Übersicht**: Karten-Ansicht aller Autoren mit Profilbild und Informationen
- **Erstellen**: Neuen Autor hinzufügen
- **Bearbeiten**: Autorenprofil bearbeiten (Name, Titel, Beschreibung, etc.)
- **Löschen**: Autor entfernen (Beiträge bleiben erhalten)
- **Farbschema**: Individuelle Theme-Farbe pro Autor

#### Autor-Felder:
- ID, Name, Lateinischer Name
- Titel/Beruf
- Lebensdaten (Jahre, Geburtsjahr, Todesjahr)
- Beschreibung
- Hero-Bild URL
- Theme und Akzentfarbe
- Übersetzungen für alle Sprachen

### 4. Lexikon verwalten

#### Funktionen:
- **Übersicht**: Tabelle mit allen Lexikon-Einträgen
- **Suche**: Durchsuche Begriffe, Kategorien und Definitionen
- **Erstellen**: Neuen Lexikon-Eintrag hinzufügen
- **Bearbeiten**: Eintrag bearbeiten
- **Löschen**: Eintrag entfernen

#### Lexikon-Felder:
- Begriff (Term)
- Slug (URL)
- Kategorie (Politik, Recht, Militär, etc.)
- Definition
- Etymologie
- Varianten
- Verwandte Begriffe
- Übersetzungen (DE/EN/LA)

### 5. Seiten verwalten

#### Funktionen:
- **Übersicht**: Liste aller statischen Seiten
- **Erstellen**: Neue Seite anlegen
- **Bearbeiten**: Seiteninhalt bearbeiten
- **Vorschau**: Seite in neuem Tab ansehen
- **Löschen**: Seite entfernen (in Entwicklung)

#### Seiten-Editor:

1. **Seiteneinstellungen**:
   - Slug (URL-Pfad, z.B. "about" für /about)
   - Hinweis: Slug kann nach Erstellung nicht mehr geändert werden

2. **Hero-Bereich**:
   - Hero Titel (Deutsch)
   - Hero Untertitel (Deutsch)
   - Hero Bild (optional, mit MediaLibrary)

3. **Projektbeschreibung**:
   - Langtext zur Seite
   - HTML erlaubt

4. **Highlights** (Kacheln):
   - Beliebig viele Highlight-Kacheln hinzufügen/entfernen
   - Jede Kachel: Titel + Beschreibung

5. **Übersetzungen**:
   - Englisch (EN)
   - Lateinisch (LA)
   - Für jede Sprache: Titel, Untertitel, Beschreibung und Highlights

#### Beispiel-Seiten:
- `/about` - Projektvorstellung
- Neue Seiten können beliebig erstellt werden

### 6. MediaLibrary (Medien-Verwaltung)

Die MediaLibrary ist ein modales Fenster zur Bildauswahl:

#### Modi:
1. **Bibliothek**: Vordefinierte Sample-Bilder auswählen
2. **URL**: Externe Bild-URL eingeben mit Live-Vorschau
3. **Upload**: Lokale Bilddateien hochladen

#### Verwendung:
- Integriert in Seiten-Editor (Hero-Bild)
- Unterstützte Formate: JPG, PNG, GIF, WebP
- Vorschau vor Auswahl

### 7. Einstellungen

Globale Anwendungseinstellungen unter `/admin/settings`:

#### Allgemein:
- **Seitenname**: Name der Website
- **Beschreibung**: Kurzbeschreibung
- **Website URL**: Haupt-URL
- **Standardsprache**: de/en/la
- **Übersetzungen aktivieren**: Toggle für mehrsprachige Inhalte

#### Design:
- **Akzentfarbe**: Farbe für Buttons, Links, etc. (Farbwähler)
- **Theme**: System/Light/Dark Mode
- **Footer Text**: Anpassbarer Footer-Text

#### Erweitert:
- **Push-Benachrichtigungen**: Toggle für Updates
- **Cache leeren**: Performance-Optimierung
- Weitere Einstellungen in Entwicklung

## API-Endpunkte

### Posts
- `GET /api/posts` - Liste aller Beiträge
- `POST /api/posts` - Beitrag erstellen/aktualisieren
- `DELETE /api/posts/:author/:slug` - Beitrag löschen

### Authors
- `POST /api/authors` - Autor erstellen/aktualisieren
- `DELETE /api/authors/:id` - Autor löschen

### Lexicon
- `POST /api/lexicon` - Lexikon-Eintrag erstellen/aktualisieren
- `DELETE /api/lexicon/:slug` - Eintrag löschen

### Pages
- `GET /api/pages` - Liste aller Seiten
- `GET /api/pages/:slug` - Einzelne Seite abrufen
- `POST /api/pages` - Seite erstellen/aktualisieren
- `DELETE /api/pages/:slug` - Seite löschen

## Datenspeicherung

### Content-Struktur:
```
src/
├── content/
│   ├── posts/          # Blog-Beiträge (.ts Dateien)
│   │   ├── caesar/
│   │   ├── cicero/
│   │   ├── augustus/
│   │   └── seneca/
│   ├── lexicon/        # Lexikon-Einträge (.ts Dateien)
│   └── pages/          # Seiten (.json Dateien)
├── data/
│   ├── authors.ts      # Autoren-Definitionen
│   ├── lexicon.ts      # Lexikon-Index
│   └── works.ts        # Werke
```

### Dateiformate:
- **Posts**: TypeScript-Module mit BlogPost Interface
- **Lexicon**: TypeScript-Module mit LexiconEntry Interface
- **Authors**: TypeScript-Objekt-Definitionen
- **Pages**: JSON-Dateien mit PageContent Interface

## Komponenten

### Wiederverwendbare UI-Komponenten:

1. **QuickStats**: Statistik-Karten mit Icons und Werten
2. **SearchFilter**: Suchfeld mit optionalen Filtern
3. **BulkActions**: Massenaktionen für ausgewählte Elemente (in Entwicklung)
4. **MediaLibrary**: Modales Fenster zur Bildauswahl

### Seiten:
- `AdminPage.tsx` - Hauptübersicht
- `PostEditorPage.tsx` - Beitrags-Editor
- `AuthorEditorPage.tsx` - Autoren-Editor
- `LexiconEditorPage.tsx` - Lexikon-Editor
- `PageEditorPage.tsx` - Seiten-Editor
- `SettingsPage.tsx` - Einstellungen

## Features

### ✅ Implementiert:
- Dashboard mit Statistiken
- Vollständige CRUD-Operationen für alle Content-Typen
- Mehrsprachige Inhalte (DE/EN/LA)
- Such- und Filterfunktionen
- Medien-Bibliothek
- Einstellungsverwaltung
- Responsive Design
- Vorschau-Funktionen
- Toast-Benachrichtigungen

### 🚧 In Entwicklung:
- Batch-Operationen (Massenaktionen)
- Content-Versionierung
- Erweiterte Medien-Upload-Funktionalität
- Drag & Drop für Sortierung
- Mehr Filter-Optionen

## Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **UI Library**: Shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React Hooks
- **Routing**: React Router v6
- **Backend**: Express.js (Node.js)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## Sicherheit

⚠️ **Wichtig**: Das CMS hat aktuell keine Authentifizierung implementiert.

### Geplante Sicherheitsmaßnahmen:
- Benutzer-Authentifizierung
- Rollenbasierte Zugriffskontrolle (RBAC)
- CSRF-Schutz
- Input-Validierung
- Rate-Limiting

## Best Practices

### Content-Erstellung:
1. Verwende aussagekräftige Slugs (URL-freundlich)
2. Füge immer deutsche Inhalte hinzu (Hauptsprache)
3. Nutze die MediaLibrary für konsistente Bildverwaltung
4. Teste Vorschau vor dem Speichern
5. Nutze HTML-Tags sparsam in Beschreibungen

### Performance:
- Bilder sollten optimiert sein (< 500KB)
- Lange Texte in Chunks aufteilen
- Cache-Strategien beachten

## Fehlerbehandlung

Das System zeigt Toast-Benachrichtigungen für:
- ✅ Erfolgreiche Aktionen (grün)
- ❌ Fehler (rot)
- ℹ️ Informationen (blau)
- ⚠️ Warnungen (orange)

## Support & Weiterentwicklung

### Bekannte Limitationen:
- Keine Bildoptimierung beim Upload
- Keine Medien-Verwaltung in der Cloud
- Bulk-Operations noch nicht vollständig implementiert
- Keine Undo/Redo-Funktionalität

### Geplante Features:
- Rich Text Editor (WYSIWYG)
- Medien-Upload zu Cloud Storage
- Automatische Backups
- Import/Export-Funktionen
- Analytics-Dashboard
- SEO-Tools

## Beispiel-Workflows

### Neuen Blog-Beitrag erstellen:
1. Gehe zu `/admin`
2. Klicke auf "Neuer Beitrag"
3. Fülle Grundinformationen aus
4. Wähle einen Autor
5. Schreibe den Inhalt auf Deutsch
6. Optional: Füge Übersetzungen hinzu
7. Wähle ein Cover-Bild
8. Klicke "Speichern"
9. Nutze "Vorschau" zum Testen

### Neue Seite erstellen:
1. Gehe zu `/admin` → Tab "Seiten"
2. Klicke "Neue Seite"
3. Gib einen Slug ein (z.B. "kontakt")
4. Fülle Hero-Bereich aus
5. Füge Highlights hinzu
6. Speichere die Seite
7. Seite ist nun unter /kontakt erreichbar

## Zusammenfassung

Das CMS bietet eine vollständige Lösung zur Verwaltung aller Inhalte der Anwendung. Mit WordPress-ähnlicher Benutzerfreundlichkeit, mehrsprachiger Unterstützung und modernem Design ist es die zentrale Schnittstelle für Content-Management.

Für technische Fragen oder Feature-Requests erstelle bitte ein Issue im Repository.

# Meum Diarium - Antikes Rom Blog

Ein modernes, interaktives Blog-System über das antike Rom mit KI-gestützten Erklärungen und mehrsprachigem Lexikon.

## 🌟 Features

- **Mehrperspektivische Blog-Einträge**: Einträge mit persönlicher (Tagebuch) und wissenschaftlicher Perspektive
- **Interaktives Lexikon**: Umfassendes Lexikon mit KI-gestützten Erklärungen historischer Begriffe
- **Historische Persönlichkeiten**: Detaillierte Profile von Caesar, Cicero, Augustus, Seneca und Catilina
- **KI-Chat-Funktionen**: Stelle Fragen zu Begriffen und historischen Persönlichkeiten
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Dark/Light Mode**: Vollständige Unterstützung für helle und dunkle Themes
- **SEO-Optimiert**: Schema.org Strukturdaten, Sitemap und optimierte Meta-Tags
- **PWA-Unterstützung**: Installierbar als Progressive Web App

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI-Framework
- **TypeScript** - Typsicherheit
- **Vite 7.2** - Build-Tool und Dev-Server
- **Tailwind CSS 3.4** - Utility-First CSS
- **Shadcn UI** - Komponentenbibliothek (Radix UI)
- **Framer Motion** - Animationen
- **TanStack Query** - Datenverwaltung und Caching
- **React Router** - Client-seitiges Routing
- **TipTap & Novel** - Rich-Text-Editor für Admin-Bereich

### Backend & Datenbank
- **Cloudflare Pages/Workers** - Hosting und Serverless Functions
- **Cloudflare D1** - SQLite-Datenbank (Produktion)
- **Drizzle ORM** - Type-safe Datenbankzugriffe
- **Express.js** - Lokaler Development-Server
- **Better-SQLite3** - Lokale SQLite-Datenbank

### Build & Tooling
- **ESLint** - Code-Qualität
- **TypeScript Compiler** - Type-Checking
- **Vite Plugins** - Compression (gzip, brotli), Code Splitting

## 📦 Installation

### Voraussetzungen
- Node.js 18+ und npm
- Git

### Lokale Einrichtung

1. Repository klonen:
```bash
git clone https://github.com/SchBenedikt/meum-diarium.git
cd meum-diarium
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
```bash
cp .env.example .env
```

4. Lokale Datenbank überprüfen:
```bash
npm run db:verify
```

5. Development-Server starten:
```bash
npm run dev
```

Die Anwendung läuft nun auf `http://localhost:9002`.

## 🚀 Entwicklung

### Verfügbare Scripts

```bash
npm run dev          # Startet Vite Dev-Server und Backend-Server
npm run debug        # Startet nur Vite Dev-Server (ohne Backend)
npm run server       # Startet nur Backend-Server
npm run build        # Production Build
npm run build:dev    # Development Build
npm run lint         # ESLint ausführen
npm run preview      # Preview des Production Builds
npm run db:verify    # Lokale Datenbank überprüfen
npm run db:verify:remote  # Remote D1-Datenbank überprüfen
```

### Projektstruktur

```
meum-diarium/
├── src/                      # Frontend React App
│   ├── components/          # React-Komponenten
│   │   ├── admin/          # Admin-Panel-Komponenten
│   │   ├── layout/         # Layout-Komponenten (Header, Footer)
│   │   ├── ui/             # Shadcn UI Komponenten
│   │   └── ...
│   ├── pages/              # Seiten-Komponenten
│   ├── hooks/              # Custom React Hooks
│   ├── context/            # React Context Provider
│   ├── lib/                # Utility-Funktionen
│   ├── types/              # TypeScript Type-Definitionen
│   └── styles/             # Globale Styles
├── server/                  # Lokaler Express-Server
│   └── index.ts            # Server-Einstiegspunkt
├── functions/              # Cloudflare Workers/Pages Functions
│   ├── api/               # API-Endpunkte
│   ├── db/                # Drizzle Schema
│   └── sitemap.xml.ts     # Dynamische Sitemap-Generierung
├── public/                 # Statische Assets
│   ├── api/               # Statische JSON-Fallbacks
│   ├── images/            # Bilder
│   └── icons/             # Favicons & PWA-Icons
├── drizzle/               # Datenbank-Migrationen
└── worker-index.js        # Cloudflare Worker Entry
```

### Entwicklungs-Workflow

1. **Frontend-Entwicklung**: Änderungen in `src/` werden durch Vite Hot Module Replacement (HMR) automatisch aktualisiert
2. **Backend-Entwicklung**: Der Express-Server läuft auf Port 3001 und wird durch `tsx watch` automatisch neu geladen
3. **API-Proxy**: Vite proxied `/api/*` Requests an den lokalen Backend-Server
4. **Datenbank**: Lokale SQLite-Datenbank in `local.db` (wird nicht committet)

## 🌐 API-Endpunkte

### Blog-Posts
- `GET /api/posts` - Alle Blog-Posts abrufen
- `GET /api/posts?slug={slug}` - Einzelnen Post nach Slug abrufen
- `GET /api/posts?author={author}` - Posts eines Autors

### Lexikon
- `GET /api/lexicon` - Alle Lexikon-Einträge (max 100)
- `GET /api/lexicon?slug={slug}` - Einzelnen Eintrag nach Slug
- `GET /api/lexicon?search={term}` - Volltextsuche

### Werke
- `GET /api/works` - Alle literarischen Werke

### KI-Funktionen
- `GET /api/explain?term={term}` - KI-Erklärung für einen Begriff
- `GET /api/explain?term={term}&question={question}` - Folgefrage stellen

### Sitemap
- `GET /sitemap.xml` - Dynamisch generierte Sitemap

## 🎨 Styling & Theming

Das Projekt verwendet ein Tailwind CSS-basiertes Design-System mit:
- **CSS Variables** für Theme-Farben
- **Dark Mode** via `next-themes`
- **Custom Fonts**:
  - Display: Playfair Display (Serif)
  - Body: Inter (Sans-Serif)
- **Responsive Breakpoints**: sm, md, lg, xl, 2xl

## 🔒 Authentifizierung

- **Firebase Authentication** für Benutzer-Login/Registrierung
- **Admin-Zugang** mit lokalem Storage (Passwort: "benedikt")
- **Protected Routes** für Admin-Bereich

## 🌍 Internationalisierung

- Primäre Sprache: Deutsch (de-DE)
- Unterstützung für lateinische Texte
- i18next für Übersetzungen vorbereitet

## 📊 SEO & Indexierung

- **Meta Tags**: Open Graph, Twitter Cards
- **Structured Data**: Schema.org (BlogPosting, Person, WebSite)
- **Sitemap**: Dynamisch generiert aus D1-Datenbank
- **Robots.txt**: Optimiert für Suchmaschinen
- **Canonical URLs**: Duplicate Content vermeiden

## 🚢 Deployment

### Cloudflare Pages

Die Anwendung wird auf Cloudflare Pages deployed:

1. **Build Command**: `npm run build`
2. **Build Output Directory**: `dist`
3. **Environment Variables**: Konfiguriert in Cloudflare Dashboard
4. **D1 Database Binding**: `DB` (main), `vocab` (vocabulary)

### Umgebungsvariablen (Production)

```env
VITE_SITE_URL=https://meum-diarium.xn--schchner-2za.de
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

## 🔧 Wartung

### Datenbank-Migrationen

```bash
# Neue Migration erstellen
npx drizzle-kit generate:sqlite

# Migration ausführen
npx drizzle-kit push:sqlite
```

### Performance-Optimierung

- Code Splitting nach Vendor-Bibliotheken
- Image Lazy Loading
- Compression (gzip, brotli)
- Caching via TanStack Query
- Service Worker für PWA

## 📝 Lizenz

Proprietär - Alle Rechte vorbehalten

## 👥 Autoren

- **Benedikt Schächner** - Entwickler & Maintainer
- **Vinzenz Schächner** - Co-Entwickler

## 🔗 Links

- **Website**: https://meum-diarium.xn--schchner-2za.de
- **GitHub**: https://github.com/SchBenedikt/meum-diarium

## 📞 Kontakt

Bei Fragen oder Anregungen:
- Benedikt: https://benedikt.xn--schchner-2za.de
- Vinzenz: https://vinzenz.xn--schchner-2za.de

---

**Hinweis**: KI-generierte Erklärungen können ungenau sein. Alle historischen Informationen sollten mit wissenschaftlichen Quellen abgeglichen werden.

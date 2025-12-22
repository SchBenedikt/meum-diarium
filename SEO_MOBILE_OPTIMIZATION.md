# SEO & Mobile Optimization Guide für Meum Diarium

## Zusammenfassung der Optimierungen

Diese Anwendung wurde umfassend für Suchmaschinen (Google, Bing, etc.) und KI-Crawler (GPTBot, Claude, Anthropic) sowie für Mobilgeräte optimiert.

---

## 1. Sitemap & Robots.txt

### Dynamische XML-Sitemap
- **Endpoint**: `/sitemap.xml` → Automatisch generiert aus allen Posts, Works und Authors
- **Aktualisierung**: In Echtzeit, basierend auf Dateisystem
- **Unterstützung**: Google, Bing, Yandex, Baidu + AI-Crawler

### Robots.txt
- **Endpoint**: `/robots.txt` → Dynamisch generiert mit aktueller Domain
- **KI-Crawlers zugelassen**:
  - GPTBot (OpenAI)
  - CCBot (Common Crawl)
  - anthropic-ai (Anthropic/Claude)
  - Claude-Web
  - Twitterbot
  - facebookexternalhit

### Sitemap Index (Human-Readable)
- **Endpoint**: `/sitemap-index.html`
- **Funktion**: Visuelle Übersicht aller indizierten Seiten mit Prioritäten

---

## 2. Mobile Optimierungen

### Viewport & Safe Areas
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, 
  maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
```
- ✅ Responsive Design
- ✅ Notch & Safe Area Support (iOS)
- ✅ User Zoom erlaubt

### PWA Manifest
- App-Name, Icons (192x192, 512x512)
- Display: `standalone`
- Theme Colors für Light/Dark Mode
- Shortcuts für Timeline & Lexicon

### Apple Mobile Web App
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### Touch Icons & Startup Images
- `apple-touch-icon`: 180×180px
- `apple-touch-startup-image`: Splash Screen

---

## 3. SEO Meta-Tags

### Canonical URLs
- **Haupt-Domain**: `https://meum-diarium.xn--schchner-2za.de/`
- **Canonical Tag**: Nur auf Home-Page, Rest wird vom Server per Route gesetzt
- **Zweck**: Duplicate Content vermeiden

### Open Graph (Social Media)
- `og:title`, `og:description`, `og:image`
- `og:type`: `website`
- `og:url`: `https://meum-diarium.xn--schchner-2za.de/`
- `og:locale`: `de_DE`

### Twitter Cards
- `twitter:card`: `summary_large_image`
- Thumbnail: 1200×630px

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Meum Diarium",
  "url": "https://meum-diarium.xn--schchner-2za.de",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://meum-diarium.xn--schchner-2za.de/search?q={search_term_string}"
  }
}
```

Zudem Person Schema für Julius Caesar

---

## 4. Crawler & Indexing Signale

### Meta-Tags für Crawler
```html
<meta name="robots" content="index, follow, max-snippet:-1, 
  max-image-preview:large, max-video-preview:-1" />
<meta name="googlebot" content="index, follow, max-snippet:-1, 
  max-image-preview:large, max-video-preview:-1" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

### Sprachdeklaration
```html
<html lang="de" dir="ltr">
```
- Automatisch synced im `LanguageContext`
- Unterstützt mehrsprachige Inhalte (de, en, la)

### Color Scheme Signal
```html
<meta name="color-scheme" content="light dark" />
```
- Hilft Crawlern, Theme-Preference zu erkennen

---

## 5. Performance Optimierungen für Mobile

### Font Loading
```html
<link rel="preload" as="style" href="..." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
```
- `display=swap`: Fallback-Font während des Ladens

### Image Optimization
- Alle Bilder sollten `webp` mit `jpg`-Fallback nutzen
- Responsive Images mit `srcset`
- Lazy Loading für Off-Screen Images

### CSS Optimization
- Tailwind CSS (Production-Build mit PurgeCSS)
- Minified Bundle
- Critical CSS inline

### JavaScript Code-Splitting
- React Lazy + Suspense für alle Pages
- Service Worker für Offline-Unterstützung
- Nur notwendige JS im kritischen Pfad

---

## 6. Server-Konfiguration (.htaccess)

Folgende Maßnahmen sind in `public/.htaccess` implementiert:

### Kompression
```
AddOutputFilterByType DEFLATE text/html text/css text/javascript
```

### Caching
- JavaScript/CSS/Fonts: 1 Jahr (31536000s)
- HTML: 30 Minuten (1800s)

### HTTPS Redirect
```
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://...
```

### Security Headers
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 7. Content Strategy für SEO

### URL-Struktur
```
/                           → Home
/:author                    → Author Timeline (Caesar, Cicero, Augustus, etc.)
/:author/about              → Author Bio & Works
/:author/:slug              → Individual Blog Post
/:author/works/:slug        → Book/Work Details
/timeline                   → Interaktive Chronologie
/lexicon                    → Glossar
/lexicon/:slug              → Glossar-Eintrag
/search                     → Such-Seite
```

### Semantic HTML
- Proper Heading Hierarchy (h1 → h2 → h3)
- `<main>`, `<article>`, `<section>` Tags
- Descriptive Alt-Text für Bilder
- Proper Link Text (nicht "Klick hier")

### Content Optimization
- Mindestens 300 Wörter pro Post
- Meta Description: 150-160 Zeichen
- Keyword Placement: Title, H1, erste 100 Worte
- Internal Linking zwischen Related Topics

---

## 8. Langfristige Wartung

### Sitemap & Robots.txt aktualisieren
Diese werden **automatisch** vom Server generiert (`/api/sitemap` Endpoint).
- Keine manuelle Wartung nötig
- Neue Posts/Authors werden sofort indiziert
- Letzte Änderungszeit wird tracked

### Google Search Console
1. Gehe zu: `https://search.google.com/search-console`
2. Verifiziere Domain: `https://meum-diarium.xn--schchner-2za.de/`
3. Reiche Sitemap ein: `https://meum-diarium.xn--schchner-2za.de/sitemap.xml`
4. Überwache Core Web Vitals

### Bing Webmaster Tools
1. Gehe zu: `https://www.bing.com/webmasters`
2. Reiche Sitemap ein

### Page Speed Insights
Regelmäßig testen:
- `https://pagespeed.web.dev/`
- Zielvorgabe: >90 Performance Score

---

## 9. Fehlerbehandlung & Monitoring

### 404 Seite
- `src/pages/NotFound.tsx` sollte SEO-optimiert sein
- Include: `<meta property="og:type" content="website" />`

### Broken Links
- Regex-Check für tote interne Links
- Externe Links: periodic check mit crawler

### Server Error Logging
- Log 5xx Errors
- Alert auf Critical Issues

---

## 10. Testing & Validation

### Online Tools
- `https://validator.schema.org/` → JSON-LD Validierung
- `https://search.google.com/test/rich-results` → Rich Results
- `https://www.bing.com/webmaster/tools/markup-validator` → Bing Validator
- `https://wave.webaim.org/` → Accessibility

### Local Testing
```bash
# Syntax-Check
npm run lint

# Build-Check
npm run build

# Server-Check (curl)
curl -I https://meum-diarium.xn--schchner-2za.de/robots.txt
curl -I https://meum-diarium.xn--schchner-2za.de/sitemap.xml
```

---

## Checkliste für Deployment

- [ ] Domain DNS eingerichtet
- [ ] SSL/TLS Zertifikat aktiv (HTTPS)
- [ ] `.htaccess` auf Server hochgeladen
- [ ] `robots.txt` Endpoint erreichbar
- [ ] `sitemap.xml` Endpoint erreichbar
- [ ] Open Graph Tags validiert
- [ ] Mobile Viewport getestet (Chrome DevTools)
- [ ] PWA installierbar (offline test)
- [ ] Google Search Console verifiziert
- [ ] Bing Webmaster Tools verifiziert
- [ ] Core Web Vitals monitored
- [ ] Analytics eingerichtet (Google Analytics / Plausible)

---

## Zusammenfassung

✅ **Dynamische Sitemap** pro Content ändern  
✅ **KI-Crawler Zugang** (GPTBot, Claude, etc.)  
✅ **Mobile-First Design** mit PWA  
✅ **Strukturierte Daten** (JSON-LD)  
✅ **Sprachunterstützung** (de, en, la)  
✅ **HTTPS + Security** Headers  
✅ **Performance Optimized** (Gzip, Caching)  
✅ **SEO-Ready** (Canonical, Meta, OG)  

Diese Website ist nun vollständig für moderne Suchmaschinen und KI-Modelle optimiert! 🏛️

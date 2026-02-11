import React, { useEffect, useState } from 'react';
import { Shield, Cpu, BookOpen, GraduationCap, BarChart3, Globe, Code2, Zap } from 'lucide-react';
type EndpointParam = {
    name: string;
    desc: string;
};
type Endpoint = {
    title: string;
    method: string;
    path: string;
    desc: string;
    params?: EndpointParam[];
    requestSchema?: string;
    responseSchema?: string;
    requestExample?: string;
    notes?: string[];
    isPrivate?: boolean;
};
const ApiDocsPage = () => {
    useEffect(() => {
        document.title = "Meum Diarium API | Dokumentation";
    }, []);
    const primaryBaseUrl = "https://meum-diarium.xn--schchner-2za.de";
    const sections = [
        { id: 'info', label: 'Was ist eine API?' },
        { id: 'base', label: 'Basis' },
        { id: 'content', label: 'Content' },
        { id: 'discovery', label: 'Discovery' },
        { id: 'ai', label: 'KI' },
        { id: 'system', label: 'System' }
    ];
    const contentEndpoints: Endpoint[] = [
        {
            title: "Katalog",
            method: "GET",
            path: "/api/catalog",
            desc: "Gibt eine Übersicht über die gesamte Datenbank zurück, inklusive Beitragszahlen und verfügbaren Autoren.",
            responseSchema: `{
  "timestamp": "YYYY-MM-DD",
  "counts": { "posts": number, "lexicon": number, "works": number, "authors": number },
  "available_authors": string[]
}`
        },
        {
            title: "Beiträge",
            method: "GET",
            path: "/api/posts",
            desc: "Listet alle verfügbaren Beiträge mit Slugs, Titeln und Autoren auf. Unterstützt Filterung nach Tags.",
            params: [
                { name: "tag", desc: "Filter nach Tag (optional)." },
                { name: "slug", desc: "Einzelnen Beitrag abrufen (optional)." }
            ],
            responseSchema: `[
  { 
    "id": string,
    "slug": string, 
    "title": string, 
    "author": string, 
    "authorId": string,
    "excerpt": string,
    "date": string,
    "tags": string[],
    "content": { "diary": string, "scientific": string }
  }
]`
        },
        {
            title: "Beitrags-Details",
            method: "GET | PUT | DELETE",
            path: "/api/posts/{author}/{slug}",
            desc: "GET: Gibt den vollständigen Inhalt eines spezifischen Beitrags zurück. PUT: Aktualisiert Beitrag. DELETE: Löscht Beitrag.",
            params: [
                { name: "author", desc: "Autor-Id (caesar, cicero, augustus, catilina, seneca)." },
                { name: "slug", desc: "Slug des Beitrags." }
            ],
            requestSchema: `{
  "title": string,
  "excerpt": string,
  "content": { "diary": string, "scientific": string },
  "tags": string[]
}`,
            responseSchema: `{
  "id": string,
  "slug": string,
  "title": string,
  "author": string,
  "authorId": string,
  "content": { "diary": string, "scientific": string },
  "tags": string[]
}`,
            notes: ["PUT/DELETE erfordern passende Berechtigungen."]
        },
        {
            title: "Vokabeln (Suche)",
            method: "GET",
            path: "/api/vocab",
            desc: "Durchsucht die Vokabel-Datenbank nach lateinischen oder deutschen Begriffen.",
            params: [
                { name: "q", desc: "Suchbegriff (optional)." },
                { name: "limit", desc: "Anzahl der Ergebnisse (Standard: 50)." },
                { name: "offset", desc: "Offset für Pagination (Standard: 0)." }
            ],
            responseSchema: `{
  "results": [
    {
      "id": number,
      "vokId": string,
      "latin": string,
      "desc": string,
      "key": string,
      "grammar": string,
      "typnr": number
    }
  ],
  "count": number,
  "limit": number,
  "offset": number,
  "source": {
    "name": "Latin-GermanDictionary",
    "entries": 36140
  }
}`,
            notes: ["Durchsucht lateinische Wörter, deutsche Übersetzungen und Schlüsselbegriffe."]
        },
        {
            title: "Vokabel-Details",
            method: "GET",
            path: "/api/vocab/{vokId}",
            desc: "Gibt alle Details zu einer Vokabel inklusive aller grammatikalischen Formen zurück.",
            params: [
                { name: "vokId", desc: "Vokabel-ID (entweder numerische ID oder vokId)." }
            ],
            responseSchema: `{
  "id": number,
  "vokId": string,
  "latin": string,
  "desc": string,
  "key": string,
  "grammar": string,
  "typnr": number,
  "forms": [
    {
      "id": number,
      "vokId": string,
      "nr": number,
      "form": string,
      "bestimmung": string
    }
  ]
}`,
            notes: ["Enthält Deklinationen, Konjugationen und grammatikalische Beschreibungen."]
        },
        {
            title: "Lexikon",
            method: "GET | POST | PUT | DELETE",
            path: "/api/lexicon",
            desc: "GET: Liste aller historischen Begriffe. POST: Neuen Eintrag erstellen. PUT: Eintrag aktualisieren. DELETE: Eintrag löschen.",
            params: [
                { name: "slug", desc: "Slug für spezifischen Eintrag (GET/PUT/DELETE)." },
                { name: "search", desc: "Suche in Begriffen und Definitionen (GET)." },
                { name: "limit", desc: "Anzahl der Ergebnisse (Standard: 100)." }
            ],
            requestSchema: `{
  "slug": string,
  "term": string,
  "definition": string,
  "variants": string[],
  "category": string,
  "etymology": string,
  "relatedTerms": string[],
  "translations": object
}`,
            responseSchema: `[
  { 
    "slug": string,
    "term": string, 
    "definition": string,
    "variants": string[],
    "category": string,
    "etymology": string,
    "relatedTerms": string[],
    "translations": object
  }
]`
        },
        {
            title: "Autoren",
            method: "GET | POST | PUT | DELETE",
            path: "/api/authors",
            desc: "GET: Liste aller Autoren. POST: Neuen Autor erstellen. PUT: Autor aktualisieren. DELETE: Autor löschen.",
            params: [
                { name: "id", desc: "Autor-ID für spezifischen Autor (GET/PUT/DELETE)." }
            ],
            requestSchema: `{
  "id": string,
  "name": string,
  "latinName": string,
  "title": string,
  "years": string,
  "birthYear": number,
  "deathYear": number,
  "description": string,
  "heroImage": string,
  "theme": string,
  "color": string,
  "highlights": array
}`,
            responseSchema: `[
  {
    "id": string,
    "name": string,
    "latinName": string,
    "title": string,
    "years": string,
    "birthYear": number,
    "deathYear": number,
    "description": string,
    "heroImage": string,
    "theme": string,
    "color": string,
    "highlights": array
  }
]`,
            notes: ["PUT/DELETE erfordern passende Berechtigungen."]
        }
    ];
    const discoveryEndpoints: Endpoint[] = [
        {
            title: "Tags",
            method: "GET",
            path: "/api/tags",
            desc: "Gibt alle verfügbaren Tags zurück.",
            responseSchema: `[
  { "id": string, "name": string, "count": number }
]`
        }
    ];
    const aiEndpoints: Endpoint[] = [
        {
            title: "KI Chat",
            method: "GET | POST",
            path: "/api/ask",
            desc: "Kommuniziere direkt mit einer historischen Persona. Forwarded to external AI service.",
            params: [
                { name: "persona", desc: "Name der Figur (caesar, cicero, augustus, catilina, seneca)." },
                { name: "ask", desc: "Die Nachricht oder Frage an die KI." },
                { name: "history", desc: "Optionaler Chat-Verlauf als JSON-Array {role, content}." },
                { name: "sitemap", desc: "Optional: URL zur Sitemap für Quellenvorschlage." }
            ],
            requestSchema: `{
  "persona"?: string,
  "ask": string,
  "history"?: [{ "role": "user" | "assistant" | "system", "content": string }],
  "sitemap"?: string
}`,
            requestExample: `curl -X POST "${primaryBaseUrl}/api/ask" \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "caesar",
    "ask": "Warum überschreitest du den Rubikon?",
    "history": [
      { "role": "user", "content": "Sei kurz." }
    ]
  }'`,
            responseSchema: `{
  "response": { "response": string },
  "resources": Array<{ "title": string, "type": string, "link": string }>,
  "format": "markdown"
}`,
            notes: ["Antworten sind als Markdown formatiert.", "External service proxy."],
            isPrivate: true
        },
        {
            title: "Begriff erklären",
            method: "GET | POST",
            path: "/api/explain",
            desc: "Erklärt einen Begriff kurz und historisch korrekt. Optional kann eine konkrete Frage gestellt werden.",
            params: [
                { name: "term", desc: "Begriff (z.B. Rubikon)." },
                { name: "question", desc: "Optionale Frage zur Vertiefung." },
                { name: "history", desc: "Optionaler Verlauf als JSON-Array." }
            ],
            requestSchema: `{
  "term": string,
  "question"?: string,
  "history"?: [{ "role": "user" | "assistant" | "system", "content": string }]
}`,
            requestExample: `curl -X GET "${primaryBaseUrl}/api/explain?term=Rubikon"`,
            responseSchema: `{
  "term": string,
  "response": { "response": string },
  "format": "markdown"
}`,
            notes: ["External service proxy."],
            isPrivate: true
        },
        {
            title: "Simulation",
            method: "POST",
            path: "/api/simulate",
            desc: "Startet ein interaktives Rollenspiel-Szenario und liefert JSON mit Optionen und Statuswerten.",
            params: [
                { name: "persona", desc: "Persona für die Simulation (caesar, cicero, augustus)." },
                { name: "scenario", desc: "Kurzbeschreibung des Szenarios." },
                { name: "choice", desc: "Optional: Entscheidung aus vorheriger Runde." },
                { name: "history", desc: "Optionaler Verlauf als Array {role, content}." }
            ],
            requestSchema: `{
  "persona": string,
  "scenario": string,
  "choice"?: string,
  "history"?: [{ "role": "user" | "assistant" | "system", "content": string }]
}`,
            requestExample: `curl -X POST "${primaryBaseUrl}/api/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "caesar",
    "scenario": "Die Überquerung des Rubikon",
    "choice": "Wir werden angreifen!"
  }'`,
            responseSchema: `{
  "narrative": string,
  "stats": { "volk": number, "einfluss": number, "macht": number },
  "options": [{ "id": string, "text": string }],
  "ended": boolean
}`,
            notes: ["External service proxy."],
            isPrivate: true
        }
    ];
    const systemEndpoints: Endpoint[] = [
        {
            title: "Stats",
            method: "GET",
            path: "/api/stats",
            desc: "Dynamische Kennzahlen für Beiträge, Autoren und Lesezeit aus der Datenbank.",
            responseSchema: `{
  "posts": number,
  "authors": number,
  "tags": number,
  "totalReadingTime": number,
  "averageReadingTime": number,
  "postsByAuthor": {
    "[authorId]": number
  },
  "topTags": [
    { "tag": string, "count": number }
  ],
  "generatedAt": string
}`,
            notes: ["Berechnet Kennzahlen in Echtzeit aus der D1 Datenbank."]
        }
    ];
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[380px] sm:h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl opacity-50" />
            </div>
            <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
                <header className="text-center mb-14 sm:mb-20">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-primary mb-6 sm:mb-8 backdrop-blur-md">
                        V1 API Dokumentation
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-4 sm:mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Meum Diarium API
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Vollstandige Dokumentation aller Content- und KI-Endpunkte, inklusive cURL-Beispielen.
                        Fokus auf mobile Lesbarkeit und klaren Einstieg.
                    </p>
                </header>
                <nav className="sticky top-4 z-20 mb-10 sm:mb-16">
                    <div className="bg-card/90 border border-border rounded-full px-3 py-2 shadow-sm backdrop-blur">
                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="px-3 py-1 rounded-full text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition"
                                >
                                    {section.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </nav>
                <div className="grid gap-16 sm:gap-20">
                    <section id="info" className="scroll-mt-24">
                        <div className="flex items-center gap-6 mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold whitespace-nowrap">API Guide</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className="bg-card border border-border rounded-[24px] p-6 sm:p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Globe className="w-24 h-24" />
                                </div>
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Code2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold">Was ist eine API?</h3>
                                </div>
                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                    Eine <strong>API</strong> (Application Programming Interface) fungiert als digitaler Dolmetscher.
                                    Sie ermöglicht es externen Anwendungen, direkt auf die Wissensdatenbank von Meum Diarium zuzugreifen.
                                    Statt einer grafischen Oberfläche liefert sie rein strukturierte Daten (JSON),
                                    die von Programmen verarbeitet werden können.
                                </p>
                            </div>
                            <div className="bg-card border border-border rounded-[24px] p-6 sm:p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Shield className="w-24 h-24" />
                                </div>
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold">Warum Meum Diarium API?</h3>
                                </div>
                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                    Wir glauben an die Demokratisierung von historischem Wissen. Unsere API stellt
                                    wissenschaftliche Inhalte, historische Quellen und KI-basierte Simulationen
                                    einer breiten Masse an Entwicklern und Forschern zur Verfügung, um Geschichte
                                    erlebbar zu machen.
                                </p>
                            </div>
                            <div className="bg-card border border-border rounded-[24px] p-6 sm:p-8 sm:col-span-2">
                                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    Was kannst du damit machen?
                                </h3>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            <GraduationCap className="w-4 h-4" />
                                            <span className="font-bold text-xs uppercase tracking-wider">Bildung & Lehre</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Entwickle interaktive Lernplattformen, die auf unsere kuratierten Inhalte
                                            und historischen Biografien zugreifen.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            <BarChart3 className="w-4 h-4" />
                                            <span className="font-bold text-xs uppercase tracking-wider">Datenanalyse</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Nutze den gesamten Katalog für quantitative Analysen römischer Geschichte
                                            oder für Natural Language Processing (NLP).
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            <BookOpen className="w-4 h-4" />
                                            <span className="font-bold text-xs uppercase tracking-wider">Forschungstools</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Integriere historische Fakten und Glossareinträge direkt in deine
                                            wissenschaftlichen Anwendungen oder Zitationssysteme.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Globe className="w-4 h-4" />
                                            <span className="font-bold text-xs uppercase tracking-wider">Integrationen</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Baue Browser-Extensions oder Mobile Apps, die unseren "Sententia Diei"
                                            oder die Timeline als Widget anzeigen.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Cpu className="w-4 h-4" />
                                            <span className="font-bold text-xs uppercase tracking-wider">KI-Experimente</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Nutze die Persona-Schnittstellen, um eigene Chat-Bots oder
                                            Rollenspiel-Szenarien mit antiken Charakteren zu gestalten.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Shield className="w-4 h-4" />
                                            <span className="font-bold text-xs uppercase tracking-wider">Open Science</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Alle öffentlich zugänglichen Daten fördern das Open Science Prinzip –
                                            freier Zugang zu Wissen für eine informierte Gesellschaft.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="base" className="scroll-mt-24">
                        <div className="flex items-center gap-6 mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold whitespace-nowrap">Basis-URL</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>
                        <div className="bg-card border border-border rounded-[20px] p-5 sm:p-6 mb-8">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    Pages
                                </span>
                                <span className="text-primary font-mono text-xs sm:text-sm bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                    {primaryBaseUrl}
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-3">
                                Statische Content-API plus KI-Proxy unter derselben Domain. /api liefert diese Dokumentation.
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-[20px] p-5 sm:p-6">
                            <h3 className="text-lg font-bold mb-4">Schnellstart mit cURL</h3>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Du kannst die API direkt von deinem Terminal aus testen. Hier ist ein Beispiel, wie du den Katalog abrufst:
                            </p>
                            <div className="bg-black/80 rounded-2xl p-4 sm:p-6 border border-border/50 font-mono text-xs sm:text-sm overflow-x-auto">
                                <pre className="text-zinc-400 whitespace-pre-wrap">
                                    {`curl "${primaryBaseUrl}/api/catalog"`}
                                </pre>
                            </div>
                        </div>
                    </section>
                    <section id="content" className="scroll-mt-24">
                        <div className="flex items-center gap-6 mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold whitespace-nowrap">Content Endpunkte</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>
                        <div className="grid gap-6 sm:gap-8">
                            {contentEndpoints.map((endpoint, i) => (
                                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} baseUrl={primaryBaseUrl} />
                            ))}
                        </div>
                    </section>
                    <section id="discovery" className="scroll-mt-24">
                        <div className="flex items-center gap-6 mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold whitespace-nowrap">Discovery Endpunkte</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>
                        <div className="grid gap-6 sm:gap-8">
                            {discoveryEndpoints.map((endpoint, i) => (
                                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} baseUrl={primaryBaseUrl} />
                            ))}
                        </div>
                    </section>
                    <section id="ai" className="scroll-mt-24">
                        <div className="flex items-center gap-6 mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold whitespace-nowrap">KI Schnittstellen</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>
                        <div className="grid gap-6 sm:gap-8">
                            {aiEndpoints.map((endpoint, i) => (
                                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} baseUrl={primaryBaseUrl} />
                            ))}
                        </div>
                    </section>
                    <section id="system" className="scroll-mt-24">
                        <div className="flex items-center gap-6 mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold whitespace-nowrap">System Endpunkte</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>
                        <div className="grid gap-6 sm:gap-8">
                            {systemEndpoints.map((endpoint, i) => (
                                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} baseUrl={primaryBaseUrl} />
                            ))}
                        </div>
                    </section>
                </div>
                <footer className="mt-24 sm:mt-32 pt-10 sm:pt-12 border-t border-border text-center text-muted-foreground text-sm">
                    <p>© 2026 Meum Diarium. Entwickelt fur die romische Ewigkeit.</p>
                    <p className="mt-4 opacity-50">Alle Daten werden via Cloudflare Edge Network ausgeliefert.</p>
                </footer>
            </div>
        </div>
    );
};
const EndpointCard = ({ endpoint, index, baseUrl }: { endpoint: Endpoint, index: number, baseUrl: string }) => {
    const fullUrl = `${baseUrl}${endpoint.path}`;
    return (
        <div className="group relative bg-card border border-border rounded-[22px] overflow-hidden transition-all duration-300">
            <div className="p-6 sm:p-8 relative">
                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary text-black font-mono font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                            {endpoint.method}
                        </span>
                        <code className="text-primary font-mono text-xs sm:text-sm md:text-base bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                            {endpoint.path}
                        </code>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">{endpoint.title}</h3>
                </div>
                {!endpoint.isPrivate ? (
                    <div className="mb-5 text-[11px] sm:text-xs font-mono text-muted-foreground break-all">
                        {fullUrl}
                    </div>
                ) : (
                    <div className="mb-5 flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        <Shield className="w-3 h-3" />
                        Interner Endpunkt • Zugriff nur via Frontend-Proxy
                    </div>
                )}
                <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl text-sm sm:text-base">
                    {endpoint.desc}
                </p>
                {endpoint.params && (
                    <div className="mb-6 p-4 sm:p-6 bg-secondary/30 rounded-2xl border border-border/50">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Parameter</h4>
                        <div className="grid gap-3">
                            {endpoint.params.map((p) => (
                                <div key={p.name} className="grid grid-cols-[100px_1fr] gap-3 text-sm">
                                    <span className="text-primary font-mono font-semibold">{p.name}</span>
                                    <span className="text-muted-foreground">{p.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {endpoint.requestSchema && (
                    <CodeBlock label="Request Schema" code={endpoint.requestSchema} />
                )}
                {endpoint.requestExample && !endpoint.isPrivate && (
                    <CodeBlock label="Request Beispiel" code={endpoint.requestExample} />
                )}
                {endpoint.responseSchema && (
                    <CodeBlock label="Response Format (JSON)" code={endpoint.responseSchema} />
                )}
                {endpoint.notes && endpoint.notes.length > 0 && (
                    <div className="mt-4 text-sm text-muted-foreground">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Hinweise</div>
                        <ul className="space-y-2">
                            {endpoint.notes.map((note, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{note}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
const CodeBlock = ({ label, code }: { label: string; code: string }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCollapsed(window.innerWidth < 768);
        }
    }, []);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            setCopied(false);
        }
    };
    return (
        <div className="relative mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</h4>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                    <button
                        type="button"
                        onClick={() => setCollapsed(!collapsed)}
                        className="px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground transition"
                    >
                        {collapsed ? 'Aufklappen' : 'Zuklappen'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground transition"
                    >
                        {copied ? 'Kopiert' : 'Kopieren'}
                    </button>
                </div>
            </div>
            {!collapsed && (
                <div className="bg-black/80 rounded-2xl p-4 sm:p-6 border border-border/50 font-mono text-xs sm:text-sm overflow-x-auto">
                    <pre className="text-zinc-400 whitespace-pre-wrap">
                        {code}
                    </pre>
                </div>
            )}
        </div>
    );
};
export default ApiDocsPage;

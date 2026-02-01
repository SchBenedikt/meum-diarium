import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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
    responseExample?: string;
    notes?: string[];
};

const ApiDocsPage = () => {
    useEffect(() => {
        document.title = "Meum Diarium API | Dokumentation";
    }, []);

    const primaryBaseUrl = "https://meum-diarium.xn--schchner-2za.de";
    const workerBaseUrl = "https://caesar.schaechner.workers.dev";

    const baseUrls = [
        {
            label: "Pages (primar)",
            url: primaryBaseUrl,
            desc: "Statische Content-API + Proxy fur KI-Endpunkte. /api liefert diese Dokumentation als SPA.",
        },
        {
            label: "Worker (direkt)",
            url: workerBaseUrl,
            desc: "KI-Endpunkte laufen nativ im Worker. Gleiche JSON-Schemas, meist geringere Latenz.",
        }
    ];

    const contentEndpoints: Endpoint[] = [
        {
            title: "Katalog",
            method: "GET",
            path: "/api/catalog",
            desc: "Gibt eine Ubersicht uber die gesamte Datenbank zuruck, inklusive Beitragszahlen und verfugbaren Autoren.",
            responseSchema: `{
  "timestamp": "YYYY-MM-DD",
  "counts": { "posts": number, "lexicon": number, "works": number },
  "available_authors": string[]
}`,
            responseExample: `{
  "timestamp": "2026-02-01",
  "counts": { "posts": 41, "lexicon": 92, "works": 7 },
  "available_authors": ["caesar", "cicero", "augustus", "catilina", "seneca"]
}`
        },
        {
            title: "Beitrage",
            method: "GET",
            path: "/api/posts",
            desc: "Listet alle verfugbaren Beitrage mit Slugs, Titeln und Autoren auf.",
            responseSchema: `[
  { "slug": string, "title": string, "author": string, "summary"?: string }
]`,
            responseExample: `[
  {
    "slug": "mein-konsulat",
    "title": "Mein Konsulat",
    "author": "caesar",
    "summary": "Ein Blick auf politische Machtspiele."
  }
]`
        },
        {
            title: "Beitrags-Details",
            method: "GET",
            path: "/api/posts/{author}/{slug}",
            desc: "Gibt den vollstandigen Inhalt eines spezifischen Beitrags zuruck.",
            params: [
                { name: "author", desc: "Autor-Id (caesar, cicero, augustus, catilina, seneca)." },
                { name: "slug", desc: "Slug des Beitrags." }
            ],
            responseSchema: `{
  "slug": string,
  "title": string,
  "author": string,
  "content": string,
  "tags"?: string[]
}`,
            responseExample: `{
  "slug": "mein-konsulat",
  "title": "Mein Konsulat",
  "author": "caesar",
  "content": "Der Senat tobt, doch die Legionen folgen...",
  "tags": ["politik", "senat"]
}`
        },
        {
            title: "Lexikon",
            method: "GET",
            path: "/api/lexicon",
            desc: "Gibt eine Liste aller historischen Begriffe und Definitionen zuruck.",
            responseSchema: `[
  { "term": string, "definition": string, "slug": string }
]`,
            responseExample: `[
  {
    "term": "Rubikon",
    "definition": "Ein Grenzfluss Norditaliens.",
    "slug": "rubikon"
  }
]`
        },
        {
            title: "Werke",
            method: "GET",
            path: "/api/works",
            desc: "Listet alle Werke/Schriften mit Basis-Metadaten auf.",
            responseSchema: `[
  { "slug": string, "title": string, "author"?: string, "type"?: string }
]`,
            responseExample: `[
  { "slug": "de-bello-gallico", "title": "De Bello Gallico", "author": "caesar" }
]`
        },
        {
            title: "Werk-Details",
            method: "GET",
            path: "/api/works-details/{slug}",
            desc: "Gibt den vollstandigen Inhalt eines Werks zuruck.",
            params: [{ name: "slug", desc: "Slug des Werks." }],
            responseSchema: `{
  "slug": string,
  "title": string,
  "content": string
}`,
            responseExample: `{
  "slug": "de-bello-gallico",
  "title": "De Bello Gallico",
  "content": "Gallia est omnis divisa in partes tres..."
}`
        },
        {
            title: "About-Seiten",
            method: "GET",
            path: "/api/about",
            desc: "Liefert statische Infoseiten (z.B. Impressum, Datenschutz).",
            responseSchema: `[
  { "slug": string, "title": string, "content": string }
]`,
            responseExample: `[
  {
    "slug": "imprint",
    "title": "Impressum",
    "content": "Kontakt und Verantwortlichkeiten..."
  }
]`
        }
    ];

    const aiEndpoints: Endpoint[] = [
        {
            title: "KI Chat",
            method: "GET | POST",
            path: "/api/ask",
            desc: "Kommuniziere direkt mit einer historischen Persona. GET fur kurze Abfragen, POST fur langere Inhalte und History.",
            params: [
                { name: "persona", desc: "Name der Figur (caesar, cicero, augustus, catilina, seneca)." },
                { name: "ask", desc: "Die Nachricht oder Frage an die KI." },
                { name: "history", desc: "Optionaler Chat-Verlauf als JSON-Array {role, content}." },
                { name: "sitemap", desc: "Optional: URL zur Sitemap fur Quellenvorschlage." }
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
    "ask": "Warum uberschreitetest du den Rubikon?",
    "history": [
      { "role": "user", "content": "Sei kurz." }
    ]
  }'`,
            responseSchema: `{
  "persona": string,
  "inputs": { "messages": Array<any> },
  "response": { "response": string },
  "resources": Array<{ "title": string, "type": string, "link": string }>,
  "format": "markdown"
}`,
            responseExample: `{
  "persona": "caesar",
  "response": { "response": "Der Rubikon war die rote Linie..." },
  "resources": [
    { "title": "Rubikon", "type": "lexicon", "link": "/lexicon/rubikon" }
  ],
  "format": "markdown"
}`,
            notes: [
                `Direktaufruf uber Worker: ${workerBaseUrl}/?persona=caesar&ask=...`,
                "Antworten sind als Markdown formatiert."
            ]
        },
        {
            title: "Begriff erklaren",
            method: "GET | POST",
            path: "/api/explain",
            desc: "Erklart einen Begriff kurz und historisch korrekt. Optional kann eine konkrete Frage gestellt werden.",
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
            responseExample: `{
  "term": "Rubikon",
  "response": { "response": "Der Rubikon war..." },
  "format": "markdown"
}`,
            notes: [
                `Direktaufruf uber Worker: ${workerBaseUrl}/explain?term=Rubikon`
            ]
        },
        {
            title: "Simulation",
            method: "POST",
            path: "/api/simulate",
            desc: "Startet ein interaktives Rollenspiel-Szenario und liefert JSON mit Optionen und Statuswerten.",
            params: [
                { name: "persona", desc: "Persona fur die Simulation (caesar, cicero, augustus)." },
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
    "scenario": "Die Uberquerung des Rubikon",
    "choice": "Wir werden angreifen!"
  }'`,
            responseSchema: `{
  "narrative": string,
  "stats": { "volk": number, "einfluss": number, "macht": number },
  "options": [{ "id": string, "text": string }],
  "ended": boolean
}`,
            responseExample: `{
  "narrative": "Die Wurfel sind gefallen...",
  "stats": { "volk": 3, "einfluss": -2, "macht": 6 },
  "options": [
    { "id": "o1", "text": "Legionen formieren" },
    { "id": "o2", "text": "Senat einschuchtern" },
    { "id": "o3", "text": "Verhandlungen anbieten" }
  ],
  "ended": false
}`,
            notes: [
                `Direktaufruf uber Worker: ${workerBaseUrl}/simulate`
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl opacity-50" />
            </div>

            <div className="container max-w-5xl mx-auto px-6 py-24 relative">
                <header className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-primary mb-8 backdrop-blur-md"
                    >
                        V1 API Dokumentation
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Meum Diarium API
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Vollstandige Dokumentation aller Content- und KI-Endpunkte, inklusive cURL-Beispielen,
                        Schema und Antworten. Die KI lauft uber einen Cloudflare Worker, die Content-Daten werden
                        statisch ausgeliefert.
                    </motion.p>
                </header>

                <div className="grid gap-20">
                    <section>
                        <div className="flex items-center gap-6 mb-10">
                            <h2 className="text-3xl font-display font-bold whitespace-nowrap">Basis-URLs</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>
                        <div className="grid gap-6">
                            {baseUrls.map((base, index) => (
                                <motion.div
                                    key={base.url}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-card border border-border rounded-[20px] p-6"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                            {base.label}
                                        </span>
                                        <span className="text-primary font-mono text-sm bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                            {base.url}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground mt-3">{base.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-6 mb-10">
                            <h2 className="text-3xl font-display font-bold whitespace-nowrap">Content Endpunkte</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>

                        <div className="grid gap-8">
                            {contentEndpoints.map((endpoint, i) => (
                                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} baseUrl={primaryBaseUrl} />
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-6 mb-10">
                            <h2 className="text-3xl font-display font-bold whitespace-nowrap">KI Schnittstellen</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>

                        <div className="grid gap-8">
                            {aiEndpoints.map((endpoint, i) => (
                                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} baseUrl={primaryBaseUrl} />
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="mt-32 pt-12 border-t border-border text-center text-muted-foreground text-sm">
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-card border border-border rounded-[24px] overflow-hidden hover:border-primary/30 transition-all duration-500"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-8 relative">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-primary text-black font-mono font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                            {endpoint.method}
                        </span>
                        <code className="text-primary font-mono text-sm md:text-base bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                            {endpoint.path}
                        </code>
                    </div>
                    <h3 className="text-xl font-bold">{endpoint.title}</h3>
                </div>

                <div className="mb-6 text-xs font-mono text-muted-foreground">
                    {fullUrl}
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                    {endpoint.desc}
                </p>

                {endpoint.params && (
                    <div className="mb-8 p-6 bg-secondary/30 rounded-2xl border border-border/50">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Parameter</h4>
                        <div className="grid gap-4">
                            {endpoint.params.map((p) => (
                                <div key={p.name} className="grid grid-cols-[120px_1fr] gap-4 text-sm">
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

                {endpoint.requestExample && (
                    <CodeBlock label="Request Beispiel" code={endpoint.requestExample} />
                )}

                {endpoint.responseSchema && (
                    <CodeBlock label="Response Schema" code={endpoint.responseSchema} />
                )}

                {endpoint.responseExample && (
                    <CodeBlock label="Response Beispiel" code={endpoint.responseExample} />
                )}

                {endpoint.notes && endpoint.notes.length > 0 && (
                    <div className="mt-6 text-sm text-muted-foreground">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Hinweise</div>
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
        </motion.div>
    );
};

const CodeBlock = ({ label, code }: { label: string; code: string }) => {
    return (
        <div className="relative group/code mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{label}</h4>
            <div className="bg-black/80 rounded-2xl p-6 border border-border/50 font-mono text-sm overflow-x-auto">
                <pre className="text-zinc-400 whitespace-pre-wrap">
                    {code}
                </pre>
            </div>
        </div>
    );
};

export default ApiDocsPage;

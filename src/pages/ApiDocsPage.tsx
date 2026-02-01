import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ApiDocsPage = () => {
    useEffect(() => {
        document.title = "Meum Diarium API | Dokumentation";
    }, []);

    const endpoints = [
        {
            title: "Katalog",
            method: "GET",
            url: "/api/catalog",
            desc: "Gibt eine Übersicht über die gesamte Datenbank zurück, inklusive Beitragszahlen und verfügbaren Autoren.",
            example: `{
  "timestamp": "2026-02-01",
  "counts": {
    "posts": 41,
    "lexicon": 92,
    "works": 7
  },
  "available_authors": ["caesar", "cicero", "augustus"]
}`
        },
        {
            title: "Beiträge",
            method: "GET",
            url: "/api/posts",
            desc: "Listet alle verfassen Blog-Beiträge mit Slugs, Titeln und Autoren auf."
        },
        {
            title: "Beitrags-Details",
            method: "GET",
            url: "/api/posts/{author}/{slug}",
            desc: "Gibt den vollständigen Inhalt eines spezifischen Beitrags zurück."
        },
        {
            title: "Lexikon",
            method: "GET",
            url: "/api/lexicon",
            desc: "Gibt eine Liste aller historischen Begriffe und Definitionen zurück."
        },
        {
            title: "KI Chat",
            method: "GET",
            url: "/api?persona=caesar&ask={text}",
            desc: "Kommuniziere direkt mit einer historischen Persona. Die KI antwortet im entsprechenden Stil.",
            params: [
                { name: "persona", desc: "Name der Figur (caesar, cicero, augustus, catilina, seneca)." },
                { name: "ask", desc: "Die Nachricht oder Frage an die KI." }
            ]
        },
        {
            title: "Simulation",
            method: "POST",
            url: "/api/simulate",
            desc: "Startet ein interaktives Rollenspiel-Szenario."
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl opacity-50" />
            </div>

            <div className="container max-w-5xl mx-auto px-6 py-24 relative">
                <header className="text-center mb-24">
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
                        className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Meum Diarium API
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Eine moderne, schnelle und interaktive Schnittstelle für alle Inhalte des römischen Imperiums.
                    </motion.p>
                </header>

                <div className="grid gap-24">
                    <section>
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-3xl font-display font-bold whitespace-nowrap">Content Endpunkte</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>

                        <div className="grid gap-8">
                            {endpoints.slice(0, 4).map((endpoint, i) => (
                                <EndpointCard key={endpoint.url} endpoint={endpoint} index={i} />
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-3xl font-display font-bold whitespace-nowrap">KI Schnittstellen</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>

                        <div className="grid gap-8">
                            {endpoints.slice(4).map((endpoint, i) => (
                                <EndpointCard key={endpoint.url} endpoint={endpoint} index={i + 4} />
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="mt-40 pt-12 border-t border-border text-center text-muted-foreground text-sm">
                    <p>© 2026 Meum Diarium. Entwickelt für die römische Ewigkeit.</p>
                    <p className="mt-4 opacity-50">Alle Daten werden via Cloudflare Edge Network ausgeliefert.</p>
                </footer>
            </div>
        </div>
    );
};

const EndpointCard = ({ endpoint, index }: { endpoint: any, index: number }) => {
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
                            {endpoint.url}
                        </code>
                    </div>
                    <h3 className="text-xl font-bold">{endpoint.title}</h3>
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                    {endpoint.desc}
                </p>

                {endpoint.params && (
                    <div className="mb-8 p-6 bg-secondary/30 rounded-2xl border border-border/50">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Parameter</h4>
                        <div className="grid gap-4">
                            {endpoint.params.map((p: any) => (
                                <div key={p.name} className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                                    <span className="text-primary font-mono font-semibold">{p.name}</span>
                                    <span className="text-muted-foreground">{p.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {endpoint.example && (
                    <div className="relative group/code">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Beispiel Antwort</h4>
                        <div className="bg-black/80 rounded-2xl p-6 border border-border/50 font-mono text-sm overflow-x-auto">
                            <pre className="text-zinc-400">
                                {endpoint.example}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ApiDocsPage;

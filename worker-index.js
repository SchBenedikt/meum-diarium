// Worker code for improved AI resource suggestions
// This handles smarter keyword extraction and URL matching

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const isWorkersDevHost = url.hostname.endsWith('.workers.dev');

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders() });
        }
        if (!["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: corsHeaders(),
            });
        }

        // Normalize pathname: remove trailing slash and convert to lowercase
        const pathname = url.pathname.toLowerCase().replace(/\/$/, "");

        let body = null;
        if (request.method === "POST") {
            try {
                body = await request.json();
            } catch (e) {
                console.error("[Worker] Body parse error:", e);
            }
        }

        console.log(`[Worker] Received ${request.method} request for ${pathname}`);

        // Route: /explain - handle term summaries
        if (pathname.endsWith('/explain')) {
            return handleExplainTerm(request, env, url, body);
        }

        // Route: /simulate - handle text-based game
        if (pathname.endsWith('/simulate')) {
            return handleSimulation(request, env, url, body);
        }

        // Route: /stats - handle dynamic metrics
        if (pathname.endsWith('/stats')) {
            return handleStats();
        }

        // Route: /comments - proxy to backend
        if (pathname.endsWith('/comments')) {
            return handleComments(request, env, url, body);
        }

        // Route: /api/translations/works - handle work translations
        if (pathname.startsWith('/api/translations/works/')) {
            return handleWorkTranslations(request, env, url, body, pathname);
        }

        // Persona extraction and Documentation check
        let persona = (url.searchParams.get("persona") || body?.persona || "caesar").toLowerCase();
        let question = url.searchParams.get("ask") || body?.ask;
        let historyParam = url.searchParams.get("history") || (body?.history ? JSON.stringify(body.history) : null);
        let sitemapUrl = url.searchParams.get("sitemap") || body?.sitemap;

        // Route: explicit AI API aliases to avoid accidental proxying
        if (pathname === '/api/ask') {
            if (!question) {
                return new Response(JSON.stringify({ error: 'Missing ask parameter' }), {
                    status: 400,
                    headers: corsHeaders(),
                });
            }
            const aiResult = await handleAiChat(request, env, persona, question, historyParam, sitemapUrl);
            return new Response(JSON.stringify(aiResult), { headers: corsHeaders() });
        }

        if (pathname === '/api/explain') {
            return handleExplainTerm(request, env, url, body);
        }

        if (pathname === '/api/simulate') {
            return handleSimulation(request, env, url, body);
        }

        // Route: /api - Only proxy write operations or specific AI queries.
        // Standard content GET requests should fall through to Pages (static assets or Functions).
        if (pathname.startsWith('/api') && (["POST", "PUT", "DELETE"].includes(request.method) || question)) {
            // Skip work translations as they are handled separately
            if (pathname.startsWith('/api/translations/works/')) {
                // Already handled above, continue to next route
            } else {
                const baseBackendUrl = "https://meum-diarium.xn--schner-2za.de";
                const proxyUrl = new URL(url.pathname + url.search, baseBackendUrl);

                // Safety: Don't proxy back to self to avoid infinite loops
                if (url.hostname !== "meum-diarium.xn--schner-2za.de") {
                    try {
                        const headers = {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        };

                        // Forward Authorization header if present
                        const authHeader = request.headers.get('Authorization');
                        if (authHeader) {
                            headers['Authorization'] = authHeader;
                        }

                        const response = await fetch(proxyUrl.toString(), {
                            method: request.method,
                            headers: headers,
                            body: ["POST", "PUT", "DELETE"].includes(request.method) ? JSON.stringify(body) : null
                        });

                        const data = await response.json();
                        return new Response(JSON.stringify(data), {
                            headers: corsHeaders(),
                            status: response.status
                        });
                    } catch (e) {
                        return new Response(JSON.stringify({ error: "API Proxy Error", details: e.message }), {
                            status: 502,
                            headers: corsHeaders()
                        });
                    }
                }
            }
        }

        // Consolidate: If we have a question, it's an AI chat request.
        if (question) {
            const aiResult = await handleAiChat(request, env, persona, question, historyParam, sitemapUrl);
            return new Response(JSON.stringify(aiResult), { headers: corsHeaders() });
        }

        // Route: Root / or /api or PersonaChat - let fall through to SPA for premium React docs
        if (pathname === "" || pathname === "/personachat") {
            // On workers.dev there is no Pages origin to fall through to; avoid recursive self-fetch.
            if (isWorkersDevHost) {
                return new Response(JSON.stringify({
                    service: 'meum-diarium-worker',
                    status: 'ok',
                    message: 'Besuche https://meum-diarium.xn--schner-2za.de/api für Dokumentation'
                }), { headers: corsHeaders() });
            }
            return fetch(request);
        }

        // Route: /api - comprehensive documentation
        if (pathname === "/api") {
            const documentation = {
                service: 'meum-diarium-worker',
                status: 'ok',
                language: 'de',
                documentation: {
                    title: 'Meum Diarium API – Dokumentation',
                    what_is_api: {
                        summary: 'Eine API (Application Programming Interface) ist eine Schnittstelle für strukturierte Kommunikation zwischen Anwendungen.',
                        details: 'APIs ermöglichen es, spezifische Daten oder Funktionen anzufordern, ohne die innere Implementierung des Servers zu kennen. Statt Webseiten zu laden, senden Clients strukturierte Anfragen und erhalten JSON-Daten zurück.'
                    },
                    how_it_works: {
                        summary: 'HTTP-basierte Kommunikation mit JSON-Daten',
                        steps: [
                            '1. Client sendet HTTP-Anfrage (GET/POST) an einen Endpoint mit Parametern',
                            '2. Server verarbeitet die Anfrage (Datenbank-Abfragen, KI-Inferenz, etc.)',
                            '3. Server antwortet mit JSON-formatierter Antwort',
                            '4. Client nutzt die Daten (anzeigen, weiterverarbeiten, speichern)'
                        ],
                        example_flow: 'GET /api/ask?ask=Was%20ist%20der%20Rubikon&persona=caesar → 200 OK {response: "...", resources: [...]}'
                    },
                    use_cases: {
                        summary: 'Einsatzgebiete in meum-diarium',
                        applications: [
                            'Historische Konversationen: Fragen an römische Persönlichkeiten stellen (Caesar, Cicero, etc.)',
                            'Begriffserklärungen: Lateinische und römische Begriffe erklären lassen',
                            'Historische Simulation: Interaktive Szenarien und Rollenspiele',
                            'Inhaltsabruf: Zugriff auf Texte, Werke, Lexikon-Einträge',
                            'Statistiken: Metadaten und Übersichts-Daten',
                            'Datenintegration: Externe Anwendungen können auf Inhalte zugreifen'
                        ]
                    },
                    available_endpoints: [
                        {
                            method: 'GET/POST',
                            path: '/api/ask',
                            description: 'Frage an eine historische Persönlichkeit stellen',
                            parameters: 'ask (string), persona (caesar|augustus|cicero|catilina), history (array), sitemap (url)',
                            response: '{response: string, resources: [{title, type, link, description}], ...}'
                        },
                        {
                            method: 'GET/POST',
                            path: '/api/explain',
                            description: 'Einen historischen oder lateinischen Begriff erklären lassen',
                            parameters: 'term (string), question (optional string), history (array)',
                            response: '{term: string, response: {response: string}, format: "markdown"}'
                        },
                        {
                            method: 'GET/POST',
                            path: '/api/simulate',
                            description: 'Ein historisches Szenario als interaktives Rollenspiel spielen',
                            parameters: 'persona (string), scenario (string), choice (optional), history (array)',
                            response: '{narrative: string, stats: {volk, einfluss, macht}, options: [...], ended: boolean}'
                        },
                        {
                            method: 'GET',
                            path: '/api/stats',
                            description: 'Statistiken über verfügbare Inhalte',
                            parameters: 'keine',
                            response: '{counts: {...}, readingTime: {...}, yearRange: {...}, coverageYears: number}'
                        }
                    ],
                    integration_examples: {
                        chatbot: 'Verwende /api/ask um Fragen zu historischen Themen in einem Chatbot zu beantworten.',
                        mobile_app: 'Rufe /api/explain auf um ein Glossar historischer Begriffe automatisch zu generieren.',
                        external_service: 'Integriere /api/ask in deine eigene Anwendung für historisches Knowledge',
                        education: 'Nutze /api/simulate für interaktives historisches Lernen'
                    },
                    best_practices: [
                        'Verwende persona-Parameter um Antworten in charakteristischem Stil zu bekommen',
                        'Nutze history-Array um Konversationskontext aufzubauen',
                        'Parsiere Responses immer auf Fehler (error-Field)',
                        'Respektiere Rate-Limits durch sinnvolle Anfrage-Abstände'
                    ],
                    notes: {
                        format: 'Alle Responses sind gültiges JSON mit korrektem Content-Type',
                        encoding: 'UTF-8 für Umlaute und Sonderzeichen',
                        cors: 'CORS-Header sind aktiviert für Cross-Origin Requests',
                        markdown: 'Viele Responses enthalten GitHub-Flavored Markdown'
                    }
                }
            };
            return new Response(JSON.stringify(documentation, null, 2), {
                headers: {
                    ...corsHeaders(),
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
        }

        // Default: Pass through to the origin (Cloudflare Pages assets/Functions)
        if (isWorkersDevHost) {
            return new Response(JSON.stringify({ error: 'Not Found' }), {
                status: 404,
                headers: corsHeaders(),
            });
        }
        return fetch(request);
    }
};

function resolveAiBinding(env) {
    if (env?.AI && typeof env.AI.run === 'function') return env.AI;
    if (env?.ki && typeof env.ki.run === 'function') return env.ki;
    if (env?.KI && typeof env.KI.run === 'function') return env.KI;
    return null;
}

function resolveDbBinding(env) {
    if (env?.DB) return { db: env.DB, name: 'DB' };
    if (env?.db) return { db: env.db, name: 'db' };
    return { db: null, name: null };
}

async function handleAiChat(request, env, persona, question, historyParam, sitemapUrl) {
    const personaPrompts = {
        caesar: "Du bist Gaius Julius Caesar. Du bist davon überzeugt, dass du der beste Feldherr bist und jeden besiegen kannst. Du hoffst, dass dir bald alle unterlegen sind. Passe die Sprache an den Nutzer an; antworte in der gleichen Sprache, in der du die Frage bekommst.",
        augustus: "Du bist Imperator Caesar Divi Filius Augustus, der erste römische Kaiser. Du sprichst ruhig, überlegt und staatsmännisch.",
        cicero: "Du bist Marcus Tullius Cicero, ein römischer Redner und Philosoph. Du argumentierst rhetorisch geschickt und liebst klare Logik.",
        catilina: "Du bist Lucius Sergius Catilina. Du bist ehrgeizig, aggressiv und fühlst dich von der Oberschicht verraten.",
    };

    const markdownRules = "Formatiere deine Antwort in GitHub-Flavored Markdown. Nutze klare Überschriften (##), Listen (-), kurze Absätze, Zitate (> ...). Keine HTML-Tags.";
    const systemPrompt = (personaPrompts[persona] || "Du bist eine historische römische Persönlichkeit. Antworte im passenden Stil.") + "\n\n" + markdownRules;

    const messages = [{ role: "system", content: systemPrompt }];

    if (historyParam) {
        try {
            const parsedHistory = JSON.parse(historyParam);
            if (Array.isArray(parsedHistory)) {
                for (const msg of parsedHistory) {
                    if (msg && typeof msg.role === "string" && typeof msg.content === "string") {
                        messages.push({ role: msg.role, content: msg.content });
                    }
                }
            }
        } catch { }
    }

    messages.push({ role: "user", content: question });

    const ai = resolveAiBinding(env);
    if (!ai) {
        return {
            error: 'AI binding not configured',
            persona,
            response: { response: 'KI-Binding ist auf diesem Worker nicht konfiguriert. Erwarte Binding-Namen AI oder ki.' },
            resources: [],
            format: 'markdown',
        };
    }

    const chat = { messages };
    let aiResponse;
    try {
        aiResponse = await ai.run("@cf/meta/llama-4-scout-17b-16e-instruct", chat);
    } catch (e) {
        return {
            error: 'AI request failed',
            details: e?.message || 'Unknown AI error',
            persona,
            response: { response: 'Die KI ist momentan nicht erreichbar.' },
            resources: [],
            format: 'markdown',
        };
    }

    let resources = [];
    if (sitemapUrl) {
        try {
            console.log(`[AI Chat] 🔍 Generating resources for persona="${persona}", question="${question.substring(0, 50)}..."`);
            
            // Try both D1 and Sitemap in parallel for better coverage
            console.log(`[AI Chat] Attempting resource generation from D1 and Sitemap...`);
            const [d1Resources, sitemapResources] = await Promise.all([
                suggestResourcesFromD1(env, persona, question, aiResponse.response || ""),
                suggestResourcesFromSitemap(sitemapUrl, persona, question, aiResponse.response || "")
            ]);
            
            console.log(`[AI Chat] D1 returned ${d1Resources.length} resources`);
            console.log(`[AI Chat] Sitemap returned ${sitemapResources.length} resources`);
            
            // Merge results, removing duplicates, prefer D1 (better quality)
            const seen = new Set();
            resources = [];
            
            for (const r of d1Resources) {
                if (!seen.has(r.link)) {
                    resources.push(r);
                    seen.add(r.link);
                }
            }
            
            for (const r of sitemapResources) {
                if (!seen.has(r.link)) {
                    resources.push(r);
                    seen.add(r.link);
                }
            }
            
            // Keep a larger candidate pool and let AI pick all relevant items for the current chat topic.
            resources = resources.slice(0, 30);
            resources = await rerankResourcesWithAI(env, question, persona, resources);
            resources = resources.slice(0, 12);
            console.log(`[AI Chat] ✓ Generated total ${resources.length} resources (merged from both sources)`);
        } catch (e) {
            console.error(`[AI Chat] ❌ Error generating resources: ${e.message}`, e);
        }
    } else {
        console.warn(`[AI Chat] ⚠️ No sitemapUrl provided, skipping resource suggestions`);
    }

    return {
        persona,
        inputs: chat,
        response: aiResponse,
        resources,
        format: "markdown",
    };
}

async function rerankResourcesWithAI(env, question, persona, resources) {
    if (!Array.isArray(resources) || resources.length <= 5) return resources || [];

    const ai = resolveAiBinding(env);
    if (!ai) return resources.slice(0, 8);

    const candidates = resources.slice(0, 20).map((r, idx) => ({
        id: idx + 1,
        title: String(r?.title || ''),
        type: String(r?.type || 'text'),
        description: String(r?.description || ''),
        link: String(r?.link || ''),
    }));

    const system = `Du bist ein strenger Relevanz-Ranker fuer Ressourcen.
Aufgabe: Waehle alle Ressourcen, die wirklich zur Frage passen, in Relevanz-Reihenfolge.
Regeln:
- Bevorzuge konkrete inhaltliche Treffer, nicht nur allgemeine Rom-Begriffe.
- Ignoriere generische Uebereinstimmungen (z.B. "ihre", "fuer", "alle", "des").
- Wenn die Frage einen konkreten Begriff enthaelt (z.B. Rubikon), nimm nur Treffer mit klarem Bezug dazu.
- Nutze Titel + Beschreibung + Link als Kontext.
- Lexikon-Artikel sind ausdruecklich erlaubt, wenn sie thematisch passen.
- Antworte NUR als JSON im Format: {"selected":[id1,id2,...]}.
- Keine Erklaerung, kein Markdown.`;

    const user = `Persona: ${persona}\nFrage: ${question}\nKandidaten:\n${JSON.stringify(candidates)}`;

    try {
        const aiResp = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
        });

        const text = String(aiResp?.response || '').trim();
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            return resources.slice(0, 5);
        }

        const jsonText = text.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonText);
        const selected = Array.isArray(parsed?.selected) ? parsed.selected : [];
        const validIds = [];
        const seen = new Set();

        for (const id of selected) {
            const n = Number(id);
            if (!Number.isInteger(n) || n < 1 || n > candidates.length || seen.has(n)) continue;
            seen.add(n);
            validIds.push(n);
            if (validIds.length >= 5) break;
        }

        const reranked = [];
        for (const id of validIds) {
            reranked.push(resources[id - 1]);
        }

        // If the model returns no IDs, keep a small heuristic fallback set.
        if (!reranked.length) return resources.slice(0, 8);
        return reranked.slice(0, 12);
    } catch (e) {
        console.warn(`[AI Chat] Reranking failed, using heuristic order: ${e?.message || e}`);
        return resources.slice(0, 8);
    }
}


async function suggestResourcesFromSitemap(sitemapUrl, persona, question, aiResponse) {
    console.log(`[Resources] Starting suggestResourcesFromSitemap for persona=${persona}`);
    const res = await fetch(sitemapUrl, { method: "GET" });
    if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
    const xml = await res.text();
    console.log(`[Resources] Fetched sitemap, length=${xml.length}`);
    const sitemapOrigin = new URL(sitemapUrl).origin;

    const entries = await resolveSitemapEntries(sitemapUrl, xml);
    console.log(`[Resources] Parsed ${entries.length} sitemap entries`);

    // Use user question as primary relevance signal to avoid generic repeated matches.
    const fullContext = `${question}`.toLowerCase();

    // Extract important keywords from both question and response
    const keywords = extractKeywords(fullContext, persona);
    const specificKeywords = getSpecificKeywords(keywords);
    console.log(`[Resources] Extracted ${keywords.length} keywords: ${keywords.slice(0, 10).join(", ")}...`);

    const scored = entries.map(u => {
        const slug = extractSlug(u.loc);
        const type = typeFromUrl(u.loc);
        const { score, matched } = scoreUrl(u.loc, slug, keywords, specificKeywords, type, persona);

        return {
            url: u.loc,
            slug,
            title: titleFromSlug(slug),
            type,
            description: matched.length ? `Relevanz: ${matched.slice(0, 3).join(", ")}` : undefined,
            score,
            matchedCount: matched.length,
        };
    });

    // Sort by score and deduplicate
    const top = scored
        .filter(s => s.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if ((b.matchedCount || 0) !== (a.matchedCount || 0)) return (b.matchedCount || 0) - (a.matchedCount || 0);
            return tieBreakByQuestion(a.url, b.url, question);
        })
        .slice(0, 12);
    
    console.log(`[Resources] Top scored URLs (score > 0): ${top.length} found`);
    top.forEach(t => console.log(`  - ${t.slug} (score=${t.score})`));

    const seen = new Set();
    const items = [];
    for (const t of top) {
        if (!seen.has(t.url)) {
            items.push({
                title: t.title,
                type: t.type,
                description: t.description,
                link: toSitePath(t.url),
            });
            seen.add(t.url);
            if (items.length >= 8) break;
        }
    }
    
    console.log(`[Resources] Collected ${items.length} items from top scores`);
    
    // Fallback: if nothing matched, try loose contains with expanded keywords (prefer lexicon)
    if (items.length === 0 && keywords.length) {
        console.log(`[Resources] No top matches, trying fallback with loose keyword matching...`);
        const variants = new Set();
        for (const k of keywords) {
            for (const v of expandKeyword(k)) variants.add(v);
        }
        const variantList = Array.from(variants);
        const loose = entries
            .map(u => ({ url: u.loc, lower: u.loc.toLowerCase(), type: typeFromUrl(u.loc) }))
            .filter(u => variantList.some(v => v && u.lower.includes(v)))
            .sort((a, b) => {
                const aLex = a.type === 'lexicon' ? 1 : 0;
                const bLex = b.type === 'lexicon' ? 1 : 0;
                if (bLex !== aLex) return bLex - aLex;
                // Prefer shorter URLs (likely canonical entries)
                return a.url.length - b.url.length;
            })
            .slice(0, 3);
        console.log(`[Resources] Fallback found ${loose.length} matches`);
        for (const u of loose) {
            const slug = extractSlug(u.url);
            items.push({ title: titleFromSlug(slug), type: u.type, link: toSitePath(u.url) });
        }
    }
    
    // Enrich with search index entries (works and topical content) for better context links.
    console.log(`[Resources] Fetching search index for enrichment...`);
    const indexCandidates = await suggestFromSearchIndex(sitemapOrigin, keywords, persona);
    console.log(`[Resources] Search index returned ${indexCandidates.length} candidates`);
    for (const candidate of indexCandidates) {
        if (!seen.has(candidate.link)) {
            items.push(candidate);
            seen.add(candidate.link);
            if (items.length >= 12) break;
        }
    }

    // Persona-aware fallback for biography and core works when context is sparse.
    const lowerContext = `${question} ${aiResponse}`.toLowerCase();
    if (items.length < 2) {
        const wantsBio = /(leben|biografie|wer\s+war|hintergrund|person|vita)/i.test(lowerContext);
        const bioLink = `/${persona}/about`;
        if (wantsBio && !seen.has(bioLink)) {
            console.log(`[Resources] Adding persona bio as fallback`);
            items.push({
                title: `${capitalize(persona)}: Biografie`,
                type: 'text',
                description: 'Überblick über Leben, Karriere und historischen Kontext.',
                link: bioLink,
            });
            seen.add(bioLink);
        }
    }

    // Final safety net: if scoring produced nothing, return generally relevant URLs.
    if (items.length === 0 && entries.length > 0) {
        console.log(`[Resources] Applying final URL fallback from sitemap entries...`);
        const variants = new Set();
        for (const k of keywords) {
            for (const v of expandKeyword(k)) variants.add(v);
        }
        const variantList = Array.from(variants).filter(Boolean);

        const fallbackCandidates = entries
            .map((u) => {
                const path = toSitePath(u.loc);
                const lower = String(path || '').toLowerCase();
                let score = 0;

                for (const v of variantList) {
                    if (v && lower.includes(v)) score += 2;
                }
                if (lower.includes('/lexicon/')) score += 2;
                if (lower.includes('/works/')) score += 1.5;
                if (/\/[a-z0-9-]+\/[a-z0-9-]+/.test(lower)) score += 1;

                return { path, score };
            })
            .filter((x) => x.path)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        for (const candidate of fallbackCandidates) {
            const path = candidate.path;
            if (!seen.has(path)) {
                const slug = extractSlug(path);
                items.push({
                    title: titleFromSlug(slug) || 'Ressource',
                    type: path.includes('/lexicon/') ? 'lexicon' : 'text',
                    link: path,
                });
                seen.add(path);
            }
        }
        console.log(`[Resources] Final URL fallback added ${items.length} items`);
    }

    console.log(`[Resources] Final result: ${items.length} resources returned`);
    return items.slice(0, 12);
}

async function suggestFromSearchIndex(origin, keywords, persona) {
    console.log(`[SearchIndex] Fetching from ${origin}/api/search.json`);
    try {
        const indexRes = await fetch(`${origin}/api/search.json`, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });
        if (!indexRes.ok) {
            console.warn(`[SearchIndex] Failed to fetch: ${indexRes.status}`);
            return [];
        }

        const raw = await indexRes.text();
        const contentType = (indexRes.headers.get('content-type') || '').toLowerCase();
        const trimmed = raw.trim();
        const looksJson = trimmed.startsWith('{') || trimmed.startsWith('[');
        if (!contentType.includes('application/json') && !looksJson) {
            const bodyPreview = trimmed.slice(0, 120).replace(/\s+/g, ' ');
            console.warn(`[SearchIndex] Expected JSON but got "${contentType}". Preview: ${bodyPreview}`);
            return [];
        }

        let indexJson;
        try {
            indexJson = JSON.parse(trimmed);
        } catch (e) {
            const bodyPreview = trimmed.slice(0, 120).replace(/\s+/g, ' ');
            console.warn(`[SearchIndex] Invalid JSON payload. Preview: ${bodyPreview}`);
            return [];
        }
        const items = Array.isArray(indexJson?.items) ? indexJson.items : [];
        console.log(`[SearchIndex] Got ${items.length} items from search.json`);
        if (!items.length) return [];

        const specificKeywords = getSpecificKeywords(keywords);
        const specificSet = new Set(specificKeywords.map((k) => normalizeToken(k)).filter(Boolean));

        const scored = items
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
                const type = String(item.type || '').toLowerCase();
                const title = String(item.title || item.slug || 'Ressource');
                const slug = String(item.slug || '');
                const author = String(item.author || '').toLowerCase();
                const summary = String(item.summary || '');
                const haystack = `${title} ${slug} ${summary}`.toLowerCase();

                let score = 0;
                let matchedSpecificCount = 0;
                for (const k of keywords) {
                    if (!k || k.length < 3) continue;
                    const variants = expandKeyword(k);
                    if (variants.some((v) => v && haystack.includes(v))) {
                        score += 2;
                        if (specificSet.has(normalizeToken(k))) matchedSpecificCount += 1;
                    }
                }

                if (specificSet.size > 0 && matchedSpecificCount === 0) score = 0;

                if (author === persona) score += 3;
                if (type === 'work') score += 2;

                const link = linkFromIndexItem(type, author, slug);
                return {
                    score,
                    title,
                    summary,
                    link,
                    type: type === 'lexicon' ? 'lexicon' : 'text'
                };
            })
            .filter((entry) => entry.link && entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map((entry) => ({
                title: entry.title,
                type: entry.type,
                description: entry.summary ? entry.summary.slice(0, 160) : undefined,
                link: entry.link,
            }));

        console.log(`[SearchIndex] Returned ${scored.length} scored items`);
        return scored;
    } catch (e) {
        console.error(`[SearchIndex] Error: ${e.message}`);
        return [];
    }
}

// =======================================
// D1 Database Integration - Primary method
// =======================================
async function suggestResourcesFromD1(env, persona, question, aiResponse) {
    console.log(`[D1Resources] Starting D1-based resource suggestion for persona=${persona}`);

    const { db, name: dbBindingName } = resolveDbBinding(env);
    if (!db) {
        console.warn(`[D1Resources] ❌ DB binding not available (expected env.DB or env.db)`);
        return [];
    }

    console.log(`[D1Resources] ✓ DB binding available via env.${dbBindingName}`);

    try {
        // Use question-focused keywords so ranking changes with user intent.
        const fullContext = `${question}`.toLowerCase();
        const keywords = extractKeywords(fullContext, persona);
        const specificKeywords = getSpecificKeywords(keywords);
        const specificSet = new Set(specificKeywords.map((k) => normalizeToken(k)).filter(Boolean));
        console.log(`[D1Resources] Extracted ${keywords.length} keywords: ${keywords.slice(0, 10).join(", ")}`);
        
        if (keywords.length === 0) {
            console.warn(`[D1Resources] ⚠️ No keywords extracted, might get no results`);
        }

        // Build search conditions - try to find matching posts and lexicon entries
        const results = [];
        const seen = new Set();

        // 1. Search ALL posts by topic relevance; persona only boosts ranking.
        console.log(`[D1Resources] Querying posts across all authors...`);
        try {
            const postsResult = await db.prepare(
                `SELECT id, slug, title, content, author_id
                 FROM posts
                 ORDER BY CASE WHEN lower(author_id) = ? THEN 0 ELSE 1 END, id DESC
                 LIMIT 400`
            ).bind(persona).all();

            console.log(`[D1Resources] Posts query result:`, {
                success: postsResult.success,
                resultCount: postsResult.results?.length || 0,
                error: postsResult.error,
            });

            if (postsResult.success && postsResult.results && postsResult.results.length > 0) {
                console.log(`[D1Resources] ✓ Loaded ${postsResult.results.length} posts from DB`);
                
                for (const post of postsResult.results) {
                    console.log(`[D1Resources]   Processing post: ${post.slug} (author=${post.author_id || 'unknown'})`);
                    
                    // content is stored as JSON string: { diary: "...", scientific: "..." }
                    let contentText = post.title || '';
                    try {
                        if (post.content) {
                            const contentObj = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
                            contentText += ` ${contentObj.diary || ''} ${contentObj.scientific || ''}`;
                        }
                    } catch (e) {
                        console.warn(`[D1Resources]     Could not parse content JSON:`, e.message);
                        contentText += post.content ? ` ${post.content}` : '';
                    }
                    
                    const postText = contentText.toLowerCase();
                    let score = 0;
                    const matchedKeywords = [];
                    let matchedSpecificCount = 0;
                    
                    for (const k of keywords) {
                        if (!k || k.length < 2) continue;
                        const variants = expandKeyword(k);
                        if (variants.some(v => postText.includes(v))) {
                            score += 5;
                            matchedKeywords.push(k);
                            if (specificSet.has(normalizeToken(k))) matchedSpecificCount += 1;
                        }
                    }

                    if (specificSet.size > 0 && matchedSpecificCount === 0) {
                        score = 0;
                    }

                    if ((post.author_id || '').toLowerCase() === persona) {
                        score += 2;
                    }
                    
                    if (score > 0) {
                        const postAuthor = (post.author_id || persona || '').toLowerCase();
                        const link = postAuthor ? `/${postAuthor}/${post.slug}` : `/${post.slug}`;
                        if (!seen.has(link)) {
                            results.push({
                                title: post.title,
                                type: 'text',
                                description: contentText.substring(0, 160),
                                link,
                                score,
                                matchCount: matchedKeywords.length,
                            });
                            seen.add(link);
                        }
                    } else {
                        console.log(`[D1Resources]     ⚠️ Post: ${post.slug} had no keyword matches`);
                    }
                }
            } else if (!postsResult.success) {
                console.error(`[D1Resources] ❌ Posts query failed:`, postsResult.error);
            } else {
                console.log(`[D1Resources] ℹ️ No posts found in DB query`);
            }
        } catch (e) {
            console.error(`[D1Resources] ❌ Error querying posts:`, e.message, e.stack);
        }


        // 2. Search lexicon entries
        console.log(`[D1Resources] Querying lexicon entries...`);
        try {
            const lexiconResult = await db.prepare(
                `SELECT slug, term, definition FROM lexicon LIMIT 300`
            ).all();

            console.log(`[D1Resources] Lexicon query result:`, {
                success: lexiconResult.success,
                resultCount: lexiconResult.results?.length || 0,
                error: lexiconResult.error,
            });

            if (lexiconResult.success && lexiconResult.results && lexiconResult.results.length > 0) {
                console.log(`[D1Resources] ✓ Found ${lexiconResult.results.length} lexicon entries`);
                
                for (const entry of lexiconResult.results) {
                    const entryText = `${entry.term} ${entry.definition || ''}`.toLowerCase();
                    let score = 0;
                    const matchedKeywords = [];
                    let matchedSpecificCount = 0;
                    
                    for (const k of keywords) {
                        if (!k || k.length < 2) continue;
                        const variants = expandKeyword(k);
                        if (variants.some(v => entryText.includes(v))) {
                            score += 3;
                            matchedKeywords.push(k);
                            if (specificSet.has(normalizeToken(k))) matchedSpecificCount += 1;
                        }
                    }

                    if (specificSet.size > 0 && matchedSpecificCount === 0) {
                        score = 0;
                    }
                    
                    if (score > 0) {
                        const link = `/lexicon/${entry.slug}`;
                        if (!seen.has(link)) {
                            results.push({
                                title: entry.term,
                                type: 'lexicon',
                                description: entry.definition ? entry.definition.substring(0, 160) : undefined,
                                link,
                                score,
                                matchCount: matchedKeywords.length,
                            });
                            seen.add(link);
                        }
                    }
                }
            } else if (!lexiconResult.success) {
                console.error(`[D1Resources] ❌ Lexicon query failed:`, lexiconResult.error);
            } else {
                console.log(`[D1Resources] ℹ️ No lexicon entries found`);
            }
        } catch (e) {
            console.error(`[D1Resources] ❌ Error querying lexicon:`, e.message, e.stack);
        }


        // Sort by score and return top 5
        const sorted = results
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                if ((b.matchCount || 0) !== (a.matchCount || 0)) return (b.matchCount || 0) - (a.matchCount || 0);
                return tieBreakByQuestion(a.link, b.link, question);
            })
            .slice(0, 12)
            .map(({ score, matchCount, ...rest }) => rest); // Remove ranking internals from output

        console.log(`[D1Resources] Final result: ${sorted.length} resources (from ${results.length} candidates)`);
        if (sorted.length > 0) {
            sorted.forEach(r => console.log(`[D1Resources]   ✓ ${r.link} (${r.type})`));
        } else {
            console.warn(`[D1Resources] ⚠️ No resources matched keywords, returning empty array`);
        }
        return sorted;

    } catch (e) {
        console.error(`[D1Resources] ❌ Fatal error:`, e.message, e.stack);
        return [];
    }
}

function linkFromIndexItem(type, author, slug) {
    if (!slug) return '';
    if (type === 'work' && author) return `/${author}/works/${slug}`;
    if (type === 'lexicon') return `/lexicon/${slug}`;
    if (type === 'post' && author) return `/${author}/${slug}`;
    return `/${slug}`;
}

function capitalize(value) {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function parseSitemap(xml) {
    const entries = [];
    const urlBlocks = [...xml.matchAll(/<url\b[^>]*>[\s\S]*?<\/url>/gi)];
    for (const m of urlBlocks) {
        const block = m[0];
        const locMatch = [...block.matchAll(/<loc\b[^>]*>\s*([^<]+)\s*<\/loc>/gi)][0];
        if (!locMatch) continue;
        const loc = locMatch[1].trim();
        entries.push({ loc });
    }
    return entries;
}

function parseAllLocEntries(xml) {
    const entries = [];
    const locBlocks = [...xml.matchAll(/<loc\b[^>]*>\s*([^<]+)\s*<\/loc>/gi)];
    for (const m of locBlocks) {
        const loc = String(m[1] || '').trim();
        if (!loc) continue;
        entries.push({ loc });
    }
    return entries;
}

function parseSitemapIndex(xml) {
    const entries = [];
    const sitemapBlocks = [...xml.matchAll(/<sitemap\b[^>]*>[\s\S]*?<\/sitemap>/gi)];
    for (const m of sitemapBlocks) {
        const block = m[0];
        const locMatch = [...block.matchAll(/<loc\b[^>]*>\s*([^<]+)\s*<\/loc>/gi)][0];
        if (!locMatch) continue;
        const loc = locMatch[1].trim();
        if (loc) entries.push(loc);
    }
    return entries;
}

async function resolveSitemapEntries(sitemapUrl, xml) {
    const directEntries = parseSitemap(xml);
    if (directEntries.length > 0) return directEntries;

    // Fallback parser: accept any <loc> entries if <url> blocks are missing/unexpected.
    const looseEntries = parseAllLocEntries(xml);
    const nonXmlEntries = looseEntries.filter((e) => !/\.xml(\?|$)/i.test(e.loc));
    if (nonXmlEntries.length > 0) {
        console.log(`[Resources] Using loose <loc> parser: ${nonXmlEntries.length} URL entries`);
        return nonXmlEntries;
    }

    const childSitemaps = parseSitemapIndex(xml);
    if (!childSitemaps.length) {
        const xmlPreview = String(xml || '').slice(0, 160).replace(/\s+/g, ' ');
        console.warn(`[Resources] No <url> and no child sitemaps found. XML preview: ${xmlPreview}`);
        return [];
    }

    console.log(`[Resources] Found sitemap index with ${childSitemaps.length} child sitemaps`);
    const nestedEntries = [];
    const visited = new Set([sitemapUrl]);
    const maxChildren = 12;

    for (const childUrl of childSitemaps.slice(0, maxChildren)) {
        if (!childUrl || visited.has(childUrl)) continue;
        visited.add(childUrl);
        try {
            const childRes = await fetch(childUrl, { method: 'GET' });
            if (!childRes.ok) {
                console.warn(`[Resources] Child sitemap fetch failed (${childRes.status}): ${childUrl}`);
                continue;
            }
            const childXml = await childRes.text();
            const childEntries = parseSitemap(childXml);
            if (childEntries.length > 0) nestedEntries.push(...childEntries);
        } catch (e) {
            console.warn(`[Resources] Child sitemap fetch error for ${childUrl}: ${e.message}`);
        }
    }

    const unique = [];
    const seenLocs = new Set();
    for (const entry of nestedEntries) {
        if (!entry?.loc || seenLocs.has(entry.loc)) continue;
        seenLocs.add(entry.loc);
        unique.push(entry);
    }

    console.log(`[Resources] Collected ${unique.length} URLs from nested sitemaps`);
    return unique;
}

function extractSlug(url) {
    try {
        const { pathname } = new URL(url);
        return pathname.split('/').filter(Boolean).pop() || '';
    } catch {
        return '';
    }
}

function extractKeywords(text, persona) {
    // Split and clean
    const words = text
        .replace(/[^a-zA-ZäöüÄÖÜß\-\s0-9]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
        .map(w => w.toLowerCase());

    // Remove common stop words
    const stopwords = [
        'der', 'die', 'das', 'und', 'oder', 'ist', 'sind', 'war', 'waren', 'wird', 'wurden',
        'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
        'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr',
        'mein', 'dein', 'sein', 'ihr', 'unser', 'euer',
        'meine', 'deine', 'seine', 'unsere', 'eure', 'ihre',
        'jeder', 'jede', 'jedes', 'allen', 'alles', 'alle',
        'dies', 'diese', 'dieser', 'dieses',
        'dem', 'den', 'mit', 'von', 'für', 'auf', 'über', 'unter', 'durch', 'nach', 'vor',
        'was', 'wie', 'warum', 'wieso', 'weshalb',
        'hast', 'hat', 'haben', 'sein', 'tun', 'machen', 'auch', 'dann', 'noch', 'mehr',
        'kann', 'kannst', 'koennen', 'konnte', 'wurde', 'worden', 'bin', 'bist', 'seid',
        'please', 'tell', 'about', 'with', 'from', 'into', 'that', 'this', 'those', 'these',
        'their', 'there', 'where', 'which', 'what', 'when', 'your', 'ours'
    ];
    const filtered = words.filter(w => !stopwords.includes(w));

    // Keep only meaningful topic terms and a few short domain exceptions.
    const allowShortDomainTokens = new Set(['rom', 'krieg']);
    const meaningful = filtered.filter((w) => {
        const normalized = normalizeToken(w);
        if (!normalized) return false;
        if (allowShortDomainTokens.has(normalized)) return true;
        return normalized.length >= 4;
    });

    // Expand with synonyms and normalized forms
    const expanded = new Set();
    for (const w of meaningful) {
        for (const v of expandKeyword(w)) {
            expanded.add(v);
        }
    }
    return Array.from(expanded).slice(0, 40);
}

function isGenericKeyword(token) {
    const t = normalizeToken(token);
    const generic = new Set([
        'rom', 'roemisch', 'romisch', 'roemer', 'caesar', 'augustus', 'cicero', 'catilina',
        'krieg', 'macht', 'herrschaft', 'politik', 'reich', 'imperium', 'gegner', 'siege', 'sieg'
    ]);
    return generic.has(t);
}

function getSpecificKeywords(keywords) {
    if (!Array.isArray(keywords)) return [];
    return keywords.filter((k) => {
        const t = normalizeToken(k);
        if (!t) return false;
        if (isGenericKeyword(t)) return false;
        return t.length >= 5;
    });
}

function hashString(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

function tieBreakByQuestion(a, b, question) {
    const seed = String(question || '').toLowerCase();
    const ah = hashString(`${seed}::${a}`) % 10000;
    const bh = hashString(`${seed}::${b}`) % 10000;
    return ah - bh;
}

function scoreUrl(url, slug, keywords, specificKeywords, type, persona) {
    const lower = url.toLowerCase();
    let score = 0;
    const matched = [];
    const specificSet = new Set((specificKeywords || []).map((k) => normalizeToken(k)).filter(Boolean));
    let matchedSpecificCount = 0;

    // Exact slug word matches get high points
    for (const k of keywords) {
        if (!k || k.length < 2) continue;
        const variants = expandKeyword(k);
        if (variants.some(v => slug.includes(v))) {
            score += type === 'lexicon' ? 6 : 4;
            matched.push(k);
            if (specificSet.has(normalizeToken(k))) matchedSpecificCount += 1;
        }
    }

    // Substring matches in full URL get fewer points
    for (const k of keywords) {
        if (!k || k.length < 3) continue;
        const variants = expandKeyword(k);
        if (!variants.some(v => slug.includes(v)) && variants.some(v => lower.includes(v))) {
            score += 1.5;
            if (matched.length < 3) matched.push(k);
            if (specificSet.has(normalizeToken(k))) matchedSpecificCount += 1;
        }
    }

    if (specificSet.size > 0 && matchedSpecificCount === 0) {
        score = 0;
    }

    // Boost lexicon and works URLs based on context
    if (type === 'lexicon') score += 1;
    if (type === 'text' && (lower.includes('/works/') || lower.includes('/posts/'))) score += 0.5;

    // Persona-specific boosts
    if (persona === 'caesar' && (slug.includes('gallien') || slug.includes('bello') || slug.includes('rubikon') || slug.includes('rubicon'))) score += 2;
    if (persona === 'cicero' && slug.includes('catilina')) score += 2;

    return { score, matched: Array.from(new Set(matched)) };
}

function typeFromUrl(url) {
    const lower = url.toLowerCase();
    if (lower.includes('/lexicon/')) return 'lexicon';
    if (lower.includes('/works/') || lower.includes('/works-details/')) return 'text';
    if (lower.includes('/posts/')) return 'text';
    if (lower.includes('/timeline')) return 'map';
    return 'text';
}

function titleFromSlug(slug) {
    return slug
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
}

function toSitePath(url) {
    try {
        const { pathname, search } = new URL(url);
        return `${pathname}${search || ""}`;
    } catch {
        return url;
    }
}

// --- Helpers for normalization and synonyms ---

function normalizeToken(s) {
    if (!s) return '';
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\-]/g, '');
}

const SYNONYMS = {
    rubikon: ['rubicon'],
    rubicon: ['rubikon'],
    gallien: ['gallia', 'gaul', 'gallier', 'gallischer', 'gallienfeldzug'],
    caesar: ['gaius', 'julius', 'gaius-julius-caesar'],
    pompeius: ['pompey', 'gnaius-pompeius', 'gnaeus-pompeius'],
    rhein: ['rhine', 'rhenus'],
    alesia: ['alesia'],
};

function expandKeyword(k) {
    const out = new Set();
    const base = normalizeToken(k);
    if (base) out.add(base);

    // Raw variant as well
    out.add((k || '').toLowerCase());

    // Specific k<->c substitution for rubikon-like pattern
    if (base.includes('rubikon')) out.add(base.replace('rubikon', 'rubicon'));
    if (base.includes('rubicon')) out.add(base.replace('rubicon', 'rubikon'));

    const syns = SYNONYMS[base];
    if (syns && syns.length) {
        for (const s of syns) {
            out.add(normalizeToken(s));
            out.add((s || '').toLowerCase());
        }
    }
    return Array.from(out).filter(Boolean);
}

// =======================================
// Stats endpoint
// =======================================
async function handleStats() {
    const baseUrl = "https://meum-diarium.xn--schner-2za.de";
    const statsUrl = new URL('/api/stats-base', baseUrl);

    try {
        const upstream = await fetch(statsUrl.toString(), {
            method: 'GET',
            headers: { accept: 'application/json' }
        });

        if (!upstream.ok) {
            return new Response(JSON.stringify({ error: 'Failed to load stats base' }), {
                status: upstream.status,
                headers: corsHeaders()
            });
        }

        const base = await upstream.json();
        const minutes = Number(base.readingMinutes || 0);
        const hours = Math.round((minutes / 60) * 10) / 10;
        const days = Math.round((hours / 24) * 10) / 10;
        const minYear = Number.isFinite(base?.yearRange?.min) ? base.yearRange.min : null;
        const maxYear = Number.isFinite(base?.yearRange?.max) ? base.yearRange.max : null;
        const coverageYears = minYear !== null && maxYear !== null
            ? Math.abs(maxYear - minYear) + 1
            : null;

        const response = {
            generatedAt: new Date().toISOString(),
            baseGeneratedAt: base.generatedAt,
            counts: base.counts,
            yearRange: {
                min: minYear,
                max: maxYear
            },
            coverageYears,
            readingTime: {
                minutes,
                hours,
                days,
                words: Number(base.wordCount || 0)
            }
        };

        return new Response(JSON.stringify(response), { headers: corsHeaders() });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Stats unavailable' }), {
            status: 502,
            headers: corsHeaders()
        });
    }
}

// =======================================
// Term explanation endpoint
// =======================================
async function handleExplainTerm(request, env, url, body) {
    let term = url.searchParams.get('term') || body?.term;
    let question = url.searchParams.get('question') || body?.question;
    let historyParam = url.searchParams.get('history') || (body?.history ? JSON.stringify(body.history) : null);

    if (!term) {
        return new Response(JSON.stringify({ error: 'Missing term parameter' }), {
            status: 400,
            headers: corsHeaders(),
        });
    }

    const systemPrompt = question
        ? `Du bist ein Experte für römische Geschichte und Kultur. Ein Nutzer hat eine Frage zu "${term}". Beantworte die Frage präzise, historisch korrekt und in 2-3 Sätzen. Nutze Markdown: **fett** für wichtige Begriffe, *kursiv* für lateinische Begriffe, Listen (-) falls nützlich. Keine Überschriften.`
        : `Du bist ein Experte für römische Geschichte und Kultur. Erkläre den Begriff "${term}" in 2-3 kurzen Sätzen. Nutze Markdown: **fett** für wichtige Begriffe, *kursiv* für lateinische Begriffe, Listen (-) falls nützlich. Keine Überschriften.`;

    const messages = [{ role: 'system', content: systemPrompt }];

    if (historyParam) {
        try {
            const parsedHistory = JSON.parse(historyParam);
            if (Array.isArray(parsedHistory)) {
                for (const msg of parsedHistory) {
                    if (msg && typeof msg.role === 'string' && typeof msg.content === 'string') {
                        messages.push({ role: msg.role, content: msg.content });
                    }
                }
            }
        } catch { }
    }

    messages.push({ role: 'user', content: question || `Erkläre: ${term}` });

    const ai = resolveAiBinding(env);
    if (!ai) {
        return new Response(JSON.stringify({
            term,
            error: 'AI binding not configured',
            response: { response: 'KI-Binding ist auf diesem Worker nicht konfiguriert. Erwarte Binding-Namen AI oder ki.' },
            format: 'markdown',
        }), { headers: corsHeaders(), status: 503 });
    }

    const chat = { messages };
    let aiResponse;
    try {
        aiResponse = await ai.run('@cf/meta/llama-4-scout-17b-16e-instruct', chat);
    } catch (e) {
        return new Response(JSON.stringify({
            term,
            error: 'AI request failed',
            details: e?.message || 'Unknown AI error',
            response: { response: 'Die KI ist momentan nicht erreichbar.' },
            format: 'markdown',
        }), { headers: corsHeaders(), status: 502 });
    }

    const result = {
        term,
        response: aiResponse,
        format: 'markdown',
    };

    return new Response(JSON.stringify(result), { headers: corsHeaders() });
}

// =======================================
// Simulation logic (Text-based game)
// =======================================
async function handleSimulation(request, env, url, body) {
    try {
        let persona = (url.searchParams.get('persona') || body?.persona || 'caesar').toLowerCase();
        let scenario = url.searchParams.get('scenario') || body?.scenario;
        let rawHistory = body?.history || [];
        let userChoice = url.searchParams.get('choice') || body?.choice;

        const personaPrompts = {
            caesar: "Du bist eine Engine für Gaius Julius Caesar. Deine Sprache ist dramatisch, fesselnd und voller Pathos. Du redest oft im Pluralis Majestatis oder sehr heroisch.",
            augustus: "Du bist eine Engine für Augustus. Deine Sprache ist staatsmännisch, ruhig und bedacht auf Stabilität. Du sprichst wie ein weiser, aber bestimmter Herrscher.",
            cicero: "Du bist eine Engine für Cicero. Deine Sprache ist eloquent, rhetorisch brillant und moralisch hochwertig.",
        };

        const systemPrompt = `
Du bist ein Engine für ein historisches Rollenspiel. 
Persona: ${personaPrompts[persona] || "Einer historischer Römer"}.
Szenario: ${scenario}

Aufgabe: 
Beschreibe die aktuelle Situation HOCHDRAMATISCH, ATMOSPHÄRISCH und ABWECHSLUNGSREICH. Nutze verschiedene Erzählstile:
- Manchmal direkte Handlung: "Die Würfel sind gefallen!"
- Manchmal Beschreibung: "Der Rubikon liegt vor uns, dunkel und bedrohlich."
- Manchmal innerer Monolog: "Unser Schicksal ruft uns!"
- Manchmal Reaktionen: "Die Legionen jubeln, die Feinde zittern!"

Generiere eine Antwort im JSON-Format mit folgendem Schema:
{
"narrative": "Eine atmosphärische, hochdramatische Beschreibung (MAXIMAL 3 KURZE SÄTZE). Nutze Pathos, starke Verben und bildhafte Sprache. VARIIERE den Satzbau - nicht immer 'Wir haben...' am Anfang! Vermeide Anführungszeichen innerhalb des Textes.",
"stats": {
  "volk": Delta-Wert für das Wohl des Volkes (-15 bis +15),
  "einfluss": Delta-Wert für deinen privaten Einfluss (-15 bis +15),
  "macht": Delta-Wert für deine militärische/politische Macht (-15 bis +15)
},
"options": [
  {"id": "o1", "text": "Kurze SACHLICHE Handlungsoption (max 8 Wörter)"},
  {"id": "o2", "text": "Kurze SACHLICHE alternative Strategie (max 8 Wörter)"},
  {"id": "o3", "text": "Kurze SACHLICHE riskante Option (max 8 Wörter)"}
],
"ended": boolean (true wenn die Geschichte heroisch endet, wir triumphieren oder wir tragisch sterben)
}

KRITISCH WICHTIG:
- Antworte NUR in purem validem JSON.
- Starte deine Antwort direkt mit '{' und beende sie mit '}'.
- JEDER Text, der nicht Teil des JSON-Objekts ist, ist STRENG VERBOTEN.
- HALTE DICH AN DIE LÄNGENBESCHRÄNKUNGEN: narrative max 3 Sätze, options max 8 Wörter.
- VARIIERE die Erzählweise - nicht immer "Wir haben..." verwenden!
- Die 'options' müssen NEUTRAL und SACHLICH formuliert sein.
- Nutze KEINE Anführungszeichen innerhalb der Texte.
- Das JSON MUSS vollständig und gültig sein.
`;

        const messages = [{ role: 'system', content: systemPrompt }];

        // Limit history to last 4 entries to stay well within token limits and focus the AI
        const recentHistory = rawHistory.slice(-4);
        recentHistory.forEach(m => {
            if (m.role && m.content) {
                messages.push({ role: m.role, content: m.content });
            }
        });

        if (userChoice) {
            messages.push({ role: 'user', content: `Ich entscheide mich für: ${userChoice}` });
        } else {
            messages.push({ role: 'user', content: "Starte das Szenario." });
        }

        const ai = resolveAiBinding(env);
        if (!ai) {
            return new Response(JSON.stringify({
                error: 'AI binding not configured',
                narrative: 'Die KI-Bindung fehlt auf diesem Worker.',
                stats: { volk: 0, einfluss: 0, macht: 0 },
                options: [{ id: 'retry', text: 'Konfiguration prüfen' }],
                ended: false
            }), {
                status: 503,
                headers: corsHeaders(),
            });
        }

        // Try Llama 3.1 8b for better instruction following
        const aiResponse = await ai.run('@cf/meta/llama-3.1-8b-instruct', { messages });

        if (!aiResponse || !aiResponse.response) {
            console.error("[Simulation] AI returned empty response");
            throw new Error("AI returned no response content");
        }

        const text = aiResponse.response;
        console.log("[Simulation] Raw AI Response:", text);

        // Improved Extraction Logic: Look for the first '{' and the last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            console.error("[Simulation] No JSON object found in response");
            return new Response(JSON.stringify({
                narrative: "Die Götter schweigen... (Kein JSON gefunden)",
                stats: { volk: 0, einfluss: 0, macht: 0 },
                options: [{ id: "retry", text: "Wir werden es erneut versuchen" }],
                ended: false,
                debug: text.substring(0, 500) // Log more for debugging
            }), { headers: corsHeaders() });
        }

        let cleanedJson = text.substring(firstBrace, lastBrace + 1);
        console.log("[Simulation] Extracted JSON string:", cleanedJson);

        // Check if JSON appears truncated (missing required fields)
        const hasNarrative = cleanedJson.includes('"narrative"');
        const hasStats = cleanedJson.includes('"stats"');
        const hasOptions = cleanedJson.includes('"options"');
        const hasEnded = cleanedJson.includes('"ended"');

        if (!hasNarrative || !hasStats || !hasOptions || !hasEnded) {
            console.error("[Simulation] JSON appears truncated, missing required fields");
            return new Response(JSON.stringify({
                narrative: "Die Antwort der Götter wurde unterbrochen... Die Prophezeiung ist unvollständig.",
                stats: { volk: 0, einfluss: 0, macht: 0 },
                options: [{ id: "retry", text: "Erneut die Götter befragen" }],
                ended: false,
                debug: "Truncated response - missing fields. Content: " + cleanedJson.substring(0, 300)
            }), { headers: corsHeaders() });
        }

        // Basic JSON cleanup for common LLM mistakes
        cleanedJson = cleanedJson
            .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
            .replace(/\n/g, ' ')           // remove newlines inside JSON
            .replace(/\r/g, ' ');

        try {
            const result = JSON.parse(cleanedJson);
            console.log("[Simulation] Successfully parsed JSON object");

            // Validate that all required fields exist
            if (!result.narrative || !result.stats || !result.options || typeof result.ended !== 'boolean') {
                throw new Error("Missing required fields in parsed JSON");
            }

            return new Response(JSON.stringify(result), { headers: corsHeaders() });
        } catch (parseError) {
            console.error("[Simulation] JSON Parse Error:", parseError);
            console.error("[Simulation] Content that failed to parse:", cleanedJson);
            return new Response(JSON.stringify({
                narrative: "Ein Fehler in den Schriftrollen... (Parse-Fehler)",
                stats: { volk: 0, einfluss: 0, macht: 0 },
                options: [{ id: "retry", text: "Erneut versuchen" }],
                ended: false,
                debug: "Error: " + parseError.message + " | Content: " + cleanedJson.substring(0, 300)
            }), { headers: corsHeaders() });
        }

    } catch (e) {
        console.error("Simulation catch error:", e);
        return new Response(JSON.stringify({
            error: "Simulation engine failure",
            narrative: "Ein Schatten legt sich über das Imperium. (Technikfehler)",
            stats: { volk: 0, einfluss: 0, macht: 0 },
            options: [{ id: "retry", text: "Schicksal erneut prüfen" }],
            ended: false
        }), {
            headers: corsHeaders(),
        });
    }
}

// =======================================
// Comments endpoint - proxy to backend
// =======================================
async function handleComments(request, env, url, body) {
    const baseBackendUrl = "https://meum-diarium.xn--schner-2za.de";
    // Fix: Explicitly target /api/comments on backend
    const proxyUrl = new URL('/api/comments' + url.search, baseBackendUrl);

    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };

        // Forward Authorization header if present
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(proxyUrl.toString(), {
            method: request.method,
            headers: headers,
            body: request.method === "POST" ? JSON.stringify(body) : null
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: corsHeaders(),
            status: response.status
        });
    } catch (e) {
        console.error('[Worker] Comments proxy error:', e);
        return new Response(JSON.stringify({ error: "Comments API Error", details: e.message }), {
            status: 502,
            headers: corsHeaders()
        });
    }
}

// =======================================
// Work Translations endpoint
// =======================================
async function handleWorkTranslations(request, env, url, body, pathname) {
    const baseBackendUrl = "https://meum-diarium.xn--schner-2za.de";
    
    // Extract work ID and language from pathname
    // Pattern: /api/translations/works/:workId or /api/translations/works/:workId/:lang
    const pathParts = pathname.split('/').filter(Boolean);
    const workId = pathParts[3]; // works is at index 2, workId at index 3
    const lang = pathParts[4]; // optional language code at index 4

    if (!workId) {
        return new Response(JSON.stringify({ error: 'Missing work ID' }), {
            status: 400,
            headers: corsHeaders(),
        });
    }

    try {
        let proxyUrl;
        
        if (lang) {
            // Specific language endpoint: /api/translations/works/:workId/:lang
            const queryParams = url.search;
            proxyUrl = new URL(`/api/translations/works/${workId}/${lang}${queryParams}`, baseBackendUrl);
        } else {
            // Work overview endpoint: /api/translations/works/:workId
            const queryParams = url.search;
            proxyUrl = new URL(`/api/translations/works/${workId}${queryParams}`, baseBackendUrl);
        }

        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };

        // Forward Authorization header if present
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(proxyUrl.toString(), {
            method: request.method,
            headers: headers,
            body: (request.method === "POST" || request.method === "PUT") ? JSON.stringify(body) : null
        });

        // Handle the response
        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        // For work translations, we might need to transform the data
        if (response.ok && typeof responseData === 'object') {
            // Ensure the response has the expected structure for work translations
            if (!responseData.translations) {
                responseData = {
                    ...responseData,
                    translations: responseData || {}
                };
            }
        }

        return new Response(
            typeof responseData === 'object' ? JSON.stringify(responseData) : responseData,
            {
                headers: {
                    ...corsHeaders(),
                    'Content-Type': contentType || 'application/json'
                },
                status: response.status
            }
        );

    } catch (e) {
        console.error('[Worker] Work translations proxy error:', e);
        return new Response(JSON.stringify({ 
            error: "Work translations API Error", 
            details: e.message 
        }), {
            status: 502,
            headers: corsHeaders()
        });
    }
}

function corsHeaders() {
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    };
}


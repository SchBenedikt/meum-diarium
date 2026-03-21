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
        if (pathname === "" || pathname === "/api" || pathname === "/personachat") {
            // On workers.dev there is no Pages origin to fall through to; avoid recursive self-fetch.
            if (isWorkersDevHost) {
                return new Response(JSON.stringify({
                    service: 'meum-diarium-worker',
                    status: 'ok',
                    routes: ['/', '/explain', '/simulate', '/stats', '/api/ask', '/api/explain', '/api/simulate']
                }), { headers: corsHeaders() });
            }
            return fetch(request);
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

    if (!env?.AI || typeof env.AI.run !== 'function') {
        return {
            error: 'AI binding not configured',
            persona,
            response: { response: 'KI-Binding ist auf diesem Worker nicht konfiguriert.' },
            resources: [],
            format: 'markdown',
        };
    }

    const chat = { messages };
    let aiResponse;
    try {
        aiResponse = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", chat);
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
            resources = await suggestResourcesFromSitemap(sitemapUrl, persona, question, aiResponse.response || "");
        } catch (e) { }
    }

    return {
        persona,
        inputs: chat,
        response: aiResponse,
        resources,
        format: "markdown",
    };
}


async function suggestResourcesFromSitemap(sitemapUrl, persona, question, aiResponse) {
    const res = await fetch(sitemapUrl, { method: "GET" });
    if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
    const xml = await res.text();

    const entries = parseSitemap(xml);

    // Combine question and AI response for better keyword extraction
    const fullContext = `${question} ${aiResponse}`.toLowerCase();

    // Extract important keywords from both question and response
    const keywords = extractKeywords(fullContext, persona);

    const scored = entries.map(u => {
        const slug = extractSlug(u.loc);
        const type = typeFromUrl(u.loc);
        const { score, matched } = scoreUrl(u.loc, slug, keywords, type, persona);

        return {
            url: u.loc,
            slug,
            title: titleFromSlug(slug),
            type,
            description: matched.length ? `Relevanz: ${matched.slice(0, 3).join(", ")}` : undefined,
            score
        };
    });

    // Sort by score and deduplicate
    const top = scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

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
            if (items.length >= 3) break;
        }
    }
    // Fallback: if nothing matched, try loose contains with expanded keywords (prefer lexicon)
    if (items.length === 0 && keywords.length) {
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
        for (const u of loose) {
            const slug = extractSlug(u.url);
            items.push({ title: titleFromSlug(slug), type: u.type, link: toSitePath(u.url) });
        }
    }
    return items;
}

function parseSitemap(xml) {
    const entries = [];
    const urlBlocks = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)];
    for (const m of urlBlocks) {
        const block = m[0];
        const locMatch = [...block.matchAll(/<loc>([^<]+)<\/loc>/g)][0];
        if (!locMatch) continue;
        const loc = locMatch[1];
        entries.push({ loc });
    }
    return entries;
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
    const stopwords = ['der', 'die', 'das', 'und', 'oder', 'ist', 'bin', 'bist', 'sein', 'haben', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'eure', 'mein', 'dein', 'sein', 'unser', 'euer', 'eure', 'dem', 'den', 'mit', 'was', 'wie', 'warum', 'wieso', 'weshalb', 'hast', 'hat', 'tun', 'machen'];
    const filtered = words.filter(w => !stopwords.includes(w));

    // Add persona-specific boosts
    const boosts = {
        caesar: ['rubikon', 'rubicon', 'gallien', 'gallia', 'alesia', 'bello', 'gallico', 'civili', 'pompeius', 'pompey', 'vercingetorix', 'helvetier', 'rhein', 'rhine'],
        cicero: ['catilina', 'oratio', 'officiis', 'republica', 'publica', 'seneca', 'antonius'],
        augustus: ['res', 'gestae', 'prinzipat', 'pax', 'romana', 'triumvir'],
        catilina: ['verschwörung', 'verschwor', 'conspiracy', 'senat', 'cicero', 'optimaten'],
    };

    const personaBoosts = boosts[persona] || [];

    // Expand with synonyms and normalized forms
    const expanded = new Set();
    for (const w of [...filtered, ...personaBoosts]) {
        for (const v of expandKeyword(w)) {
            expanded.add(v);
        }
    }
    return Array.from(expanded);
}

function scoreUrl(url, slug, keywords, type, persona) {
    const lower = url.toLowerCase();
    let score = 0;
    const matched = [];

    // Exact slug word matches get high points
    for (const k of keywords) {
        if (!k || k.length < 2) continue;
        const variants = expandKeyword(k);
        if (variants.some(v => slug.includes(v))) {
            score += type === 'lexicon' ? 6 : 4;
            matched.push(k);
        }
    }

    // Substring matches in full URL get fewer points
    for (const k of keywords) {
        if (!k || k.length < 3) continue;
        const variants = expandKeyword(k);
        if (!variants.some(v => slug.includes(v)) && variants.some(v => lower.includes(v))) {
            score += 1.5;
            if (matched.length < 3) matched.push(k);
        }
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

    if (!env?.AI || typeof env.AI.run !== 'function') {
        return new Response(JSON.stringify({
            term,
            error: 'AI binding not configured',
            response: { response: 'KI-Binding ist auf diesem Worker nicht konfiguriert.' },
            format: 'markdown',
        }), { headers: corsHeaders(), status: 503 });
    }

    const chat = { messages };
    let aiResponse;
    try {
        aiResponse = await env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', chat);
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

        // Try Llama 3.1 8b for better instruction following
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages });

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


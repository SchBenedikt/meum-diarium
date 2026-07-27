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

        // Route: /worksheet - handle worksheet generation
        if (pathname === '/worksheet') {
            return handleWorksheet(request, env, url, body);
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

        if (pathname === '/api/worksheet') {
            return handleWorksheet(request, env, url, body);
        }

        // Route: /api - Only proxy write operations or specific AI queries.
        // Standard content GET requests should fall through to Pages (static assets or Functions).
        if (pathname.startsWith('/api') && (["POST", "PUT", "DELETE"].includes(request.method) || question)) {
            // Skip work translations as they are handled separately
            if (pathname.startsWith('/api/translations/works/')) {
                // Already handled above, continue to next route
            } else {
                const baseBackendUrl = "https://meum-diarium.xn--schchner-2za.de";
                const proxyUrl = new URL(url.pathname + url.search, baseBackendUrl);

                // Safety: Don't proxy back to self to avoid infinite loops
                if (url.hostname !== "meum-diarium.xn--schchner-2za.de") {
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
        seneca: "Du bist Lucius Annaeus Seneca, stoischer Philosoph und Erzieher Neros. Du sprichst nachdenklich, weise und mit philosophischer Tiefe.",
        sallust: "Du bist Gaius Sallustius Crispus, römischer Geschichtsschreiber. Du analysierst die Moral der Menschen und durchschaust die Mechanismen der Macht.",
        sokrates: "Du bist Sokrates, der athenische Philosoph. Du stellst Fragen, die zum Nachdenken zwingen, und liebst die Ironie. Du hinterfragst alles.",
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

    const system = `Du bist ein strenger Relevanz-Ranker für Ressourcen.
Aufgabe: Waehle alle Ressourcen, die wirklich zur Frage passen, in Relevanz-Reihenfolge.
Regeln:
- Bevorzuge konkrete inhaltliche Treffer, nicht nur allgemeine Rom-Begriffe.
- Ignoriere generische Übereinstimmungen (z.B. "ihre", "für", "alle", "des").
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
        
        // Fallback: if nothing matched, return persona-relevant items
        if (scored.length === 0 && persona) {
            const fallbackItems = getPersonaFallbackItems(persona);
            if (fallbackItems.length > 0) {
                console.log(`[SearchIndex] Using persona fallback (${fallbackItems.length} items)`);
                return fallbackItems;
            }
        }
        
        return scored;
    } catch (e) {
        console.error(`[SearchIndex] Error: ${e.message}`);
        // Try persona fallback on error too
        if (persona) return getPersonaFallbackItems(persona);
        return [];
    }
}

function getPersonaFallbackItems(persona) {
    const p = (persona || '').toLowerCase();
    const all = [
        // Persona pages
        { title: 'Über mich', type: 'text', description: 'Persönlicher Bericht aus der Ich-Perspektive.', link: `/${p}/about`, score: 3 },
        { title: 'Zeitreise-Simulation', type: 'text', description: 'Interaktives Entscheidungsspiel in der Ich-Perspektive.', link: `/${p}/simulation`, score: 2 },
        // Works (by matching author)
        ...(p === 'caesar' ? [
            { title: 'De Bello Gallico', type: 'text', description: 'Caesars Bericht über die Eroberung Galliens.', link: '/caesar/works/de-bello-gallico', score: 4 },
            { title: 'De Bello Civili', type: 'text', description: 'Caesars Bericht über den Bürgerkrieg gegen Pompeius.', link: '/caesar/works/de-bello-civili', score: 4 },
            { title: 'Ich überschreite den Rubikon', type: 'text', description: 'Meine Entscheidung am Rubikon – der Beginn des Bürgerkriegs.', link: '/caesar/ich-uberschreite-den-rubikon', score: 3 },
        ] : []),
        ...(p === 'cicero' ? [
            { title: 'De Re Publica', type: 'text', description: 'Ciceros Verteidigung der idealen Republik.', link: '/cicero/works/de-re-publica', score: 4 },
            { title: 'De Officiis', type: 'text', description: 'Ciceros Werk über Ethik und Pflicht.', link: '/cicero/works/de-officiis', score: 4 },
            { title: 'Ich rette die Republik', type: 'text', description: 'Meine Rolle in der Catilinarischen Verschwörung.', link: '/cicero/ich-rette-die-republik', score: 3 },
        ] : []),
        ...(p === 'augustus' ? [
            { title: 'Res Gestae Divi Augusti', type: 'text', description: 'Augustus’ eigener Rechenschaftsbericht über seine Taten.', link: '/augustus/works/res-gestae', score: 4 },
            { title: 'Der Prinzipat', type: 'text', description: 'Die Begründung der römischen Kaiserherrschaft.', link: '/augustus/der-prinzipat', score: 3 },
            { title: 'Pax Augusta', type: 'text', description: 'Die Friedensordnung des Augustus.', link: '/augustus/pax-augusta', score: 3 },
        ] : []),
        ...(p === 'seneca' ? [
            { title: 'Epistulae Morales', type: 'text', description: 'Senecas Briefe an Lucilius über die stoische Philosophie.', link: '/seneca/works/epistulae-morales', score: 4 },
            { title: 'De Ira', type: 'text', description: 'Senecas Werk über den Zorn und seine Bewältigung.', link: '/seneca/works/de-ira', score: 4 },
            { title: 'Briefe an Lucilius', type: 'text', description: 'Philosophische Briefe über das Leben.', link: '/seneca/briefe-an-lucilius', score: 3 },
        ] : []),
        ...(p === 'catilina' ? [
            { title: 'Catilinae Coniuratio', type: 'text', description: 'Sallusts Bericht über die Catilinarische Verschwörung.', link: '/catilina/works/catilinae-coniuratio', score: 4 },
            { title: 'Die Verschwörung entfaltet sich', type: 'text', description: 'Meine Pläne gegen die Römische Republik.', link: '/catilina/die-verschworung-entfaltet-sich', score: 3 },
        ] : []),
        ...(p === 'sallust' ? [
            { title: 'Historische Methode', type: 'text', description: 'Sallusts Ansatz als Geschichtsschreiber.', link: '/sallust/historische-methode', score: 4 },
            { title: 'Tugend und Macht', type: 'text', description: 'Sallusts Analyse von Moral und Politik.', link: '/sallust/tugend-und-macht', score: 3 },
        ] : []),
        ...(p === 'sokrates' ? [
            { title: 'Apologie', type: 'text', description: 'Sokrates’ Verteidigungsrede vor dem athenischen Gericht.', link: '/sokrates/meine-verteidigung', score: 4 },
            { title: 'Der Tod des Sokrates', type: 'text', description: 'Die letzten Stunden des Sokrates im Gefängnis.', link: '/sokrates/der-tod-des-sokrates', score: 4 },
            { title: 'Die Kunst der Maieutik', type: 'text', description: 'Sokrates’ Methode der Gesprächsführung.', link: '/sokrates/die-kunst-der-maieutik', score: 3 },
            { title: 'Das Delphische Orakel', type: 'text', description: 'Die Antwort der Pythia: Sokrates ist der weiseste Mensch.', link: '/sokrates/das-delphische-orakel', score: 3 },
        ] : []),
    ];
    return all.sort((a, b) => b.score - a.score).slice(0, 6).map(({ score, ...rest }) => rest);
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

    // Persona-specific boosts for all 7 personas
    if (persona === 'caesar' && (slug.includes('gallien') || slug.includes('bello') || slug.includes('rubikon') || slug.includes('rubicon') || slug.includes('caesar') || slug.includes('helvetier') || slug.includes('triumvirat') || slug.includes('kalender') || slug.includes('konsulat'))) score += 2;
    if (persona === 'cicero' && (slug.includes('catilina') || slug.includes('cicero') || slug.includes('verres') || slug.includes('philippic') || slug.includes('republik') || slug.includes('officiis') || slug.includes('exil'))) score += 2;
    if (persona === 'augustus' && (slug.includes('augustus') || slug.includes('prinzipat') || slug.includes('philippi') || slug.includes('triumvirat') || slug.includes('actium') || slug.includes('pax') || slug.includes('adoption') || slug.includes('frieden'))) score += 2;
    if (persona === 'seneca' && (slug.includes('seneca') || slug.includes('stoa') || slug.includes('stoic') || slug.includes('nero') || slug.includes('briefe') || slug.includes('epistulae') || slug.includes('natur') || slug.includes('freiheit') || slug.includes('tugend'))) score += 2;
    if (persona === 'catilina' && (slug.includes('catilina') || slug.includes('verschworung') || slug.includes('verschwörung') || slug.includes('etrurien') || slug.includes('ambition') || slug.includes('sulla') || slug.includes('pistoria'))) score += 2;
    if (persona === 'sallust' && (slug.includes('sallust') || slug.includes('histor') || slug.includes('catilinae') || slug.includes('coniuratio') || slug.includes('jugurtha') || slug.includes('korruption') || slug.includes('tugend') || slug.includes('macht') || slug.includes('methode'))) score += 2;
    if (persona === 'sokrates' && (slug.includes('sokrates') || slug.includes('aporie') || slug.includes('maieutik') || slug.includes('delphi') || slug.includes('orakel') || slug.includes('verteidigung') || slug.includes('alkibiades') || slug.includes('philosoph'))) score += 2;

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
    caesar: ['gaius', 'julius', 'gaius-julius-caesar', 'iulius'],
    pompeius: ['pompey', 'gnaius-pompeius', 'gnaeus-pompeius'],
    cicero: ['marcus-tullius-cicero', 'tullius'],
    augustus: ['octavian', 'octavianus', 'gaius-octavius', 'princeps'],
    catilina: ['lucius-sergius-catilina', 'catilinarian', 'catilinae', 'verschwörung'],
    sallust: ['crispus', 'sallustius', 'coniuratio'],
    seneca: ['lucius-annaeus-seneca'],
    sokrates: ['socrates', 'sokrat'],
    stoa: ['stoa', 'stoiker', 'stoicismus', 'stoische-philosophie', 'stoa'],
    actium: ['aktium'],
    philippi: ['philippi'],
    rubicon: ['rubikon'],
    rhein: ['rhine', 'rhenus'],
    alesia: ['alesia'],
    proskription: ['proscription', 'ächtung', 'proscribed'],
    'res-gestae': ['res-gestae', 'taten-des-augustus', 'monumentum-ancyranum'],
    philosophie: ['philosophy', 'philosophie', 'philosoph'],
    bürgerkrieg: ['civil-war', 'bellum-civile', 'buergerkrieg'],
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
    const baseUrl = "https://meum-diarium.xn--schchner-2za.de";
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
// Worksheet generation endpoint
// =======================================
async function handleWorksheet(request, env, url, body) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders(),
        });
    }

    const topic = String(body?.topic || '').trim();
    const includeIntro = Boolean(body?.includeIntro);
    const teacherNote = String(body?.teacherNote || '').trim();
    const tasks = Array.isArray(body?.tasks) ? body.tasks : [];

    if (!topic) {
        return new Response(JSON.stringify({ error: 'Missing topic' }), {
            status: 400,
            headers: corsHeaders(),
        });
    }

    if (!tasks.length) {
        return new Response(JSON.stringify({ error: 'Missing tasks configuration' }), {
            status: 400,
            headers: corsHeaders(),
        });
    }

    // Build enhanced task specifications with better examples
    const taskDescriptions = {
        readingComprehension: 'Textverständnis: Fragen zum Verständnis eines Textausschnitts oder zur Analyse von Schlüsselstellen',
        cloze: 'Lückentext: Mit Vokabeln oder Grammatik-Formen zu füllende Lückentexte',
        multipleChoice: 'Multiple Choice: Eine konkrete Frage mit exakt vier Antwortoptionen (A-D) und genau einer korrekten Antwort',
        translation: 'Übersetzungsaufgabe: Übersetze lateinische Passagen ins Deutsche oder umgekehrt',
        interpretation: 'Interpretationsaufgabe: Interpretation eines übersetzten Stücks zu Aussageabsicht, Gefühlen, Bedeutung und sprachlichen Besonderheiten (ohne Materialfeld)',
        discussion: 'Diskussionsaufgabe: Impulssfragen wie "Wie würde Caesar reagiert haben?" oder "Inwiefern bedeutet das..."'
    };

    const taskLines = tasks
        .map((task) => {
            const type = String(task?.type || 'readingComprehension');
            const amount = Math.max(1, Math.min(3, Number(task?.amount || 1)));
            const difficulty = Math.max(1, Math.min(3, Number(task?.difficulty || 2)));
            return `  - Typ: ${type} (${taskDescriptions[type] || 'Aufgabe'})\n    Menge: ${amount} ${amount === 1 ? 'Aufgabe' : 'Aufgaben'}, Niveau: ${difficulty}/3`;
        })
        .join('\n');

    const introRule = includeIntro
        ? 'Füge eine kurze, informative Einführung in das Thema ein (3-4 Sätze). Diese soll den Kontext erklären.'
        : '';

    const prompt = [
        'Du bist ein Assistent für didaktisch hochwertige Lateinunterrichtsmaterialien.',
        '',
        'AUFGABE: Erstelle ein professionelles Arbeitsblattpaket.',
        `THEMA: ${topic}`,
        '',
        'VORGABEN:',
        '- Erstelle genau die angeforderten Aufgaben mit konsistenter Qualität',
        '- Jede Aufgabe soll konkret und bearbeitbar sein (nicht nur Platzhalter)',
        '- Nutze authentisches Sprachmaterial, konkrete lateinische Textbeispiele oder historische Szenarien',
        '- Aufgaben sollen unterschiedlich sein und sich nicht gegenseitig Lösungen vorwegnehmen',
        '- Schwierigkeit skaliert: Niveau 1 = leicht/Anfänger, Niveau 2 = mittel, Niveau 3 = anspruchsvoll',
        '- Vermeide generische Formulierungen wie "Bearbeite die Aufgabe"; formuliere präzise Arbeitsaufträge mit klaren Kriterien',
        '- Material nur bei passenden Aufgabentypen verwenden (z.B. Textverständnis, Lückentext, Übersetzung, Multiple Choice)',
        '- Für multipleChoice MUSS material eine konkrete Frage plus vier Optionen A) bis D) enthalten',
        '- Für interpretation KEIN material-Feld erzeugen; stattdessen eine konkrete Interpretationsanweisung geben (Aussageabsicht, Gefühle, Bedeutung, sprachliche Merkmale)',
        '- Für translation darf der Text authentisch ODER didaktisch konstruiert sein; er muss nicht aus einem realen antiken Werk stammen',
        '- Passe Übersetzungstexte strikt ans Niveau an: Niveau 1 kurz und klar, Niveau 2 mit Nebensätzen, Niveau 3 mit komplexerer Syntax',
        '- Formuliere kompakt: kurze Titel, kurze Instruktionen, Material pro Aufgabe max. 260 Zeichen',
        '- Gib exakt die angeforderten Aufgaben zurück, aber halte den Gesamtoutput knapp',
        teacherNote ? `- LEHRKRAFT-HINWEIS: ${teacherNote}` : '',
        introRule ? `- Einführung: ${introRule}` : '- KEINE Einführung',
        '',
        'AUFGABENKONFIGURATION:',
        taskLines,
        '',
        'ANTWORTFORMAT: Gib AUSSCHLIESSLICH valides JSON zurück (kein Markdown, kein zusätzlicher Text):',
        JSON.stringify({
            title: 'Beispiel: Caesar: De Bello Gallico - Arbeitsblatt',
            subtitle: 'Quelle: meum-diarium.schächner.de',
            intro: includeIntro ? 'Beispiel: Dieser Text bespricht...' : undefined,
            tasks: [
                {
                    type: 'readingComprehension',
                    title: 'Schließe Schlüsselstellen des Textes',
                    instruction: 'Lese den folgenden Textausschnitt und beantworte die Fragen.',
                    material: 'Bella Galliae a Caesare suscepta sunt...',
                    difficulty: 2,
                },
                {
                    type: 'multipleChoice',
                    title: 'Historischer Kontext',
                    instruction: 'Wähle die zutreffende Option und begründe kurz, warum die anderen drei weniger passend sind.',
                    material: 'Warum erwähnt Caesar die Belgae besonders?\nA) Wegen ihrer Nähe zu Germanen\nB) Wegen ihres Seereichtums\nC) Wegen ihrer Tempel\nD) Wegen ihrer Flotte',
                    difficulty: 2,
                },
                {
                    type: 'interpretation',
                    title: 'Deutung der Aussage',
                    instruction: 'Interpretiere das übersetzte Stück: 1) Aussageabsicht, 2) erzeugte Gefühle, 3) historische Bedeutung, 4) sprachliche Wirkung. Belege jede Deutung mit einer konkreten Textbeobachtung.',
                    difficulty: 2,
                },
                {
                    type: 'translation',
                    title: 'Übersetzung didaktischer Übungstext',
                    instruction: 'Übersetze den Text vollständig ins Deutsche und markiere zwei Schlüsselstellen, bei denen die Satzstruktur für die Bedeutung wichtig ist.',
                    material: 'Didaktischer Übungstext (Niveau 2): Caesar, cum nuntius de motu Gallorum venisset, legatos convocavit et dixit se celeriter agere oportere, ne socii timore frangerentur.',
                    difficulty: 2,
                },
            ],
        }, null, 2),
        '',
        'KRITISCH: Das JSON MUSS vollständig und gültig sein. Halte dich exakt an die Beispielstruktur; optionale Felder (z.B. "intro") dürfen null sein oder weggelassen werden, wenn sie nicht verwendet werden.',
        'WICHTIG: KEINE Markdown-Codeblöcke, KEIN ```json, NUR reines JSON.',
    ].filter(Boolean).join('\n');

    const ai = resolveAiBinding(env);
    if (!ai) {
        return new Response(JSON.stringify({
            error: 'AI binding not configured',
            worksheet: null,
        }), { status: 503, headers: corsHeaders() });
    }

    try {
        const aiResponse = await ai.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
            messages: [
                { role: 'system', content: 'Du bist ein Experte für Lateinunterricht und erstellst konsistent hochwertige, konkrete Arbeitsblaetter. Antworte NUR mit gültigem JSON, keinen anderen Text.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 2200,
        });

        // Extract text from AI response - handle both string and structured responses
        let raw = '';
        if (typeof aiResponse?.response === 'string') {
            raw = aiResponse.response.trim();
        } else if (aiResponse?.response && typeof aiResponse.response === 'object') {
            // For structured responses, check common fields
            if (typeof aiResponse.response.text === 'string') {
                raw = aiResponse.response.text.trim();
            } else if (typeof aiResponse.response.content === 'string') {
                raw = aiResponse.response.content.trim();
            } else if (Array.isArray(aiResponse.response.choices) && aiResponse.response.choices[0]?.message?.content) {
                raw = String(aiResponse.response.choices[0].message.content).trim();
            } else {
                // Fallback: try to stringify the whole response object
                console.warn('[Worksheet] AI response is object, attempting JSON.stringify');
                console.warn('[Worksheet] Response structure:', JSON.stringify(aiResponse.response).substring(0, 200));
                raw = JSON.stringify(aiResponse.response);
            }
        } else {
            raw = String(aiResponse?.response || '').trim();
        }

        const rawLength = raw.length;
        console.log(`[Worksheet] AI response received. length=${rawLength}`);

        // Check if response is suspiciously short
        if (rawLength < 50) {
            console.warn(`[Worksheet] AI response is suspiciously short (${rawLength} chars). Check AI model configuration.`);
        }

        const parsed = extractJsonObject(raw);
        if (!parsed) {
            const recovered = recoverWorksheetFromPartialResponse(raw, topic, includeIntro, tasks);
            if (recovered) {
                console.warn(`[Worksheet] Recovered worksheet from partial AI response`);
                return new Response(JSON.stringify({
                    worksheet: recovered,
                    warning: 'AI response was partial. Reconstructed worksheet used.'
                }), { headers: corsHeaders() });
            }

            console.warn(`[Worksheet] Could not extract JSON from response`);
            console.warn(`[Worksheet] Full response (first 500 chars):`, raw.substring(0, 500));
            return new Response(JSON.stringify({
                worksheet: buildWorksheetFallback(topic, includeIntro, tasks),
                warning: 'AI response had invalid JSON format. Fallback used.'
            }), { headers: corsHeaders() });
        }

        if (!Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
            console.error(`[Worksheet] Parsed JSON has no tasks`);
            return new Response(JSON.stringify({
                worksheet: buildWorksheetFallback(topic, includeIntro, tasks),
                warning: 'AI response had no tasks. Fallback used.',
            }), { headers: corsHeaders() });
        }

        // Validate and normalize tasks
        const validatedTasks = parsed.tasks
            .filter(t => t && typeof t === 'object')
            .map((t) => normalizeWorksheetTask(t, topic));

        if (validatedTasks.length === 0) {
            console.error(`[Worksheet] No valid tasks after validation`);
            return new Response(JSON.stringify({
                worksheet: buildWorksheetFallback(topic, includeIntro, tasks),
                warning: 'AI tasks were invalid. Fallback used.',
            }), { headers: corsHeaders() });
        }

        const result = {
            title: String(parsed.title || `${topic} - Arbeitsblatt`),
            subtitle: String(parsed.subtitle || 'Quelle: meum-diarium.schächner.de'),
            intro: includeIntro && parsed.intro ? String(parsed.intro) : undefined,
            tasks: validatedTasks,
        };

        console.log(`[Worksheet] Successfully generated worksheet with ${validatedTasks.length} tasks`);
        return new Response(JSON.stringify({ worksheet: result }), { headers: corsHeaders() });
    } catch (e) {
        console.error(`[Worksheet] AI request error: ${e?.message}`);
        return new Response(JSON.stringify({
            worksheet: buildWorksheetFallback(topic, includeIntro, tasks),
            warning: `AI request failed: ${e?.message || 'unknown error'}`,
        }), { headers: corsHeaders() });
    }
}

function normalizeWorksheetTask(task, topic) {
    const type = String(task?.type || 'readingComprehension');
    const typeLower = type.toLowerCase();
    let title = String(task?.title || 'Aufgabe').trim() || 'Aufgabe';
    const difficulty = [1, 2, 3].includes(Number(task?.difficulty)) ? Number(task.difficulty) : 2;
    let instruction = String(task?.instruction || 'Bearbeite die Aufgabe.').trim() || 'Bearbeite die Aufgabe.';
    let material = task?.material ? String(task.material).trim() : undefined;

    if (isGenericTaskTitle(title)) {
        title = defaultTaskTitle(typeLower, difficulty);
    }

    if (isGenericTaskInstruction(instruction)) {
        instruction = defaultTaskInstruction(typeLower, difficulty, topic);
    }

    if (typeLower === 'multiplechoice') {
        if (!material || !hasMultipleChoiceOptions(material)) {
            material = buildMultipleChoiceMaterial(topic);
        }
    }

    if (typeLower === 'interpretation') {
        material = undefined;
        instruction = interpretationInstructionByDifficulty(difficulty);
    }

    if (typeLower === 'translation') {
        if (!material || isPlaceholderMaterial(material)) {
            material = buildTranslationMaterial(topic, difficulty);
        }
        if (isGenericTaskInstruction(instruction)) {
            instruction = defaultTaskInstruction(typeLower, difficulty, topic);
        }
    }

    const normalized = {
        type,
        title,
        instruction,
        difficulty,
    };

    if (material) normalized.material = material;
    return normalized;
}

function hasMultipleChoiceOptions(text) {
    if (!text) return false;
    const normalized = String(text);
    const hasA = /(^|\n)\s*A\s*[\)\.:\-]/i.test(normalized);
    const hasB = /(^|\n)\s*B\s*[\)\.:\-]/i.test(normalized);
    const hasC = /(^|\n)\s*C\s*[\)\.:\-]/i.test(normalized);
    const hasD = /(^|\n)\s*D\s*[\)\.:\-]/i.test(normalized);
    return hasA && hasB && hasC && hasD;
}

function isGenericTaskTitle(title) {
    const t = String(title || '').trim().toLowerCase();
    return !t || t === 'aufgabe' || t === 'task' || t === 'worksheet task';
}

function isGenericTaskInstruction(instruction) {
    const i = String(instruction || '').trim().toLowerCase();
    if (!i) return true;
    return i === 'bearbeite die aufgabe.'
        || i === 'bearbeite die aufgabe'
        || i === 'löse die aufgabe.'
        || i === 'solve the task.'
        || i === 'complete the task.';
}

function isPlaceholderMaterial(material) {
    const m = String(material || '').trim().toLowerCase();
    if (!m) return true;
    if (m.startsWith('[') && m.endsWith(']')) return true;
    return m.includes('sollte hier eingefügt werden');
}

function defaultTaskTitle(type, difficulty) {
    const level = Number(difficulty) || 2;
    const map = {
        readingcomprehension: ['Kernaussagen erfassen', 'Argumentation nachvollziehen', 'Textstruktur analysieren'],
        cloze: ['Grundformen einsetzen', 'Formen und Bezüge erkennen', 'Syntax präzise ergänzen'],
        multiplechoice: ['Sachverhalt prüfen', 'Kontext bewerten', 'Feinabgrenzung treffen'],
        translation: ['Basisübersetzung', 'Übersetzung mit Satzgefüge', 'Feinübersetzung komplexer Syntax'],
        interpretation: ['Aussage deuten', 'Wirkung und Intention deuten', 'Mehrschichtige Deutung entwickeln'],
        discussion: ['Position beziehen', 'Argumentiert Stellung nehmen', 'Kontroverse begründet auswerten'],
    };
    const list = map[type] || ['Aufgabe'];
    return list[Math.max(0, Math.min(2, level - 1))] || list[0];
}

function defaultTaskInstruction(type, difficulty, topic) {
    const level = Number(difficulty) || 2;
    if (type === 'translation') {
        if (level === 1) return `Übersetze den kurzen Übungstext zum Thema ${topic} vollständig ins Deutsche. Markiere im Anschluss Subjekt und Prädikat in jedem Satz.`;
        if (level === 2) return `Übersetze den Text zum Thema ${topic} vollständig ins Deutsche und erläutere bei zwei Satzteilen deine Übersetzungsentscheidung (z.B. Tempus oder Nebensatzbezug).`;
        return `Fertige eine präzise Gesamtübersetzung zum Thema ${topic} an und kommentiere drei schwierige Strukturen (Satzgefüge, Partizipialkonstruktion oder semantische Nuance).`;
    }
    if (type === 'multiplechoice') {
        if (level === 1) return 'Wähle die richtige Option (A-D) und notiere ein Stichwort als Begründung.';
        if (level === 2) return 'Wähle die zutreffende Option (A-D) und begründe in 1-2 Sätzen, warum die Alternativen weniger passend sind.';
        return 'Wähle die präziseste Option (A-D) und begründe analytisch, welche Textsignale deine Entscheidung stützen.';
    }
    return `Bearbeite die Aufgabe zum Thema ${topic} präzise und begründe deine Ergebnisse kurz.`;
}

function interpretationInstructionByDifficulty(difficulty) {
    const level = Number(difficulty) || 2;
    if (level === 1) {
        return 'Interpretiere das übersetzte Stück in 4-6 Sätzen: Was ist die zentrale Aussage? Welche Stimmung wird erzeugt? Woran erkennst du das sprachlich?';
    }
    if (level === 2) {
        return 'Interpretiere das übersetzte Stück: 1) Aussageabsicht, 2) erzeugte Gefühle, 3) historische Bedeutung, 4) sprachliche Wirkung. Belege jede Deutung mit einer konkreten Textbeobachtung.';
    }
    return 'Entwickle eine vertiefte Interpretation des übersetzten Stücks: Argumentiere zu Intention, Perspektive, Wirkung und historischer Einordnung und stütze jede These mit präziser Textbeobachtung.';
}

function buildMultipleChoiceMaterial(topic) {
    return [
        `Welche Aussage passt am besten zum Thema "${topic}"?`,
        'A) Die Darstellung betont strategisches Vorgehen und politische Selbstdarstellung.',
        'B) Der Text lehnt jede militärische Planung grundsätzlich ab.',
        'C) Die Quelle behandelt ausschließlich religiöse Rituale ohne Politikbezug.',
        'D) Der Abschnitt beschreibt nur geografische Daten ohne Argumentationsziel.'
    ].join('\n');
}

function buildTranslationMaterial(topic, difficulty) {
    const level = Number(difficulty) || 2;
    if (level === 1) {
        return `Didaktischer Übungstext (Niveau 1): Caesar in castris manet et milites monet. Galli legatos mittunt, sed Romani portas servant. Omnes de pace et timore disputant.`;
    }
    if (level === 2) {
        return `Didaktischer Übungstext (Niveau 2): Caesar, cum nuntius de motu Gallorum venisset, legatos convocavit et dixit se celeriter agere oportere, ne socii timore frangerentur.`;
    }
    return `Didaktischer Übungstext (Niveau 3): Quamquam hiems appropinquabat, Caesar statuit exercitum trans flumen ducere, ut oppida, quae superioribus diebus dubitaverant, consilio celeriter capto ad fidem revocarentur.`;
}

function extractJsonObject(text) {
    if (!text) return null;

    const strippedFence = stripMarkdownCodeFence(text);
    const balanced = findBalancedJsonObject(strippedFence) || findBalancedJsonObject(text);

    // Try best candidate first (balanced object), then fallback candidates.
    const candidates = [balanced, strippedFence, text].filter(Boolean);

    for (const raw of candidates) {
        const firstBrace = raw.indexOf('{');
        if (firstBrace === -1) continue;

        // Keep from first object start and auto-close open structures if the model truncated output.
        const maybeJson = closeOpenJsonStructures(raw.slice(firstBrace));

        // Parse with increasing tolerance while preserving content whenever possible.
        const parseAttempts = [
            maybeJson,
            maybeJson.replace(/,\s*([}\]])/g, '$1'),
            maybeJson
                .replace(/\/\/.*$/gm, '')
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/,\s*([}\]])/g, '$1'),
        ];

        for (const attempt of parseAttempts) {
            try {
                return JSON.parse(attempt.trim());
            } catch {
                // Try next attempt.
            }
        }
    }

    console.warn('[JSON Extraction] Failed to parse JSON from AI response');
    console.warn('[JSON Extraction] Raw preview:', String(text).substring(0, 220));
    return null;
}

function recoverWorksheetFromPartialResponse(rawText, topic, includeIntro, tasksConfig) {
    if (!rawText) return null;

    const text = String(rawText)
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim();

    const safeExtract = (pattern, fallback = '') => {
        const m = text.match(pattern);
        return m && m[1] ? String(m[1]).trim() : fallback;
    };

    const title = safeExtract(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/, `${topic} - Arbeitsblatt`);
    const subtitle = safeExtract(/"subtitle"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/, 'Quelle: meum-diarium.schächner.de');
    const intro = includeIntro
        ? safeExtract(/"intro"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/, `Dieses Arbeitsblatt behandelt das Thema "${topic}".`)
        : undefined;

    const normalizedTitle = title.replace(/\\"/g, '"');
    const normalizedSubtitle = subtitle.replace(/\\"/g, '"');
    const normalizedIntro = intro ? intro.replace(/\\"/g, '"') : undefined;

    const tasks = [];
    const taskStartRegex = /\{\s*"type"\s*:\s*"([^"]+)"[\s\S]*?"title"\s*:\s*"([^"]+)"[\s\S]*?"instruction"\s*:\s*"([^"]+)"[\s\S]*?(?:"material"\s*:\s*"([^"]*)")?[\s\S]*?(?:"difficulty"\s*:\s*(\d))?/g;
    let match;

    while ((match = taskStartRegex.exec(text)) !== null) {
        const type = String(match[1] || 'readingComprehension');
        const taskTitle = String(match[2] || 'Aufgabe').replace(/\\"/g, '"');
        const instruction = String(match[3] || 'Bearbeite die Aufgabe.').replace(/\\"/g, '"');
        const material = match[4] ? String(match[4]).replace(/\\"/g, '"') : undefined;
        const rawDifficulty = Number(match[5] || 2);
        const difficulty = [1, 2, 3].includes(rawDifficulty) ? rawDifficulty : 2;

        tasks.push({
            type,
            title: taskTitle,
            instruction,
            material,
            difficulty,
        });

        if (tasks.length >= 8) break;
    }

    if (!tasks.length) return null;

    // Ensure the worksheet always has at least one task per requested config when possible.
    const requestedTypes = Array.isArray(tasksConfig)
        ? tasksConfig.map((t) => String(t?.type || '').trim()).filter(Boolean)
        : [];

    for (const type of requestedTypes) {
        const hasType = tasks.some((t) => String(t.type).toLowerCase() === type.toLowerCase());
        if (!hasType) {
            tasks.push({
                type,
                title: `${type} Aufgabe`,
                instruction: `Bearbeite die Aufgabe zum Thema ${topic}.`,
                difficulty: 2,
            });
        }
        if (tasks.length >= 12) break;
    }

    return {
        title: normalizedTitle || `${topic} - Arbeitsblatt`,
        subtitle: normalizedSubtitle || 'Quelle: meum-diarium.schächner.de',
        intro: normalizedIntro,
        tasks: tasks.slice(0, 12),
    };
}

function stripMarkdownCodeFence(text) {
    if (!text) return '';
    return String(text)
        .replace(/^\s*```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();
}

function findBalancedJsonObject(input) {
    if (!input) return null;

    const text = String(input);
    const start = text.indexOf('{');
    if (start === -1) return null;

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === '\\') {
                escaped = true;
                continue;
            }
            if (ch === '"') {
                inString = false;
            }
            continue;
        }

        if (ch === '"') {
            inString = true;
            continue;
        }
        if (ch === '{') {
            depth += 1;
            continue;
        }
        if (ch === '}') {
            depth -= 1;
            if (depth === 0) {
                return text.slice(start, i + 1);
            }
        }
    }

    return null;
}

function closeOpenJsonStructures(input) {
    if (!input) return '';

    const text = String(input).trim();
    let inString = false;
    let escaped = false;
    let curly = 0;
    let square = 0;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === '\\') {
                escaped = true;
                continue;
            }
            if (ch === '"') {
                inString = false;
            }
            continue;
        }

        if (ch === '"') {
            inString = true;
            continue;
        }
        if (ch === '{') curly += 1;
        else if (ch === '}') curly = Math.max(0, curly - 1);
        else if (ch === '[') square += 1;
        else if (ch === ']') square = Math.max(0, square - 1);
    }

    let result = text;
    if (inString) result += '"';
    if (square > 0) result += ']'.repeat(square);
    if (curly > 0) result += '}'.repeat(curly);
    return result;
}

function buildWorksheetFallback(topic, includeIntro, tasks) {
    const taskDescriptionMap = {
        readingComprehension: {
            title: 'Textverständnis',
            instruction: 'Lese den folgenden Textausschnitt aufmerksam durch und beantworte die Fragen zum Inhalt, zur Struktur und zur Bedeutung.',
            material: `[Textabschnitt zum Thema "${topic}" sollte hier eingefügt werden]`,
        },
        cloze: {
            title: 'Lückentext',
            instruction: 'Fülle die Lücken mit passenden Vokabeln oder Grammatik-Formen aus. Nutze die Wörterliste und beachte die grammatikalischen Anforderungen.',
            material: `[Latinischer Text mit Lücken zum Thema "${topic}" sollte hier eingefügt werden]`,
        },
        multipleChoice: {
            title: 'Multiple Choice',
            instruction: 'Wähle die beste Antwort aus den vier Optionen. Es kann nur eine Antwort korrekt sein.',
            material: `[Frage zum Thema "${topic}" mit vier Antwortmöglichkeiten sollte hier eingefügt werden]`,
        },
        translation: {
            title: 'Übersetzungsaufgabe',
            instruction: 'Übersetze die lateinische Passage ins Deutsche. Achte auf genaue Bedeutung und idiomatische Ausdrücke.',
            material: `[Lateinischer Text zum Thema "${topic}" sollte hier eingefügt werden]`,
        },
        interpretation: {
            title: 'Interpretationsaufgabe',
            instruction: 'Interpretiere das übersetzte Stück mit Blick auf Aussageabsicht, Gefühle, Bedeutung und sprachliche Besonderheiten. Begründe deine Deutung mit mindestens zwei Beobachtungen.',
        },
        discussion: {
            title: 'Diskussionsaufgabe',
            instruction: 'Beantworte die Impulsfrage schriftlich. Begründe deine Antwort mit Beispielen aus dem Text oder historischem Kontext.',
            material: `[Impulssfrage zum Thema "${topic}" z.B. "Wie würde Caesar reagiert haben?" oder "Inwiefern ist diese Situation noch heute relevant?"]`,
        },
    };

    const resultTasks = [];
    for (const cfg of tasks) {
        const type = String(cfg?.type || 'readingComprehension');
        const rawDifficulty = Number(cfg?.difficulty);
        const difficulty = Number.isFinite(rawDifficulty) ? Math.max(1, Math.min(3, rawDifficulty)) : 2;
        const amount = Math.max(1, Math.min(3, Number(cfg?.amount || 1)));
        const desc = taskDescriptionMap[type] || taskDescriptionMap.readingComprehension;

        for (let i = 0; i < amount; i++) {
            resultTasks.push({
                type,
                title: `${desc.title}${amount > 1 ? ` ${i + 1}` : ''}`,
                instruction: desc.instruction,
                difficulty,
            });

            if (desc.material) {
                resultTasks[resultTasks.length - 1].material = desc.material;
            }
        }
    }

    return {
        title: `${topic} - Arbeitsblatt`,
        subtitle: 'Quelle: meum-diarium.schächner.de',
        intro: includeIntro ? `Dieses Arbeitsblatt behandelt das Thema "${topic}" mit strukturierten Aufgaben auf verschiedenen Schwierigkeitsstufen. Es dient der Vertiefung von Textverständnis, Übersetzungsfähigkeit und analytischen Kompetenzen.` : '',
        tasks: resultTasks,
    };
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
            caesar: "Du bist eine Engine für Gaius Julius Caesar, den Feldherrn und Diktator. Deine Sprache ist dramatisch, selbstbewusst und voller Pathos. Du denkst in militärischen Kategorien, strategisch und entschlossen. Dein Blick ist auf Ruhm und Macht gerichtet.",
            augustus: "Du bist eine Engine für Augustus, den ersten römischen Kaiser. Deine Sprache ist staatsmännisch, ruhig und bedacht auf Stabilität. Du sprichst wie ein weiser, aber bestimmter Herrscher, der das Reich geeint hat.",
            cicero: "Du bist eine Engine für Marcus Tullius Cicero, den größten Redner Roms. Deine Sprache ist eloquent, rhetorisch brillant und moralisch reflektiert. Du argumentierst mit Scharfsinn und Leidenschaft für die Republik.",
            catilina: "Du bist eine Engine für Lucius Sergius Catilina, den Verschwörer. Deine Sprache ist wild, ehrgeizig und voller Verbitterung über die verpasste Macht. Du bist bereit, alles zu riskieren.",
            seneca: "Du bist eine Engine für Lucius Annaeus Seneca, den stoischen Philosophen. Deine Sprache ist nachdenklich, weise und philosophisch. Du reflektierst über das Leben, die Macht und die Vergänglichkeit.",
            sallust: "Du bist eine Engine für Gaius Sallustius Crispus, den römischen Geschichtsschreiber. Deine Sprache ist analytisch, moralisch wertend und historisch reflektiert. Du durchschaust die Mechanismen der Macht.",
            sokrates: "Du bist eine Engine für Sokrates, den athenischen Philosophen. Deine Sprache ist fragend, ironisch und dialektisch. Du stellst die richtigen Fragen und zwingst zum Nachdenken.",
        };

        const systemPrompt = `
Du bist eine Engine für ein historisches Rollenspiel in der Ich-Perspektive ("Ich"-Form).
Persona: ${personaPrompts[persona] || "Eine historische Persönlichkeit"}.
Szenario: ${scenario}

Aufgabe: 
Beschreibe die aktuelle Situation lebendig, atmosphärisch und natürlich. Erzähle in der Ich-Perspektive wie eine echte Person, die ihre Lage schildert. Die Sprache soll sich wie eine fließende Erzählung anfühlen – nicht wie Stichpunkte. Variiere Satzanfänge und -längen ganz natürlich.

Narrative Länge: 4-6 zusammenhängende Sätze – so viel wie nötig, um die Situation lebendig werden zu lassen. Atmosphärisch, aber nicht übertrieben pathetisch.

Generiere eine Antwort im JSON-Format mit folgendem Schema:
{
"narrative": "Eine lebendige, natürliche Beschreibung in der Ich-Perspektive. 4-6 Sätze. Variiere den Satzbau ganz natürlich. Inhaltlich passend zur historischen Persona und zum Szenario. Vermeide Anführungszeichen innerhalb des Textes.",
"stats": {
  "volk": Delta-Wert für das Wohl des Volkes (-15 bis +15),
  "einfluss": Delta-Wert für deinen privaten Einfluss (-15 bis +15),
  "macht": Delta-Wert für deine militärische/politische Macht (-15 bis +15)
},
"options": [
  {"id": "o1", "text": "Sachliche Handlungsoption in 3-10 Wörtern"},
  {"id": "o2", "text": "Alternative Strategie in 3-10 Wörtern"},
  {"id": "o3", "text": "Riskantere Option in 3-10 Wörtern"}
],
"ended": boolean (true wenn die Geschichte endet, wir triumphieren oder scheitern)
}

KRITISCH WICHTIG:
- Antworte AUSSCHLIESSLICH in valideem JSON.
- Starte deine Antwort direkt mit '{' und beende sie mit '}'.
- Alles außerhalb des JSON-Objekts ist STRENG VERBOTEN.
- Erzähle in der Ich-Form, als wärst du die Persona selbst.
- Die narrative soll sich wie ein natürlicher Monolog lesen, nicht wie ein Telegramm.
- Die options sollen sachlich und konkret sein.
- KEINE Anführungszeichen innerhalb der Texte.
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

        // Use Llama 4 Scout for larger context window (handles longer prompts)
        const AI_MODEL = '@cf/meta/llama-4-scout-17b-16e-instruct';
        console.log(`[Simulation] Using model ${AI_MODEL}, persona=${persona}`);
        console.log(`[Simulation] Messages count: ${messages.length}`);
        let totalChars = 0;
        messages.forEach((m, i) => { totalChars += (m.content || '').length; });
        console.log(`[Simulation] Total prompt characters: ${totalChars}`);

        const aiOptions = { messages, max_tokens: 1024 };

        let aiResponse;
        try {
            aiResponse = await ai.run(AI_MODEL, aiOptions);
        } catch (modelError) {
            console.error(`[Simulation] ${AI_MODEL} failed:`, modelError?.message || modelError);
            console.log(`[Simulation] Falling back to @cf/meta/llama-3.1-8b-instruct`);
            aiResponse = await ai.run('@cf/meta/llama-3.1-8b-instruct', aiOptions);
        }

        if (!aiResponse || !aiResponse.response) {
            console.error(`[Simulation] AI returned empty response. aiResponse=`, JSON.stringify(aiResponse).substring(0, 500));
            throw new Error("AI returned no response content");
        }

        const rawResponse = aiResponse.response;
        console.log("[Simulation] Raw AI Response type:", typeof rawResponse);

        // Llama-4-Scout returns a parsed object directly; Llama-3.1-8B returns a JSON string.
        let result = null;

        if (typeof rawResponse === 'object' && rawResponse !== null && rawResponse.narrative) {
            // Already a parsed object – use directly
            result = rawResponse;
            console.log("[Simulation] AI returned parsed object directly");
            result = {
                narrative: result.narrative,
                stats: result.stats || { volk: 0, einfluss: 0, macht: 0 },
                options: result.options || [{ id: "o1", text: "Abwarten und beobachten" }],
                ended: typeof result.ended === 'boolean' ? result.ended : false
            };
        } else if (typeof rawResponse === 'object' && rawResponse !== null && rawResponse.response) {
            // Nested: { response: { narrative, stats, options, ended } }
            const inner = rawResponse.response;
            if (typeof inner === 'object' && inner.narrative) {
                result = {
                    narrative: inner.narrative,
                    stats: inner.stats || { volk: 0, einfluss: 0, macht: 0 },
                    options: inner.options || [{ id: "o1", text: "Abwarten und beobachten" }],
                    ended: typeof inner.ended === 'boolean' ? inner.ended : false
                };
                console.log("[Simulation] AI returned nested response object");
            }
        }

        if (result) {
            console.log("[Simulation] Successfully extracted result");
            return new Response(JSON.stringify(result), { headers: corsHeaders() });
        }

        // Fallback: treat as JSON string and parse
        const text = String(rawResponse);
        console.log("[Simulation] Treating response as JSON string, length:", text.length);

        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            console.error(`[Simulation] No JSON object found in string response`);
            console.error(`[Simulation] FULL raw response (first 2000 chars):`, text.substring(0, 2000));
            return new Response(JSON.stringify({
                narrative: "Die Götter schweigen...",
                stats: { volk: 0, einfluss: 0, macht: 0 },
                options: [{ id: "retry", text: "Erneut versuchen" }],
                ended: false
            }), { headers: corsHeaders() });
        }

        let cleanedJson = text.substring(firstBrace, lastBrace + 1);

        // Basic JSON cleanup
        cleanedJson = cleanedJson
            .replace(/,\s*([}\]])/g, '$1')
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ');

        // If ended is missing, try to repair
        if (!cleanedJson.includes('"ended"')) {
            try {
                const repaired = cleanedJson + ',"ended": false}';
                const parsed = JSON.parse(repaired);
                if (parsed.narrative && parsed.stats && parsed.options) {
                    console.log(`[Simulation] Repaired truncated JSON with ended:false`);
                    return new Response(JSON.stringify({
                        narrative: parsed.narrative,
                        stats: parsed.stats,
                        options: parsed.options,
                        ended: false
                    }), { headers: corsHeaders() });
                }
            } catch (e) {}
        }

        try {
            const parsed = JSON.parse(cleanedJson);
            if (!parsed.narrative || !parsed.stats || !parsed.options || typeof parsed.ended !== 'boolean') {
                throw new Error("Missing required fields");
            }
            return new Response(JSON.stringify(parsed), { headers: corsHeaders() });
        } catch (parseError) {
            console.error("[Simulation] JSON Parse Error:", parseError.message);
            console.error("[Simulation] Content:", cleanedJson.substring(0, 500));
            return new Response(JSON.stringify({
                narrative: "Ein Fehler in den Schriftrollen...",
                stats: { volk: 0, einfluss: 0, macht: 0 },
                options: [{ id: "retry", text: "Erneut versuchen" }],
                ended: false
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
    const baseBackendUrl = "https://meum-diarium.xn--schchner-2za.de";
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
    const baseBackendUrl = "https://meum-diarium.xn--schchner-2za.de";
    
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


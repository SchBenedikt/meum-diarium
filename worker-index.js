// Worker code for improved AI resource suggestions
// This handles smarter keyword extraction and URL matching

export default {
    async fetch(request, env) {
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders() });
        }
        if (!["GET", "POST"].includes(request.method)) {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: corsHeaders(),
            });
        }

        const url = new URL(request.url);
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

        // Persona extraction and Documentation check
        let persona = (url.searchParams.get("persona") || body?.persona || "caesar").toLowerCase();
        let question = url.searchParams.get("ask") || body?.ask;
        let historyParam = url.searchParams.get("history") || (body?.history ? JSON.stringify(body.history) : null);
        let sitemapUrl = url.searchParams.get("sitemap") || body?.sitemap;

        // Route: /api - Only proxy write operations or specific AI queries.
        // Standard content GET requests should fall through to Pages (static assets or Functions).
        if (pathname.startsWith('/api') && (["POST", "PUT", "DELETE"].includes(request.method) || question)) {
            const baseBackendUrl = "https://meum-diarium.xn--schchner-2za.de";
            const proxyUrl = new URL(url.pathname + url.search, baseBackendUrl);

            // Safety: Don't proxy back to self to avoid infinite loops
            if (url.hostname !== "meum-diarium.xn--schchner-2za.de") {
                try {
                    const response = await fetch(proxyUrl.toString(), {
                        method: request.method,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: request.method === "POST" ? JSON.stringify(body) : null
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

        // Route: Root / or /api or PersonaChat - Show docs if no question
        if (!question && (pathname === "" || pathname === "/api" || pathname === "/personachat")) {
            return renderApiDocs(request);
        }

        if (!question) {
            return new Response(JSON.stringify({ error: "No question provided. Use ?ask=... or POST {ask}." }), {
                status: 400,
                headers: corsHeaders(),
            });
        }

        const personaPrompts = {
            caesar: "Du bist Gaius Julius Caesar. Du bist davon überzeugt, dass du der beste Feldherr bist und jeden besiegen kannst. Du hoffst, dass dir bald alle unterlegen sind. Passe die Sprache an den Nutzer an; antworte in der gleichen Sprache, in der du die Frage bekommst.",
            augustus: "Du bist Imperator Caesar Divi Filius Augustus, der erste römische Kaiser. Du sprichst ruhig, überlegt und staatsmännisch.",
            cicero: "Du bist Marcus Tullius Cicero, ein römischer Redner und Philosoph. Du argumentierst rhetorisch geschickt und liebst klare Logik.",
            catilina: "Du bist Lucius Sergius Catilina. Du bist ehrgeizig, aggressiv und fühlst dich von der Oberschicht verraten.",
        };

        const markdownRules =
            "Formatiere deine Antwort in GitHub-Flavored Markdown. Nutze klare Überschriften (##), Listen (-), kurze Absätze, Zitate (> ...). Keine HTML-Tags.";

        const systemPrompt =
            (personaPrompts[persona] || "Du bist eine historische römische Persönlichkeit. Antworte im passenden Stil.") +
            "\n\n" + markdownRules;

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

        const chat = { messages };
        const aiResponse = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", chat);

        let resources = [];
        if (sitemapUrl) {
            try {
                resources = await suggestResourcesFromSitemap(sitemapUrl, persona, question, aiResponse.response || "");
            } catch (e) {
                // keep answering even if sitemap fails
            }
        }

        const result = {
            persona,
            inputs: chat,
            response: aiResponse,
            resources,
            format: "markdown",
        };

        // If we have a question, it's an AI chat request.
        // Otherwise, it falls through to Cloudflare Pages (Static Assets or Functions).
        if (question) {
            const aiResult = await handleAiChat(request, env, persona, question, historyParam, sitemapUrl);
            return new Response(JSON.stringify(aiResult), { headers: corsHeaders() });
        }

        // Default: Pass through to the origin (Cloudflare Pages assets/Functions)
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

    const chat = { messages };
    const aiResponse = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", chat);

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

    const chat = { messages };
    const aiResponse = await env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', chat);

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

function renderApiDocs(request) {
    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meum Diarium API | Dokumentation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #e11d48;
            --primary-glow: rgba(225, 29, 72, 0.4);
            --background: #09090b;
            --surface: #121214;
            --surface-hover: #1c1c20;
            --border: rgba(255, 255, 255, 0.08);
            --text: #fafafa;
            --text-muted: #a1a1aa;
            --radius: 20px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--background);
            color: var(--text);
            line-height: 1.6;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 0% 0%, rgba(225, 29, 72, 0.03) 0%, transparent 40%),
                radial-gradient(circle at 100% 100%, rgba(225, 29, 72, 0.03) 0%, transparent 40%);
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 6rem 1.5rem;
        }

        header {
            text-align: center;
            margin-bottom: 6rem;
            position: relative;
        }

        .badge {
            display: inline-block;
            padding: 0.4rem 1rem;
            background: rgba(225, 29, 72, 0.1);
            color: var(--primary);
            border: 1px solid rgba(225, 29, 72, 0.2);
            border-radius: 99px;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
        }

        h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.5rem, 8vw, 4.5rem);
            font-weight: 700;
            margin-bottom: 1.5rem;
            letter-spacing: -0.01em;
            background: linear-gradient(to bottom, #fff, #a1a1aa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 650px;
            margin: 0 auto;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 4rem;
        }

        section {
            scroll-margin-top: 2rem;
        }

        h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2.25rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        h2::after {
            content: "";
            flex: 1;
            height: 1px;
            background: var(--border);
        }

        .endpoint-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 2.5rem;
            margin-bottom: 2.5rem;
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .endpoint-card:hover {
            border-color: rgba(225, 29, 72, 0.3);
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
        }

        .endpoint-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .method-tag {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            background: var(--primary);
            color: white;
            box-shadow: 0 0 15px var(--primary-glow);
        }

        .url-box {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.95rem;
            color: var(--text);
            padding: 0.75rem 1.25rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            border: 1px solid var(--border);
            flex: 1;
            min-width: 250px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .url-box code {
            color: var(--primary);
        }

        .copy-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: color 0.2s;
        }

        .copy-btn:hover {
            color: white;
        }

        .description {
            color: var(--text-muted);
            margin-bottom: 2rem;
            font-size: 1.05rem;
        }

        .params-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 1rem 2.5rem;
            margin-top: 1.5rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 16px;
        }

        .param-name {
            font-family: 'JetBrains Mono', monospace;
            color: var(--primary);
            font-weight: 600;
        }

        .param-desc {
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .example-section {
            margin-top: 2.5rem;
        }

        .example-label {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-muted);
            margin-bottom: 1rem;
            display: block;
        }

        pre {
            font-family: 'JetBrains Mono', monospace;
            background: #000;
            padding: 1.5rem;
            border-radius: 16px;
            font-size: 0.9rem;
            overflow-x: auto;
            border: 1px solid var(--border);
            color: #d1d5db;
        }

        .json-key { color: #f472b6; }
        .json-string { color: #34d399; }
        .json-bool { color: #fbbf24; }
        .json-number { color: #60a5fa; }

        footer {
            margin-top: 8rem;
            padding: 4rem 1.5rem;
            text-align: center;
            border-top: 1px solid var(--border);
            color: var(--text-muted);
        }

        footer a {
            color: var(--primary);
            text-decoration: none;
        }

        .glow-overlay {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: radial-gradient(circle at top right, rgba(225, 29, 72, 0.1), transparent 40%);
            z-index: 10;
        }

        @media (max-width: 640px) {
            .endpoint-card { padding: 1.5rem; }
            h1 { font-size: 2.5rem; }
            .params-grid { grid-template-columns: 1fr; gap: 0.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="badge">V1 API Docs</div>
            <h1>Meum Diarium API</h1>
            <p class="subtitle">Eine moderne, schnelle und interaktive API für alle Inhalte des römischen Imperiums.</p>
        </header>

        <div class="grid">
            <!-- Content API Section -->
            <section>
                <h2>Inhalts-API</h2>
                <p class="description" style="margin-bottom: 3rem;">Greife auf alle strukturierten Daten der Plattform zu – von Blogposts über Lexikoneinträge bis hin zu antiken Werken.</p>

                <!-- Catalog -->
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method-tag">GET</span>
                        <div class="url-box">
                            <code>/api/catalog</code>
                        </div>
                    </div>
                    <p class="description">Gibt eine Übersicht über die gesamte Datenbank zurück, inklusive Beitragszahlen und verfügbaren Autoren.</p>
                    
                    <div class="example-section">
                        <span class="example-label">Response Beispiel</span>
                        <pre>{
  <span class="json-key">"timestamp"</span>: <span class="json-string">"2026-02-01"</span>,
  <span class="json-key">"counts"</span>: {
    <span class="json-key">"posts"</span>: <span class="json-number">41</span>,
    <span class="json-key">"lexicon"</span>: <span class="json-number">92</span>,
    <span class="json-key">"works"</span>: <span class="json-number">7</span>
  },
  <span class="json-key">"available_authors"</span>: [<span class="json-string">"caesar"</span>, <span class="json-string">"cicero"</span>, <span class="json-string">"augustus"</span>]
}</pre>
                    </div>
                </div>

                <!-- Posts -->
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method-tag">GET</span>
                        <div class="url-box">
                            <code>/api/posts</code>
                        </div>
                    </div>
                    <p class="description">Listet alle verfassen Blog-Beiträge mit Slugs, Titeln und Autoren auf.</p>
                </div>

                <!-- Specific Post -->
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method-tag">GET</span>
                        <div class="url-box">
                            <code>/api/posts/{author}/{slug}</code>
                        </div>
                    </div>
                    <p class="description">Gibt den vollständigen Inhalt eines Beitrags zurück, inklusive Tagebuch- und wissenschaftlichem Text.</p>
                </div>

                <!-- Lexicon -->
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method-tag">GET</span>
                        <div class="url-box">
                            <code>/api/lexicon</code>
                        </div>
                    </div>
                    <p class="description">Gibt eine Liste aller historischen Begriffe und Definitionen zurück.</p>
                </div>

                <!-- Works -->
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method-tag">GET</span>
                        <div class="url-box">
                            <code>/api/works</code>
                        </div>
                    </div>
                    <p class="description">Liefert eine Liste der antiken Standardwerke, die auf der Plattform referenziert werden.</p>
                </div>
            </section>

            <!-- AI Engine Section -->
            <section>
                <h2>KI Schnittstellen</h2>
                <p class="description" style="margin-bottom: 3rem;">Nutze unsere spezialisierten LLM-Modelle, um interaktive Gespräche mit historischen Persönlichkeiten zu führen.</p>

                <!-- Persona Chat -->
                <div class="endpoint-card">
                    <div class="glow-overlay"></div>
                    <div class="endpoint-header">
                        <span class="method-tag" style="background: #ffffff; color: #000; box-shadow: 0 0 20px rgba(255,255,255,0.2)">GET</span>
                        <div class="url-box">
                            <code>/api?persona=caesar&ask={text}</code>
                        </div>
                    </div>
                    <p class="description">Kommuniziere direkt mit einer historischen Persona. Die KI antwortet im entsprechenden Stil und schlägt passende Ressourcen vor.</p>
                    
                    <div class="params-grid">
                        <span class="param-name">persona</span>
                        <span class="param-desc">Name der Figur (caesar, cicero, augustus, catilina, seneca).</span>
                        <span class="param-name">ask</span>
                        <span class="param-desc">Die Nachricht oder Frage an die KI.</span>
                        <span class="param-name">personaParam</span>
                        <span class="param-desc">Optional: Context-Historie für fortlaufende Gespräche.</span>
                    </div>
                </div>

                <!-- Simulation -->
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method-tag">POST</span>
                        <div class="url-box">
                            <code>/simulate</code>
                        </div>
                    </div>
                    <p class="description">Startet ein textbasiertes Rollenspiel-Szenario, in dem du Entscheidungen triffst, die den Verlauf der Geschichte beeinflussen.</p>
                </div>
            </section>
        </div>

        <footer>
            <p>&copy; 2026 Meum Diarium. Entwickelt von <a href="https://github.com/SchBenedikt">Benedikt Schächner</a>.</p>
            <p style="margin-top: 1rem; opacity: 0.5; font-size: 0.8rem;">Alle Daten werden statisch exportiert und via Cloudflare Global Edge Network ausgeliefert.</p>
        </footer>
    </div>
</body>
</html>
    `;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
        }
    });
}

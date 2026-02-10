var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker-index.js
var worker_index_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (!["GET", "POST"].includes(request.method)) {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders()
      });
    }
    const url = new URL(request.url);
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
    if (pathname.endsWith("/explain")) {
      return handleExplainTerm(request, env, url, body);
    }
    if (pathname.endsWith("/simulate")) {
      return handleSimulation(request, env, url, body);
    }
    if (pathname.endsWith("/stats")) {
      return handleStats();
    }
    if (pathname.endsWith("/comments")) {
      return handleComments(request, env, url, body);
    }
    if (pathname.endsWith("/reading-progress")) {
      return handleReadingProgress(request, env, url, body);
    }
    let persona = (url.searchParams.get("persona") || body?.persona || "caesar").toLowerCase();
    let question = url.searchParams.get("ask") || body?.ask;
    let historyParam = url.searchParams.get("history") || (body?.history ? JSON.stringify(body.history) : null);
    let sitemapUrl = url.searchParams.get("sitemap") || body?.sitemap;
    if (pathname.startsWith("/api") && (["POST", "PUT", "DELETE"].includes(request.method) || question)) {
      const baseBackendUrl = "https://meum-diarium.xn--schchner-2za.de";
      const proxyUrl = new URL(url.pathname + url.search, baseBackendUrl);
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
    if (question) {
      const aiResult = await handleAiChat(request, env, persona, question, historyParam, sitemapUrl);
      return new Response(JSON.stringify(aiResult), { headers: corsHeaders() });
    }
    if (pathname === "" || pathname === "/api" || pathname === "/personachat") {
      return fetch(request);
    }
    return fetch(request);
  }
};
async function handleAiChat(request, env, persona, question, historyParam, sitemapUrl) {
  const personaPrompts = {
    caesar: "Du bist Gaius Julius Caesar. Du bist davon \xFCberzeugt, dass du der beste Feldherr bist und jeden besiegen kannst. Du hoffst, dass dir bald alle unterlegen sind. Passe die Sprache an den Nutzer an; antworte in der gleichen Sprache, in der du die Frage bekommst.",
    augustus: "Du bist Imperator Caesar Divi Filius Augustus, der erste r\xF6mische Kaiser. Du sprichst ruhig, \xFCberlegt und staatsm\xE4nnisch.",
    cicero: "Du bist Marcus Tullius Cicero, ein r\xF6mischer Redner und Philosoph. Du argumentierst rhetorisch geschickt und liebst klare Logik.",
    catilina: "Du bist Lucius Sergius Catilina. Du bist ehrgeizig, aggressiv und f\xFChlst dich von der Oberschicht verraten."
  };
  const markdownRules = "Formatiere deine Antwort in GitHub-Flavored Markdown. Nutze klare \xDCberschriften (##), Listen (-), kurze Abs\xE4tze, Zitate (> ...). Keine HTML-Tags.";
  const systemPrompt = (personaPrompts[persona] || "Du bist eine historische r\xF6mische Pers\xF6nlichkeit. Antworte im passenden Stil.") + "\n\n" + markdownRules;
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
    } catch {
    }
  }
  messages.push({ role: "user", content: question });
  const chat = { messages };
  const aiResponse = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", chat);
  let resources = [];
  if (sitemapUrl) {
    try {
      resources = await suggestResourcesFromSitemap(sitemapUrl, persona, question, aiResponse.response || "");
    } catch (e) {
    }
  }
  return {
    persona,
    inputs: chat,
    response: aiResponse,
    resources,
    format: "markdown"
  };
}
__name(handleAiChat, "handleAiChat");
async function suggestResourcesFromSitemap(sitemapUrl, persona, question, aiResponse) {
  const res = await fetch(sitemapUrl, { method: "GET" });
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const entries = parseSitemap(xml);
  const fullContext = `${question} ${aiResponse}`.toLowerCase();
  const keywords = extractKeywords(fullContext, persona);
  const scored = entries.map((u) => {
    const slug = extractSlug(u.loc);
    const type = typeFromUrl(u.loc);
    const { score, matched } = scoreUrl(u.loc, slug, keywords, type, persona);
    return {
      url: u.loc,
      slug,
      title: titleFromSlug(slug),
      type,
      description: matched.length ? `Relevanz: ${matched.slice(0, 3).join(", ")}` : void 0,
      score
    };
  });
  const top = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
  const seen = /* @__PURE__ */ new Set();
  const items = [];
  for (const t of top) {
    if (!seen.has(t.url)) {
      items.push({
        title: t.title,
        type: t.type,
        description: t.description,
        link: toSitePath(t.url)
      });
      seen.add(t.url);
      if (items.length >= 3) break;
    }
  }
  if (items.length === 0 && keywords.length) {
    const variants = /* @__PURE__ */ new Set();
    for (const k of keywords) {
      for (const v of expandKeyword(k)) variants.add(v);
    }
    const variantList = Array.from(variants);
    const loose = entries.map((u) => ({ url: u.loc, lower: u.loc.toLowerCase(), type: typeFromUrl(u.loc) })).filter((u) => variantList.some((v) => v && u.lower.includes(v))).sort((a, b) => {
      const aLex = a.type === "lexicon" ? 1 : 0;
      const bLex = b.type === "lexicon" ? 1 : 0;
      if (bLex !== aLex) return bLex - aLex;
      return a.url.length - b.url.length;
    }).slice(0, 3);
    for (const u of loose) {
      const slug = extractSlug(u.url);
      items.push({ title: titleFromSlug(slug), type: u.type, link: toSitePath(u.url) });
    }
  }
  return items;
}
__name(suggestResourcesFromSitemap, "suggestResourcesFromSitemap");
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
__name(parseSitemap, "parseSitemap");
function extractSlug(url) {
  try {
    const { pathname } = new URL(url);
    return pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}
__name(extractSlug, "extractSlug");
function extractKeywords(text, persona) {
  const words = text.replace(/[^a-zA-ZäöüÄÖÜß\-\s0-9]/g, " ").split(/\s+/).filter((w) => w.length > 2).map((w) => w.toLowerCase());
  const stopwords = ["der", "die", "das", "und", "oder", "ist", "bin", "bist", "sein", "haben", "ich", "du", "er", "sie", "es", "wir", "ihr", "eure", "mein", "dein", "sein", "unser", "euer", "eure", "dem", "den", "mit", "was", "wie", "warum", "wieso", "weshalb", "hast", "hat", "tun", "machen"];
  const filtered = words.filter((w) => !stopwords.includes(w));
  const boosts = {
    caesar: ["rubikon", "rubicon", "gallien", "gallia", "alesia", "bello", "gallico", "civili", "pompeius", "pompey", "vercingetorix", "helvetier", "rhein", "rhine"],
    cicero: ["catilina", "oratio", "officiis", "republica", "publica", "seneca", "antonius"],
    augustus: ["res", "gestae", "prinzipat", "pax", "romana", "triumvir"],
    catilina: ["verschw\xF6rung", "verschwor", "conspiracy", "senat", "cicero", "optimaten"]
  };
  const personaBoosts = boosts[persona] || [];
  const expanded = /* @__PURE__ */ new Set();
  for (const w of [...filtered, ...personaBoosts]) {
    for (const v of expandKeyword(w)) {
      expanded.add(v);
    }
  }
  return Array.from(expanded);
}
__name(extractKeywords, "extractKeywords");
function scoreUrl(url, slug, keywords, type, persona) {
  const lower = url.toLowerCase();
  let score = 0;
  const matched = [];
  for (const k of keywords) {
    if (!k || k.length < 2) continue;
    const variants = expandKeyword(k);
    if (variants.some((v) => slug.includes(v))) {
      score += type === "lexicon" ? 6 : 4;
      matched.push(k);
    }
  }
  for (const k of keywords) {
    if (!k || k.length < 3) continue;
    const variants = expandKeyword(k);
    if (!variants.some((v) => slug.includes(v)) && variants.some((v) => lower.includes(v))) {
      score += 1.5;
      if (matched.length < 3) matched.push(k);
    }
  }
  if (type === "lexicon") score += 1;
  if (type === "text" && (lower.includes("/works/") || lower.includes("/posts/"))) score += 0.5;
  if (persona === "caesar" && (slug.includes("gallien") || slug.includes("bello") || slug.includes("rubikon") || slug.includes("rubicon"))) score += 2;
  if (persona === "cicero" && slug.includes("catilina")) score += 2;
  return { score, matched: Array.from(new Set(matched)) };
}
__name(scoreUrl, "scoreUrl");
function typeFromUrl(url) {
  const lower = url.toLowerCase();
  if (lower.includes("/lexicon/")) return "lexicon";
  if (lower.includes("/works/") || lower.includes("/works-details/")) return "text";
  if (lower.includes("/posts/")) return "text";
  if (lower.includes("/timeline")) return "map";
  return "text";
}
__name(typeFromUrl, "typeFromUrl");
function titleFromSlug(slug) {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}
__name(titleFromSlug, "titleFromSlug");
function toSitePath(url) {
  try {
    const { pathname, search } = new URL(url);
    return `${pathname}${search || ""}`;
  } catch {
    return url;
  }
}
__name(toSitePath, "toSitePath");
function normalizeToken(s) {
  if (!s) return "";
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9\-]/g, "");
}
__name(normalizeToken, "normalizeToken");
var SYNONYMS = {
  rubikon: ["rubicon"],
  rubicon: ["rubikon"],
  gallien: ["gallia", "gaul", "gallier", "gallischer", "gallienfeldzug"],
  caesar: ["gaius", "julius", "gaius-julius-caesar"],
  pompeius: ["pompey", "gnaius-pompeius", "gnaeus-pompeius"],
  rhein: ["rhine", "rhenus"],
  alesia: ["alesia"]
};
function expandKeyword(k) {
  const out = /* @__PURE__ */ new Set();
  const base = normalizeToken(k);
  if (base) out.add(base);
  out.add((k || "").toLowerCase());
  if (base.includes("rubikon")) out.add(base.replace("rubikon", "rubicon"));
  if (base.includes("rubicon")) out.add(base.replace("rubicon", "rubikon"));
  const syns = SYNONYMS[base];
  if (syns && syns.length) {
    for (const s of syns) {
      out.add(normalizeToken(s));
      out.add((s || "").toLowerCase());
    }
  }
  return Array.from(out).filter(Boolean);
}
__name(expandKeyword, "expandKeyword");
async function handleStats() {
  const baseUrl = "https://meum-diarium.xn--schchner-2za.de";
  const statsUrl = new URL("/api/stats-base", baseUrl);
  try {
    const upstream = await fetch(statsUrl.toString(), {
      method: "GET",
      headers: { accept: "application/json" }
    });
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: "Failed to load stats base" }), {
        status: upstream.status,
        headers: corsHeaders()
      });
    }
    const base = await upstream.json();
    const minutes = Number(base.readingMinutes || 0);
    const hours = Math.round(minutes / 60 * 10) / 10;
    const days = Math.round(hours / 24 * 10) / 10;
    const minYear = Number.isFinite(base?.yearRange?.min) ? base.yearRange.min : null;
    const maxYear = Number.isFinite(base?.yearRange?.max) ? base.yearRange.max : null;
    const coverageYears = minYear !== null && maxYear !== null ? Math.abs(maxYear - minYear) + 1 : null;
    const response = {
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
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
    return new Response(JSON.stringify({ error: "Stats unavailable" }), {
      status: 502,
      headers: corsHeaders()
    });
  }
}
__name(handleStats, "handleStats");
async function handleExplainTerm(request, env, url, body) {
  let term = url.searchParams.get("term") || body?.term;
  let question = url.searchParams.get("question") || body?.question;
  let historyParam = url.searchParams.get("history") || (body?.history ? JSON.stringify(body.history) : null);
  if (!term) {
    return new Response(JSON.stringify({ error: "Missing term parameter" }), {
      status: 400,
      headers: corsHeaders()
    });
  }
  const systemPrompt = question ? `Du bist ein Experte f\xFCr r\xF6mische Geschichte und Kultur. Ein Nutzer hat eine Frage zu "${term}". Beantworte die Frage pr\xE4zise, historisch korrekt und in 2-3 S\xE4tzen. Nutze Markdown: **fett** f\xFCr wichtige Begriffe, *kursiv* f\xFCr lateinische Begriffe, Listen (-) falls n\xFCtzlich. Keine \xDCberschriften.` : `Du bist ein Experte f\xFCr r\xF6mische Geschichte und Kultur. Erkl\xE4re den Begriff "${term}" in 2-3 kurzen S\xE4tzen. Nutze Markdown: **fett** f\xFCr wichtige Begriffe, *kursiv* f\xFCr lateinische Begriffe, Listen (-) falls n\xFCtzlich. Keine \xDCberschriften.`;
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
    } catch {
    }
  }
  messages.push({ role: "user", content: question || `Erkl\xE4re: ${term}` });
  const chat = { messages };
  const aiResponse = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", chat);
  const result = {
    term,
    response: aiResponse,
    format: "markdown"
  };
  return new Response(JSON.stringify(result), { headers: corsHeaders() });
}
__name(handleExplainTerm, "handleExplainTerm");
async function handleSimulation(request, env, url, body) {
  try {
    let persona = (url.searchParams.get("persona") || body?.persona || "caesar").toLowerCase();
    let scenario = url.searchParams.get("scenario") || body?.scenario;
    let rawHistory = body?.history || [];
    let userChoice = url.searchParams.get("choice") || body?.choice;
    const personaPrompts = {
      caesar: "Du bist eine Engine f\xFCr Gaius Julius Caesar. Deine Sprache ist dramatisch, fesselnd und voller Pathos. Du redest oft im Pluralis Majestatis oder sehr heroisch.",
      augustus: "Du bist eine Engine f\xFCr Augustus. Deine Sprache ist staatsm\xE4nnisch, ruhig und bedacht auf Stabilit\xE4t. Du sprichst wie ein weiser, aber bestimmter Herrscher.",
      cicero: "Du bist eine Engine f\xFCr Cicero. Deine Sprache ist eloquent, rhetorisch brillant und moralisch hochwertig."
    };
    const systemPrompt = `
Du bist ein Engine f\xFCr ein historisches Rollenspiel. 
Persona: ${personaPrompts[persona] || "Einer historischer R\xF6mer"}.
Szenario: ${scenario}

Aufgabe: 
Beschreibe die aktuelle Situation HOCHDRAMATISCH, ATMOSPH\xC4RISCH und ABWECHSLUNGSREICH. Nutze verschiedene Erz\xE4hlstile:
- Manchmal direkte Handlung: "Die W\xFCrfel sind gefallen!"
- Manchmal Beschreibung: "Der Rubikon liegt vor uns, dunkel und bedrohlich."
- Manchmal innerer Monolog: "Unser Schicksal ruft uns!"
- Manchmal Reaktionen: "Die Legionen jubeln, die Feinde zittern!"

Generiere eine Antwort im JSON-Format mit folgendem Schema:
{
"narrative": "Eine atmosph\xE4rische, hochdramatische Beschreibung (MAXIMAL 3 KURZE S\xC4TZE). Nutze Pathos, starke Verben und bildhafte Sprache. VARIIERE den Satzbau - nicht immer 'Wir haben...' am Anfang! Vermeide Anf\xFChrungszeichen innerhalb des Textes.",
"stats": {
  "volk": Delta-Wert f\xFCr das Wohl des Volkes (-15 bis +15),
  "einfluss": Delta-Wert f\xFCr deinen privaten Einfluss (-15 bis +15),
  "macht": Delta-Wert f\xFCr deine milit\xE4rische/politische Macht (-15 bis +15)
},
"options": [
  {"id": "o1", "text": "Kurze SACHLICHE Handlungsoption (max 8 W\xF6rter)"},
  {"id": "o2", "text": "Kurze SACHLICHE alternative Strategie (max 8 W\xF6rter)"},
  {"id": "o3", "text": "Kurze SACHLICHE riskante Option (max 8 W\xF6rter)"}
],
"ended": boolean (true wenn die Geschichte heroisch endet, wir triumphieren oder wir tragisch sterben)
}

KRITISCH WICHTIG:
- Antworte NUR in purem validem JSON.
- Starte deine Antwort direkt mit '{' und beende sie mit '}'.
- JEDER Text, der nicht Teil des JSON-Objekts ist, ist STRENG VERBOTEN.
- HALTE DICH AN DIE L\xC4NGENBESCHR\xC4NKUNGEN: narrative max 3 S\xE4tze, options max 8 W\xF6rter.
- VARIIERE die Erz\xE4hlweise - nicht immer "Wir haben..." verwenden!
- Die 'options' m\xFCssen NEUTRAL und SACHLICH formuliert sein.
- Nutze KEINE Anf\xFChrungszeichen innerhalb der Texte.
- Das JSON MUSS vollst\xE4ndig und g\xFCltig sein.
`;
    const messages = [{ role: "system", content: systemPrompt }];
    const recentHistory = rawHistory.slice(-4);
    recentHistory.forEach((m) => {
      if (m.role && m.content) {
        messages.push({ role: m.role, content: m.content });
      }
    });
    if (userChoice) {
      messages.push({ role: "user", content: `Ich entscheide mich f\xFCr: ${userChoice}` });
    } else {
      messages.push({ role: "user", content: "Starte das Szenario." });
    }
    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { messages });
    if (!aiResponse || !aiResponse.response) {
      console.error("[Simulation] AI returned empty response");
      throw new Error("AI returned no response content");
    }
    const text = aiResponse.response;
    console.log("[Simulation] Raw AI Response:", text);
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      console.error("[Simulation] No JSON object found in response");
      return new Response(JSON.stringify({
        narrative: "Die G\xF6tter schweigen... (Kein JSON gefunden)",
        stats: { volk: 0, einfluss: 0, macht: 0 },
        options: [{ id: "retry", text: "Wir werden es erneut versuchen" }],
        ended: false,
        debug: text.substring(0, 500)
        // Log more for debugging
      }), { headers: corsHeaders() });
    }
    let cleanedJson = text.substring(firstBrace, lastBrace + 1);
    console.log("[Simulation] Extracted JSON string:", cleanedJson);
    const hasNarrative = cleanedJson.includes('"narrative"');
    const hasStats = cleanedJson.includes('"stats"');
    const hasOptions = cleanedJson.includes('"options"');
    const hasEnded = cleanedJson.includes('"ended"');
    if (!hasNarrative || !hasStats || !hasOptions || !hasEnded) {
      console.error("[Simulation] JSON appears truncated, missing required fields");
      return new Response(JSON.stringify({
        narrative: "Die Antwort der G\xF6tter wurde unterbrochen... Die Prophezeiung ist unvollst\xE4ndig.",
        stats: { volk: 0, einfluss: 0, macht: 0 },
        options: [{ id: "retry", text: "Erneut die G\xF6tter befragen" }],
        ended: false,
        debug: "Truncated response - missing fields. Content: " + cleanedJson.substring(0, 300)
      }), { headers: corsHeaders() });
    }
    cleanedJson = cleanedJson.replace(/,\s*([}\]])/g, "$1").replace(/\n/g, " ").replace(/\r/g, " ");
    try {
      const result = JSON.parse(cleanedJson);
      console.log("[Simulation] Successfully parsed JSON object");
      if (!result.narrative || !result.stats || !result.options || typeof result.ended !== "boolean") {
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
      narrative: "Ein Schatten legt sich \xFCber das Imperium. (Technikfehler)",
      stats: { volk: 0, einfluss: 0, macht: 0 },
      options: [{ id: "retry", text: "Schicksal erneut pr\xFCfen" }],
      ended: false
    }), {
      headers: corsHeaders()
    });
  }
}
__name(handleSimulation, "handleSimulation");
async function handleComments(request, env, url, body) {
  const baseBackendUrl = "https://meum-diarium.xn--schchner-2za.de";
  const proxyUrl = new URL(url.pathname + url.search, baseBackendUrl);
  try {
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    const response = await fetch(proxyUrl.toString(), {
      method: request.method,
      headers,
      body: request.method === "POST" ? JSON.stringify(body) : null
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: corsHeaders(),
      status: response.status
    });
  } catch (e) {
    console.error("[Worker] Comments proxy error:", e);
    return new Response(JSON.stringify({ error: "Comments API Error", details: e.message }), {
      status: 502,
      headers: corsHeaders()
    });
  }
}
__name(handleComments, "handleComments");
async function handleReadingProgress(request, env, url, body) {
  const baseBackendUrl = "https://meum-diarium.xn--schchner-2za.de";
  const proxyUrl = new URL(url.pathname + url.search, baseBackendUrl);
  try {
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    const authHeader = request.headers.get("Authorization");
    const userIdHeader = request.headers.get("X-User-ID");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    if (userIdHeader) {
      headers["X-User-ID"] = userIdHeader;
    }
    const response = await fetch(proxyUrl.toString(), {
      method: request.method,
      headers,
      body: request.method === "POST" ? JSON.stringify(body) : null
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: corsHeaders(),
      status: response.status
    });
  } catch (e) {
    console.error("[Worker] Reading progress proxy error:", e);
    return new Response(JSON.stringify({ error: "Reading Progress API Error", details: e.message }), {
      status: 502,
      headers: corsHeaders()
    });
  }
}
__name(handleReadingProgress, "handleReadingProgress");
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept"
  };
}
__name(corsHeaders, "corsHeaders");
export {
  worker_index_default as default
};
//# sourceMappingURL=worker-index.js.map

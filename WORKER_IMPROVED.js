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
    const pathname = url.pathname;

    // Route: /explain?term=... for term summaries
    if (pathname === '/explain' || pathname.endsWith('/explain')) {
      return handleExplainTerm(request, env, url);
    }

    // Default route: persona chat
    let persona = (url.searchParams.get("persona") || "caesar").toLowerCase();
    let question = url.searchParams.get("ask");
    let historyParam = url.searchParams.get("history");
    let sitemapUrl = url.searchParams.get("sitemap");

    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (typeof body.persona === "string") persona = body.persona.toLowerCase();
        if (typeof body.ask === "string") question = body.ask;
        if (body.history) historyParam = JSON.stringify(body.history);
        if (typeof body.sitemap === "string") sitemapUrl = body.sitemap;
      } catch {}
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
      } catch {}
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

    return new Response(JSON.stringify(result), { headers: corsHeaders() });
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
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
async function handleExplainTerm(request, env, url) {
  let term = url.searchParams.get('term');
  let question = url.searchParams.get('question');
  let historyParam = url.searchParams.get('history');

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      if (body.term) term = body.term;
      if (body.question) question = body.question;
      if (body.history) historyParam = JSON.stringify(body.history);
    } catch {}
  }

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
    } catch {}
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

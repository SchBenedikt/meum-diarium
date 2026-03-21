interface RequestBody {
  persona?: string;
  ask?: string;
  history?: unknown;
  sitemap?: unknown;
  [key: string]: unknown;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

const jsonHeaders = {
  'content-type': 'application/json',
  ...corsHeaders,
};

const allowedPersonas = new Set(['caesar', 'cicero', 'augustus', 'seneca', 'catilina']);

function normalizeHistory(input: unknown): Array<{ role: string; content: string }> {
  if (!Array.isArray(input)) return [];
  return input
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => {
      const item = entry as Record<string, unknown>;
      return { role: String(item.role || ''), content: String(item.content || '') };
    })
    .filter((entry) => ['user', 'assistant', 'system'].includes(entry.role) && entry.content.trim().length > 0)
    .slice(0, 20)
    .map((entry) => ({ role: entry.role, content: entry.content.slice(0, 2000) }));
}

export const onRequest = async ({ request }: { request: Request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!['GET', 'POST'].includes(request.method)) {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const url = new URL(request.url);
  const target = new URL('https://caesar.schaechner.workers.dev/');
  let body: RequestBody | null = null;

  if (request.method === 'POST') {
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }
  }

  const personaRaw = (url.searchParams.get('persona') ?? body?.persona ?? 'caesar').toString().toLowerCase();
  if (!allowedPersonas.has(personaRaw)) {
    return new Response(JSON.stringify({ error: 'Invalid persona' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const askRaw = (url.searchParams.get('ask') ?? body?.ask ?? '').toString().trim();
  if (!askRaw) {
    return new Response(JSON.stringify({ error: 'Missing ask parameter' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
  if (askRaw.length > 800) {
    return new Response(JSON.stringify({ error: 'ask is too long (max 800 chars)' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const historyInput = url.searchParams.get('history')
    ? (() => {
        try {
          return JSON.parse(url.searchParams.get('history') || '[]');
        } catch {
          return [];
        }
      })()
    : body?.history;
  const history = normalizeHistory(historyInput);

  const sitemapRaw = (url.searchParams.get('sitemap') ?? body?.sitemap ?? '').toString().trim();
  let sitemap: string | null = null;
  if (sitemapRaw) {
    try {
      const parsed = new URL(sitemapRaw);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }
      sitemap = parsed.toString();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid sitemap URL' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }
  }

  target.searchParams.set('persona', personaRaw);
  target.searchParams.set('ask', askRaw);
  if (history.length) target.searchParams.set('history', JSON.stringify(history));
  if (sitemap) target.searchParams.set('sitemap', sitemap);

  try {
    const upstream = await fetch(target.toString(), {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
        ...corsHeaders,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upstream request failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: jsonHeaders,
    });
  }
};

interface ExplainRequestBody {
  term?: unknown;
  question?: unknown;
  history?: unknown;
}

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
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  };
  const jsonHeaders = {
    'content-type': 'application/json',
    ...corsHeaders,
  };

  // CORS preflight
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
  // Target Worker endpoint for explaining terms
  const target = new URL('https://caesar.schaechner.workers.dev/explain');
  let body: ExplainRequestBody | null = null;

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

  const term = (url.searchParams.get('term') ?? body?.term ?? '').toString().trim();
  if (!term) {
    return new Response(JSON.stringify({ error: 'Missing term parameter' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
  if (term.length > 120) {
    return new Response(JSON.stringify({ error: 'term is too long (max 120 chars)' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const question = (url.searchParams.get('question') ?? body?.question ?? '').toString().trim();
  if (question.length > 500) {
    return new Response(JSON.stringify({ error: 'question is too long (max 500 chars)' }), {
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

  // Forward expected params: term, question, history
  target.searchParams.set('term', term);
  if (question) target.searchParams.set('question', question);
  if (history.length) target.searchParams.set('history', JSON.stringify(history));

  try {
    const upstream = await fetch(target.toString(), {
      method: 'GET',
      headers: { accept: 'application/json' }
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

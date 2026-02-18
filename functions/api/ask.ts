interface RequestBody {
  persona?: string;
  ask?: string;
  history?: unknown;
  sitemap?: unknown;
  [key: string]: unknown;
}

export const onRequest = async ({ request }: { request: Request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      }
    });
  }

  if (!['GET', 'POST'].includes(request.method)) {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' }
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
        headers: { 'content-type': 'application/json' }
      });
    }
  }

  // Forward all expected params from query or body
  ['persona', 'ask', 'history', 'sitemap'].forEach((key) => {
    const v = url.searchParams.get(key) ?? body?.[key];
    if (v != null) target.searchParams.set(key, typeof v === 'string' ? v : JSON.stringify(v));
  });

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
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upstream request failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

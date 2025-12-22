export const onRequest = async ({ request }: { request: Request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      }
    });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const target = new URL('https://caesar.schaechner.workers.dev/');
  // Forward all expected params
  ['persona', 'ask', 'history', 'sitemap'].forEach((key) => {
    const v = url.searchParams.get(key);
    if (v != null) target.searchParams.set(key, v);
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
  } catch (err: any) {
    const message = err?.message || 'Upstream request failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

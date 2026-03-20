interface SimulationRequestBody {
  persona?: unknown;
  scenario?: unknown;
  choice?: unknown;
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  };
  const jsonHeaders = {
    'content-type': 'application/json',
    ...corsHeaders,
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  let payload: SimulationRequestBody | null = null;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const allowedPersonas = new Set(['caesar', 'cicero', 'augustus', 'seneca', 'catilina']);
  const persona = String(payload?.persona || '').toLowerCase().trim();
  const scenario = String(payload?.scenario || '').trim();
  const choice = payload?.choice != null ? String(payload.choice).trim() : '';

  if (!allowedPersonas.has(persona)) {
    return new Response(JSON.stringify({ error: 'Invalid persona' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (!scenario) {
    return new Response(JSON.stringify({ error: 'Missing scenario' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (scenario.length > 500) {
    return new Response(JSON.stringify({ error: 'scenario is too long (max 500 chars)' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (choice.length > 300) {
    return new Response(JSON.stringify({ error: 'choice is too long (max 300 chars)' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const history = normalizeHistory(payload?.history);

  payload = {
    persona,
    scenario,
    ...(choice ? { choice } : {}),
    ...(history.length ? { history } : {}),
  };

  const target = new URL('https://caesar.schaechner.workers.dev/simulate');

  try {
    const upstream = await fetch(target.toString(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify(payload)
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

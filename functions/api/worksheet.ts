interface WorksheetTaskConfig {
  type?: unknown;
  difficulty?: unknown;
  amount?: unknown;
}

interface WorksheetRequestBody {
  topic?: unknown;
  includeIntro?: unknown;
  teacherNote?: unknown;
  tasks?: unknown;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

const jsonHeaders = {
  'content-type': 'application/json',
  ...corsHeaders,
};

function normalizeTasks(input: unknown): Array<{ type: string; difficulty: 1 | 2 | 3; amount: 1 | 2 | 3 }> {
  if (!Array.isArray(input)) return [];

  return input
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => {
      const item = entry as WorksheetTaskConfig;
      const type = String(item.type || 'readingComprehension');
      const difficultyRaw = Number(item.difficulty || 2);
      const amountRaw = Number(item.amount || 1);
      const difficulty: 1 | 2 | 3 = difficultyRaw === 1 || difficultyRaw === 2 || difficultyRaw === 3 ? difficultyRaw : 2;
      const amount: 1 | 2 | 3 = amountRaw === 1 || amountRaw === 2 || amountRaw === 3 ? amountRaw : 1;
      return { type, difficulty, amount };
    });
}

export const onRequest = async ({ request }: { request: Request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  let body: WorksheetRequestBody | null = null;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const topic = String(body?.topic || '').trim();
  const includeIntro = Boolean(body?.includeIntro);
  const teacherNote = String(body?.teacherNote || '').trim();
  const tasks = normalizeTasks(body?.tasks);

  if (!topic) {
    return new Response(JSON.stringify({ error: 'Missing topic' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (!tasks.length) {
    return new Response(JSON.stringify({ error: 'Missing tasks config' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const payload = {
    topic,
    includeIntro,
    teacherNote,
    tasks,
  };

  const target = new URL('https://caesar.schaechner.workers.dev/worksheet');

  try {
    const upstream = await fetch(target.toString(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseBody = await upstream.text();
    return new Response(responseBody, {
      status: upstream.status,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
        ...corsHeaders,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upstream request failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: jsonHeaders,
    });
  }
};

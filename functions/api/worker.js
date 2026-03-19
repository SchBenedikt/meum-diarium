export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route to appropriate handler
      if (path.startsWith('/api/authors')) {
        return handleAuthors(request, env, corsHeaders);
      } else if (path.startsWith('/api/posts')) {
        return handlePosts(request, env, corsHeaders);
      } else if (path.startsWith('/api/lexicon')) {
        return handleLexicon(request, env, corsHeaders);
      } else {
        return new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

async function handleAuthors(request, env, corsHeaders) {
  try {
    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 503,
        headers: corsHeaders
      });
    }

    const method = request.method;
    if (method === 'GET') {
      const stmt = db.prepare('SELECT * FROM authors');
      const results = await stmt.all();
      return new Response(JSON.stringify(results.results || []), {
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Authors handler error:', error);
    return new Response(JSON.stringify({ error: 'Database error', message: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function handlePosts(request, env, corsHeaders) {
  try {
    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 503,
        headers: corsHeaders
      });
    }

    const method = request.method;
    if (method === 'GET') {
      const stmt = db.prepare('SELECT * FROM posts ORDER BY date DESC');
      const results = await stmt.all();
      return new Response(JSON.stringify(results.results || []), {
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Posts handler error:', error);
    return new Response(JSON.stringify({ error: 'Database error', message: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function handleLexicon(request, env, corsHeaders) {
  try {
    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 503,
        headers: corsHeaders
      });
    }

    const method = request.method;
    if (method === 'GET') {
      const stmt = db.prepare('SELECT * FROM lexicon');
      const results = await stmt.all();
      return new Response(JSON.stringify(results.results || []), {
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Lexicon handler error:', error);
    return new Response(JSON.stringify({ error: 'Database error', message: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

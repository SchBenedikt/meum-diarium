export async function onRequest(context) {
  const { request, next, env } = context;
  
  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Get the original response
  const response = await next();

  // Create new headers with CORS and proper MIME types
  const newHeaders = new Headers(response.headers);
  
  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  // Fix MIME types for static assets
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if (pathname.endsWith('.js')) {
    newHeaders.set('Content-Type', 'application/javascript');
  } else if (pathname.endsWith('.css')) {
    newHeaders.set('Content-Type', 'text/css');
  } else if (pathname.endsWith('.json')) {
    newHeaders.set('Content-Type', 'application/json');
  } else if (pathname.endsWith('.woff2')) {
    newHeaders.set('Content-Type', 'font/woff2');
  } else if (pathname === '/manifest.json') {
    newHeaders.set('Content-Type', 'application/json');
    // Ensure manifest is accessible without authentication
    newHeaders.delete('WWW-Authenticate');
  }

  // Handle Cloudflare Access bypass for static assets
  if (pathname.startsWith('/assets/') || pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.json')) {
    newHeaders.delete('WWW-Authenticate');
  }

  // Create new response with updated headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });

  return newResponse;
}

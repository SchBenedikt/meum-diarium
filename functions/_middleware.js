export async function onRequest(context) {
  const { request, next, env } = context;
  
  // Block Cloudflare Insights requests completely
  const url = new URL(request.url);
  if (url.hostname.includes('cloudflareinsights.com') || 
      url.pathname.includes('/cdn-cgi/rum') ||
      url.hostname.includes('cloudflare.com')) {
    return new Response(null, { status: 204 });
  }
  
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

  const pathname = url.pathname;
  
  // Completely bypass Cloudflare Access for static assets
  if (pathname.startsWith('/assets/') || 
      pathname.endsWith('.js') || 
      pathname.endsWith('.css') || 
      pathname.endsWith('.json') || 
      pathname.endsWith('.woff2') || 
      pathname.endsWith('.png') || 
      pathname.endsWith('.jpg') || 
      pathname.endsWith('.svg') ||
      pathname === '/manifest.json' ||
      pathname === '/sw.js') {
    
    // Get the original response
    const response = await next();
    
    // Create new headers with CORS and proper MIME types
    const newHeaders = new Headers(response.headers);
    
    // Add CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    // Fix MIME types for static assets
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
    }

    // Remove any authentication headers
    newHeaders.delete('WWW-Authenticate');
    newHeaders.delete('X-Frame-Options');
    
    // Create new response with updated headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // For all other requests, apply CORS and continue normally
  const response = await next();

  // Create new headers with CORS
  const newHeaders = new Headers(response.headers);
  
  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  // Create new response with updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

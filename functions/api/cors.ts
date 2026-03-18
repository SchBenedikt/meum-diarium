// CORS helper functions for Cloudflare Pages Functions

export function setCorsHeaders(response: Response, origin?: string): Response {
  // Allow requests from any origin
  const allowedOrigin = origin || '*';
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
}

export function handleCorsPreflight(request: Request): Response | null {
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    const response = new Response(null, { status: 200 });
    return setCorsHeaders(response, '*');
  }
  return null;
}

export function createCorsResponse(data: any, status: number = 200, origin?: string): Response {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return setCorsHeaders(response, origin);
}

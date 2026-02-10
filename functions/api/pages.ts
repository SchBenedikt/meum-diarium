interface CloudflareContext {
    request: Request;
    env: {
        ASSETS: {
            fetch: (request: Request) => Promise<Response>;
        };
    };
}

export const onRequest = async (context: CloudflareContext) => {
    const url = new URL(context.request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // Handle CORS
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // GET /api/pages/:slug
    if (context.request.method === 'GET' && pathSegments.length === 3 && pathSegments[0] === 'api' && pathSegments[1] === 'pages') {
        const slug = pathSegments[2];
        
        try {
            console.log(`📄 [Pages API] GET /api/pages/${slug} - serving from JSON files`);
            
            // Map slugs to actual JSON files
            const slugToFileMap: Record<string, string> = {
                'caesar': 'caesar.json',
                'cicero': 'cicero.json', 
                'augustus': 'augustus.json',
                'catilina': 'catilina.json',
                'seneca': 'seneca.json',
                'about': 'about.json',
                'author-about-caesar': 'caesar.json',
                'author-about-cicero': 'cicero.json',
                'author-about-augustus': 'augustus.json', 
                'author-about-catilina': 'catilina.json',
                'author-about-seneca': 'seneca.json'
            };
            
            const fileName = slugToFileMap[slug];
            if (!fileName) {
                console.log(`⚠️ [Pages API] Unknown slug: ${slug}`);
                return new Response(JSON.stringify({ error: 'Not found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
            
            const assetUrl = new URL(`/api/pages/${fileName}`, url.origin);
            const response = await context.env.ASSETS.fetch(new Request(assetUrl.toString()));

            if (!response.ok) {
                console.log(`⚠️ [Pages API] File not found: ${fileName}`);
                return new Response(JSON.stringify({
                    error: 'Page not found',
                    message: `Static file not found: ${fileName}`
                }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            const data = await response.json();
            console.log(`✅ [Pages API] Served page: ${slug}`);
            
            return new Response(JSON.stringify(data), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'json-files'
                }
            });
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error(`❌ [Pages API] Error:`, errorMessage);
            return new Response(JSON.stringify({ error: 'Internal Error', message: errorMessage }), {
                status: 500,
                headers: corsHeaders
            });
        }
    }

    // Invalid endpoint
    return new Response(JSON.stringify({ 
        error: 'Not found',
        message: 'Invalid API endpoint'
    }), {
        status: 404,
        headers: corsHeaders
    });
};

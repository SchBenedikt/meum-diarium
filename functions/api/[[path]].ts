export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    const pathname = url.pathname.replace(/\/$/, '');

    // If it's the exact /api path, it's the documentation page (SPA).
    // Explicitly fetch index.html to ensure the SPA is returned.
    if (pathname === '/api') {
        const indexUrl = new URL('/index.html', url.origin);
        const response = await context.env.ASSETS.fetch(new Request(indexUrl.toString()));
        const headers = new Headers(response.headers);
        headers.set('content-type', 'text/html; charset=utf-8');
        headers.set('cache-control', 'no-store');
        return new Response(response.body, {
            status: response.status,
            headers
        });
    }

    const path = url.pathname.replace(/^\/api/, '');
    const assetUrl = new URL(`/api${path}.json`, url.origin);

    try {
        const response = await context.env.ASSETS.fetch(new Request(assetUrl.toString(), {
            headers: {
                'Accept': 'application/json'
            }
        }));

        if (!response.ok) {
            return new Response(JSON.stringify({
                error: 'Endpoint not found',
                message: `Static file not found at ${assetUrl.pathname}`,
                status: response.status
            }), {
                status: 404,
                headers: { 'content-type': 'application/json' }
            });
        }

        return new Response(response.body, {
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: 'Internal Error', message: err.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
};

export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    const pathname = url.pathname.replace(/\/$/, '');

    // If it's the exact /api path, it's the documentation page (SPA).
    // Hand it back to the assets origin.
    if (pathname === '/api') {
        return context.env.ASSETS.fetch(context.request);
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

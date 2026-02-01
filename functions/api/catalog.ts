export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    // Fetch from the static asset path
    const assetUrl = new URL('/api/catalog.json', url.origin);

    try {
        const response = await context.env.ASSETS.fetch(new Request(assetUrl.toString(), {
            headers: {
                'Accept': 'application/json'
            }
        }));

        if (!response.ok) {
            return new Response(JSON.stringify({
                error: 'API Error',
                message: `Static file not found at ${assetUrl.pathname}`,
                status: response.status,
                origin: url.origin
            }), {
                status: 500,
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

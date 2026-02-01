export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    const assetUrl = new URL('/api/about.json', url.origin);

    try {
        const response = await context.env.ASSETS.fetch(new Request(assetUrl.toString()));

        if (!response.ok) {
            return new Response(JSON.stringify({
                error: 'API Error',
                message: `Static file not found at ${assetUrl.pathname}`,
                status: response.status
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

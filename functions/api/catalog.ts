export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    const catalogUrl = `${url.origin}/api/catalog.json`;

    try {
        const response = await context.env.ASSETS.fetch(new Request(catalogUrl));
        if (!response.ok) throw new Error('Static catalog file not found');

        return new Response(response.body, {
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: 'API Error', message: err.message, origin: url.origin }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
};

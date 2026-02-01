export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    const path = url.pathname.replace(/^\/api/, '');
    const jsonUrl = `${url.origin}/api${path}.json`;

    try {
        const response = await context.env.ASSETS.fetch(new Request(jsonUrl));
        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Endpoint not found', path: url.pathname }), {
                status: 404,
                headers: { 'content-type': 'application/json' }
            });
        }

        return new Response(response.body, {
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: 'API Error', message: err.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
};

export const onRequest = async (context: any) => {
    const url = new URL(context.request.url);
    const worksUrl = `${url.origin}/api/works.json`;

    try {
        const response = await context.env.ASSETS.fetch(new Request(worksUrl));
        if (!response.ok) throw new Error('Static works file not found');

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

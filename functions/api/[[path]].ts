export const onRequest = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    // Remove /api prefix and append .json
    const path = url.pathname.replace(/^\/api/, '');
    const jsonUrl = `${url.origin}/api${path}.json`;

    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            // Fallback for subpaths like /api/posts/caesar/slug
            return new Response(JSON.stringify({ error: 'Endpoint not found', path: url.pathname }), {
                status: 404,
                headers: { 'content-type': 'application/json' }
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
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

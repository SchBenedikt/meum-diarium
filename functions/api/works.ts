export const onRequest = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const worksUrl = `${url.origin}/api/works.json`;

    try {
        const response = await fetch(worksUrl);
        if (!response.ok) throw new Error('Failed to fetch works data');

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

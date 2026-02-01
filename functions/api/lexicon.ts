export const onRequest = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const dataUrl = `${url.origin}/api/lexicon.json`;

    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error('Failed to fetch lexicon data');

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

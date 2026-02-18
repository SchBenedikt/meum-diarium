interface CloudflareContext {
    request: Request;
    env: {
        ASSETS: {
            fetch: (request: Request) => Promise<Response>;
        };
    };
}

export const onRequest = async (context: CloudflareContext) => {
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
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: 'Internal Error', message: errorMessage }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
};

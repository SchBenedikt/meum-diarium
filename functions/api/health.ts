export const onRequestGet = async (context: any) => {
    try {
        return new Response(JSON.stringify({
            status: 'success',
            message: 'Cloudflare Pages Functions working',
            environment: {
                hasDB: !!context.env?.DB,
                hasVocab: !!context.env?.vocab,
                envKeys: Object.keys(context.env || {})
            },
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Health check error:', error);
        
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Health check failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

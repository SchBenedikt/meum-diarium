export const onRequest = async (context: any) => {
    const envKeys = Object.keys(context.env || {});
    const bindings: Record<string, any> = {};
    
    for (const key of envKeys) {
        bindings[key] = {
            available: !!context.env[key],
            type: typeof context.env[key],
            hasPrepare: !!(context.env[key] && typeof context.env[key].prepare === 'function')
        };
    }
    
    return new Response(JSON.stringify({
        message: 'Debug D1 bindings',
        envKeys,
        bindings,
        timestamp: new Date().toISOString()
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};

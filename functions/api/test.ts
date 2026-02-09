export const onRequestGet = async () => {
    return new Response(JSON.stringify({
        status: 'ok',
        message: 'Simple test function working',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

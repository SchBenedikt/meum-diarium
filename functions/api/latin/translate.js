// Latin Translation endpoint for Cloudflare Pages
export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    try {
        const body = await request.json().catch(() => ({}));
        let sentence = url.searchParams.get('sentence') || body?.sentence;
        let translationType = url.searchParams.get('type') || body?.type || 'literal';

        if (!sentence) {
            return new Response(JSON.stringify({ error: 'Missing sentence parameter' }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
                },
            });
        }

        const systemPrompt = translationType === 'meaningful'
            ? `Du bist ein Experte für lateinische Literatur und Übersetzung. Übersetze den folgenden lateinischen Satz in sinnvolles, fließendes Deutsch. Behalte den Ton und Stil des Originals bei. Gib nur die Übersetzung zurück, ohne zusätzliche Erklärungen.`
            : `Du bist ein Experte für lateinische Grammatik und Übersetzung. Übersetze den folgenden lateinischen Satz so wörtlich wie möglich ins Deutsche, behalte aber die deutsche Satzstruktur bei. Gib nur die Übersetzung zurück, ohne zusätzliche Erklärungen.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: sentence }
        ];

        const chat = { messages };
        const aiResponse = await env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', chat);

        const result = {
            sentence,
            type: translationType,
            translation: aiResponse.response || 'Übersetzung nicht verfügbar',
            format: 'text',
        };

        return new Response(JSON.stringify(result), { 
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
            }
        });
    } catch (e) {
        console.error('Latin translation error:', e);
        return new Response(JSON.stringify({ 
            error: "Translation failed", 
            details: e.message,
            sentence,
            type: translationType || 'literal',
            translation: 'Übersetzung nicht verfügbar'
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
            }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
        }
    });
}

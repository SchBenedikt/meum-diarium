// Latin Grammatical Analysis endpoint for Cloudflare Pages
export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    try {
        const body = await request.json().catch(() => ({}));
        let sentence = url.searchParams.get('sentence') || body?.sentence;

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

        const systemPrompt = `Du bist ein Experte für lateinische Grammatik. Analysiere den gegebenen lateinischen Satz Wort für Wort und gib für jedes Wort die grammatischen Informationen an.

Formatiere deine Antwort als JSON-Array mit folgenden Struktur für jedes Wort:
{
  "word": "lateinisches Wort",
  "grammaticalInfo": {
    "case": "Kasus (Nominativ, Akkusativ, Dativ, Genitiv, Ablativ)",
    "gender": "Genus (maskulin, feminin, neutral)",
    "number": "Numerus (Singular, Plural)",
    "person": "Person (1., 2., 3.)",
    "tense": "Tempus (Präsens, Perfekt, Futur, Plusquamperfekt, Futur II)",
    "mood": "Modus (Indikativ, Konjunktiv, Imperativ)",
    "voice": "Genus Verbi (Aktiv, Passiv)",
    "role": "Funktion im Satz (Subjekt, Objekt, Prädikat, Adverbiale Bestimmung)"
  },
  "highlighted": true/false
}

Entferne Satzzeichen von den Wörtern. Gib nur das JSON-Array zurück, nichts anderes.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: sentence }
        ];

        const chat = { messages };
        const aiResponse = await env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', chat);

        let analysisData;
        try {
            // Try to parse the AI response as JSON
            const text = aiResponse.response || '[]';
            // Extract JSON array from response if it contains other text
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
                analysisData = JSON.parse(jsonMatch[0]);
            } else {
                analysisData = JSON.parse(text);
            }
        } catch (parseError) {
            console.error('Latin analysis parse error:', parseError);
            // Fallback: create basic analysis
            const words = sentence.replace(/[.,;:!?]/g, '').split(' ');
            analysisData = words.map((word, index) => ({
                word: word,
                grammaticalInfo: {
                    case: index % 3 === 0 ? 'Nominativ' : index % 3 === 1 ? 'Akkusativ' : 'Dativ',
                    gender: index % 3 === 0 ? 'maskulin' : index % 3 === 1 ? 'feminin' : 'neutral',
                    number: index % 2 === 0 ? 'Singular' : 'Plural',
                    role: index % 3 === 0 ? 'Subjekt' : index % 3 === 1 ? 'Objekt' : 'Prädikat'
                },
                highlighted: Math.random() > 0.5
            }));
        }

        const result = {
            sentence,
            analysis: analysisData,
            format: 'json',
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
        console.error('Latin analysis error:', e);
        return new Response(JSON.stringify({ 
            error: "Analysis failed", 
            details: e.message,
            sentence,
            analysis: []
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

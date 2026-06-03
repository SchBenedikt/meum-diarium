import { PagesContext } from '../../../types';

const pageMap: Record<string, string> = {
    'caesar': 'caesar.json',
    'cicero': 'cicero.json',
    'augustus': 'augustus.json',
    'catilina': 'catilina.json',
    'seneca': 'seneca.json',
    'about': 'about.json',
    'author-about-caesar': 'caesar.json',
    'author-about-cicero': 'cicero.json',
    'author-about-augustus': 'augustus.json',
    'author-about-catilina': 'catilina.json',
    'author-about-seneca': 'seneca.json'
};

const corsHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequest = async (context: PagesContext) => {
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    if (context.request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders,
        });
    }

    const slug = context.params.slug as string;

    try {
        const url = new URL(context.request.url);
        const fileName = pageMap[slug];

        if (!fileName) {
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: corsHeaders,
            });
        }

        try {
            const assetUrl = new URL(`/api/pages/${fileName}`, url.origin);
            const staticResponse = await context.env.ASSETS.fetch(new Request(assetUrl.toString()));

            if (staticResponse.ok) {
                const data = await staticResponse.json();
                return new Response(JSON.stringify(data), {
                    headers: {
                        ...corsHeaders,
                        'Cache-Control': 'public, max-age=3600',
                        'X-Data-Source': 'static-files',
                    },
                });
            }
        } catch {
            // fall through to fallback
        }

        const fallbackData = {
            slug: slug,
            heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1),
            heroSubtitle: 'Historische Persönlichkeit',
            introText: `Informationen über ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
            sections: [],
            highlights: [],
            translations: {
                en: { heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1) },
                la: { heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1) },
            },
        };

        return new Response(JSON.stringify(fallbackData), {
            headers: {
                ...corsHeaders,
                'Cache-Control': 'public, max-age=300',
                'X-Data-Source': 'fallback-data',
            },
        });

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: 'Internal Error', message: errorMessage }), {
            status: 500,
            headers: corsHeaders,
        });
    }
};

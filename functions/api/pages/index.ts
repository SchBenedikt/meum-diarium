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

    try {
        const entries = Object.entries(pageMap);
        const results = await Promise.all(entries.map(async ([slug, fileName]) => {
            try {
                const url = new URL(context.request.url);
                const assetUrl = new URL(`/api/pages/${fileName}`, url.origin);
                const staticResponse = await context.env.ASSETS.fetch(new Request(assetUrl.toString()));
                if (!staticResponse.ok) {
                    return { slug, title: slug, dataSource: 'fallback' };
                }

                const data = await staticResponse.json();
                const title = data?.heroTitle || data?.title || slug;
                return { slug, title, dataSource: 'static-files' };
            } catch {
                return { slug, title: slug, dataSource: 'fallback' };
            }
        }));

        return new Response(JSON.stringify(results), {
            headers: {
                ...corsHeaders,
                'Cache-Control': 'public, max-age=300',
                'X-Data-Source': 'mixed',
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

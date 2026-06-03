import type { PagesContext } from '../types';

const corsHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequest = async (context: PagesContext): Promise<Response> => {
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const url = new URL(context.request.url);

        const workId = url.searchParams.get('workId');
        const book = url.searchParams.get('book');
        const chapter = url.searchParams.get('chapter');

        if (!workId || !book) {
            return new Response(JSON.stringify({ error: 'Missing workId or book parameter' }), {
                status: 400, headers: corsHeaders
            });
        }

        if (!context.env?.DB) {
            return new Response(JSON.stringify({ error: 'Database not configured' }), {
                status: 503, headers: corsHeaders
            });
        }

        const bookNum = parseInt(book);

        let results;
        if (chapter) {
            const chapterNum = parseInt(chapter);
            const { results: rows } = await context.env.DB.prepare(
                'SELECT * FROM latin_texts WHERE work_id = ? AND book = ? AND chapter = ? ORDER BY chapter, section, verse'
            ).bind(workId, bookNum, chapterNum).all();
            results = rows;
        } else {
            const { results: rows } = await context.env.DB.prepare(
                'SELECT * FROM latin_texts WHERE work_id = ? AND book = ? ORDER BY chapter, section, verse'
            ).bind(workId, bookNum).all();
            results = rows;
        }

        const parsed = results.map((row: any) => ({
            ...row,
            annotations: typeof row.annotations === 'string' ? tryParseJson(row.annotations) : (row.annotations || null),
        }));

        return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=3600' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Internal Error', message: e.message }), {
            status: 500, headers: corsHeaders
        });
    }
};

function tryParseJson(val: string) {
    try { return JSON.parse(val); }
    catch { return val; }
}

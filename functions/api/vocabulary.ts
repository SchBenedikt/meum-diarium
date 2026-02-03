import { getDb } from '../db/client';
import { vocabulary } from '../db/schema';
import { sql, eq } from 'drizzle-orm';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const db = getDb(context.env);
    const url = new URL(context.request.url);
    const type = url.searchParams.get('type');
    const random = url.searchParams.get('random');
    const limit = parseInt(url.searchParams.get('limit') || (random ? random : '50'));

    try {
        const results = await db.query.vocabulary.findMany({
            where: type ? eq(vocabulary.type, type) : undefined,
            orderBy: random ? sql`RANDOM()` : undefined,
            limit: limit
        });

        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Internal Error', message: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

import { getDb } from '../db/client';
import { works } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const db = getDb(context.env);

    const url = new URL(context.request.url);
    const slug = url.searchParams.get('slug');

    try {
        if (slug) {
            const result = await db.query.works.findFirst({
                where: eq(works.id, slug),
                with: {
                    author: true
                }
            });

            if (!result) {
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            return new Response(JSON.stringify(result), {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        const results = await db.query.works.findMany({
            with: {
                author: true
            }
        });

        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Internal Error', message: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }
};

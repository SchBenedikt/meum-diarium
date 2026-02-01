import { getDb } from '../../../src/db/client';
import { lexicon } from '../../../src/db/schema';
import { eq, like, or } from 'drizzle-orm';

export const onRequest = async (context: any) => {
    const db = getDb(context.env);
    const url = new URL(context.request.url);
    const slug = url.searchParams.get('slug');
    const search = url.searchParams.get('search');
    // Default limit to prevent fetching huge lists if table grows
    const limit = parseInt(url.searchParams.get('limit') || '100');

    try {
        if (slug) {
            const result = await db.query.lexicon.findFirst({
                where: eq(lexicon.slug, slug)
            });

            if (!result) {
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify(result), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        let whereClause = undefined;
        if (search) {
            whereClause = or(
                like(lexicon.term, `%${search}%`),
                like(lexicon.definition, `%${search}%`)
            );
        }

        const results = await db.query.lexicon.findMany({
            where: whereClause,
            limit: limit
        });

        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: 'Internal Error', message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

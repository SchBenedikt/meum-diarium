import { getDb } from '../db/client';
import { lexicon } from '../db/schema';
import { eq, like, or } from 'drizzle-orm';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Lexicon API] D1 database not available');
            console.error('   env keys:', context.env ? Object.keys(context.env) : 'no env');
            return new Response(JSON.stringify({ 
                error: 'Database not configured',
                message: 'D1 database binding not found',
                hint: 'Check wrangler.toml and Pages environment settings'
            }), {
                status: 503,
                headers: corsHeaders
            });
        }

        const startTime = Date.now();
        console.log('🔷 [Lexicon API] DB binding found, initializing Drizzle...');
        const db = getDb(context.env);
        const url = new URL(context.request.url);
        const slug = url.searchParams.get('slug');
        const search = url.searchParams.get('search');
        const limit = parseInt(url.searchParams.get('limit') || '100');

        console.log(`🔷 [Lexicon API] Query: ${slug ? `slug=${slug}` : search ? `search=${search}` : 'all entries'}`);

        if (slug) {
            const result = await db.query.lexicon.findFirst({
                where: eq(lexicon.slug, slug)
            });

            const queryTime = Date.now() - startTime;

            if (!result) {
                console.warn(`⚠️ [Lexicon API] Entry not found: ${slug} (${queryTime}ms)`);
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            console.log(`✅ [Lexicon API] D1 query successful: Found entry "${result.term}" (${queryTime}ms)`);

            return new Response(JSON.stringify(result), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'cloudflare-d1'
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

        const queryTime = Date.now() - startTime;
        console.log(`✅ [Lexicon API] D1 query successful: Fetched ${results.length} entries (${queryTime}ms)`);

        // Ensure proper UTF-8 encoding in response with umlauts
        const responseText = JSON.stringify(results);
        
        return new Response(responseText, {
            headers: {
                ...corsHeaders,
                'Cache-Control': 'public, max-age=3600',
                'X-Data-Source': 'cloudflare-d1',
                'X-Entry-Count': results.length.toString()
            }
        });

    } catch (err: any) {
        const queryTime = Date.now() - (context.startTime || Date.now());
        console.error(`❌ [Lexicon API] D1 query failed (${queryTime}ms):`, err.message);
        console.error('   Stack:', err.stack);
        
        return new Response(JSON.stringify({ 
            error: 'Database Error', 
            message: err.message,
            hint: 'Check if database is seeded and migrations are applied'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
};

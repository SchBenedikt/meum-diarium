import { getDb } from '../db/client';
import { authors } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Authors API] D1 database not available');
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
        console.log('🔷 [Authors API] DB binding found, initializing Drizzle...');
        const db = getDb(context.env);
        const url = new URL(context.request.url);
        const id = url.searchParams.get('id');

        console.log(`🔷 [Authors API] Query: ${id ? `id=${id}` : 'all authors'}`);

        if (id) {
            // Fetch single author by ID
            const result = await db.query.authors.findFirst({
                where: eq(authors.id, id)
            });

            const queryTime = Date.now() - startTime;

            if (!result) {
                console.warn(`⚠️ [Authors API] Author not found: ${id} (${queryTime}ms)`);
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            console.log(`✅ [Authors API] D1 query successful: Found author "${result.name}" (${queryTime}ms)`);

            return new Response(JSON.stringify(result), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'cloudflare-d1'
                }
            });
        }

        // Fetch all authors
        const results = await db.query.authors.findMany();

        const queryTime = Date.now() - startTime;
        console.log(`✅ [Authors API] D1 query successful: Fetched ${results.length} authors (${queryTime}ms)`);

        return new Response(JSON.stringify(results), {
            headers: {
                ...corsHeaders,
                'Cache-Control': 'public, max-age=3600',
                'X-Data-Source': 'cloudflare-d1',
                'X-Author-Count': results.length.toString()
            }
        });

    } catch (err: any) {
        const queryTime = Date.now() - (context.startTime || Date.now());
        console.error(`❌ [Authors API] D1 query failed (${queryTime}ms):`, err.message);
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

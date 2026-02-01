import { getDb } from '../../../src/db/client';
import { posts } from '../../../src/db/schema';
import { desc, eq } from 'drizzle-orm';

export const onRequest = async (context: any) => {
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Posts API] D1 database not available in context.env.DB');
            return new Response(JSON.stringify({ 
                error: 'Database not configured',
                message: 'D1 database binding not found'
            }), {
                status: 503,
                headers: corsHeaders
            });
        }

        const startTime = Date.now();
        const db = getDb(context.env);
        const url = new URL(context.request.url);
        const slug = url.searchParams.get('slug');
        const tag = url.searchParams.get('tag');

        console.log(`🔷 [Posts API] Query: ${slug ? `slug=${slug}` : tag ? `tag=${tag}` : 'all posts'}`);

        if (slug) {
            const result = await db.query.posts.findFirst({
                where: eq(posts.slug, slug)
            });

            const queryTime = Date.now() - startTime;
            
            if (!result) {
                console.warn(`⚠️ [Posts API] Post not found: ${slug} (${queryTime}ms)`);
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            console.log(`✅ [Posts API] D1 query successful: Found post "${result.title}" (${queryTime}ms)`);
            
            return new Response(JSON.stringify(result), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'cloudflare-d1'
                }
            });
        }

        // Fetch all posts
        const allPosts = await db.query.posts.findMany({
            orderBy: [desc(posts.date)]
        });

        // Filter by tag if requested (client-side filtering for JSON array)
        let filtered = allPosts;
        if (tag) {
            filtered = allPosts.filter((post: any) => {
                const tags = post.tags;
                return Array.isArray(tags) && tags.includes(tag);
            });
        }

        const queryTime = Date.now() - startTime;
        console.log(`✅ [Posts API] D1 query successful: Fetched ${filtered.length} posts (${queryTime}ms)`);

        return new Response(JSON.stringify(filtered), {
            headers: {
                ...corsHeaders,
                'Cache-Control': 'public, max-age=3600',
                'X-Data-Source': 'cloudflare-d1',
                'X-Post-Count': filtered.length.toString()
            }
        });

    } catch (err: any) {
        const queryTime = Date.now() - (context.startTime || Date.now());
        console.error(`❌ [Posts API] D1 query failed (${queryTime}ms):`, err.message);
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

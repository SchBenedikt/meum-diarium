import { getDb } from '../db/client';
import { posts } from '../db/schema';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Tags API] D1 database not available');
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
        console.log('🔷 [Tags API] DB binding found, initializing Drizzle...');
        const db = getDb(context.env);

        // Fetch all posts to extract tags
        const allPosts = await db.query.posts.findMany();

        // Extract unique tags from all posts
        const tagsSet = new Set<string>();
        allPosts.forEach((post: any) => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach((tag: string) => {
                    if (typeof tag === 'string' && tag.trim().length > 0) {
                        tagsSet.add(tag.trim());
                    }
                });
            }
        });

        const tags = Array.from(tagsSet).sort();
        const queryTime = Date.now() - startTime;
        
        console.log(`✅ [Tags API] D1 query successful: Found ${tags.length} unique tags (${queryTime}ms)`);

        return new Response(JSON.stringify(tags), {
            headers: {
                ...corsHeaders,
                'Cache-Control': 'public, max-age=3600',
                'X-Data-Source': 'cloudflare-d1',
                'X-Tag-Count': tags.length.toString()
            }
        });

    } catch (err: any) {
        const queryTime = Date.now() - (context.startTime || Date.now());
        console.error(`❌ [Tags API] D1 query failed (${queryTime}ms):`, err.message);
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

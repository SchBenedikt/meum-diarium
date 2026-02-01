import { getDb } from '../../../src/db/client';
import { posts } from '../../../src/db/schema';
import { desc, eq } from 'drizzle-orm';

export const onRequest = async (context: any) => {
    const db = getDb(context.env);
    const url = new URL(context.request.url);
    const slug = url.searchParams.get('slug');
    const tag = url.searchParams.get('tag');

    try {
        if (slug) {
            const result = await db.query.posts.findFirst({
                where: eq(posts.slug, slug)
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

        // Fetch all posts
        // Note: We might want to limit fields returned for the list view to reduce size
        // But for now, returning full objects as the frontend expects
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

        return new Response(JSON.stringify(filtered), {
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

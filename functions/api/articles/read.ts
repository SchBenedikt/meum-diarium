import { getDb } from '../../db/client';
import { userReadArticles, posts } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { PagesContext } from '../../types';

// Helper function to verify JWT token (simplified version)
function verifyToken(token: string): string | null {
    try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        return decoded.userId;
    } catch {
        return null;
    }
}

// Get user's read articles
export const onRequestGet = async (context: PagesContext): Promise<Response> => {
    try {
        const { request, env } = context;
        
        // Get token from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const token = authHeader.substring(7);
        const userId = verifyToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const db = getDb(env);

        // Get read articles with post details
        const readArticles = await db
            .select({
                id: userReadArticles.id,
                readAt: userReadArticles.readAt,
                post: {
                    id: posts.id,
                    title: posts.title,
                    excerpt: posts.excerpt,
                    historicalDate: posts.historicalDate,
                    coverImage: posts.coverImage,
                    readingTime: posts.readingTime,
                    tags: posts.tags
                }
            })
            .from(userReadArticles)
            .leftJoin(posts, eq(userReadArticles.postId, posts.id))
            .where(eq(userReadArticles.userId, userId))
            .orderBy(desc(userReadArticles.readAt));

        return new Response(JSON.stringify({
            readArticles: readArticles.map(item => ({
                ...item.post,
                readAt: item.readAt,
                readId: item.id
            }))
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching read articles:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Mark an article as read
export const onRequestPost = async (context: PagesContext): Promise<Response> => {
    try {
        const { request, env } = context;
        
        // Get token from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const token = authHeader.substring(7);
        const userId = verifyToken(token);

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await request.json() as { postId: string };

        if (!body.postId) {
            return new Response(JSON.stringify({ error: 'postId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const db = getDb(env);

        // Check if already marked as read
        const existingRead = await db
            .select()
            .from(userReadArticles)
            .where(and(
                eq(userReadArticles.userId, userId),
                eq(userReadArticles.postId, body.postId)
            ))
            .limit(1);

        if (existingRead.length === 0) {
            // Mark as read
            await db.insert(userReadArticles).values({
                id: `read_${userId}_${body.postId}_${Date.now()}`,
                userId: userId,
                postId: body.postId,
                readAt: new Date().toISOString()
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Artikel als gelesen markiert'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error marking article as read:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

import { getDb } from '../../db/client';
import { userSavedArticles, userReadArticles, posts } from '../../db/schema';
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

// Get user's saved articles
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

        // Get saved articles with post details
        const savedArticles = await db
            .select({
                id: userSavedArticles.id,
                savedAt: userSavedArticles.savedAt,
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
            .from(userSavedArticles)
            .leftJoin(posts, eq(userSavedArticles.postId, posts.id))
            .where(eq(userSavedArticles.userId, userId))
            .orderBy(desc(userSavedArticles.savedAt));

        return new Response(JSON.stringify({
            savedArticles: savedArticles.map(item => ({
                ...item.post,
                savedAt: item.savedAt,
                saveId: item.id
            }))
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching saved articles:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Save or unsave an article
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

        // Check if already saved
        const existingSave = await db
            .select()
            .from(userSavedArticles)
            .where(and(
                eq(userSavedArticles.userId, userId),
                eq(userSavedArticles.postId, body.postId)
            ))
            .limit(1);

        if (existingSave.length > 0) {
            // Unsave the article
            await db
                .delete(userSavedArticles)
                .where(and(
                    eq(userSavedArticles.userId, userId),
                    eq(userSavedArticles.postId, body.postId)
                ));

            return new Response(JSON.stringify({
                success: true,
                action: 'unsaved',
                message: 'Artikel wurde aus den Lesezeichen entfernt'
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            // Save the article
            await db.insert(userSavedArticles).values({
                id: `save_${userId}_${body.postId}_${Date.now()}`,
                userId: userId,
                postId: body.postId,
                savedAt: new Date().toISOString()
            });

            return new Response(JSON.stringify({
                success: true,
                action: 'saved',
                message: 'Artikel wurde zu den Lesezeichen hinzugefügt'
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('Error saving article:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

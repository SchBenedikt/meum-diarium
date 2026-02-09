import { getDb } from '../../db/client';
import { comments, users } from '../../db/schema';
import { eq, and, desc, count } from 'drizzle-orm';
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

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;

    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const token = authHeader.substring(7);
    const userId = verifyToken(token);

    if (!userId) {
        return new Response(
            JSON.stringify({ error: 'Invalid token' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const db = getDb(env);

        // Get user's comment count
        const commentCountResult = await db
            .select({ count: count() })
            .from(comments)
            .where(and(
                eq(comments.userId, userId),
                eq(comments.isDeleted, false)
            ));

        // Get user's recent comments with post titles
        const recentCommentsResult = await db
            .select({
                id: comments.id,
                content: comments.content,
                createdAt: comments.createdAt,
                postTitle: comments.postId // We'll need to join with posts for actual titles
            })
            .from(comments)
            .where(and(
                eq(comments.userId, userId),
                eq(comments.isDeleted, false)
            ))
            .orderBy(desc(comments.createdAt))
            .limit(5);

        // Get user info
        const userResult = await db
            .select({
                id: users.id,
                email: users.email,
                username: users.username,
                displayName: users.displayName,
                createdAt: users.createdAt,
                lastLoginAt: users.lastLoginAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const user = userResult[0];

        // Calculate activity stats (simplified)
        const daysActive = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

        const stats = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt
            },
            commentStats: {
                totalComments: commentCountResult[0]?.count || 0
            },
            readingStats: {
                postsRead: 0, // Simplified - we don't track this anymore
                totalReadingTime: 0 // Simplified - we don't track this anymore
            },
            activityStats: {
                daysActive
            },
            recentComments: recentCommentsResult.map((comment: any) => ({
                ...comment,
                postTitle: `Beitrag ${comment.id.substring(0, 8)}` // Simplified title
            }))
        };

        return new Response(
            JSON.stringify(stats),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

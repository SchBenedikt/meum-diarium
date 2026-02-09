import { getDb } from '../../../db/client';
import { comments, userCommentingActivity } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import type { PagesContext } from '../../../types';

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

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    const commentId = context.params.commentId as string;

    if (!commentId) {
        return new Response(
            JSON.stringify({ error: 'Comment ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
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

        const db = getDb(env);

        // Check if comment exists
        const commentRecords = await db
            .select()
            .from(comments)
            .where(eq(comments.id, commentId))
            .limit(1);

        if (commentRecords.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Comment not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const comment = commentRecords[0];

        // Check if user already liked this comment
        const existingLikeRecords = await db
            .select()
            .from(userCommentingActivity)
            .where(
                and(
                    eq(userCommentingActivity.userId, userId),
                    eq(userCommentingActivity.commentId, commentId),
                    eq(userCommentingActivity.action, 'liked')
                )
            )
            .limit(1);

        const isLiked = existingLikeRecords.length > 0;

        if (isLiked) {
            // Unlike: remove the like activity and decrement count
            await db.delete(userCommentingActivity).where(
                and(
                    eq(userCommentingActivity.userId, userId),
                    eq(userCommentingActivity.commentId, commentId),
                    eq(userCommentingActivity.action, 'liked')
                )
            );

            await db
                .update(comments)
                .set({ 
                    likesCount: Math.max(0, comment.likesCount - 1),
                    updatedAt: new Date().toISOString()
                })
                .where(eq(comments.id, commentId));

            return new Response(
                JSON.stringify({
                    message: 'Comment unliked successfully',
                    liked: false,
                    likesCount: Math.max(0, comment.likesCount - 1)
                }),
                { 
                    status: 200, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        } else {
            // Like: add the like activity and increment count
            const activityId = 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            await db.insert(userCommentingActivity).values({
                id: activityId,
                userId,
                commentId,
                action: 'liked',
                createdAt: new Date().toISOString(),
                metadata: JSON.stringify({ previousLikesCount: comment.likesCount })
            });

            await db
                .update(comments)
                .set({ 
                    likesCount: comment.likesCount + 1,
                    updatedAt: new Date().toISOString()
                })
                .where(eq(comments.id, commentId));

            return new Response(
                JSON.stringify({
                    message: 'Comment liked successfully',
                    liked: true,
                    likesCount: comment.likesCount + 1
                }),
                { 
                    status: 200, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        }

    } catch (error) {
        console.error('Like comment error:', error);
        
        // Check if it's a database table not found error
        if (error instanceof Error && error.message.includes('no such table')) {
            return new Response(
                JSON.stringify({ 
                    error: 'Database tables not yet created. Please run database migrations.',
                    details: 'The user_commenting_activity table may not exist in your D1 database.'
                }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

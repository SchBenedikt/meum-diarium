import { getDb } from '../../db/client';
import { comments, userReadingProgress, userCommentingActivity } from '../../db/schema';
import { eq, desc, sum, count, and } from 'drizzle-orm';
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

        // Get user's reading progress stats
        const readingStats = await db
            .select({
                totalRead: count(),
                totalTime: sum(userReadingProgress.readingTimeSeconds),
                completedCount: count(userReadingProgress.id)
            })
            .from(userReadingProgress)
            .where(eq(userReadingProgress.userId, userId));

        // Get completed count separately
        const completedStats = await db
            .select({
                completedCount: count(userReadingProgress.id)
            })
            .from(userReadingProgress)
            .where(
                and(
                    eq(userReadingProgress.userId, userId),
                    eq(userReadingProgress.isCompleted, true)
                )
            );

        // Get user's comment stats
        const commentStats = await db
            .select({
                totalComments: count(),
                totalLikes: sum(comments.likesCount)
            })
            .from(comments)
            .where(
                and(
                    eq(comments.userId, userId),
                    eq(comments.isDeleted, false)
                )
            );

        // Get recent reading activity
        const recentReading = await db
            .select({
                postId: userReadingProgress.postId,
                startedAt: userReadingProgress.startedAt,
                progressPercentage: userReadingProgress.progressPercentage,
                isCompleted: userReadingProgress.isCompleted
            })
            .from(userReadingProgress)
            .where(eq(userReadingProgress.userId, userId))
            .orderBy(desc(userReadingProgress.startedAt))
            .limit(5);

        // Get recent comments
        const recentComments = await db
            .select({
                id: comments.id,
                postId: comments.postId,
                content: comments.content,
                createdAt: comments.createdAt,
                likesCount: comments.likesCount
            })
            .from(comments)
            .where(
                and(
                    eq(comments.userId, userId),
                    eq(comments.isDeleted, false)
                )
            )
            .orderBy(desc(comments.createdAt))
            .limit(5);

        // Get activity streak (consecutive days with activity)
        const activityDays = await db
            .select({
                createdAt: userCommentingActivity.createdAt
            })
            .from(userCommentingActivity)
            .where(eq(userCommentingActivity.userId, userId))
            .orderBy(desc(userCommentingActivity.createdAt))
            .limit(30); // Last 30 days

        // Calculate streak
        const uniqueDates = [...new Set(
            activityDays.map(activity => 
                new Date(activity.createdAt).toISOString().split('T')[0]
            )
        )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        
        for (let i = 0; i < uniqueDates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];
            
            if (uniqueDates[i] === expectedDateStr || uniqueDates[i] === today) {
                streak++;
            } else {
                break;
            }
        }

        const stats = {
            readingStats: {
                postsRead: readingStats[0]?.totalRead || 0,
                totalTimeSeconds: readingStats[0]?.totalTime || 0,
                completedPosts: completedStats[0]?.completedCount || 0
            },
            commentStats: {
                totalComments: commentStats[0]?.totalComments || 0,
                totalLikes: commentStats[0]?.totalLikes || 0
            },
            activityStreak: streak,
            recentReading,
            recentComments
        };

        return new Response(
            JSON.stringify(stats),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        
        // Check if it's a database table not found error
        if (error instanceof Error && error.message.includes('no such table')) {
            return new Response(
                JSON.stringify({ 
                    error: 'Database tables not yet created. Please run database migrations.',
                    details: 'The user_reading_progress or user_commenting_activity tables may not exist in your D1 database.'
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

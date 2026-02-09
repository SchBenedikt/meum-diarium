import { getDb } from '../../db/client';
import { userReadingProgress } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
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

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
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

        const { postId, readingTimeSeconds = 0, progressPercentage = 0, lastPosition = 0 } = await request.json() as {
            postId: string;
            readingTimeSeconds?: number;
            progressPercentage?: number;
            lastPosition?: number;
        };

        // Validation
        if (!postId) {
            return new Response(
                JSON.stringify({ error: 'Post ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (progressPercentage < 0 || progressPercentage > 100) {
            return new Response(
                JSON.stringify({ error: 'Progress percentage must be between 0 and 100' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb(env);
        const now = new Date().toISOString();

        // Check if user already has reading progress for this post
        const existingProgress = await db
            .select()
            .from(userReadingProgress)
            .where(
                and(
                    eq(userReadingProgress.userId, userId),
                    eq(userReadingProgress.postId, postId)
                )
            )
            .limit(1);

        const isCompleted = progressPercentage >= 100;

        if (existingProgress.length > 0) {
            // Update existing progress
            const progress = existingProgress[0];
            
            await db
                .update(userReadingProgress)
                .set({
                    readingTimeSeconds: progress.readingTimeSeconds + readingTimeSeconds,
                    progressPercentage: Math.max(progress.progressPercentage, progressPercentage),
                    lastPosition: Math.max(progress.lastPosition, lastPosition),
                    isCompleted: progress.isCompleted || isCompleted,
                    completedAt: (progress.isCompleted || isCompleted) ? (progress.completedAt || now) : undefined,
                    updatedAt: now
                })
                .where(
                    and(
                        eq(userReadingProgress.userId, userId),
                        eq(userReadingProgress.postId, postId)
                    )
                );

            return new Response(
                JSON.stringify({
                    message: 'Reading progress updated successfully',
                    isCompleted: progress.isCompleted || isCompleted,
                    totalReadingTime: progress.readingTimeSeconds + readingTimeSeconds
                }),
                { 
                    status: 200, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        } else {
            // Create new reading progress
            const progressId = 'progress_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            await db.insert(userReadingProgress).values({
                id: progressId,
                userId,
                postId,
                startedAt: now,
                completedAt: isCompleted ? now : undefined,
                readingTimeSeconds,
                progressPercentage,
                lastPosition,
                isCompleted,
                createdAt: now,
                updatedAt: now
            });

            return new Response(
                JSON.stringify({
                    message: 'Reading progress created successfully',
                    isCompleted,
                    totalReadingTime: readingTimeSeconds
                }),
                { 
                    status: 201, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        }

    } catch (error) {
        console.error('Track reading progress error:', error);
        
        // Check if it's a database table not found error
        if (error instanceof Error && error.message.includes('no such table')) {
            return new Response(
                JSON.stringify({ 
                    error: 'Database tables not yet created. Please run database migrations.',
                    details: 'The user_reading_progress table may not exist in your D1 database.'
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

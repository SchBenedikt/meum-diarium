import { getDb } from '../db/client';
import { userReadingProgress } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { PagesContext } from '../types';

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
    const userId = request.headers.get('X-User-ID');
    
    if (!userId) {
        return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const db = getDb(env);

        let progressRecords;
        try {
            progressRecords = await db
                .select({
                    postId: userReadingProgress.postId,
                    readingTimeSeconds: userReadingProgress.readingTimeSeconds,
                    progressPercentage: userReadingProgress.progressPercentage,
                    lastReadAt: userReadingProgress.updatedAt,
                    createdAt: userReadingProgress.createdAt,
                    updatedAt: userReadingProgress.updatedAt,
                })
                .from(userReadingProgress)
                .where(eq(userReadingProgress.userId, userId))
                .orderBy(desc(userReadingProgress.updatedAt));
        } catch (queryError: any) {
            console.warn('[ReadingProgress] Table may not exist, returning empty:', queryError.message);
            progressRecords = [];
        }

        return new Response(
            JSON.stringify({ 
                readingProgress: progressRecords,
                totalReadingTime: progressRecords.reduce((sum, record) => sum + record.readingTimeSeconds, 0),
                totalPostsRead: progressRecords.length,
                averageReadingTime: progressRecords.length > 0 
                    ? progressRecords.reduce((sum, record) => sum + record.readingTimeSeconds, 0) / progressRecords.length 
                    : 0
            }),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error: any) {
        console.error('Get reading progress error:', error.message);
        return new Response(
            JSON.stringify({ 
                readingProgress: [],
                totalReadingTime: 0,
                totalPostsRead: 0,
                averageReadingTime: 0,
                note: 'Reading progress table not available'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    const userId = request.headers.get('X-User-ID');
    
    if (!userId) {
        return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const { postId, readingTimeSeconds, progressPercentage } = await request.json() as {
            postId: string;
            readingTimeSeconds?: number;
            progressPercentage?: number;
        };

        // Validation
        if (!postId || readingTimeSeconds === undefined || progressPercentage === undefined) {
            return new Response(
                JSON.stringify({ error: 'Post ID, reading time, and progress percentage are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb(env);

        // Check if progress already exists
        const existingProgress = await db
            .select()
            .from(userReadingProgress)
            .where(and(
                eq(userReadingProgress.userId, userId),
                eq(userReadingProgress.postId, postId)
            ))
            .limit(1);

        const now = new Date().toISOString();

        if (existingProgress) {
            // Update existing progress
            await db
                .update(userReadingProgress)
                .set({
                    readingTimeSeconds: existingProgress.readingTimeSeconds + readingTimeSeconds,
                    progressPercentage: Math.min(100, existingProgress.progressPercentage + (progressPercentage || 0)),
                    updatedAt: now,
                })
                .where(and(
                    eq(userReadingProgress.userId, userId),
                    eq(userReadingProgress.postId, postId)
                ));
        } else {
            // Create new progress record
            await db.insert(userReadingProgress).values({
                id: `progress_${userId}_${postId}_${Date.now()}`,
                userId,
                postId,
                readingTimeSeconds: readingTimeSeconds || 0,
                progressPercentage: progressPercentage || 0,
                createdAt: now,
                updatedAt: now,
            });
        }

        return new Response(
            JSON.stringify({
                message: 'Reading progress tracked successfully',
                readingTimeSeconds: readingTimeSeconds || 0,
                progressPercentage: progressPercentage || 0,
            }),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error: any) {
        console.error('Reading progress error:', error.message);
        return new Response(
            JSON.stringify({ error: 'Reading progress unavailable', message: error.message }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

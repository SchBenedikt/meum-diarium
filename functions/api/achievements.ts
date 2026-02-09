import { getDb } from '../db/client';
import { achievements, userAchievements, users } from '../db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
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

// Get all achievements with user progress
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

        // Get all achievements
        const allAchievements = await db.select().from(achievements).orderBy(desc(achievements.xpReward));

        // Get user's unlocked achievements
        const userUnlocked = await db
            .select({
                achievementId: userAchievements.achievementId,
                unlockedAt: userAchievements.unlockedAt,
                progress: userAchievements.progress
            })
            .from(userAchievements)
            .where(eq(userAchievements.userId, userId));

        const unlockedMap = new Map(
            userUnlocked.map((ua: any) => [ua.achievementId, ua])
        );

        // Combine achievements with user progress
        const achievementsWithProgress = allAchievements.map((achievement: any) => {
            const userProgress = unlockedMap.get(achievement.id);
            return {
                ...achievement,
                isUnlocked: !!userProgress,
                unlockedAt: userProgress?.unlockedAt,
                progress: (userProgress as any)?.progress || 0,
                progressPercentage: userProgress ? 100 : 0 // Simplified - could calculate based on actual progress
            };
        });

        // Group by category
        const groupedAchievements = achievementsWithProgress.reduce((acc: any, achievement: any) => {
            if (!acc[achievement.category]) {
                acc[achievement.category] = [];
            }
            acc[achievement.category].push(achievement);
            return acc;
        }, {} as Record<string, any[]>);

        return new Response(JSON.stringify({
            achievements: achievementsWithProgress,
            categories: groupedAchievements,
            stats: {
                total: allAchievements.length,
                unlocked: userUnlocked.length,
                percentage: Math.round((userUnlocked.length / allAchievements.length) * 100)
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching achievements:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

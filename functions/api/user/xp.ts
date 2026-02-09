import { getDb } from '../../db/client';
import { userXp, achievements, userAchievements, users, userReadArticles } from '../../db/schema';
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

// Helper function to calculate XP requirements for levels
function getXpForLevel(level: number): number {
    if (level <= 10) return 100;
    if (level <= 25) return 150;
    if (level <= 50) return 200;
    return 250;
}

// Helper function to calculate total XP needed for a level
function getTotalXpForLevel(level: number): number {
    let totalXp = 0;
    for (let i = 1; i < level; i++) {
        totalXp += getXpForLevel(i);
    }
    return totalXp;
}

// Helper function to calculate level from total XP
function getLevelFromXp(totalXp: number): { level: number; currentLevelXp: number; xpToNextLevel: number } {
    let level = 1;
    let remainingXp = totalXp;
    
    while (remainingXp >= getXpForLevel(level)) {
        remainingXp -= getXpForLevel(level);
        level++;
    }
    
    return {
        level,
        currentLevelXp: remainingXp,
        xpToNextLevel: getXpForLevel(level)
    };
}

// Get user XP and level information
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

        // Get or create user XP record
        let userXpRecord = await db
            .select()
            .from(userXp)
            .where(eq(userXp.userId, userId))
            .limit(1);

        if (userXpRecord.length === 0) {
            // Create initial XP record
            await db.insert(userXp).values({
                userId: userId,
                totalXp: 0,
                level: 1,
                currentLevelXp: 0,
                xpToNextLevel: 100,
                streakDays: 0,
                longestStreak: 0,
                updatedAt: new Date().toISOString()
            });

            userXpRecord = await db
                .select()
                .from(userXp)
                .where(eq(userXp.userId, userId))
                .limit(1);
        }

        const xpData = userXpRecord[0];

        // Get additional stats
        const readArticlesCount = await db
            .select({ count: count() })
            .from(userReadArticles)
            .where(eq(userReadArticles.userId, userId));

        const achievementsCount = await db
            .select({ count: count() })
            .from(userAchievements)
            .where(eq(userAchievements.userId, userId));

        return new Response(JSON.stringify({
            ...xpData,
            stats: {
                articlesRead: readArticlesCount[0].count,
                achievementsUnlocked: achievementsCount[0].count
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching user XP:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

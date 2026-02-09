import { getDb } from '../../../db/client';
import { userXp, activityFeed, achievements, userAchievements } from '../../../db/schema';
import { eq } from 'drizzle-orm';
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

// Helper function to calculate XP requirements for levels
function getXpForLevel(level: number): number {
    if (level <= 10) return 100;
    if (level <= 25) return 150;
    if (level <= 50) return 200;
    return 250;
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

// Check and unlock achievements based on user progress
async function checkAchievements(db: any, userId: string, activityType: string, currentValue: number) {
    const allAchievements = await db.select().from(achievements);
    const userAchievementsList = await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
    
    const unlockedIds = new Set(userAchievementsList.map((ua: any) => ua.achievementId));
    const newAchievements = [];

    for (const achievement of allAchievements) {
        if (unlockedIds.has(achievement.id)) continue;
        
        let shouldUnlock = false;
        
        switch (achievement.requirementType) {
            case 'posts_read':
                if (activityType === 'article_read' && currentValue >= achievement.requirementValue) {
                    shouldUnlock = true;
                }
                break;
            case 'words_learned':
                if (activityType === 'vocabulary_learned' && currentValue >= achievement.requirementValue) {
                    shouldUnlock = true;
                }
                break;
            case 'streak_days':
                if (activityType === 'streak_updated' && currentValue >= achievement.requirementValue) {
                    shouldUnlock = true;
                }
                break;
            case 'friends_count':
                if (activityType === 'friend_added' && currentValue >= achievement.requirementValue) {
                    shouldUnlock = true;
                }
                break;
            case 'grammar_completed':
                if (activityType === 'grammar_exercise' && currentValue >= achievement.requirementValue) {
                    shouldUnlock = true;
                }
                break;
        }

        if (shouldUnlock) {
            await db.insert(userAchievements).values({
                id: `ua_${userId}_${achievement.id}_${Date.now()}`,
                userId: userId,
                achievementId: achievement.id,
                unlockedAt: new Date().toISOString(),
                progress: achievement.requirementValue
            });

            // Add XP for achievement
            await addUserXp(db, userId, achievement.xpReward, 'achievement_unlocked', {
                achievementId: achievement.id,
                title: achievement.title
            });

            newAchievements.push(achievement);
        }
    }

    return newAchievements;
}

// Helper function to add XP and handle level ups
async function addUserXp(db: any, userId: string, xpAmount: number, activityType: string, activityData: any) {
    // Get current XP record
    let userXpRecord = await db
        .select()
        .from(userXp)
        .where(eq(userXp.userId, userId))
        .limit(1);

    if (userXpRecord.length === 0) {
        // Create initial XP record
        await db.insert(userXp).values({
            userId: userId,
            totalXp: xpAmount,
            level: 1,
            currentLevelXp: xpAmount,
            xpToNextLevel: 100,
            streakDays: 0,
            longestStreak: 0,
            updatedAt: new Date().toISOString()
        });
        return { levelUp: false, newLevel: 1 };
    }

    const currentXp = userXpRecord[0];
    const newTotalXp = currentXp.totalXp + xpAmount;
    const levelInfo = getLevelFromXp(newTotalXp);
    
    const levelUp = levelInfo.level > currentXp.level;

    // Update XP record
    await db
        .update(userXp)
        .set({
            totalXp: newTotalXp,
            level: levelInfo.level,
            currentLevelXp: levelInfo.currentLevelXp,
            xpToNextLevel: levelInfo.xpToNextLevel,
            updatedAt: new Date().toISOString()
        })
        .where(eq(userXp.userId, userId));

    // Add activity feed entry
    await db.insert(activityFeed).values({
        id: `activity_${userId}_${Date.now()}`,
        userId: userId,
        activityType: activityType,
        activityData: JSON.stringify(activityData),
        createdAt: new Date().toISOString()
    });

    // If level up, add special activity
    if (levelUp) {
        await db.insert(activityFeed).values({
            id: `levelup_${userId}_${Date.now()}`,
            userId: userId,
            activityType: 'level_up',
            activityData: JSON.stringify({
                newLevel: levelInfo.level,
                previousLevel: currentXp.level
            }),
            createdAt: new Date().toISOString()
        });
    }

    return { levelUp, newLevel: levelInfo.level, previousLevel: currentXp.level };
}

// Add XP for various activities
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

        const body = await request.json() as {
            activityType: string;
            xpAmount?: number;
            currentValue?: number;
            metadata?: any;
        };

        if (!body.activityType) {
            return new Response(JSON.stringify({ error: 'activityType is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const db = getDb(env);
        let xpAmount = body.xpAmount || 0;
        let newAchievements = [];

        // Define XP amounts for different activities
        const xpValues: Record<string, number> = {
            'article_read': 10,
            'vocabulary_learned': 5,
            'grammar_exercise': 15,
            'daily_login': 5,
            'streak_milestone': 50,
            'friend_joined': 25
        };

        if (xpAmount === 0 && xpValues[body.activityType]) {
            xpAmount = xpValues[body.activityType];
        }

        // Add XP and check for level up
        const levelResult = await addUserXp(db, userId, xpAmount, body.activityType, body.metadata || {});

        // Check for new achievements
        if (body.currentValue) {
            newAchievements = await checkAchievements(db, userId, body.activityType, body.currentValue);
        }

        return new Response(JSON.stringify({
            success: true,
            xpAdded: xpAmount,
            levelUp: levelResult.levelUp,
            newLevel: levelResult.newLevel,
            previousLevel: levelResult.previousLevel,
            newAchievements: newAchievements.map(a => ({
                id: a.id,
                title: a.title,
                description: a.description,
                icon: a.icon,
                xpReward: a.xpReward
            }))
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error adding XP:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

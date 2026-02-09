import { getDb } from '../db/client';
import { userXp, users } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
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

// Get leaderboard data
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

        // Get URL parameters for filtering
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'global'; // global, friends, streak
        const timeFrame = url.searchParams.get('timeframe') || 'all-time'; // weekly, monthly, all-time

        // Global leaderboard - top users by XP
        if (type === 'global') {
            const globalLeaderboard = await db
                .select({
                    userId: userXp.userId,
                    totalXp: userXp.totalXp,
                    level: userXp.level,
                    streakDays: userXp.streakDays,
                    longestStreak: userXp.longestStreak,
                    user: {
                        displayName: users.displayName,
                        username: users.username,
                        avatarUrl: users.avatarUrl
                    }
                })
                .from(userXp)
                .leftJoin(users, eq(userXp.userId, users.id))
                .orderBy(desc(userXp.totalXp))
                .limit(50);

            return new Response(JSON.stringify({
                type: 'global',
                timeframe: timeFrame,
                leaderboard: globalLeaderboard.map((entry, index) => ({
                    rank: index + 1,
                    ...entry
                }))
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Streak leaderboard - top users by streak days
        if (type === 'streak') {
            const streakLeaderboard = await db
                .select({
                    userId: userXp.userId,
                    totalXp: userXp.totalXp,
                    level: userXp.level,
                    streakDays: userXp.streakDays,
                    longestStreak: userXp.longestStreak,
                    user: {
                        displayName: users.displayName,
                        username: users.username,
                        avatarUrl: users.avatarUrl
                    }
                })
                .from(userXp)
                .leftJoin(users, eq(userXp.userId, users.id))
                .orderBy(desc(userXp.streakDays))
                .limit(50);

            return new Response(JSON.stringify({
                type: 'streak',
                timeframe: timeFrame,
                leaderboard: streakLeaderboard.map((entry, index) => ({
                    rank: index + 1,
                    ...entry
                }))
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Friends leaderboard - would require friends system
        return new Response(JSON.stringify({
            type: 'friends',
            timeframe: timeFrame,
            leaderboard: [],
            message: 'Friends leaderboard coming soon!'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

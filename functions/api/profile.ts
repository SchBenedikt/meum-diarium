import { getDb } from '../../db/client';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
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

        // Get user profile
        const userRecords = await db
            .select({
                id: users.id,
                email: users.email,
                username: users.username,
                displayName: users.displayName,
                bio: users.bio,
                avatarUrl: users.avatarUrl,
                createdAt: users.createdAt,
                lastLoginAt: users.lastLoginAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (userRecords.length === 0) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = userRecords[0];

        return new Response(
            JSON.stringify({
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName,
                    bio: user.bio,
                    avatarUrl: user.avatarUrl,
                    createdAt: user.createdAt,
                    lastLoginAt: user.lastLoginAt
                }
            }),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Get profile error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const onRequestPut = async (context: PagesContext): Promise<Response> => {
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

        const { displayName, bio, avatarUrl } = await request.json() as {
            displayName?: string;
            bio?: string;
            avatarUrl?: string;
        };

        // Validation
        if (displayName && displayName.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Display name cannot be empty' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (displayName && displayName.length > 50) {
            return new Response(
                JSON.stringify({ error: 'Display name too long (max 50 characters)' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (bio && bio.length > 500) {
            return new Response(
                JSON.stringify({ error: 'Bio too long (max 500 characters)' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (avatarUrl && avatarUrl.length > 500) {
            return new Response(
                JSON.stringify({ error: 'Avatar URL too long (max 500 characters)' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb(env);

        // Check if user exists
        const userRecords = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (userRecords.length === 0) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Update user profile
        const updateData: any = {
            updatedAt: new Date().toISOString()
        };

        if (displayName !== undefined) updateData.displayName = displayName.trim();
        if (bio !== undefined) updateData.bio = bio.trim();
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl.trim();

        await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId));

        // Get updated user data
        const updatedUserRecords = await db
            .select({
                id: users.id,
                email: users.email,
                username: users.username,
                displayName: users.displayName,
                bio: users.bio,
                avatarUrl: users.avatarUrl,
                createdAt: users.createdAt,
                lastLoginAt: users.lastLoginAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const updatedUser = updatedUserRecords[0];

        return new Response(
            JSON.stringify({
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    username: updatedUser.username,
                    displayName: updatedUser.displayName,
                    bio: updatedUser.bio,
                    avatarUrl: updatedUser.avatarUrl,
                    createdAt: updatedUser.createdAt,
                    lastLoginAt: updatedUser.lastLoginAt
                }
            }),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Update profile error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

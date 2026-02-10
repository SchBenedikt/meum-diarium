import { getDb } from '../db/client';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
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

export const onRequestPut = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };
    
    try {
        // Verify authentication
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(
                JSON.stringify({ error: 'Authentication required' }),
                { status: 401, headers: corsHeaders }
            );
        }

        const token = authHeader.substring(7);
        const userId = verifyToken(token);

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'Invalid token' }),
                { status: 401, headers: corsHeaders }
            );
        }

        const { displayName, bio, avatarUrl } = await request.json() as {
            displayName?: string;
            bio?: string;
            avatarUrl?: string;
        };

        // Validation
        if (!displayName && !bio && !avatarUrl) {
            return new Response(
                JSON.stringify({ error: 'At least one field must be provided' }),
                { status: 400, headers: corsHeaders }
            );
        }

        const db = getDb(env);

        // Update user profile
        const updateData: any = {
            updatedAt: new Date().toISOString()
        };

        if (displayName) updateData.displayName = displayName.trim();
        if (bio) updateData.bio = bio.trim();
        if (avatarUrl) updateData.avatarUrl = avatarUrl.trim();

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
                updatedAt: users.updatedAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const updatedUser = updatedUserRecords[0];

        return new Response(
            JSON.stringify({
                message: 'Profile updated successfully',
                user: updatedUser
            }),
            { 
                status: 200, 
                headers: corsHeaders
            }
        );

    } catch (error) {
        console.error('Profile update error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: corsHeaders }
        );
    }
};

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };
    
    try {
        // Verify authentication
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(
                JSON.stringify({ error: 'Authentication required' }),
                { status: 401, headers: corsHeaders }
            );
        }

        const token = authHeader.substring(7);
        const userId = verifyToken(token);

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'Invalid token' }),
                { status: 401, headers: corsHeaders }
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
                updatedAt: users.updatedAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const user = userRecords[0];

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: corsHeaders }
            );
        }

        return new Response(
            JSON.stringify({ user }),
            { 
                status: 200, 
                headers: corsHeaders
            }
        );

    } catch (error) {
        console.error('Profile get error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: corsHeaders }
        );
    }
};

export const onRequestOptions = async (): Promise<Response> => {
    // CORS headers for preflight requests
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // 24 hours
    };

    return new Response(null, {
        status: 200,
        headers: corsHeaders
    });
};

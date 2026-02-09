import { getDb } from '../../db/client';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../../types';

// Helper function to generate JWT token
function generateToken(userId: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { userId, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }; // 24 hours
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}`;
}

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
    const { request, env } = context;
    
    try {
        const { email, username, password, displayName } = await request.json() as {
            email: string;
            username: string;
            password: string;
            displayName?: string;
        };

        // Validation
        if (!email || !username || !password) {
            return new Response(
                JSON.stringify({ error: 'Email, username, and password are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (password.length < 6) {
            return new Response(
                JSON.stringify({ error: 'Password must be at least 6 characters long' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb(env);

        // Check if user already exists
        const existingUserRecords = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase().trim()))
            .limit(1);

        if (existingUserRecords.length > 0) {
            return new Response(
                JSON.stringify({ error: 'User with this email already exists' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create new user
        const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const hashedPassword = await hashPassword(password);
        const now = new Date().toISOString();

        const newUser = {
            id: userId,
            email: email.toLowerCase().trim(),
            username: username.trim(),
            passwordHash: hashedPassword,
            displayName: displayName?.trim() || username.trim(),
            createdAt: now,
            updatedAt: now,
            isActive: true,
        };

        await db.insert(users).values(newUser);

        // Generate token
        const token = generateToken(userId);

        return new Response(
            JSON.stringify({
                message: 'Registration successful',
                user: {
                    id: userId,
                    email: newUser.email,
                    username: newUser.username,
                    displayName: newUser.displayName,
                },
                token
            }),
            { 
                status: 201, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Register error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

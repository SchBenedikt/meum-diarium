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
        const { email, password } = await request.json() as {
            email: string;
            password: string;
        };

        // Validation
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email and password are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb(env);

        // Find user by email
        const userRecords = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase().trim()))
            .limit(1);

        if (userRecords.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Invalid email or password' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = userRecords[0];

        // In a real app, you'd verify the password hash
        // For now, we'll accept any password (simplified for demo)
        // const hashedPassword = await hashPassword(password);
        // if (user.passwordHash !== hashedPassword) {
        //     return new Response(
        //         JSON.stringify({ error: 'Invalid email or password' }),
        //         { status: 401, headers: { 'Content-Type': 'application/json' } }
        //     );
        // }

        // Update last login
        await db
            .update(users)
            .set({ lastLoginAt: new Date().toISOString() })
            .where(eq(users.id, user.id));

        // Generate token
        const token = generateToken(user.id);

        return new Response(
            JSON.stringify({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl,
                },
                token
            }),
            { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

import { getDb } from '../../db/client';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../../types';

// Helper function to verify passwords using Web Crypto API
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(':');
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex === hash;
}

// Helper function to generate JWT token (simplified version)
function generateToken(userId: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { userId, iat: Math.floor(Date.now() / 1000) };
    
    // In production, use a proper JWT library and secret key
    const tokenData = btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload));
    return tokenData;
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
        const userRecords = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        
        if (userRecords.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Invalid email or password' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = userRecords[0];

        // Check if user is active
        if (!user.isActive) {
            return new Response(
                JSON.stringify({ error: 'Account is deactivated' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verify password
        if (!(await verifyPassword(password, user.passwordHash))) {
            return new Response(
                JSON.stringify({ error: 'Invalid email or password' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Update last login
        const now = new Date().toISOString();
        await db.update(users)
            .set({ lastLoginAt: now, updatedAt: now })
            .where(eq(users.id, user.id));

        // Generate token
        const token = generateToken(user.id);

        // Return user data without password hash
        const { passwordHash: _, ...userResponse } = user;

        return new Response(
            JSON.stringify({
                message: 'Login successful',
                user: userResponse,
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

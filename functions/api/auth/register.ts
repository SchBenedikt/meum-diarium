import { getDb } from '../../db/client';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../../types';

// Helper function to hash passwords using Web Crypto API
async function hashPassword(password: string): Promise<string> {
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return salt + ':' + hashHex;
}

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

// Helper function to generate user ID
function generateUserId(): string {
    return 'user_' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Helper function to validate email
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to validate username
function validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
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

        if (!validateEmail(email)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!validateUsername(username)) {
            return new Response(
                JSON.stringify({ error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (password.length < 8) {
            return new Response(
                JSON.stringify({ error: 'Password must be at least 8 characters long' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb(env);

        // Check if email already exists
        const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingEmail.length > 0) {
            return new Response(
                JSON.stringify({ error: 'Email already registered' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if username already exists
        const existingUsername = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (existingUsername.length > 0) {
            return new Response(
                JSON.stringify({ error: 'Username already taken' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create new user
        const userId = generateUserId();
        const passwordHash = await hashPassword(password);
        const now = new Date().toISOString();

        const newUser = {
            id: userId,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            passwordHash,
            displayName: displayName || username,
            bio: null,
            avatarUrl: null,
            preferences: JSON.stringify({
                theme: 'system',
                language: 'de',
                emailNotifications: true,
                commentNotifications: true
            }),
            createdAt: now,
            updatedAt: now,
            lastLoginAt: null,
            isActive: true
        };

        await db.insert(users).values(newUser);

        // Return user data without password hash
        const { passwordHash: _, ...userResponse } = newUser;

        return new Response(
            JSON.stringify({
                message: 'User registered successfully',
                user: userResponse
            }),
            { 
                status: 201, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

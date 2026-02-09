import { getDb } from '../../db/client';
import { users } from '../../db/schema';
import type { PagesContext } from '../../types';

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
    try {
        const db = getDb(context.env);
        
        // Test basic database connection
        console.log('Testing database connection...');
        
        // Try to query users table
        const result = await db.select().from(users).limit(1);
        
        return new Response(JSON.stringify({
            status: 'success',
            message: 'Database connection working',
            databaseBindings: {
                DB: !!context.env.DB,
                vocab: !!context.env.vocab
            },
            userCount: result.length,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Database test error:', error);
        
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            databaseBindings: {
                DB: !!context.env.DB,
                vocab: !!context.env.vocab
            },
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

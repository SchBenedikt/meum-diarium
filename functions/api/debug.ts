import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        const debug: any = {
            timestamp: new Date().toISOString(),
            environment: {
                hasDB: !!context.env?.DB,
                envKeys: context.env ? Object.keys(context.env) : [],
            },
            request: {
                url: context.request.url,
                method: context.request.method,
            }
        };

        // Check if DB binding exists
        if (!context.env?.DB) {
            debug.error = 'DB binding not found in context.env';
            debug.hint = 'Check wrangler.toml configuration and Pages environment settings';
            
            return new Response(JSON.stringify(debug, null, 2), {
                status: 503,
                headers: corsHeaders
            });
        }

        // Try to query the database
        try {
            const db = context.env.DB;
            
            // Test basic query
            const tablesResult = await db.prepare(`
                SELECT name FROM sqlite_master 
                WHERE type='table' 
                ORDER BY name
            `).all();
            
            debug.database = {
                connected: true,
                tables: tablesResult.results?.map((r: any) => r.name) || [],
            };

            // Get row counts if tables exist
            const tables = ['authors', 'posts', 'lexicon', 'works'];
            const counts: Record<string, number> = {};
            
            for (const table of tables) {
                try {
                    const result = await db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first();
                    counts[table] = result?.count as number || 0;
                } catch (e: any) {
                    counts[table] = -1; // Table doesn't exist or error
                }
            }
            
            debug.database.rowCounts = counts;
            
        } catch (dbError: any) {
            debug.database = {
                connected: false,
                error: dbError.message,
                stack: dbError.stack,
            };
        }

        return new Response(JSON.stringify(debug, null, 2), {
            headers: corsHeaders
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ 
            error: 'Debug endpoint failed',
            message: err.message,
            stack: err.stack
        }, null, 2), {
            status: 500,
            headers: corsHeaders
        });
    }
};

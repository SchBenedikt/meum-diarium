import { getDb } from '../db/client';
import { lexicon } from '../db/schema';
import { eq, like, or } from 'drizzle-orm';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    };
    const startTime = Date.now();

    const parseJsonField = (value: any): any => {
        if (!value || typeof value !== 'string') return null;
        try {
            return JSON.parse(value);
        } catch (e: any) {
            console.warn(`⚠️ [Lexicon API] Malformed JSON in field: ${value.substring(0, 50)}...`);
            return null;
        }
    };

    const sanitizeEntry = (entry: any) => {
        const sanitized: any = {};
        Object.entries(entry).forEach(([key, value]) => {
            if (typeof value === 'string') {
                sanitized[key] = value
                    .replace(/\x00/g, '')
                    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, '');
            } else {
                sanitized[key] = value;
            }
        });
        return sanitized;
    };

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Lexicon API] D1 database not available');
            console.error('   env keys:', context.env ? Object.keys(context.env) : 'no env');
            return new Response(JSON.stringify({ 
                error: 'Database not configured',
                message: 'D1 database binding not found',
                hint: 'Check wrangler.toml and Pages environment settings'
            }), {
                status: 503,
                headers: corsHeaders
            });
        }


        console.log('🔷 [Lexicon API] DB binding found, initializing Drizzle...');
        const db = getDb(context.env);
        const url = new URL(context.request.url);
        const slug = url.searchParams.get('slug');
        const search = url.searchParams.get('search');
        const limit = parseInt(url.searchParams.get('limit') || '100');

        console.log(`🔷 [Lexicon API] Query: ${slug ? `slug=${slug}` : search ? `search=${search}` : 'all entries'}`);

        if (slug) {
            const result = await db.query.lexicon.findFirst({
                where: eq(lexicon.slug, slug)
            });

            const queryTime = Date.now() - startTime;

            if (!result) {
                console.warn(`⚠️ [Lexicon API] Entry not found: ${slug} (${queryTime}ms)`);
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            console.log(`✅ [Lexicon API] D1 query successful: Found entry "${result.term}" (${queryTime}ms)`);

            const parsedResult = {
                ...result,
                variants: parseJsonField(result.variants) || [],
                relatedTerms: parseJsonField(result.relatedTerms) || [],
                translations: parseJsonField(result.translations) || {},
            };

            const sanitizedResult = sanitizeEntry(parsedResult);

            return new Response(JSON.stringify(sanitizedResult), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'cloudflare-d1'
                }
            });
        }

        let whereClause = undefined;
        if (search) {
            whereClause = or(
                like(lexicon.term, `%${search}%`),
                like(lexicon.definition, `%${search}%`)
            );
        }

        const results = await db.query.lexicon.findMany({
            where: whereClause,
            limit: limit
        });

        // Parse JSON fields manually to handle corrupted/malformed data gracefully
        const parsedResults = results.map((entry: any) => ({
            ...entry,
            variants: parseJsonField(entry.variants) || [],
            relatedTerms: parseJsonField(entry.relatedTerms) || [],
            translations: parseJsonField(entry.translations) || {},
        }));

        const queryTime = Date.now() - startTime;
        console.log(`✅ [Lexicon API] D1 query successful: Fetched ${results.length} entries (${queryTime}ms)`);

        // Sanitize each entry to ensure valid JSON serialization with proper UTF-8
        const sanitizedResults = parsedResults.map((entry: any) => sanitizeEntry(entry));

        // Proper UTF-8 JSON serialization with replacer to handle edge cases
        let responseText: string;
        try {
            responseText = JSON.stringify(sanitizedResults, (_key, value) => {
                if (typeof value === 'string') {
                    return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
                }
                return value;
            });
        } catch (jsonErr: any) {
            console.error(`❌ [Lexicon API] JSON serialization failed:`, jsonErr.message);
            responseText = JSON.stringify(sanitizedResults.slice(0, 10));
        }
        
        return new Response(responseText, {
            headers: {
                ...corsHeaders,
                'Cache-Control': 'public, max-age=3600',
                'X-Data-Source': 'cloudflare-d1',
                'X-Entry-Count': results.length.toString()
            }
        });

    } catch (err: any) {
        const queryTime = Date.now() - startTime;
        console.error(`❌ [Lexicon API] D1 query failed (${queryTime}ms):`, err.message);
        console.error('   Stack:', err.stack);
        
        return new Response(JSON.stringify({ 
            error: 'Database Error', 
            message: err.message,
            hint: 'Check if database is seeded and migrations are applied'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
};

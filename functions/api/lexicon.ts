import { getDb } from '../db/client';
import { lexicon } from '../db/schema';
import { eq, like, or } from 'drizzle-orm';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const parseJsonField = (value: any): any => {
        if (!value || typeof value !== 'string') return null;
        try {
            return JSON.parse(value);
        } catch (e: any) {
            console.warn(`⚠️ [Lexicon API] Malformed JSON in field: ${value.substring(0, 50)}...`);
            return null;
        }
    };

    const parseJsonArray = (value: any): string[] => {
        const parsed = parseJsonField(value);
        return Array.isArray(parsed) ? parsed : [];
    };

    const serializeJsonField = (value: any): string | null => {
        if (value === undefined || value === null) return null;
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
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

    const startTime = Date.now();

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Lexicon API] D1 database not available');
            return new Response(JSON.stringify({ 
                error: 'Database not configured',
                message: 'D1 database binding not found'
            }), {
                status: 503,
                headers: corsHeaders
            });
        }

        const db = getDb(context.env);
        const url = new URL(context.request.url);
        const method = context.request.method;

        console.log(`🔷 [Lexicon API] ${method} request: ${url.pathname}${url.search}`);

        // Extract slug from path or query params
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const slugFromPath = pathSegments[pathSegments.length - 1] !== 'lexicon' ? pathSegments[pathSegments.length - 1] : null;
        const slugParam = slugFromPath || url.searchParams.get('slug');
        const search = url.searchParams.get('search');
        const limit = parseInt(url.searchParams.get('limit') || '100');

        // GET handler
        if (method === 'GET') {
            if (slugParam) {
                const result = await db.query.lexicon.findFirst({
                    where: eq(lexicon.slug, slugParam)
                });

                const queryTime = Date.now() - startTime;

                if (!result) {
                    console.warn(`⚠️ [Lexicon API] Entry not found: ${slugParam}`);
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                console.log(`✅ [Lexicon API] GET found entry "${result.term}" (${queryTime}ms)`);

                const parsedResult = {
                    ...result,
                    variants: parseJsonArray(result.variants),
                    relatedTerms: parseJsonArray(result.relatedTerms),
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

            let results = await db.query.lexicon.findMany({
                where: whereClause,
                // When searching, fetch a generous upper bound so relevance sorting
                // covers enough candidates; apply the requested limit after sorting.
                limit: search ? Math.max(limit * 10, 500) : limit
            });

            // If search is provided, sort by relevance then apply limit
            if (search) {
                const searchLower = search.toLowerCase();
                // Escape regex metacharacters to avoid runtime errors and ReDoS
                const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(searchLower)}`, 'i');

                const getRelevanceScore = (entry: any): number => {
                    const termLower = (entry.term || "").toLowerCase();
                    const definitionLower = (entry.definition || "").toLowerCase();

                    if (termLower === searchLower) return 1000;
                    if (termLower.startsWith(searchLower)) return 900;
                    if (wordBoundaryRegex.test(termLower)) return 600;
                    if (termLower.includes(searchLower)) return 400;
                    if (definitionLower.startsWith(searchLower)) return 200;
                    if (wordBoundaryRegex.test(definitionLower)) return 100;
                    if (definitionLower.includes(searchLower)) return 50;
                    return 0;
                };

                // Precompute scores once (O(n)) before sorting
                const scored = results.map((entry: any) => ({ entry, score: getRelevanceScore(entry) }));
                scored.sort((a: any, b: any) => {
                    const diff = b.score - a.score;
                    return diff !== 0 ? diff : (a.entry.term || "").localeCompare(b.entry.term || "");
                });
                results = scored.slice(0, limit).map((s: any) => s.entry);
            }

            // Parse JSON fields manually
            const parsedResults = results.map((entry: any) => ({
                ...entry,
                variants: parseJsonArray(entry.variants),
                relatedTerms: parseJsonArray(entry.relatedTerms),
                translations: parseJsonField(entry.translations) || {},
            }));

            const queryTime = Date.now() - startTime;
            console.log(`✅ [Lexicon API] GET fetched ${results.length} entries (${queryTime}ms)`);

            const sanitizedResults = parsedResults.map(sanitizeEntry);

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
        }

        // POST handler - Create new entry
        if (method === 'POST') {
            try {
                const body = await context.request.json();
                
                // Validate required fields
                if (!body.slug || !body.term || !body.definition) {
                    return new Response(JSON.stringify({ 
                        error: 'Missing required fields',
                        required: ['slug', 'term', 'definition']
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                // Check if entry already exists
                const existing = await db.query.lexicon.findFirst({
                    where: eq(lexicon.slug, body.slug)
                });

                if (existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Entry already exists',
                        slug: body.slug
                    }), {
                        status: 409,
                        headers: corsHeaders
                    });
                }

                // Create new entry
                const newEntry = {
                    slug: body.slug,
                    term: body.term,
                    variants: serializeJsonField(body.variants || []),
                    definition: body.definition,
                    category: body.category || '',
                    etymology: body.etymology || '',
                    relatedTerms: serializeJsonField(body.relatedTerms || []),
                    translations: serializeJsonField(body.translations || {})
                };

                await db.insert(lexicon).values(newEntry);
                
                const queryTime = Date.now() - startTime;
                console.log(`✅ [Lexicon API] POST created entry "${newEntry.term}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Entry created',
                    entry: newEntry
                }), {
                    status: 201,
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Lexicon API] POST failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to create entry',
                    message: err.message
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
        }

        // PUT handler - Update entry
        if (method === 'PUT') {
            try {
                if (!slugParam) {
                    return new Response(JSON.stringify({ 
                        error: 'Slug required for update'
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                const body = await context.request.json();

                // Check if entry exists
                const existing = await db.query.lexicon.findFirst({
                    where: eq(lexicon.slug, slugParam)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Entry not found',
                        slug: slugParam
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                // Update entry
                const updatedData = {
                    term: body.term ?? existing.term,
                    variants: body.variants !== undefined ? serializeJsonField(body.variants) : existing.variants,
                    definition: body.definition ?? existing.definition,
                    category: body.category ?? existing.category,
                    etymology: body.etymology ?? existing.etymology,
                    relatedTerms: body.relatedTerms !== undefined ? serializeJsonField(body.relatedTerms) : existing.relatedTerms,
                    translations: body.translations !== undefined ? serializeJsonField(body.translations) : existing.translations
                };

                await db.update(lexicon)
                    .set(updatedData)
                    .where(eq(lexicon.slug, slugParam));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Lexicon API] PUT updated entry "${slugParam}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Entry updated',
                    slug: slugParam
                }), {
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Lexicon API] PUT failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to update entry',
                    message: err.message
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
        }

        // DELETE handler
        if (method === 'DELETE') {
            try {
                if (!slugParam) {
                    return new Response(JSON.stringify({ 
                        error: 'Slug required for deletion'
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                // Check if entry exists
                const existing = await db.query.lexicon.findFirst({
                    where: eq(lexicon.slug, slugParam)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Entry not found',
                        slug: slugParam
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                await db.delete(lexicon).where(eq(lexicon.slug, slugParam));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Lexicon API] DELETE removed entry "${slugParam}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Entry deleted',
                    slug: slugParam
                }), {
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Lexicon API] DELETE failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to delete entry',
                    message: err.message
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
        }

        return new Response(JSON.stringify({ 
            error: 'Method not allowed'
        }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (err: any) {
        const queryTime = Date.now() - startTime;
        console.error(`❌ [Lexicon API] Error (${queryTime}ms):`, err.message);
        
        return new Response(JSON.stringify({ 
            error: 'Server error', 
            message: err.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
};

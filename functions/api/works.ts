import { getDb } from '../db/client';
import { works } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const startTime = Date.now();

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Works API] D1 database not available');
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

        console.log(`🔷 [Works API] ${method} request: ${url.pathname}${url.search}`);

        // Extract ID from path or query params
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const idFromPath = pathSegments[pathSegments.length - 1] !== 'works' ? pathSegments[pathSegments.length - 1] : null;
        const id = idFromPath || url.searchParams.get('slug');

        // GET handler
        if (method === 'GET') {
            if (id) {
                const result = await db.query.works.findFirst({
                    where: eq(works.id, id),
                    with: {
                        author: true
                    }
                });

                const queryTime = Date.now() - startTime;

                if (!result) {
                    console.warn(`⚠️ [Works API] Work not found: ${id}`);
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                console.log(`✅ [Works API] GET found work "${result.title}" (${queryTime}ms)`);

                const normalizedResult = normalizeWorkResult(result);

                return new Response(JSON.stringify(normalizedResult), {
                    headers: {
                        ...corsHeaders,
                        'Cache-Control': 'public, max-age=3600',
                        'X-Data-Source': 'cloudflare-d1'
                    }
                });
            }

            const results = await db.query.works.findMany({
                with: {
                    author: true
                }
            });

            const queryTime = Date.now() - startTime;
            console.log(`✅ [Works API] GET fetched ${results.length} works (${queryTime}ms)`);

            const normalized = results.map(normalizeWorkResult);

            return new Response(JSON.stringify(normalized), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'cloudflare-d1',
                    'X-Work-Count': results.length.toString()
                }
            });
        }

        // POST handler - Create new work
        if (method === 'POST') {
            try {
                const body = await context.request.json();
                
                // Validate required fields
                if (!body.id || !body.title) {
                    return new Response(JSON.stringify({ 
                        error: 'Missing required fields',
                        required: ['id', 'title']
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                // Check if work already exists
                const existing = await db.query.works.findFirst({
                    where: eq(works.id, body.id)
                });

                if (existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Work already exists',
                        id: body.id
                    }), {
                        status: 409,
                        headers: corsHeaders
                    });
                }

                // Create new work
                const newWork = {
                    id: body.id,
                    title: body.title,
                    authorId: body.authorId || null,
                    description: body.description || '',
                    type: body.type || '',
                    date: body.date || '',
                    coverImage: body.coverImage || '',
                    content: body.content || {}
                };

                await db.insert(works).values(newWork);
                
                const queryTime = Date.now() - startTime;
                console.log(`✅ [Works API] POST created work "${newWork.title}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Work created',
                    work: newWork
                }), {
                    status: 201,
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Works API] POST failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to create work',
                    message: err.message
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
        }

        // PUT handler - Update work
        if (method === 'PUT') {
            try {
                if (!id) {
                    return new Response(JSON.stringify({ 
                        error: 'ID required for update'
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                const body = await context.request.json();

                // Check if work exists
                const existing = await db.query.works.findFirst({
                    where: eq(works.id, id)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Work not found',
                        id: id
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                // Update work
                const updatedData = {
                    title: body.title ?? existing.title,
                    authorId: body.authorId ?? existing.authorId,
                    description: body.description ?? existing.description,
                    type: body.type ?? existing.type,
                    date: body.date ?? existing.date,
                    coverImage: body.coverImage ?? existing.coverImage,
                    content: body.content ?? existing.content
                };

                await db.update(works)
                    .set(updatedData)
                    .where(eq(works.id, id));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Works API] PUT updated work "${id}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Work updated',
                    id: id
                }), {
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Works API] PUT failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to update work',
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
                if (!id) {
                    return new Response(JSON.stringify({ 
                        error: 'ID required for deletion'
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                // Check if work exists
                const existing = await db.query.works.findFirst({
                    where: eq(works.id, id)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Work not found',
                        id: id
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                await db.delete(works).where(eq(works.id, id));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Works API] DELETE removed work "${id}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Work deleted',
                    id: id
                }), {
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Works API] DELETE failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to delete work',
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
        console.error(`❌ [Works API] Error (${queryTime}ms):`, err.message);
        
        return new Response(JSON.stringify({ 
            error: 'Server error', 
            message: err.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
};

// Helper function to normalize work results
function normalizeWorkResult(work: any) {
    const parseContent = (value: unknown) => {
        if (typeof value !== 'string') return value || {};
        try {
            return JSON.parse(value);
        } catch {
            // Keep endpoint resilient even if a row contains malformed JSON.
            return {};
        }
    };

    return {
        ...work,
        content: parseContent(work.content)
    };
}

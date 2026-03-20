import { getDb } from '../db/client';
import { authors } from '../db/schema';
import { eq } from 'drizzle-orm';
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

    const startTime = Date.now();

    try {
        // Check if D1 database is available
        if (!context.env?.DB) {
            console.error('❌ [Authors API] D1 database not available');
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

        console.log(`🔷 [Authors API] ${method} request: ${url.pathname}${url.search}`);

        // Extract ID from path or query params
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const idFromPath = pathSegments[pathSegments.length - 1] !== 'authors' ? pathSegments[pathSegments.length - 1] : null;
        const id = idFromPath || url.searchParams.get('id');

        // GET handler
        if (method === 'GET') {
            if (id) {
                // Fetch single author by ID
                const result = await db.query.authors.findFirst({
                    where: eq(authors.id, id)
                });

                const queryTime = Date.now() - startTime;

                if (!result) {
                    console.warn(`⚠️ [Authors API] Author not found: ${id}`);
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                const normalizedResult = normalizeAuthorResult(result);

                console.log(`✅ [Authors API] GET found author "${normalizedResult.name}" (${queryTime}ms)`);

                return new Response(JSON.stringify(normalizedResult), {
                    headers: {
                        ...corsHeaders,
                        'Cache-Control': 'public, max-age=3600',
                        'X-Data-Source': 'cloudflare-d1'
                    }
                });
            }

            // Fetch all authors
            const results = await db.query.authors.findMany();

            const queryTime = Date.now() - startTime;
            console.log(`✅ [Authors API] GET fetched ${results.length} authors (${queryTime}ms)`);

            const normalized = results.map(normalizeAuthorResult);
            
            return new Response(JSON.stringify(normalized), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'cloudflare-d1',
                    'X-Author-Count': results.length.toString()
                }
            });
        }

        // POST handler - Create new author
        if (method === 'POST') {
            try {
                const body = await context.request.json();
                
                // Validate required fields
                if (!body.id || !body.name) {
                    return new Response(JSON.stringify({ 
                        error: 'Missing required fields',
                        required: ['id', 'name']
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                // Check if author already exists
                const existing = await db.query.authors.findFirst({
                    where: eq(authors.id, body.id)
                });

                if (existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Author already exists',
                        id: body.id
                    }), {
                        status: 409,
                        headers: corsHeaders
                    });
                }

                // Create new author
                const newAuthor = {
                    id: body.id,
                    name: body.name,
                    latinName: body.latinName || '',
                    title: body.title || '',
                    years: body.years || '',
                    birthYear: body.birthYear || null,
                    deathYear: body.deathYear || null,
                    description: body.description || '',
                    heroImage: body.heroImage || '',
                    theme: body.theme || '',
                    color: body.color || '',
                    highlights: body.highlights || []
                };

                await db.insert(authors).values(newAuthor);
                
                const queryTime = Date.now() - startTime;
                console.log(`✅ [Authors API] POST created author "${newAuthor.name}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Author created',
                    author: normalizeAuthorResult(newAuthor)
                }), {
                    status: 201,
                    headers: corsHeaders
                });
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('❌ [Authors API] POST failed:', errorMessage);
                return new Response(JSON.stringify({ 
                    error: 'Failed to create author',
                    message: errorMessage
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
        }

        // PUT handler - Update author
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

                // Check if author exists
                const existing = await db.query.authors.findFirst({
                    where: eq(authors.id, id)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Author not found',
                        id: id
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                // Update author
                const updatedData = {
                    name: body.name ?? existing.name,
                    latinName: body.latinName ?? existing.latinName,
                    title: body.title ?? existing.title,
                    years: body.years ?? existing.years,
                    birthYear: body.birthYear ?? existing.birthYear,
                    deathYear: body.deathYear ?? existing.deathYear,
                    description: body.description ?? existing.description,
                    heroImage: body.heroImage ?? existing.heroImage,
                    theme: body.theme ?? existing.theme,
                    color: body.color ?? existing.color,
                    highlights: body.highlights ?? existing.highlights
                };

                await db.update(authors)
                    .set(updatedData)
                    .where(eq(authors.id, id));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Authors API] PUT updated author "${id}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Author updated',
                    id: id
                }), {
                    headers: corsHeaders
                });
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('❌ [Authors API] PUT failed:', errorMessage);
                return new Response(JSON.stringify({ 
                    error: 'Failed to update author',
                    message: errorMessage
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

                // Check if author exists
                const existing = await db.query.authors.findFirst({
                    where: eq(authors.id, id)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Author not found',
                        id: id
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                await db.delete(authors).where(eq(authors.id, id));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Authors API] DELETE removed author "${id}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Author deleted',
                    id: id
                }), {
                    headers: corsHeaders
                });
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('❌ [Authors API] DELETE failed:', errorMessage);
                return new Response(JSON.stringify({ 
                    error: 'Failed to delete author',
                    message: errorMessage
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

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        const queryTime = Date.now() - startTime;
        console.error(`❌ [Authors API] Error (${queryTime}ms):`, errorMessage);
        
        return new Response(JSON.stringify({ 
            error: 'Server error', 
            message: errorMessage
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
};

// Helper function to normalize author results
interface AuthorResult {
    id: string;
    name: string | null;
    latin_name: string | null; // database field name
    title: string | null;
    years: string | null;
    birth_year: number | null; // database field name
    death_year: number | null; // database field name
    description: string | null;
    hero_image: string | null; // database field name
    theme: string | null;
    color: string | null;
    highlights: unknown;
    [key: string]: unknown;
}

function normalizeAuthorResult(author: any) {
    console.log('🔧 [Authors API] Normalizing author:', author.id, 'current hero_image:', author.hero_image);
    const heroImage = author.id === 'cicero' ? '/images/cicero-hero.png' : author.hero_image;
    
    return {
        id: author.id,
        name: author.name,
        latinName: author.latin_name,
        title: author.title,
        years: author.years,
        birthYear: author.birth_year,
        deathYear: author.death_year,
        description: author.description,
        heroImage: heroImage,
        theme: author.theme,
        color: author.color,
        highlights: typeof author.highlights === 'string' ? JSON.parse(author.highlights) : author.highlights || [],
    };
}

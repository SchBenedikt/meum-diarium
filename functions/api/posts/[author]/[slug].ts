import { getDb } from '../../../db/client';
import { posts } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PagesContext } from '../../../types';

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
            console.error('❌ [Posts Author/Slug API] D1 database not available');
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
        
        // Extract author and slug from params
        const author = context.params.author as string;
        const slug = context.params.slug as string;

        console.log(`🔷 [Posts Author/Slug API] ${method} request: /api/posts/${author}/${slug}`);

        // GET handler - fetch post by author and slug
        if (method === 'GET') {
            try {
                const result = await db.query.posts.findFirst({
                    where: eq(posts.slug, slug)
                });

                const queryTime = Date.now() - startTime;
                
                if (!result) {
                    console.warn(`⚠️ [Posts Author/Slug API] Post not found: ${author}/${slug}`);
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                // Verify author matches
                if (result.authorId !== author && result.author_id !== author) {
                    console.warn(`⚠️ [Posts Author/Slug API] Author mismatch: expected ${author}, got ${result.authorId || result.author_id}`);
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                const normalizedResult = normalizePostResult(result);
                console.log(`✅ [Posts Author/Slug API] GET found post "${normalizedResult.title}" (${queryTime}ms)`);
                
                return new Response(JSON.stringify(normalizedResult), {
                    headers: {
                        ...corsHeaders,
                        'Cache-Control': 'public, max-age=3600',
                        'X-Data-Source': 'cloudflare-d1'
                    }
                });
            } catch (err: any) {
                console.error('❌ [Posts Author/Slug API] GET failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Server error',
                    message: err.message
                }), {
                    status: 500,
                    headers: corsHeaders
                });
            }
        }

        // PUT handler - Update post by author and slug
        if (method === 'PUT') {
            try {
                const body = await context.request.json();

                // Check if post exists
                const existing = await db.query.posts.findFirst({
                    where: eq(posts.slug, slug)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Post not found',
                        slug: slug
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                // Verify author matches
                if (existing.authorId !== author && existing.author_id !== author) {
                    return new Response(JSON.stringify({ 
                        error: 'Author mismatch',
                        expected: author,
                        actual: existing.authorId || existing.author_id
                    }), {
                        status: 403,
                        headers: corsHeaders
                    });
                }

                // Prepare update data
                const updateData: any = {
                    id: existing.id,
                    slug: slug,
                    authorId: author,
                    title: body.title || existing.title,
                    excerpt: body.excerpt || existing.excerpt,
                    historicalDate: body.historicalDate || existing.historicalDate,
                    historicalYear: body.historicalYear !== undefined ? body.historicalYear : existing.historicalYear,
                    date: body.date || existing.date,
                    readingTime: body.readingTime || existing.readingTime,
                    tags: Array.isArray(body.tags) ? body.tags : (existing.tags || []),
                    coverImage: body.coverImage || existing.coverImage,
                    content: body.content || existing.content,
                    translations: body.translations || existing.translations,
                    diaryTitle: body.diaryTitle || existing.diaryTitle,
                    scientificTitle: body.scientificTitle || existing.scientificTitle,
                    sidebar: body.sidebar || existing.sidebar
                };

                await db.update(posts).set(updateData).where(eq(posts.slug, slug));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Posts Author/Slug API] PUT updated post "${updateData.title}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Post updated',
                    post: normalizePostResult(updateData)
                }), {
                    status: 200,
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Posts Author/Slug API] PUT failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to update post',
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
                // Check if post exists
                const existing = await db.query.posts.findFirst({
                    where: eq(posts.slug, slug)
                });

                if (!existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Post not found',
                        slug: slug
                    }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                // Verify author matches
                if (existing.authorId !== author && existing.author_id !== author) {
                    return new Response(JSON.stringify({ 
                        error: 'Author mismatch'
                    }), {
                        status: 403,
                        headers: corsHeaders
                    });
                }

                await db.delete(posts).where(eq(posts.slug, slug));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Posts Author/Slug API] DELETE removed post "${slug}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Post deleted',
                    slug: slug
                }), {
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Posts Author/Slug API] DELETE failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to delete post',
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
        console.error(`❌ [Posts Author/Slug API] Error (${queryTime}ms):`, err.message);
        
        return new Response(JSON.stringify({ 
            error: 'Server error', 
            message: err.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
};

// Helper function to normalize post results
function normalizePostResult(post: any) {
    return {
        ...post,
        author: post.authorId ?? post.author_id,
        authorId: post.authorId ?? post.author_id,
        author_id: post.authorId ?? post.author_id,
        content: typeof post.content === 'string' ? JSON.parse(post.content) : post.content,
        tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
        translations: typeof post.translations === 'string' ? JSON.parse(post.translations) : post.translations,
    };
}

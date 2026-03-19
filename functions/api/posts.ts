import { getDb } from '../db/client';
import { posts } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
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
            console.error('❌ [Posts API] D1 database not available');
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

        console.log(`🔷 [Posts API] ${method} request: ${url.pathname}${url.search}`);

        // Extract slug from URL path or query params
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const slugFromPath = pathSegments[pathSegments.length - 1] !== 'posts' ? pathSegments[pathSegments.length - 1] : null;
        const slug = slugFromPath || url.searchParams.get('slug');
        const tag = url.searchParams.get('tag');

        // GET handler
        if (method === 'GET') {
            if (slug) {
                const result = await db.query.posts.findFirst({
                    where: eq(posts.slug, slug)
                });

                const queryTime = Date.now() - startTime;
                
                if (!result) {
                    console.warn(`⚠️ [Posts API] Post not found: ${slug}`);
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                // Normalize fields
                const normalizedResult = normalizePostResult(result);

                console.log(`✅ [Posts API] GET found post "${normalizedResult.title}" (${queryTime}ms)`);
                
                return new Response(JSON.stringify(normalizedResult), {
                    headers: {
                        ...corsHeaders,
                        'Cache-Control': 'public, max-age=3600',
                        'X-Data-Source': 'cloudflare-d1'
                    }
                });
            }

            // Fetch all posts
            const allPosts = await db.query.posts.findMany({
                orderBy: [desc(posts.date)]
            });

            let filtered = allPosts.map(normalizePostResult);
            
            if (tag) {
                filtered = filtered.filter((post: any) => {
                    const tags = post.tags;
                    return Array.isArray(tags) && tags.includes(tag);
                });
            }

            const queryTime = Date.now() - startTime;
            console.log(`✅ [Posts API] GET fetched ${filtered.length} posts (${queryTime}ms)`);

            return new Response(JSON.stringify(filtered), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'cloudflare-d1',
                    'X-Post-Count': filtered.length.toString()
                }
            });
        }

        // POST handler - Create new post
        if (method === 'POST') {
            try {
                const body = await context.request.json();
                
                // Validate required fields
                if (!body.slug || !body.title) {
                    return new Response(JSON.stringify({ 
                        error: 'Missing required fields',
                        required: ['slug', 'title']
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

                // Check if post already exists
                const existing = await db.query.posts.findFirst({
                    where: eq(posts.slug, body.slug)
                });

                if (existing) {
                    return new Response(JSON.stringify({ 
                        error: 'Post already exists',
                        slug: body.slug
                    }), {
                        status: 409,
                        headers: corsHeaders
                    });
                }

                // Create new post
                const newPost = {
                    id: body.id || `post-${Date.now()}`,
                    slug: body.slug,
                    authorId: body.authorId || body.author,
                    title: body.title,
                    excerpt: body.excerpt || '',
                    historicalDate: body.historicalDate || '',
                    historicalYear: body.historicalYear || null,
                    date: body.date || new Date().toISOString().split('T')[0],
                    readingTime: body.readingTime || 5,
                    tags: Array.isArray(body.tags) ? body.tags : [],
                    coverImage: body.coverImage || '',
                    content: body.content || { diary: '', scientific: '' },
                    translations: body.translations || { en: {}, la: {} }
                };

                await db.insert(posts).values(newPost);
                
                const queryTime = Date.now() - startTime;
                console.log(`✅ [Posts API] POST created post "${newPost.title}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Post created',
                    post: normalizePostResult(newPost)
                }), {
                    status: 201,
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Posts API] POST failed:', err.message);
                return new Response(JSON.stringify({ 
                    error: 'Failed to create post',
                    message: err.message
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
        }

        // PUT handler - Update post
        if (method === 'PUT') {
            try {
                if (!slug) {
                    return new Response(JSON.stringify({ 
                        error: 'Slug required for update'
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

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

                // Update post
                const updatedData = {
                    title: body.title ?? existing.title,
                    excerpt: body.excerpt ?? existing.excerpt,
                    historicalDate: body.historicalDate ?? existing.historicalDate,
                    historicalYear: body.historicalYear ?? existing.historicalYear,
                    readingTime: body.readingTime ?? existing.readingTime,
                    tags: body.tags ?? existing.tags,
                    coverImage: body.coverImage ?? existing.coverImage,
                    content: body.content ?? existing.content,
                    translations: body.translations ?? existing.translations
                };

                await db.update(posts)
                    .set(updatedData)
                    .where(eq(posts.slug, slug));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Posts API] PUT updated post "${slug}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Post updated',
                    slug: slug
                }), {
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Posts API] PUT failed:', err.message);
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
                if (!slug) {
                    return new Response(JSON.stringify({ 
                        error: 'Slug required for deletion'
                    }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }

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

                await db.delete(posts).where(eq(posts.slug, slug));

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Posts API] DELETE removed post "${slug}" (${queryTime}ms)`);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: 'Post deleted',
                    slug: slug
                }), {
                    headers: corsHeaders
                });
            } catch (err: any) {
                console.error('❌ [Posts API] DELETE failed:', err.message);
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
        console.error(`❌ [Posts API] Error (${queryTime}ms):`, err.message);
        
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
    // Handle tags - ensure it's always an array
    let normalizedTags = [];
    if (post.tags) {
        if (typeof post.tags === 'string') {
            try {
                const parsed = JSON.parse(post.tags);
                normalizedTags = Array.isArray(parsed) ? parsed : [];
            } catch {
                // If JSON parsing fails, try to handle common string formats
                if (post.tags.includes('[') && post.tags.includes(']')) {
                    // It might be a stringified array with issues
                    try {
                        const cleanTags = post.tags
                            .replace(/[\[\]"]/g, '')
                            .replace(/,\s*/g, ',')
                            .trim();
                        normalizedTags = cleanTags ? cleanTags.split(',') : [];
                    } catch {
                        normalizedTags = [];
                    }
                } else if (post.tags.trim()) {
                    // Split by commas if it's a comma-separated string
                    normalizedTags = post.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
                }
            }
        } else if (Array.isArray(post.tags)) {
            normalizedTags = post.tags;
        }
    }
    
    return {
        ...post,
        author: post.authorId ?? post.author_id,
        authorId: post.authorId ?? post.author_id,
        author_id: post.authorId ?? post.author_id,
        content: typeof post.content === 'string' ? JSON.parse(post.content) : post.content,
        tags: normalizedTags,
        translations: typeof post.translations === 'string' ? JSON.parse(post.translations) : post.translations,
    };
}

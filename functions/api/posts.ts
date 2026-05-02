import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        const url = new URL(context.request.url);
        const method = context.request.method;

        if (method !== 'GET') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: corsHeaders
            });
        }

        console.log(`🔷 [Posts API] ${method} request: ${url.pathname}${url.search}`);

        // Extract author and slug from URL path: /api/posts/{author}/{slug}
        const pathSegments = url.pathname.split('/').filter(Boolean);
        // pathSegments: ['api', 'posts'] or ['api', 'posts', author] or ['api', 'posts', author, slug]
        const postsIndex = pathSegments.indexOf('posts');
        const author = postsIndex >= 0 && pathSegments.length > postsIndex + 1 ? pathSegments[postsIndex + 1] : null;
        const slug = postsIndex >= 0 && pathSegments.length > postsIndex + 2 ? pathSegments[postsIndex + 2] : (url.searchParams.get('slug') || null);
        const tag = url.searchParams.get('tag');
        const authorParam = url.searchParams.get('author') || author;

        // GET /api/posts/{author}/{slug} – serve a single post file
        if (author && slug) {
            try {
                const fileUrl = new URL(`/posts/${author}/${slug}.json`, url.origin);
                const fileResponse = await context.env.ASSETS.fetch(new Request(fileUrl.toString()));

                if (!fileResponse.ok) {
                    console.warn(`⚠️ [Posts API] Post file not found: ${author}/${slug}`);
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }

                const post = await fileResponse.json() as any;
                // Ensure author fields are set
                post.author = post.author || author;
                post.authorId = post.author;

                const queryTime = Date.now() - startTime;
                console.log(`✅ [Posts API] Served post "${post.title}" from file (${queryTime}ms)`);

                return new Response(JSON.stringify(post), {
                    headers: {
                        ...corsHeaders,
                        'Cache-Control': 'public, max-age=3600',
                        'X-Data-Source': 'static-files'
                    }
                });
            } catch (err: any) {
                console.error(`❌ [Posts API] Failed to load post ${author}/${slug}:`, err.message);
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
        }

        // GET /api/posts – serve all posts from index.json
        try {
            const indexUrl = new URL('/posts/index.json', url.origin);
            const indexResponse = await context.env.ASSETS.fetch(new Request(indexUrl.toString()));

            if (!indexResponse.ok) {
                throw new Error(`Index file not available: ${indexResponse.status}`);
            }

            const index = await indexResponse.json() as { posts: any[] };
            let allPosts: any[] = index.posts || [];

            // Filter by author if provided
            if (authorParam) {
                allPosts = allPosts.filter((p: any) => p.author === authorParam);
            }

            // Filter by tag if provided
            if (tag) {
                allPosts = allPosts.filter((p: any) =>
                    Array.isArray(p.tags) && p.tags.includes(tag)
                );
            }

            // Sort by date descending
            allPosts.sort((a: any, b: any) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });

            // Ensure authorId is set on all posts
            allPosts = allPosts.map((p: any) => ({ ...p, authorId: p.author }));

            const queryTime = Date.now() - startTime;
            console.log(`✅ [Posts API] Served ${allPosts.length} posts from static files (${queryTime}ms)`);

            return new Response(JSON.stringify(allPosts), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600',
                    'X-Data-Source': 'static-files',
                    'X-Post-Count': allPosts.length.toString()
                }
            });
        } catch (err: any) {
            console.error(`❌ [Posts API] Failed to load post index:`, err.message);
            return new Response(JSON.stringify([]), {
                headers: {
                    ...corsHeaders,
                    'X-Data-Source': 'static-files',
                    'X-Post-Count': '0'
                }
            });
        }

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

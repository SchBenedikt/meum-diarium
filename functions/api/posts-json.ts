import { PagesContext } from '../types';

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

    const url = new URL(context.request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // GET /api/posts - return all posts from JSON files
    if (context.request.method === 'GET' && pathSegments.length === 2 && pathSegments[1] === 'posts') {
        try {
            console.log('📝 [Production] GET /api/posts - serving from JSON files');
            
            // List all author directories
            const authorDirs = ['caesar', 'augustus', 'cicero', 'catilina', 'seneca'];
            let allPosts: any[] = [];
            
            for (const authorDir of authorDirs) {
                try {
                    // List all post files for this author
                    const postFiles = [
                        'adoption-durch-caesar.json',
                        'das-zweite-triumvirat.json',
                        'der-prinzipat.json',
                        'die-schlacht-bei-actium.json',
                        'pax-augusta.json',
                        'schlacht-bei-philippi.json',
                        // Add more files as needed
                    ];
                    
                    for (const file of postFiles) {
                        try {
                            const filePath = `/api/posts/${authorDir}/${file}`;
                            const fileResponse = await fetch(`https://00d6eaf0.meum-diarium.pages.dev${filePath}`);
                            
                            if (fileResponse.ok) {
                                const post = await fileResponse.json();
                                post.author = authorDir;
                                post.authorId = authorDir;
                                allPosts.push(post);
                            }
                        } catch (fileError) {
                            // Skip files that don't exist
                            continue;
                        }
                    }
                } catch (authorError) {
                    // Skip authors that don't exist
                    continue;
                }
            }
            
            // Sort by date (newest first)
            allPosts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
            
            console.log(`✅ [Production] Served ${allPosts.length} posts from JSON files`);
            
            return new Response(JSON.stringify(allPosts), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=300', // 5 minutes cache
                    'X-Data-Source': 'json-files',
                    'X-Post-Count': allPosts.length.toString()
                }
            });
            
        } catch (error) {
            console.error('❌ [Production] Error serving posts from JSON:', error);
            return new Response(JSON.stringify([]), {
                headers: corsHeaders
            });
        }
    }
    
    // GET /api/posts/:author/:slug - return specific post
    if (context.request.method === 'GET' && pathSegments.length === 4 && pathSegments[1] === 'posts') {
        const [, , author, slug] = pathSegments;
        
        try {
            console.log(`📝 [Production] GET /api/posts/${author}/${slug} - serving from JSON files`);
            
            const filePath = `/api/posts/${author}/${slug}.json`;
            const fileResponse = await fetch(`https://00d6eaf0.meum-diarium.pages.dev${filePath}`);
            
            if (fileResponse.ok) {
                const post = await fileResponse.json();
                post.author = author;
                post.authorId = author;
                
                console.log(`✅ [Production] Served post: ${post.title}`);
                
                return new Response(JSON.stringify(post), {
                    headers: {
                        ...corsHeaders,
                        'Cache-Control': 'public, max-age=3600', // 1 hour cache
                        'X-Data-Source': 'json-files'
                    }
                });
            } else {
                console.log(`⚠️ [Production] Post not found: ${author}/${slug}`);
                return new Response(JSON.stringify({ error: 'Not found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
            
        } catch (error) {
            console.error('❌ [Production] Error serving post:', error);
            return new Response(JSON.stringify({ error: 'Internal server error' }), {
                status: 500,
                headers: corsHeaders
            });
        }
    }
    
    // Other methods not implemented
    return new Response(JSON.stringify({ 
        error: 'Method not allowed' 
    }), {
        status: 405,
        headers: corsHeaders
    });
};

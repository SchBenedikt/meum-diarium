import { PagesContext } from '../types';

export const onRequest = async (context: PagesContext) => {
    const url = new URL(context.request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const pageMap: Record<string, string> = {
        'caesar': 'caesar.json',
        'cicero': 'cicero.json',
        'augustus': 'augustus.json',
        'catilina': 'catilina.json',
        'seneca': 'seneca.json',
        'about': 'about.json',
        'author-about-caesar': 'caesar.json',
        'author-about-cicero': 'cicero.json',
        'author-about-augustus': 'augustus.json',
        'author-about-catilina': 'catilina.json',
        'author-about-seneca': 'seneca.json'
    };
    
    // Handle CORS
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // GET /api/pages
    if (context.request.method === 'GET' && pathSegments.length === 2 && pathSegments[0] === 'api' && pathSegments[1] === 'pages') {
        try {
            const entries = Object.entries(pageMap);
            const results = await Promise.all(entries.map(async ([slug, fileName]) => {
                try {
                    const assetUrl = new URL(`/api/pages/${fileName}`, url.origin);
                    const staticResponse = await fetch(assetUrl.toString());
                    if (!staticResponse.ok) {
                        return { slug, title: slug, dataSource: 'fallback' };
                    }

                    const data = await staticResponse.json();
                    const title = data?.heroTitle || data?.title || slug;
                    return { slug, title, dataSource: 'static-files' };
                } catch {
                    return { slug, title: slug, dataSource: 'fallback' };
                }
            }));

            return new Response(JSON.stringify(results), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=300',
                    'X-Data-Source': 'mixed'
                }
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            return new Response(JSON.stringify({ error: 'Internal Error', message: errorMessage }), {
                status: 500,
                headers: corsHeaders
            });
        }
    }

    // GET /api/pages/:slug
    if (context.request.method === 'GET' && pathSegments.length === 3 && pathSegments[0] === 'api' && pathSegments[1] === 'pages') {
        const slug = pathSegments[2];
        
        try {
            console.log(`📄 [Pages API] GET /api/pages/${slug} - serving from JSON files`);
            
            // Map slugs to actual JSON files
            const fileName = pageMap[slug];
            if (!fileName) {
                console.log(`⚠️ [Pages API] Unknown slug: ${slug}`);
                return new Response(JSON.stringify({ error: 'Not found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
            
            // Try to fetch from static assets first
            try {
                const assetUrl = new URL(`/api/pages/${fileName}`, url.origin);
                const staticResponse = await fetch(assetUrl.toString());
                
                if (staticResponse.ok) {
                    const data = await staticResponse.json();
                    console.log(`✅ [Pages API] Served page from static assets: ${slug}`);
                    
                    return new Response(JSON.stringify(data), {
                        headers: {
                            ...corsHeaders,
                            'Cache-Control': 'public, max-age=3600',
                            'X-Data-Source': 'static-files'
                        }
                    });
                }
            } catch (staticError) {
                console.log(`⚠️ [Pages API] Static file not accessible: ${fileName}`);
            }
            
            // Fallback: return basic data
            console.log(`⚠️ [Pages API] Using fallback data for: ${slug}`);
            const fallbackData = {
                slug: slug,
                heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1),
                heroSubtitle: 'Historische Persönlichkeit',
                introText: `Informationen über ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
                sections: [],
                highlights: [],
                translations: {
                    en: { heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1) },
                    la: { heroTitle: slug.charAt(0).toUpperCase() + slug.slice(1) }
                }
            };
            
            return new Response(JSON.stringify(fallbackData), {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=300',
                    'X-Data-Source': 'fallback-data'
                }
            });
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error(`❌ [Pages API] Error:`, errorMessage);
            return new Response(JSON.stringify({ error: 'Internal Error', message: errorMessage }), {
                status: 500,
                headers: corsHeaders
            });
        }
    }

    // Invalid endpoint
    return new Response(JSON.stringify({ 
        error: 'Not found',
        message: 'Invalid API endpoint'
    }), {
        status: 404,
        headers: corsHeaders
    });
};

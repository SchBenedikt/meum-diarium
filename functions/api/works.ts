import type { PagesContext } from '../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const startTime = Date.now();

    try {
        if (!context.env?.DB) {
            return new Response(JSON.stringify({ error: 'Database not configured' }), {
                status: 503, headers: corsHeaders
            });
        }

        const url = new URL(context.request.url);
        const method = context.request.method;
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const idFromPath = pathSegments[pathSegments.length - 1] !== 'works' ? pathSegments[pathSegments.length - 1] : null;
        const id = idFromPath || url.searchParams.get('slug');

        if (method === 'GET') {
            if (id) {
                const row = await context.env.DB.prepare('SELECT * FROM works WHERE id = ?').bind(id).first();
                if (!row) {
                    return new Response(JSON.stringify({ error: 'Not Found' }), {
                        status: 404, headers: corsHeaders
                    });
                }
                const parsed = parseWorkRow(row);
                return new Response(JSON.stringify(parsed), {
                    headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=3600' }
                });
            }

            const { results } = await context.env.DB.prepare('SELECT * FROM works').all();
            const parsed = results.map(parseWorkRow);
            return new Response(JSON.stringify(parsed), {
                headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=3600', 'X-Work-Count': results.length.toString() }
            });
        }

        if (method === 'POST') {
            const body = await context.request.json();
            if (!body.id || !body.title) {
                return new Response(JSON.stringify({ error: 'Missing required fields', required: ['id', 'title'] }), {
                    status: 400, headers: corsHeaders
                });
            }

            const existing = await context.env.DB.prepare('SELECT id FROM works WHERE id = ?').bind(body.id).first();
            if (existing) {
                return new Response(JSON.stringify({ error: 'Work already exists', id: body.id }), {
                    status: 409, headers: corsHeaders
                });
            }

            await context.env.DB.prepare(
                'INSERT INTO works (id, title, author_id, description, type, date, cover_image, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            ).bind(body.id, body.title, body.authorId || null, body.description || '', body.type || '', body.date || '', body.coverImage || '', JSON.stringify(body.content || {})).run();

            return new Response(JSON.stringify({ success: true, message: 'Work created' }), {
                status: 201, headers: corsHeaders
            });
        }

        if (method === 'PUT') {
            if (!id) {
                return new Response(JSON.stringify({ error: 'ID required for update' }), {
                    status: 400, headers: corsHeaders
                });
            }

            const existing = await context.env.DB.prepare('SELECT * FROM works WHERE id = ?').bind(id).first();
            if (!existing) {
                return new Response(JSON.stringify({ error: 'Work not found', id }), {
                    status: 404, headers: corsHeaders
                });
            }

            const body = await context.request.json();
            await context.env.DB.prepare(
                'UPDATE works SET title = ?, author_id = ?, description = ?, type = ?, date = ?, cover_image = ?, content = ? WHERE id = ?'
            ).bind(
                body.title ?? existing.title,
                body.authorId ?? existing.author_id,
                body.description ?? existing.description,
                body.type ?? existing.type,
                body.date ?? existing.date,
                body.coverImage ?? existing.cover_image,
                body.content ? JSON.stringify(body.content) : existing.content,
                id
            ).run();

            return new Response(JSON.stringify({ success: true, message: 'Work updated' }), {
                headers: corsHeaders
            });
        }

        if (method === 'DELETE') {
            if (!id) {
                return new Response(JSON.stringify({ error: 'ID required for deletion' }), {
                    status: 400, headers: corsHeaders
                });
            }

            const existing = await context.env.DB.prepare('SELECT id FROM works WHERE id = ?').bind(id).first();
            if (!existing) {
                return new Response(JSON.stringify({ error: 'Work not found', id }), {
                    status: 404, headers: corsHeaders
                });
            }

            await context.env.DB.prepare('DELETE FROM works WHERE id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true, message: 'Work deleted' }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405, headers: corsHeaders
        });

    } catch (err: any) {
        console.error(`❌ [Works API] Error:`, err.message);
        return new Response(JSON.stringify({ error: 'Server error', message: err.message }), {
            status: 500, headers: corsHeaders
        });
    }
};

function parseWorkRow(row: any) {
    return {
        ...row,
        content: typeof row.content === 'string' ? tryParseJson(row.content) : (row.content || {}),
    };
}

function tryParseJson(val: string) {
    try { return JSON.parse(val); }
    catch { return val; }
}



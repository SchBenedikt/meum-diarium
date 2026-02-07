import { getVocabDb } from '../../db/vocab-client';
import { voc } from '../../db/vocab-schema';
import { like, or, desc } from 'drizzle-orm';
import type { PagesContext } from '../../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    console.log('🔍 [Vocab API] Starting request');
    console.log('🔍 [Vocab API] Environment keys:', Object.keys(context.env));
    console.log('🔍 [Vocab API] Vocab binding available:', !!context.env?.vocab);
    
    // Check if D1 database is available
    if (!context.env?.vocab) {
        console.error('❌ [Vocab API] D1 vocab database not available');
        return new Response(JSON.stringify({ 
            error: 'Database not configured',
            message: 'D1 vocab database binding not found'
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }

    const db = getVocabDb(context.env);
    const url = new URL(context.request.url);
    const searchQuery = url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
        let results;

        if (searchQuery) {
            // Search in latin, desc (German), and key fields
            const searchPattern = `%${searchQuery}%`;
            results = await db.query.voc.findMany({
                where: or(
                    like(voc.latin, searchPattern),
                    like(voc.desc, searchPattern),
                    like(voc.key, searchPattern)
                ),
                limit: limit,
                offset: offset,
                orderBy: [desc(voc.id)]
            });
        } else {
            // Return random or recent entries if no search query
            results = await db.query.voc.findMany({
                limit: limit,
                offset: offset,
                orderBy: [desc(voc.id)]
            });
        }

        return new Response(JSON.stringify({
            results,
            count: results.length,
            limit,
            offset
        }), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e: any) {
        console.error('Vocab API Error:', e);
        return new Response(JSON.stringify({ 
            error: 'Internal Error', 
            message: e.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }
};

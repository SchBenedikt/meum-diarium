import { getVocabDb } from '../../db/vocab-client';
import { voc } from '../../db/vocab-schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const db = getVocabDb(context.env);
    const { vokId } = context.params;

    if (!vokId || typeof vokId !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid vocabulary ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }

    try {
        // Get the vocabulary entry with all its forms
        const entry = await db.query.voc.findFirst({
            where: eq(voc.vokId, vokId),
            with: {
                forms: true,
                grammarForms: true,
            }
        });

        if (!entry) {
            return new Response(JSON.stringify({ error: 'Vocabulary not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        return new Response(JSON.stringify(entry), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e: any) {
        console.error('Vocab Detail API Error:', e);
        return new Response(JSON.stringify({ 
            error: 'Internal Error', 
            message: e.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }
};

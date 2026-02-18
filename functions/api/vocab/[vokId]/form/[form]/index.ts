import { getVocabDb } from '../../../../../db/vocab-client';
import { form } from '../../../../../db/vocab-schema';
import { eq, and } from 'drizzle-orm';

export const onRequest = async (context: any) => {
    console.log('🔍 [Form Detail API] Starting request for vokId:', context.params.vokId, 'form:', context.params.form);
    console.log('🔍 [Form Detail API] Environment keys:', Object.keys(context.env || {}));
    console.log('🔍 [Form Detail API] Vocab binding available:', !!context.env?.vocab);
    
    // Check if D1 database is available
    if (!context.env?.vocab) {
        console.error('❌ [Form Detail API] D1 vocab database not available');
        return new Response(JSON.stringify({ 
            error: 'Database not configured',
            message: 'D1 vocab database binding not found'
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }

    const db = getVocabDb(context.env);
    const { vokId, form: formParam } = context.params;

    if (!vokId || typeof vokId !== 'string' || !formParam || typeof formParam !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid parameters' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }

    try {
        // Try to find the form in the FORM table
        const formRecord = await db
            .select()
            .from(form)
            .where(and(
                eq(form.vokId, vokId),
                eq(form.form, decodeURIComponent(formParam))
            ))
            .limit(1);

        if (formRecord.length > 0) {
            return new Response(JSON.stringify({
                success: true,
                data: formRecord[0]
            }), {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        // If not found in FORM table, try to find similar forms
        const similarForms = await db
            .select()
            .from(form)
            .where(eq(form.vokId, vokId))
            .limit(10);

        return new Response(JSON.stringify({
            success: false,
            message: 'Form not found',
            similarForms: similarForms
        }), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Error fetching form:', error);
        return new Response(JSON.stringify(
            { error: 'Internal server error' }
        ), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }
};

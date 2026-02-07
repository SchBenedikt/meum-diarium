import { getVocabDb } from '../../db/vocab-client.ts';
import { voc, grammar, form } from '../../db/vocab-schema.ts';
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
        // Get the vocabulary entry
        const entry = await db.query.voc.findFirst({
            where: eq(voc.vokId, vokId),
        });

        if (!entry) {
            return new Response(JSON.stringify({ error: 'Vocabulary not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        // Get all grammar forms for this vocabulary entry
        const grammarForms = await db.select()
            .from(grammar)
            .where(eq(grammar.vokId, vokId))
            .all();

        // Get all form descriptions for this vocabulary entry
        const formDescriptions = await db.select()
            .from(form)
            .where(eq(form.vokId, vokId))
            .all();

        // Create a map of form -> bestimmung for quick lookup
        const formDescriptionMap = new Map<string, string[]>();
        for (const formDesc of formDescriptions) {
            if (formDesc.form) {
                const normalizedForm = formDesc.form.toLowerCase().trim();
                if (!formDescriptionMap.has(normalizedForm)) {
                    formDescriptionMap.set(normalizedForm, []);
                }
                if (formDesc.bestimmung) {
                    const descriptions = formDescriptionMap.get(normalizedForm)!;
                    descriptions.push(formDesc.bestimmung);
                }
            }
        }

        // Enrich grammar forms with their descriptions from the FORM table
        const enrichedGrammarForms = grammarForms.map(gf => {
            let bestimmung: string | null = null;
            
            if (gf.form) {
                const normalizedForm = gf.form.toLowerCase().trim();
                const descriptions = formDescriptionMap.get(normalizedForm);
                
                if (descriptions && descriptions.length > 0) {
                    // Join multiple descriptions with comma if there are multiple
                    bestimmung = descriptions.join(', ');
                }
            }

            return {
                id: gf.id,
                vokId: gf.vokId,
                nr: gf.nr,
                form: gf.form,
                bestimmung: bestimmung,
            };
        });

        // Return the entry with enriched grammar forms
        // We use enrichedGrammarForms as the primary source of forms since it contains
        // all forms from GRAMMAR table with matched descriptions from FORM table
        const response = {
            ...entry,
            forms: enrichedGrammarForms, // Use enriched grammar forms as the main forms array
            grammarForms: enrichedGrammarForms, // Keep for backward compatibility
        };

        return new Response(JSON.stringify(response), {
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

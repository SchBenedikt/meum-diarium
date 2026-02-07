import { getVocabDb } from '../../db/vocab-client';
import { voc, grammar, form } from '../../db/vocab-schema';
import { eq } from 'drizzle-orm';

export const onRequest = async (context: any) => {
    console.log('🔍 [Vocab Detail API] Starting request for vokId:', context.params.vokId);
    console.log('🔍 [Vocab Detail API] Environment keys:', Object.keys(context.env || {}));
    console.log('🔍 [Vocab Detail API] Vocab binding available:', !!context.env?.vocab);
    
    // Check if D1 database is available
    if (!context.env?.vocab) {
        console.error('❌ [Vocab Detail API] D1 vocab database not available');
        return new Response(JSON.stringify({ 
            error: 'Database not configured',
            message: 'D1 vocab database binding not found'
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }

    const db = getVocabDb(context.env);
    const { vokId } = context.params;

    if (!vokId || typeof vokId !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid vocabulary ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }

    try {
        // First, find the actual vok_id from the VOC table using the numeric ID
        // The vokId parameter might be a numeric string like "510" or an actual vok_id
        let actualVokId: string;
        
        // Try to find by vokId field first (in case it's already the real vok_id)
        const entryByVokId = await db.query.voc.findFirst({
            where: eq(voc.vokId, vokId),
        });

        if (entryByVokId) {
            actualVokId = entryByVokId.vokId;
        } else {
            // Try to find by id field (numeric ID)
            const entryById = await db.query.voc.findFirst({
                where: eq(voc.id, parseInt(vokId)),
            });
            
            if (!entryById) {
                return new Response(JSON.stringify({ error: 'Vocabulary not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                });
            }
            
            actualVokId = entryById.vokId;
        }

        // Get the vocabulary entry using the actual vok_id
        const entry = entryByVokId || await db.query.voc.findFirst({
            where: eq(voc.vokId, actualVokId),
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
            .where(eq(grammar.vokId, actualVokId))
            .all();

        // Get all form descriptions for this vocabulary entry
        const formDescriptions = await db.select()
            .from(form)
            .where(eq(form.vokId, actualVokId))
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

        // Helper function to find best matching description
        const findBestDescription = (grammarForm: string): string | null => {
            const normalizedGrammarForm = grammarForm.toLowerCase().trim();
            
            // First try exact match
            if (formDescriptionMap.has(normalizedGrammarForm)) {
                const descriptions = formDescriptionMap.get(normalizedGrammarForm)!;
                return descriptions.join(', ');
            }
            
            // Try to find exact matches with common morphological variations
            for (const [formKey, descriptions] of formDescriptionMap.entries()) {
                // Check for exact matches with common ending variations
                if (normalizedGrammarForm === formKey) {
                    return descriptions.join(', ');
                }
                
                // Check for very close matches (minor differences)
                if (Math.abs(normalizedGrammarForm.length - formKey.length) <= 2 &&
                    (normalizedGrammarForm.includes(formKey) || formKey.includes(normalizedGrammarForm))) {
                    return descriptions.join(', ');
                }
            }
            
            return null;
        };

        // Enrich grammar forms with their descriptions from the FORM table
        const enrichedGrammarForms = grammarForms.map(gf => {
            let bestimmung: string | null = null;
            
            if (gf.form) {
                bestimmung = findBestDescription(gf.form);
            }

            return {
                id: gf.id,
                vokId: gf.vokId,
                nr: gf.nr,
                form: gf.form,
                bestimmung: bestimmung,
            };
        });

        // Include ALL FORM entries, even if they have corresponding GRAMMAR entries
        // This ensures we don't miss any forms
        const allFormEntries = formDescriptions.map(fd => ({
            id: fd.id,
            vokId: fd.vokId,
            nr: null,
            form: fd.form,
            bestimmung: fd.bestimmung,
        }));

        // Combine enriched grammar forms with all form entries
        // Remove duplicates based on form content
        const combinedForms = [...enrichedGrammarForms, ...allFormEntries];
        const uniqueForms = combinedForms.filter((form, index, self) => 
            index === self.findIndex(f => f.form === form.form)
        );

        // Sort forms by form content for better readability
        const allForms = uniqueForms.sort((a, b) => {
            if (!a.form) return 1;
            if (!b.form) return -1;
            return a.form.localeCompare(b.form);
        });

        // Return the entry with enriched grammar forms
        const response = {
            ...entry,
            forms: allForms,
            grammarForms: enrichedGrammarForms,
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

import { getVocabDb } from '../../../db/vocab-client';
import { voc, grammar, form } from '../../../db/vocab-schema';
import { eq } from 'drizzle-orm';
import type { PagesContext } from '../../../types';

export const onRequest = async (context: PagesContext): Promise<Response> => {
    console.log('🔍 [Vocab All API] Starting request for ALL vocabulary with forms');
    console.log('🔍 [Vocab All API] Environment keys:', Object.keys(context.env));
    console.log('🔍 [Vocab All API] Vocab binding available:', !!context.env?.vocab);
    
    // Check if D1 database is available
    if (!context.env?.vocab) {
        console.error('❌ [Vocab All API] D1 vocab database not available');
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
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const includeForms = url.searchParams.get('includeForms') !== 'false';

    try {
        // Get all vocabulary entries with pagination
        const vocabEntries = await db.query.voc.findMany({
            limit: limit,
            offset: offset,
            orderBy: [voc.id]
        });

        let enrichedEntries = vocabEntries;

        if (includeForms) {
            enrichedEntries = await Promise.all(vocabEntries.map(async (entry) => {
                try {
                    // Get all grammar forms for this vocabulary entry
                    const grammarForms = await db.select()
                        .from(grammar)
                        .where(eq(grammar.vokId, entry.vokId))
                        .all();

                    // Get all form descriptions for this vocabulary entry
                    const formDescriptions = await db.select()
                        .from(form)
                        .where(eq(form.vokId, entry.vokId))
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

                    return {
                        ...entry,
                        forms: allForms,
                        grammarForms: enrichedGrammarForms,
                    };
                } catch (error) {
                    console.error(`Error processing entry ${entry.vokId}:`, error);
                    // Return entry without forms if there's an error
                    return {
                        ...entry,
                        forms: [],
                        grammarForms: [],
                    };
                }
            }));
        }

        // Get total count for pagination
        const totalCount = await db.select().from(voc).all();

        return new Response(JSON.stringify({
            results: enrichedEntries,
            count: enrichedEntries.length,
            total: totalCount.length,
            limit,
            offset,
            includeForms
        }), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (e: any) {
        console.error('Vocab All API Error:', e);
        return new Response(JSON.stringify({ 
            error: 'Internal Error', 
            message: e.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }
};

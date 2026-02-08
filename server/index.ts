import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const BASE_URL = (process.env.SITE_URL || 'https://meum-diarium.xn--schchner-2za.de').replace(/\/$/, '');

// Known author IDs
const AUTHOR_IDS = ['caesar', 'augustus', 'cicero', 'catilina', 'seneca'];

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// **CRITICAL**: Serve static files from public folder BEFORE API routes
// This allows /api/works.json, /api/works-details/*.json to be served directly
const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir, {
    setHeaders: (res, filePath) => {
        // Set proper content type for JSON files
        if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
    }
}));

// Helper to build full URLs
const buildUrl = (path: string) => `${BASE_URL}${path}`;

// ========== ROBOTS & SEO ENDPOINTS ==========

// Serve robots.txt with dynamic sitemap reference
app.get('/robots.txt', (_req, res) => {
    const content = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Disallow admin paths
Disallow: /admin

Sitemap: ${buildUrl('/sitemap.xml')}
`;
    res.type('text/plain').send(content);
});

// Human-readable sitemap index
app.get('/sitemap-index.html', async (_req, res) => {
    const staticRoutes = [
        { path: '/', label: 'Home', priority: 1.0 },
        { path: '/about', label: 'About', priority: 0.8 },
        { path: '/timeline', label: 'Timeline', priority: 0.8 },
        { path: '/lexicon', label: 'Lexicon', priority: 0.7 },
        { path: '/search', label: 'Search', priority: 0.6 },
    ];

    const authorIds = AUTHOR_IDS;
    const authorRoutes = authorIds.flatMap((id) => ([
        { path: `/${id}`, label: `${id.charAt(0).toUpperCase() + id.slice(1)} - Timeline`, priority: 0.9 },
        { path: `/${id}/about`, label: `${id.charAt(0).toUpperCase() + id.slice(1)} - About`, priority: 0.8 },
    ]));

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meum Diarium - Sitemap Index</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
        h1 { color: #333; }
        .routes { display: grid; gap: 8px; }
        .route-item { padding: 12px; background: #f5f5f5; border-radius: 4px; border-left: 4px solid #8B4513; }
        .route-item a { color: #0066cc; text-decoration: none; font-weight: bold; }
        .route-item a:hover { text-decoration: underline; }
        .route-item .priority { font-size: 12px; color: #666; margin-top: 4px; }
    </style>
</head>
<body>
    <h1>🏛️ Meum Diarium - Sitemap Index</h1>
    <p>This is a human-readable index of all pages. For search engines, see <a href="/sitemap.xml">/sitemap.xml</a>.</p>
    
    <h2>Core Pages</h2>
    <div class="routes">
        ${staticRoutes.map((r) => `<div class="route-item"><a href="${buildUrl(r.path)}">${r.label}</a><div class="priority">Priority: ${r.priority}</div></div>`).join('')}
    </div>

    <h2>Author Pages</h2>
    <div class="routes">
        ${authorRoutes.map((r) => `<div class="route-item"><a href="${buildUrl(r.path)}">${r.label}</a><div class="priority">Priority: ${r.priority}</div></div>`).join('')}
    </div>

    <p style="margin-top: 40px; color: #666; font-size: 14px;">
        Note: This sitemap is generated dynamically. For the XML version, visit <a href="/sitemap.xml">/sitemap.xml</a>
    </p>
</body>
</html>
`;
    res.type('text/html').send(html);
});

// Serve sitemap.xml
app.get('/sitemap.xml', async (_req, res) => {
    try {
        const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
        const sitemap = await fs.readFile(sitemapPath, 'utf-8');
        res.type('application/xml').send(sitemap);
    } catch (error) {
        console.error('Error loading sitemap:', error);
        res.status(500).send('Error loading sitemap');
    }
});

// ========== API ENDPOINTS - STUB/FALLBACK ==========
// These return empty data since we're using D1 in Cloudflare Functions
// In production, these won't be hit - Cloudflare Functions handle /api/*

app.get('/api/posts', (_req, res) => {
    res.json([]);
});

app.post('/api/posts', (req, res) => {
    // In dev, always return success for create
    console.log('📝 [Dev] POST /api/posts - creating post:', req.body.slug);
    res.status(201).json({ 
        success: true, 
        message: 'Post created (dev mode)',
        post: req.body 
    });
});

app.get('/api/posts/:author/:slug', (_req, res) => {
    res.status(404).json({ error: 'Not found', message: 'Use Cloudflare Functions in production' });
});

app.put('/api/posts/:author/:slug', (req, res) => {
    // In dev, always return success for update
    const { author, slug } = req.params;
    console.log(`✏️  [Dev] PUT /api/posts/${author}/${slug} - updating post`);
    res.status(200).json({ 
        success: true, 
        message: 'Post updated (dev mode)',
        post: req.body 
    });
});

app.delete('/api/posts/:author/:slug', (req, res) => {
    // In dev, always return success for delete
    const { author, slug } = req.params;
    console.log(`🗑️  [Dev] DELETE /api/posts/${author}/${slug} - deleting post`);
    res.status(200).json({ 
        success: true, 
        message: 'Post deleted (dev mode)',
        slug: slug 
    });
});

app.get('/api/lexicon', (_req, res) => {
    res.json([]);
});

app.get('/api/lexicon/:slug', (_req, res) => {
    res.status(404).json({ error: 'Not found', message: 'Use Cloudflare Functions in production' });
});

app.get('/api/authors', (_req, res) => {
    const authors: Record<string, { id: string; name: string; slug: string }> = {};
    AUTHOR_IDS.forEach(id => {
        authors[id] = {
            id,
            name: id.charAt(0).toUpperCase() + id.slice(1),
            slug: id
        };
    });
    res.json(authors);
});

app.get('/api/works', (_req, res) => {
    res.json([]);
});

app.get('/api/works/:slug', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.get('/api/tags', (_req, res) => {
    res.json([]);
});

app.get('/api/pages/:slug', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.get('/api/translations/:lang', (_req, res) => {
    res.json({});
});

// Vocabulary API - Local development with real database
app.get('/api/vocab', async (req, res) => {
    console.log('📚 [Dev] GET /api/vocab - using local database');
    
    try {
        const { getLocalVocabDb } = await import('./db/local-vocab-client');
        const { voc } = await import('../functions/db/vocab-schema');
        const { like, or, desc } = await import('drizzle-orm');
        
        const db = getLocalVocabDb();
        const searchQuery = req.query.q as string;
        const limit = parseInt(req.query.limit as string || '50');
        const offset = parseInt(req.query.offset as string || '0');

        let results;

        if (searchQuery) {
            // Normalize search query by removing diacritical marks
            const normalizeString = (str: string) => {
                return str
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
                    .toLowerCase();
            };
            
            const normalizedSearchQuery = normalizeString(searchQuery);
            const searchPattern = `%${searchQuery}%`;
            
            // Get all vocabulary entries and filter them manually for diacritic-insensitive search
            const allEntries = await db.query.voc.findMany({
                limit: 10000, // Get more entries to filter from
                orderBy: [voc.id] // Order by ID ascending to get the actual amāre entry
            });
            
            // Filter entries with diacritic-insensitive search and rank by relevance
            results = allEntries
                .map(entry => {
                    const normalizedLatin = normalizeString(entry.latin || '');
                    const normalizedDesc = normalizeString(entry.desc || '');
                    const normalizedKey = normalizeString(entry.key || '');
                    
                    // Calculate relevance score
                    let score = 0;
                    
                    // Exact match in latin gets highest score
                    if (normalizedLatin === normalizedSearchQuery) score += 100;
                    // Starts with search query gets high score
                    else if (normalizedLatin.startsWith(normalizedSearchQuery)) score += 80;
                    // Contains search query gets medium score
                    else if (normalizedLatin.includes(normalizedSearchQuery)) score += 60;
                    
                    // Exact match in desc gets good score
                    if (normalizedDesc === normalizedSearchQuery) score += 40;
                    // Contains in desc gets lower score
                    else if (normalizedDesc.includes(normalizedSearchQuery)) score += 20;
                    
                    // Original pattern matching (for diacritic-sensitive search)
                    if (entry.latin?.includes(searchPattern)) score += 30;
                    if (entry.desc?.includes(searchPattern)) score += 15;
                    if (entry.key?.includes(searchPattern)) score += 10;
                    
                    return { entry, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score) // Sort by relevance score (descending)
                .map(item => item.entry)
                .slice(0, limit); // Apply limit after sorting
        } else {
            // Return empty results if no search query
            results = [];
        }

        res.json({
            results,
            count: results.length,
            limit,
            offset
        });
    } catch (error) {
        console.error('Vocabulary API Error:', error);
        res.status(500).json({ 
            error: 'Internal Error', 
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Vocabulary API - Get ALL vocabulary with ALL forms
app.get('/api/vocab/all', async (req, res) => {
    console.log('📚 [Dev] GET /api/vocab/all - using local database');
    
    try {
        const { getLocalVocabDb } = await import('./db/local-vocab-client');
        const { voc, grammar, form } = await import('../functions/db/vocab-schema');
        const { eq } = await import('drizzle-orm');
        
        const db = getLocalVocabDb();
        const limit = parseInt(req.query.limit as string || '100');
        const offset = parseInt(req.query.offset as string || '0');
        const includeForms = req.query.includeForms !== 'false';

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
                        
                        // Handle slash notation (e.g., "amabaris/amabare" -> try both "amabaris" and "amabare")
                        if (normalizedGrammarForm.includes('/')) {
                            const parts = normalizedGrammarForm.split('/');
                            for (const part of parts) {
                                const trimmedPart = part.trim();
                                if (formDescriptionMap.has(trimmedPart)) {
                                    const descriptions = formDescriptionMap.get(trimmedPart)!;
                                    return descriptions.join(', ');
                                }
                            }
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

        res.json({
            results: enrichedEntries,
            count: enrichedEntries.length,
            total: totalCount.length,
            limit,
            offset,
            includeForms
        });
    } catch (error) {
        console.error('Vocabulary All API Error:', error);
        res.status(500).json({ 
            error: 'Internal Error', 
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.get('/api/vocab/:vokId', async (req, res) => {
    console.log('📚 [Dev] GET /api/vocab/:vokId - using local database');
    
    try {
        const { getLocalVocabDb } = await import('./db/local-vocab-client');
        const { voc, grammar, form } = await import('../functions/db/vocab-schema');
        const { eq } = await import('drizzle-orm');
        
        const db = getLocalVocabDb();
        const { vokId } = req.params;

        if (!vokId || typeof vokId !== 'string') {
            return res.status(400).json({ error: 'Invalid vocabulary ID' });
        }

        // First, find the actual vok_id from the VOC table using the numeric ID
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
                return res.status(404).json({ error: 'Vocabulary not found' });
            }
            
            actualVokId = entryById.vokId;
        }

        // Get the vocabulary entry using the actual vok_id
        const entry = entryByVokId || await db.query.voc.findFirst({
            where: eq(voc.vokId, actualVokId),
        });

        if (!entry) {
            return res.status(404).json({ error: 'Vocabulary not found' });
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
            
            // Handle slash notation (e.g., "amabaris/amabare" -> try both "amabaris" and "amabare")
            if (normalizedGrammarForm.includes('/')) {
                const parts = normalizedGrammarForm.split('/');
                for (const part of parts) {
                    const trimmedPart = part.trim();
                    if (formDescriptionMap.has(trimmedPart)) {
                        const descriptions = formDescriptionMap.get(trimmedPart)!;
                        return descriptions.join(', ');
                    }
                }
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

        res.json(response);
    } catch (error) {
        console.error('Vocabulary Detail API Error:', error);
        res.status(500).json({ 
            error: 'Internal Error', 
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Vocabulary API - Get ALL vocabulary with ALL forms
app.get('/api/vocab/all', async (req, res) => {
    console.log('📚 [Dev] GET /api/vocab/all - using local database');
    
    try {
        const { getLocalVocabDb } = await import('./db/local-vocab-client');
        const { voc, grammar, form } = await import('../functions/db/vocab-schema');
        const { eq } = await import('drizzle-orm');
        
        const db = getLocalVocabDb();
        const limit = parseInt(req.query.limit as string || '100');
        const offset = parseInt(req.query.offset as string || '0');
        const includeForms = req.query.includeForms !== 'false';

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
                        
                        // Handle slash notation (e.g., "amabaris/amabare" -> try both "amabaris" and "amabare")
                        if (normalizedGrammarForm.includes('/')) {
                            const parts = normalizedGrammarForm.split('/');
                            for (const part of parts) {
                                const trimmedPart = part.trim();
                                if (formDescriptionMap.has(trimmedPart)) {
                                    const descriptions = formDescriptionMap.get(trimmedPart)!;
                                    return descriptions.join(', ');
                                }
                            }
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

        res.json({
            results: enrichedEntries,
            count: enrichedEntries.length,
            total: totalCount.length,
            limit,
            offset,
            includeForms
        });
    } catch (error) {
        console.error('Vocabulary All API Error:', error);
        res.status(500).json({ 
            error: 'Internal Error', 
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Dev server running - using local data files' });
});

// **CRITICAL SPA FALLBACK**: All non-API, non-static routes go to index.html for React Router
// This must be LAST to catch all deep routes like /caesar/works/:slug
app.get(/^(?!\/api\/)/, async (_req, res) => {
    try {
        const indexPath = path.resolve(__dirname, '../public/index.html');
        const html = await fs.readFile(indexPath, 'utf-8');
        res.type('text/html').send(html);
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading application');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`✅ Serving static files from public/`);
    console.log(`✅ SPA fallback enabled for deep routes`);
    console.log(`✅ API endpoints use local data (JSON files)`);
});

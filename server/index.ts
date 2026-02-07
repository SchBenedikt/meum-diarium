import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { getLocalVocabDb } from './db/local-vocab-client';
import { voc } from '../functions/db/vocab-schema';
import { like, or, desc, eq } from 'drizzle-orm';

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

// Vocabulary API - Real database connection for local development
app.get('/api/vocab', async (req, res) => {
    const query = req.query.q as string || '';
    const limit = parseInt(req.query.limit as string || '50');
    const offset = parseInt(req.query.offset as string || '0');
    
    try {
        const db = getLocalVocabDb();
        let results;

        if (query) {
            // Search in latin, desc (German), and key fields
            const searchPattern = `%${query}%`;
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
            // Return recent entries if no search query
            results = await db.query.voc.findMany({
                limit: limit,
                offset: offset,
                orderBy: [desc(voc.id)]
            });
        }

        res.json({
            results,
            count: results.length,
            limit,
            offset
        });
    } catch (error) {
        console.error('Vocab API Error:', error);
        res.status(500).json({ 
            error: 'Internal Error', 
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.get('/api/vocab/:vokId', async (req, res) => {
    const { vokId } = req.params;
    
    try {
        const db = getLocalVocabDb();
        
        // Get the vocabulary entry with all its forms
        const entry = await db.query.voc.findFirst({
            where: eq(voc.vokId, vokId),
            with: {
                forms: true,
                grammarForms: true,
            }
        });

        if (!entry) {
            return res.status(404).json({ error: 'Vocabulary not found' });
        }

        // Helper function to parse grammatical descriptions
const parseGrammaticalDescription = (description: string) => {
    if (!description) return [];
    
    return description.split(',').map(part => {
        const trimmed = part.trim();
        const match = trimmed.match(/^(Nom|Gen|Dat|Akk|Abl|Vok)\.\s+(Sg|Pl)\.?$/);
        if (match) {
            return {
                case: match[1],
                number: match[2]
            };
        }
        return null;
    }).filter(Boolean);
};

// Helper function to generate description from parsed grammatical info
const generateDescription = (caseInfo: Array<{case: string, number: string}>) => {
    if (!caseInfo || caseInfo.length === 0) return null;
    
    const caseMap: Record<string, string> = {
        'Nom': 'Nominative',
        'Gen': 'Genitive', 
        'Dat': 'Dative',
        'Akk': 'Accusative',
        'Abl': 'Ablative',
        'Vok': 'Vocative'
    };
    
    const numberMap: Record<string, string> = {
        'Sg': 'Singular',
        'Pl': 'Plural'
    };
    
    return caseInfo.map(info => `${caseMap[info.case]} ${numberMap[info.number]}`).join(', ');
};

// Helper function to recognize Latin grammatical patterns
const recognizeLatinPattern = (form: string, existingForms: Array<{form: string, bestimmung: string}>, entry: any) => {
    if (!form || form.length < 3) return null;
    
    // Strategy 1: Try to find exact match first (highest priority)
    const exactMatch = existingForms.find(f => f.form === form);
    if (exactMatch) {
        return exactMatch.bestimmung;
    }
    
    // Strategy 2: Try case-insensitive match
    const caseInsensitiveMatch = existingForms.find(f => 
        f.form && f.form.toLowerCase() === form.toLowerCase()
    );
    if (caseInsensitiveMatch) {
        return caseInsensitiveMatch.bestimmung;
    }
    
    // Strategy 3: Handle forms with alternatives like "Achillis/Achillei"
    if (form && form.includes('/')) {
        const alternatives = form.split('/');
        for (const alt of alternatives) {
            const found = existingForms.find(f => f.form === alt);
            if (found) {
                return found.bestimmung;
            }
        }
    }
    
    // Strategy 4: Smart gender inference from existing forms
    if (existingForms.length > 0) {
        // Analyze existing forms to determine word type and patterns
        const hasFeminine = existingForms.some(f => f.bestimmung && f.bestimmung.includes('fem.'));
        const hasMasculine = existingForms.some(f => f.bestimmung && f.bestimmung.includes('mask.'));
        const hasNeuter = existingForms.some(f => f.bestimmung && f.bestimmung.includes('neut.'));
        
        // Smart pattern recognition based on existing forms
        if (form.endsWith('iorum') && hasFeminine) {
            return 'Gen. Pl. mask.';
        }
        if (form.endsWith('ios') && hasFeminine) {
            return 'Akk. Pl. mask.';
        }
        if (form.endsWith('orum') && hasFeminine) {
            return 'Gen. Pl. mask.';
        }
        if (form.endsWith('is') && hasFeminine) {
            return 'Dat. Pl. mask., Abl. Pl. mask.';
        }
        if (form.endsWith('os') && hasFeminine) {
            return 'Akk. Pl. mask.';
        }
        if (form.endsWith('us') && hasFeminine) {
            return 'Nom. Sg. mask.';
        }
        if (form.endsWith('i') && hasFeminine) {
            return 'Gen. Sg. mask.';
        }
        if (form.endsWith('o') && hasFeminine) {
            return 'Dat. Sg. mask.';
        }
        if (form.endsWith('e') && hasFeminine) {
            return 'Abl. Sg. mask.';
        }
        
        // Handle specific ambiguous endings (check longer patterns first)
        if (form.endsWith('um') && hasFeminine) {
            // Only apply to shorter forms that are likely accusative singular
            if (form.length <= 6) {
                return 'Akk. Sg. mask.';
            }
        }
    }
    
    // Strategy 5: Try partial matching (form contains existing form)
    const partialMatch = existingForms.find(f => 
        f.form && form.includes(f.form)
    );
    if (partialMatch) {
        return partialMatch.bestimmung;
    }
    
    // Strategy 6: Try partial matching (existing form contains form)
    const reversePartialMatch = existingForms.find(f => 
        f.form && f.form.includes(form)
    );
    if (reversePartialMatch) {
        return reversePartialMatch.bestimmung;
    }
    
    // No pattern generation - return null if no match found
    return null;
};

// Enhance grammar forms with descriptions from FORM table
        const enhancedGrammarForms = entry.grammarForms.map(grammarForm => {
            let matchingForm = null;
            let generatedDescription = null;
            
            // Strategy 1: Exact match (highest priority)
            matchingForm = entry.forms.find(form => form.form === grammarForm.form);
            
            // Strategy 2: Handle forms with alternatives like "Achillis/Achillei"
            if (!matchingForm && grammarForm.form && grammarForm.form.includes('/')) {
                const alternatives = grammarForm.form.split('/');
                for (const alt of alternatives) {
                    const found = entry.forms.find(form => form.form === alt);
                    if (found) {
                        matchingForm = found;
                        break;
                    }
                }
            }
            
            // Strategy 3: Case-insensitive match
            if (!matchingForm && grammarForm.form) {
                matchingForm = entry.forms.find(form => 
                    form.form && form.form.toLowerCase() === grammarForm.form.toLowerCase()
                );
            }
            
            // Strategy 4: Pattern recognition for Latin forms
            if (!matchingForm && grammarForm.form) {
                generatedDescription = recognizeLatinPattern(grammarForm.form, entry.forms, entry);
            }
            
            // Strategy 5: Partial match (grammar form contains FORM entry)
            if (!matchingForm && !generatedDescription && grammarForm.form) {
                matchingForm = entry.forms.find(form => 
                    form.form && grammarForm.form.includes(form.form)
                );
            }
            
            // Strategy 6: Partial match (FORM entry contains grammar form)
            if (!matchingForm && !generatedDescription && grammarForm.form) {
                matchingForm = entry.forms.find(form => 
                    form.form && form.form.includes(grammarForm.form)
                );
            }
            
            // Log matching results for debugging
            if (grammarForm.form) {
                let matchType = 'NOT FOUND';
                let description = 'null';
                
                if (matchingForm) {
                    matchType = 'EXACT MATCH';
                    description = matchingForm.bestimmung || 'null';
                } else if (generatedDescription) {
                    matchType = 'PATTERN RECOGNITION';
                    description = generatedDescription;
                }
                
                console.log(`[Form Matching] ${matchType}: "${grammarForm.form}" -> "${description}"`);
            }
            
            return {
                ...grammarForm,
                bestimmung: matchingForm?.bestimmung || generatedDescription || null
            };
        });

        res.json({
            ...entry,
            grammarForms: enhancedGrammarForms
        });
    } catch (error) {
        console.error('Vocab Detail API Error:', error);
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

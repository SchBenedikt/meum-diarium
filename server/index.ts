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
        const { grammar, form } = await import('../functions/db/vocab-schema.js');
        
        // Get the vocabulary entry
        const entry = await db.query.voc.findFirst({
            where: eq(voc.vokId, vokId),
        });

        if (!entry) {
            return res.status(404).json({ error: 'Vocabulary not found' });
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
        res.json({
            ...entry,
            forms: enrichedGrammarForms, // Use enriched grammar forms as the main forms array
            grammarForms: enrichedGrammarForms, // Keep for backward compatibility
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

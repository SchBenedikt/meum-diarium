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

app.get('/api/posts/:author/:slug', (_req, res) => {
    res.status(404).json({ error: 'Not found', message: 'Use Cloudflare Functions in production' });
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

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Dev server running - using Cloudflare Functions for data' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Note: API endpoints return empty data in local dev.`);
    console.log(`      Deploy to Cloudflare to use D1 database.`);
});

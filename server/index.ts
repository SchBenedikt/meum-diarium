
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const BASE_URL = (process.env.SITE_URL || 'https://meum-diarium.xn--schchner-2za.de').replace(/\/$/, '');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

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
    try {
        const staticRoutes = [
            { path: '/', label: 'Home', priority: 1.0 },
            { path: '/about', label: 'About', priority: 0.8 },
            { path: '/timeline', label: 'Timeline', priority: 0.8 },
            { path: '/lexicon', label: 'Lexicon', priority: 0.7 },
            { path: '/search', label: 'Search', priority: 0.6 },
        ];

        const authorIds = await getAuthorIdsFromFile();
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
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; }
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

    <hr>
    <p><small>Last updated: ${todayIso()} | Generated dynamically from server</small></p>
</body>
</html>
        `;
        res.type('text/html').send(html);
    } catch (error) {
        console.error('Failed to generate sitemap index', error);
        res.status(500).send('Failed to generate sitemap index');
    }
});


const CONTENT_DIR = path.resolve(__dirname, '../src/content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const WORKS_DIR = path.join(CONTENT_DIR, 'works');
const WORKS_DETAILS_DIR = path.join(CONTENT_DIR, 'works-details');
const DATA_DIR = path.resolve(__dirname, '../src/data');

// Helper to sanitize slug
const sanitizeSlug = (slug: string) => slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

// Helper to escape strings for template literal
const escapeContent = (content: string) => {
    return content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
};

const escapeString = (str: string) => {
    return str.replace(/'/g, "\\'");
};

// --- Regex Helpers for Parsing TS Files ---

// Extracts a string property: key: 'value' or "key": "value"
const extractString = (content: string, key: string): string => {
    // Capture the opening quote and match until the same closing quote that is not escaped
    const regex = new RegExp(`['"]?${key}['"]?:\\s*(["'\`])([\\s\\S]*?)(?<!\\\\)\\1,?`);
    const match = content.match(regex);
    return match ? match[2] : '';
};

// Extracts a number property: key: 123
const extractNumber = (content: string, key: string): number => {
    const regex = new RegExp(`['"]?${key}['"]?:\\s*(-?\\d+(\\.\\d+)?),?`);
    const match = content.match(regex);
    return match ? parseFloat(match[1]) : 0;
};

// Extracts an array of strings: key: ['a', 'b']
const extractStringArray = (content: string, key: string): string[] => {
    const regex = new RegExp(`['"]?${key}['"]?:\\s*\\[(.*?)\\]`, 's');
    const match = content.match(regex);
    if (!match) return [];
    return match[1]
        .split(',')
        .map(s => s.trim().replace(/['"`]/g, ''))
        .filter(s => s.length > 0);
};

// Extracts content inside template literals: key: `content`
const extractTemplateLiteral = (content: string, key: string): string => {
    // Matches key: `...` allowing optional comma or whitespace after; closing backtick not escaped
    const regex = new RegExp(`['"]?${key}['"]?:\\s*\`([\\s\\S]*?)(?<!\\\\)\`(?=\\s*,|\\s*})`);
    const match = content.match(regex);
    return match ? match[1] : '';
};

// Extracts nested object (simplified, basically captures between braces)
const extractObject = (content: string, key: string): string => {
    // This is tricky with regex. We'll look for key: { ... }
    // A better approach for specific nested fields (like translations) might be to just extract the block
    const regex = new RegExp(`${key}:\\s*({[\\s\\S]*?}),\\s*\\n`); // Assumes ending with comma and newline
    const match = content.match(regex);
    return match ? match[1] : '{}';
};

// ------------------------------------------

// GET all posts
app.get('/api/posts', async (req, res) => {
    try {
        const authors = ['caesar', 'cicero', 'augustus', 'seneca']; // simplified, could scan dirs
        const allPosts: any[] = [];

        for (const author of authors) {
            const authorDir = path.join(POSTS_DIR, author);
            try {
                await fs.access(authorDir);
                const files = await fs.readdir(authorDir);

                for (const file of files) {
                    if (file.endsWith('.ts')) {
                        const filePath = path.join(authorDir, file);
                        const content = await fs.readFile(filePath, 'utf-8');

                        allPosts.push({
                            id: extractString(content, 'id') || file.replace('.ts', ''),
                            author: author,
                            slug: extractString(content, 'slug') || file.replace('.ts', ''),
                            title: extractString(content, 'title'),
                            diaryTitle: extractString(content, 'diaryTitle'),
                            scientificTitle: extractString(content, 'scientificTitle'),
                            excerpt: extractString(content, 'excerpt'),
                            historicalDate: extractString(content, 'historicalDate'),
                            historicalYear: extractNumber(content, 'historicalYear'),
                            readingTime: extractNumber(content, 'readingTime') || 5,
                            tags: extractStringArray(content, 'tags'),
                            coverImage: extractString(content, 'coverImage'),
                            content: {
                                diary: extractTemplateLiteral(content, 'diary'),
                                scientific: extractTemplateLiteral(content, 'scientific')
                            }
                        });
                    }
                }
            } catch (e) {
                // author dir might not exist
            }
        }
        res.json(allPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET single post
app.get('/api/posts/:author/:slug', async (req, res) => {
    try {
        const { author, slug } = req.params;
        const filePath = path.join(POSTS_DIR, author, `${slug}.ts`);
        const content = await fs.readFile(filePath, 'utf-8');

        // Parse complex structure
        // Translations is usually a JSON stringified object at the end of the file
        const translationsMatch = content.match(/translations:\s*({[\s\S]*?})\n};/);
        let translations = {};

        if (translationsMatch) {
            try {
                // Try strictly parsing as JSON (works for files created by Admin)
                translations = JSON.parse(translationsMatch[1]);
            } catch (e) {
                // Fallback: Manual extraction for legacy files or lax format
                // We define a helper that works on the extracted block string
                const extractNestedTranslation = (langBlock: string) => ({
                    title: extractString(langBlock, 'title'),
                    excerpt: extractString(langBlock, 'excerpt'),
                    content: {
                        diary: extractTemplateLiteral(langBlock, 'diary'), // Template literal might fail if converted to JSON escaping
                        scientific: extractTemplateLiteral(langBlock, 'scientific')
                    }
                });

                // If JSON parse failed, it might be because of JS-like syntax (single quotes, no quotes)
                // We try to extract per language
                // Note: This regex-based extraction is best-effort
                const extractLangBlock = (lang: string) => {
                    // Try to find "lang": { ... } or lang: { ... }
                    const regex = new RegExp(`['"]?${lang}['"]?:\\s*{([\\s\\S]*?)}`);
                    const match = translationsMatch[1].match(regex);
                    return match ? match[1] : '';
                };

                const enBlock = extractLangBlock('en');
                const laBlock = extractLangBlock('la');

                translations = {
                    en: enBlock ? extractNestedTranslation(enBlock) : {},
                    la: laBlock ? extractNestedTranslation(laBlock) : {}
                };
            }
        }

        const post = {
            id: extractString(content, 'id'),
            slug: extractString(content, 'slug'),
            author: extractString(content, 'author'),
            title: extractString(content, 'title'),
            diaryTitle: extractString(content, 'diaryTitle'),
            scientificTitle: extractString(content, 'scientificTitle'),
            latinTitle: extractString(content, 'latinTitle'),
            excerpt: extractString(content, 'excerpt'),
            historicalDate: extractString(content, 'historicalDate'),
            historicalYear: extractNumber(content, 'historicalYear'),
            readingTime: extractNumber(content, 'readingTime'),
            tags: extractStringArray(content, 'tags'),
            coverImage: extractString(content, 'coverImage'),
            content: {
                diary: extractTemplateLiteral(content, 'diary'),
                scientific: extractTemplateLiteral(content, 'scientific')
            },
            translations: translations
        };

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Post not found' });
    }
});

// POST creates a new post file
app.post('/api/posts', async (req, res) => {
    try {
        const { id, slug, author, title, diaryTitle, scientificTitle, content, excerpt, translations, tags, historicalDate, historicalYear, readingTime, coverImage, latinTitle } = req.body;

        if (!author || !slug || !title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const safeSlug = sanitizeSlug(slug);
        const authorDir = path.join(POSTS_DIR, author);

        // Ensure author dir exists
        await fs.mkdir(authorDir, { recursive: true });

        const filePath = path.join(authorDir, `${safeSlug}.ts`);

        // Generate File Content
        const fileContent = `import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '${id}',
  slug: '${safeSlug}',
  author: '${author}',
  title: '${escapeString(title)}',
  ${diaryTitle ? `diaryTitle: '${escapeString(diaryTitle)}',` : ''}
  ${scientificTitle ? `scientificTitle: '${escapeString(scientificTitle)}',` : ''}
  ${latinTitle ? `latinTitle: '${escapeString(latinTitle)}',` : ''}
  excerpt: '${escapeString(excerpt || '')}',
  historicalDate: '${escapeString(historicalDate || '')}',
  historicalYear: ${historicalYear || 0},
  date: new Date().toISOString().split('T')[0],
  readingTime: ${readingTime || 5},
  tags: ${JSON.stringify(tags || [])},
  coverImage: '${coverImage || ''}',
  content: {
    diary: \`${escapeContent(content.diary || '')}\`,
    scientific: \`${escapeContent(content.scientific || '')}\`
  },
  translations: ${JSON.stringify(translations, null, 2)}
};

export default post;
`;

        await fs.writeFile(filePath, fileContent, 'utf-8');
        console.log(`Created post: ${filePath}`);

        res.status(201).json({ success: true, path: filePath });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// DELETE post
app.delete('/api/posts/:author/:slug', async (req, res) => {
    try {
        const { author, slug } = req.params;
        const filePath = path.join(POSTS_DIR, author, `${slug}.ts`);

        await fs.unlink(filePath);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// ============ AUTHORS API ============

const AUTHORS_FILE = path.join(DATA_DIR, 'authors.ts');
const WORKS_FILE = path.join(DATA_DIR, 'works.ts');

const todayIso = () => new Date().toISOString().split('T')[0];
const buildUrl = (pathSegment: string) => `${BASE_URL}${pathSegment}`;

const getAuthorIdsFromFile = async (): Promise<string[]> => {
    try {
        const content = await fs.readFile(AUTHORS_FILE, 'utf-8');
        const blockRegex = /(\w+):\s*{([\s\S]*?)},/g;
        const ids: string[] = [];
        let match;
        while ((match = blockRegex.exec(content)) !== null) {
            const id = match[1];
            if (id === 'authors') continue;
            ids.push(id);
        }
        return ids;
    } catch (error) {
        console.error('Failed to read authors for sitemap', error);
        return [];
    }
};

const getPostEntries = async (): Promise<Array<{ author: string; slug: string; lastmod: string }>> => {
    const entries: Array<{ author: string; slug: string; lastmod: string }> = [];
    try {
        const authors = await fs.readdir(POSTS_DIR);
        for (const author of authors) {
            const dirPath = path.join(POSTS_DIR, author);
            const stat = await fs.stat(dirPath).catch(() => null);
            if (!stat || !stat.isDirectory()) continue;
            const files = await fs.readdir(dirPath);
            for (const file of files) {
                if (!file.endsWith('.ts')) continue;
                const slug = file.replace('.ts', '');
                const fileStat = await fs.stat(path.join(dirPath, file)).catch(() => null);
                entries.push({ author, slug, lastmod: fileStat ? fileStat.mtime.toISOString().split('T')[0] : todayIso() });
            }
        }
    } catch (error) {
        console.error('Failed to read posts for sitemap', error);
    }
    return entries;
};

const getWorkEntries = async (): Promise<Array<{ author: string; slug: string; lastmod: string }>> => {
    const entries: Array<{ author: string; slug: string; lastmod: string }> = [];
    try {
        const content = await fs.readFile(WORKS_FILE, 'utf-8');
        const blockRegex = /'([^']+)'\s*:\s*{([\s\S]*?)}\s*,/g;
        let match;
        while ((match = blockRegex.exec(content)) !== null) {
            const slug = match[1];
            const block = match[2];
            const author = extractString(block, 'author');
            entries.push({ author, slug, lastmod: todayIso() });
        }
    } catch (error) {
        console.error('Failed to read works for sitemap', error);
    }
    return entries;
};

// GET all authors
app.get('/api/authors', async (req, res) => {
    try {
        const content = await fs.readFile(AUTHORS_FILE, 'utf-8');

        // Naive extraction of the authors object
        // We know structure is: authors = { key: { ... }, key2: { ... } };
        // Let's iterate over known keys or regex capture keys
        // Since we have a fixed set of authors usually, we can also just extract everything that looks like a key ID.

        // Actually, let's just use regex to find all objects inside the main object
        // Block: key: { ... }
        const authorsMap: any = {};

        const blockRegex = /(\w+):\s*{([\s\S]*?)},/g;
        let match;

        while ((match = blockRegex.exec(content)) !== null) {
            const id = match[1];
            if (id === 'authors') continue; // skip the export line itself if matched

            const block = match[2];
            authorsMap[id] = {
                id: extractString(block, 'id'),
                name: extractString(block, 'name'),
                latinName: extractString(block, 'latinName'),
                title: extractString(block, 'title'),
                years: extractString(block, 'years'),
                birthYear: extractNumber(block, 'birthYear'),
                deathYear: extractNumber(block, 'deathYear'),
                description: extractString(block, 'description'),
                heroImage: extractString(block, 'heroImage'),
                theme: extractString(block, 'theme'),
                color: extractString(block, 'color'),
                // Extract translations - assuming struct translations: { en: { ... }, la: { ... } }
                translations: {
                    en: {
                        title: extractString(extractObject(block, 'en'), 'title'),
                        description: extractString(extractObject(block, 'en'), 'description')
                    },
                    la: {
                        title: extractString(extractObject(block, 'la'), 'title'),
                        description: extractString(extractObject(block, 'la'), 'description')
                    }
                }
            };
        }

        res.json(authorsMap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
});

// POST create new author
app.post('/api/authors', async (req, res) => {
    try {
        const { id, name, latinName, title, years, birthYear, deathYear, description, heroImage, theme, color, translations } = req.body;

        if (!id || !name) {
            return res.status(400).json({ error: 'ID and name are required' });
        }

        const safeId = sanitizeSlug(id);
        let content = await fs.readFile(AUTHORS_FILE, 'utf-8');

        // Check if author already exists
        if (content.includes(`${safeId}: {`)) {
            return res.status(400).json({ error: 'Author with this ID already exists' });
        }

        // Create the author block
        const authorBlock = `  ${safeId}: {
    id: '${safeId}',
    name: '${escapeString(name)}',
    latinName: '${escapeString(latinName || name)}',
    title: '${escapeString(title || '')}',
    years: '${escapeString(years || '')}',
    birthYear: ${birthYear || 0},
    deathYear: ${deathYear || 0},
    description: '${escapeString(description || '')}',
    heroImage: '${heroImage || ''}',
    theme: '${theme || `theme-${safeId}`}',
    color: '${color || 'hsl(25, 95%, 53%)'}',
    translations: ${JSON.stringify(translations || { en: {}, la: {} }, null, 4).replace(/\n/g, '\n    ')}
  },\n`;

        // Insert before the closing };
        content = content.replace(/(\n};?\s*$)/, `\n${authorBlock}$1`);

        await fs.writeFile(AUTHORS_FILE, content, 'utf-8');
        console.log(`Created author: ${safeId}`);

        res.status(201).json({ success: true, id: safeId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create author' });
    }
});

// PUT update existing author
app.put('/api/authors/:id', async (req, res) => {
    try {
        const { id: authorId } = req.params;
        const { name, latinName, title, years, birthYear, deathYear, description, heroImage, theme, color, translations } = req.body;

        let content = await fs.readFile(AUTHORS_FILE, 'utf-8');

        // Find and replace the author block
        const blockRegex = new RegExp(`(${authorId}:\\s*{)[\\s\\S]*?(},\\s*\\n)`, 'g');

        if (!blockRegex.test(content)) {
            return res.status(404).json({ error: 'Author not found' });
        }

        const updatedBlock = `${authorId}: {
    id: '${authorId}',
    name: '${escapeString(name)}',
    latinName: '${escapeString(latinName || name)}',
    title: '${escapeString(title || '')}',
    years: '${escapeString(years || '')}',
    birthYear: ${birthYear || 0},
    deathYear: ${deathYear || 0},
    description: '${escapeString(description || '')}',
    heroImage: '${heroImage || ''}',
    theme: '${theme || `theme-${authorId}`}',
    color: '${color || 'hsl(25, 95%, 53%)'}',
    translations: ${JSON.stringify(translations || { en: {}, la: {} }, null, 4).replace(/\n/g, '\n    ')}
  },\n`;

        content = content.replace(new RegExp(`${authorId}:\\s*{[\\s\\S]*?},\\s*\\n`, 'g'), updatedBlock);

        await fs.writeFile(AUTHORS_FILE, content, 'utf-8');
        console.log(`Updated author: ${authorId}`);

        res.json({ success: true, id: authorId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update author' });
    }
});

// DELETE author
app.delete('/api/authors/:id', async (req, res) => {
    try {
        const { id: authorId } = req.params;
        let content = await fs.readFile(AUTHORS_FILE, 'utf-8');

        // Safer removal using brace matching to avoid corrupting the file
        const startMarker = `${authorId}: {`;
        const startIdx = content.indexOf(startMarker);

        if (startIdx === -1) {
            return res.status(404).json({ error: 'Author not found' });
        }

        // Find the matching closing brace for this block
        let i = startIdx + startMarker.length;
        let depth = 1; // we are inside the first {
        while (i < content.length && depth > 0) {
            const ch = content[i];
            if (ch === '{') depth++;
            else if (ch === '}') depth--;
            i++;
        }

        // Include trailing comma and newline if present
        let endIdx = i; // position after the closing }
        // consume optional comma and following newline/spaces
        while (endIdx < content.length && /[\s,]/.test(content[endIdx])) {
            endIdx++;
            // stop after first newline following the comma to keep formatting tidy
            if (content[endIdx - 1] === '\n') break;
        }

        const before = content.slice(0, startIdx).replace(/\n{3,}/g, '\n\n');
        const after = content.slice(endIdx);
        content = (before + after).replace(/\n{3,}/g, '\n\n');

        await fs.writeFile(AUTHORS_FILE, content, 'utf-8');
        console.log(`Deleted author: ${authorId}`);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete author' });
    }
});

// ============ LEXICON API ============
const LEXICON_DIR = path.join(CONTENT_DIR, 'lexicon');

// Helper: extract either template literal (multi-line) or simple string for a given key
const extractStringOrTemplate = (content: string, key: string): string => {
    const tmpl = extractTemplateLiteral(content, key);
    if (tmpl) return tmpl;
    return extractString(content, key) || '';
};

// Helper: robustly extract translations block for lexicon entries
const extractLexiconTranslationsBlock = (content: string): any => {
    // Try to capture the translations object block
    const translationsMatch = content.match(/translations:\s*({[\s\S]*?})\n};/);
    if (translationsMatch) {
        const block = translationsMatch[1];
        try {
            // Works for JSON-formatted translations (created by Admin API)
            return JSON.parse(block);
        } catch {
            // Fallback: regex-based extraction for legacy JS object syntax
            const extractLangBlock = (lang: string) => {
                const rx = new RegExp(`['\"]?${lang}['\"]?:\\s*{([\\s\\S]*?)}`);
                const m = block.match(rx);
                return m ? m[1] : '';
            };

            const parseLang = (langBlock: string) => {
                if (!langBlock) return {};
                return {
                    term: extractString(langBlock, 'term'),
                    definition: extractStringOrTemplate(langBlock, 'definition'),
                    etymology: extractStringOrTemplate(langBlock, 'etymology'),
                    category: extractString(langBlock, 'category'),
                    variants: extractStringArray(langBlock, 'variants')
                };
            };

            return {
                en: parseLang(extractLangBlock('en')),
                la: parseLang(extractLangBlock('la')),
            };
        }
    }
    return {};
};

// GET all lexicon entries
app.get('/api/lexicon', async (req, res) => {
    try {
        const entries = [];
        const files = await fs.readdir(LEXICON_DIR);

        for (const file of files) {
            if (file.endsWith('.ts')) {
                const content = await fs.readFile(path.join(LEXICON_DIR, file), 'utf-8');

                // Parse entry
                entries.push({
                    slug: extractString(content, 'slug') || file.replace('.ts', ''),
                    term: extractString(content, 'term'),
                    definition: extractStringOrTemplate(content, 'definition'),
                    category: extractString(content, 'category'),
                    etymology: extractStringOrTemplate(content, 'etymology'),
                    variants: extractStringArray(content, 'variants'),
                    relatedTerms: extractStringArray(content, 'relatedTerms')
                    // Not parsing translations for list view to save bandwidth/complexity
                });
            }
        }
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch lexicon' });
    }
});

// GET lexicon entry
app.get('/api/lexicon/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(LEXICON_DIR, `${slug}.ts`);
        const content = await fs.readFile(filePath, 'utf-8');

        const translations = extractLexiconTranslationsBlock(content);

        const entry = {
            slug: extractString(content, 'slug') || slug,
            term: extractString(content, 'term'),
            definition: extractStringOrTemplate(content, 'definition'),
            category: extractString(content, 'category'),
            etymology: extractStringOrTemplate(content, 'etymology'),
            variants: extractStringArray(content, 'variants'),
            relatedTerms: extractStringArray(content, 'relatedTerms'),
            translations
        };

        res.json(entry);
    } catch (error) {
        res.status(404).json({ error: 'Entry not found' });
    }
});


// POST creates/updates lexicon entry
app.post('/api/lexicon', async (req, res) => {
    try {
        const { term, slug, category, definition, etymology, variants, relatedTerms, translations } = req.body;

        if (!term || !slug || !definition) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const safeSlug = sanitizeSlug(slug);
        await fs.mkdir(LEXICON_DIR, { recursive: true });

        const filePath = path.join(LEXICON_DIR, `${safeSlug}.ts`);

        const fileContent = `import { LexiconEntry } from '@/types/blog';

const entry: LexiconEntry = {
  term: "${escapeString(term)}",
  slug: "${safeSlug}",
  variants: ${JSON.stringify(variants || [])},
  definition: \`${escapeContent(definition)}\`,
  category: "${escapeString(category || 'Politik')}",
  etymology: \`${escapeContent(etymology || '')}\`,
  relatedTerms: ${JSON.stringify(relatedTerms || [])},
  translations: ${JSON.stringify(translations || {}, null, 4)}
};

export default entry;
`;

        await fs.writeFile(filePath, fileContent, 'utf-8');
        console.log(`Created lexicon entry: ${filePath}`);

        // Update lexicon.ts imports - check if already imported
        const lexiconIndexPath = path.join(DATA_DIR, 'lexicon.ts');
        let indexContent = await fs.readFile(lexiconIndexPath, 'utf-8');

        const importName = safeSlug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const importStatement = `import ${importName} from '@/content/lexicon/${safeSlug}';`;

        if (!indexContent.includes(importStatement)) {
            // Add import after last import
            const lastImportMatch = indexContent.match(/import [^;]+;(?=\s*\n\s*export)/s);
            if (lastImportMatch) {
                indexContent = indexContent.replace(lastImportMatch[0], `${lastImportMatch[0]}\n${importStatement}`);
            }

            // Add to array
            indexContent = indexContent.replace(/\];\s*$/, `  ${importName},\n];`);

            await fs.writeFile(lexiconIndexPath, indexContent, 'utf-8');
        }

        res.status(201).json({ success: true, path: filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create lexicon entry' });
    }
});

// DELETE lexicon entry
app.delete('/api/lexicon/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(LEXICON_DIR, `${slug}.ts`);

        await fs.unlink(filePath);

        // Also remove from lexicon.ts index
        const lexiconIndexPath = path.join(DATA_DIR, 'lexicon.ts');
        let indexContent = await fs.readFile(lexiconIndexPath, 'utf-8');

        const importName = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

        // Remove import line
        indexContent = indexContent.replace(new RegExp(`\\nimport ${importName} from[^;]+;`, 'g'), '');

        // Remove from array
        indexContent = indexContent.replace(new RegExp(`\\s*${importName},?`, 'g'), '');

        await fs.writeFile(lexiconIndexPath, indexContent, 'utf-8');

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete lexicon entry' });
    }
});

// ============ PAGES API ============
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

// GET page content
app.get('/api/pages/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(PAGES_DIR, `${slug}.json`);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const pageData = JSON.parse(content);
            res.json(pageData);
        } catch (error) {
            // Page doesn't exist yet, return empty
            res.status(404).json({ error: 'Page not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

// POST creates/updates page
app.post('/api/pages', async (req, res) => {
    try {
        const pageData = req.body;
        const { slug } = pageData;

        if (!slug) {
            return res.status(400).json({ error: 'Missing slug' });
        }

        await fs.mkdir(PAGES_DIR, { recursive: true });
        const filePath = path.join(PAGES_DIR, `${slug}.json`);

        await fs.writeFile(filePath, JSON.stringify(pageData, null, 2), 'utf-8');
        console.log(`Saved page: ${filePath}`);

        res.status(201).json({ success: true, path: filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save page' });
    }
});

// DELETE page
app.delete('/api/pages/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(PAGES_DIR, `${slug}.json`);

        await fs.unlink(filePath);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

// GET all pages list
app.get('/api/pages', async (req, res) => {
    try {
        await fs.mkdir(PAGES_DIR, { recursive: true });
        const files = await fs.readdir(PAGES_DIR);

        const pages = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(PAGES_DIR, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const pageData = JSON.parse(content);
                pages.push({
                    slug: file.replace('.json', ''),
                    title: pageData.heroTitle || pageData.slug,
                    path: `/${file.replace('.json', '')}`
                });
            }
        }

        res.json(pages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});


// ============ TAGS API ============

// GET all unique tags
app.get('/api/tags', async (req, res) => {
    try {
        const authors = ['caesar', 'cicero', 'augustus', 'seneca'];
        const tagsSet = new Set<string>();

        for (const author of authors) {
            const authorDir = path.join(POSTS_DIR, author);
            try {
                await fs.access(authorDir);
                const files = await fs.readdir(authorDir);
                for (const file of files) {
                    if (file.endsWith('.ts')) {
                        const content = await fs.readFile(path.join(authorDir, file), 'utf-8');
                        const tags = extractStringArray(content, 'tags');
                        tags.forEach(t => tagsSet.add(t));
                    }
                }
            } catch (e) { }
        }
        res.json(Array.from(tagsSet).sort());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

// PATCH rename tag
app.patch('/api/tags', async (req, res) => {
    try {
        const { oldTag, newTag } = req.body;
        if (!oldTag || !newTag) return res.status(400).json({ error: 'Missing oldTag or newTag' });

        const authors = ['caesar', 'cicero', 'augustus', 'seneca'];
        let count = 0;

        for (const author of authors) {
            const authorDir = path.join(POSTS_DIR, author);
            try {
                await fs.access(authorDir);
                const files = await fs.readdir(authorDir);
                for (const file of files) {
                    if (file.endsWith('.ts')) {
                        const filePath = path.join(authorDir, file);
                        let content = await fs.readFile(filePath, 'utf-8');
                        const tags = extractStringArray(content, 'tags');

                        if (tags.includes(oldTag)) {
                            const newTags = tags.map(t => t === oldTag ? newTag : t);
                            // Simple replacement of the tags array line
                            content = content.replace(/tags:\s*\[.*?\]/, `tags: ${JSON.stringify(newTags)}`);
                            await fs.writeFile(filePath, content, 'utf-8');
                            count++;
                        }
                    }
                }
            } catch (e) { }
        }
        res.json({ success: true, updatedCount: count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to rename tag' });
    }
});

// DELETE tag
app.delete('/api/tags/:tag', async (req, res) => {
    try {
        const tagToDelete = req.params.tag;
        const authors = ['caesar', 'cicero', 'augustus', 'seneca'];
        let count = 0;

        for (const author of authors) {
            const authorDir = path.join(POSTS_DIR, author);
            try {
                await fs.access(authorDir);
                const files = await fs.readdir(authorDir);
                for (const file of files) {
                    if (file.endsWith('.ts')) {
                        const filePath = path.join(authorDir, file);
                        let content = await fs.readFile(filePath, 'utf-8');
                        const tags = extractStringArray(content, 'tags');

                        if (tags.includes(tagToDelete)) {
                            const newTags = tags.filter(t => t !== tagToDelete);
                            content = content.replace(/tags:\s*\[.*?\]/, `tags: ${JSON.stringify(newTags)}`);
                            await fs.writeFile(filePath, content, 'utf-8');
                            count++;
                        }
                    }
                }
            } catch (e) { }
        }
        res.json({ success: true, updatedCount: count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tag' });
    }
});

// ============ TRANSLATIONS API ============
const LOCALES_DIR = path.resolve(__dirname, '../src/locales');

// Helper to parse translations from TS file
const parseTranslationsFile = async (lang: string): Promise<Record<string, any>> => {
    const filePath = path.join(LOCALES_DIR, `${lang}.ts`);
    const content = await fs.readFile(filePath, 'utf-8');

    // Extract the object content between = { and };
    const objectMatch = content.match(/export const \w+ = ({[\s\S]*});/);
    if (!objectMatch) return {};

    // Parse the object (simplified - handles most cases)
    const objectStr = objectMatch[1];
    const result: Record<string, any> = {};

    // Match key: 'value' or key: "value" patterns
    const simpleRegex = /(\w+):\s*['"`]([^'"`]*)['"`]/g;
    let match;
    while ((match = simpleRegex.exec(objectStr)) !== null) {
        result[match[1]] = match[2];
    }

    return result;
};

// Helper to update a translation in a TS file
const updateTranslationInFile = async (lang: string, key: string, value: string): Promise<boolean> => {
    const filePath = path.join(LOCALES_DIR, `${lang}.ts`);
    let content = await fs.readFile(filePath, 'utf-8');

    // Escape the value for safe insertion
    const escapedValue = value.replace(/'/g, "\\'").replace(/\n/g, '\\n');

    // Try to find and replace the key
    // Match patterns like: key: 'value', or key: "value",
    const patterns = [
        new RegExp(`(${key}:\\s*)['"]([^'"]*)['"](,?)`, 'g'),
        new RegExp(`(${key}:\\s*)'([^']*)'(,?)`, 'g'),
        new RegExp(`(${key}:\\s*)"([^"]*)"(,?)`, 'g'),
    ];

    let replaced = false;
    for (const pattern of patterns) {
        if (pattern.test(content)) {
            content = content.replace(pattern, `$1'${escapedValue}'$3`);
            replaced = true;
            break;
        }
    }

    if (replaced) {
        await fs.writeFile(filePath, content, 'utf-8');
        return true;
    }

    return false;
};

// GET all translations for a language
app.get('/api/translations/:lang', async (req, res) => {
    try {
        const { lang } = req.params;
        if (!['de', 'en', 'la'].includes(lang)) {
            return res.status(400).json({ error: 'Invalid language. Use de, en, or la.' });
        }

        const translations = await parseTranslationsFile(lang);
        res.json(translations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch translations' });
    }
});

// GET all translations for all languages (for comparison view)
app.get('/api/translations', async (req, res) => {
    try {
        const [de, en, la] = await Promise.all([
            parseTranslationsFile('de'),
            parseTranslationsFile('en'),
            parseTranslationsFile('la'),
        ]);

        res.json({ de, en, la });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch translations' });
    }
});

// PUT update a single translation key
app.put('/api/translations/:lang/:key', async (req, res) => {
    try {
        const { lang, key } = req.params;
        const { value } = req.body;

        if (!['de', 'en', 'la'].includes(lang)) {
            return res.status(400).json({ error: 'Invalid language. Use de, en, or la.' });
        }

        if (typeof value !== 'string') {
            return res.status(400).json({ error: 'Value must be a string' });
        }

        const success = await updateTranslationInFile(lang, key, value);

        if (success) {
            console.log(`Updated translation: ${lang}.${key} = "${value.substring(0, 50)}..."`);
            res.json({ success: true, lang, key, value });
        } else {
            res.status(404).json({ error: `Key "${key}" not found in ${lang}.ts` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update translation' });
    }
});

// POST add a new translation key to all languages
app.post('/api/translations', async (req, res) => {
    try {
        const { key, de: deValue, en: enValue, la: laValue } = req.body;

        if (!key || !deValue) {
            return res.status(400).json({ error: 'Key and German value are required' });
        }

        // Add to each language file
        const languages = [
            { lang: 'de', value: deValue },
            { lang: 'en', value: enValue || deValue },
            { lang: 'la', value: laValue || deValue },
        ];

        for (const { lang, value } of languages) {
            const filePath = path.join(LOCALES_DIR, `${lang}.ts`);
            let content = await fs.readFile(filePath, 'utf-8');

            // Find the closing }; and add new key before it
            const escapedValue = value.replace(/'/g, "\\'");
            const newEntry = `    ${key}: '${escapedValue}',\n`;

            content = content.replace(/\n};(\s*)$/, `\n${newEntry}};$1`);
            await fs.writeFile(filePath, content, 'utf-8');
        }

        console.log(`Added new translation key: ${key}`);
        res.status(201).json({ success: true, key });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add translation' });
    }
});

app.get(['/sitemap.xml', '/sitemap'], async (_req, res) => {
    try {
        const staticRoutes = [
            { path: '/', changefreq: 'weekly', priority: '1.0' },
            { path: '/about', changefreq: 'monthly', priority: '0.8' },
            { path: '/timeline', changefreq: 'weekly', priority: '0.8' },
            { path: '/lexicon', changefreq: 'weekly', priority: '0.7' },
            { path: '/search', changefreq: 'weekly', priority: '0.6' },
        ];

        const authorIds = await getAuthorIdsFromFile();
        const authorRoutes = authorIds.flatMap((id) => ([
            { path: `/${id}`, changefreq: 'weekly', priority: '0.9' },
            { path: `/${id}/about`, changefreq: 'monthly', priority: '0.8' },
            { path: `/${id}/chat`, changefreq: 'monthly', priority: '0.5' },
            { path: `/${id}/simulation`, changefreq: 'monthly', priority: '0.5' },
        ]));

        const posts = await getPostEntries();
        const works = await getWorkEntries();
        const today = todayIso();

        const urlEntries = [
            ...staticRoutes,
            ...authorRoutes,
            ...posts.map((p) => ({
                path: `/${p.author}/${p.slug}`,
                changefreq: 'weekly',
                priority: '0.7',
                lastmod: p.lastmod || today,
            })),
            ...works
                .filter((w) => w.author)
                .map((w) => ({
                    path: `/${w.author}/works/${w.slug}`,
                    changefreq: 'monthly',
                    priority: '0.6',
                    lastmod: w.lastmod || today,
                })),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries
            .map((entry) => `  <url>\n    <loc>${buildUrl(entry.path)}</loc>\n    <lastmod>${entry.lastmod || today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`)
            .join('\n')}\n</urlset>`;

        res.type('application/xml').send(xml);
    } catch (error) {
        console.error('Failed to generate sitemap', error);
        res.status(500).send('Failed to generate sitemap');
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// ============ WORKS API ============

// Helper: parse a Work TS file
const extractWorkArray = (content: string, key: string): Array<{ title: string; content: string }> => {
    const block = extractObject(content, key);
    // naive parse of array of objects with title/content strings
    const items: Array<{ title: string; content: string }> = [];
    const itemRegex = /{\s*title:\s*['"`](.*?)['"`],\s*content:\s*['"`](.*?)['"`]\s*}/gs;
    let m;
    while ((m = itemRegex.exec(block)) !== null) {
        items.push({ title: m[1], content: m[2] });
    }
    return items;
};

// GET all works
app.get('/api/works', async (_req, res) => {
    try {
        await fs.mkdir(WORKS_DIR, { recursive: true });
        const files = await fs.readdir(WORKS_DIR);
        const works = [] as any[];
        for (const file of files) {
            if (!file.endsWith('.ts')) continue;
            const content = await fs.readFile(path.join(WORKS_DIR, file), 'utf-8');
            works.push({
                slug: file.replace('.ts', ''),
                title: extractString(content, 'title'),
                author: extractString(content, 'author'),
                year: extractString(content, 'year')
            });
        }
        res.json(works);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch works' });
    }
});

// GET single work
app.get('/api/works/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(WORKS_DIR, `${slug}.ts`);
        const content = await fs.readFile(filePath, 'utf-8');

        // Try to parse translations block as JSON
        let translations: any = {};
        const translationsMatch = content.match(/translations:\s*({[\s\S]*?})\n};/);
        if (translationsMatch) {
            try {
                translations = JSON.parse(translationsMatch[1]);
            } catch {
                translations = {};
            }
        }

        const work = {
            slug,
            title: extractString(content, 'title'),
            author: extractString(content, 'author'),
            year: extractString(content, 'year'),
            summary: extractString(content, 'summary'),
            takeaway: extractString(content, 'takeaway'),
            structure: extractWorkArray(content, 'structure'),
            translations,
        };
        res.json(work);
    } catch (e) {
        console.error(e);
        res.status(404).json({ error: 'Work not found' });
    }
});

// POST create/update work
app.post('/api/works', async (req, res) => {
    try {
        const { slug, title, author, year, summary, takeaway, structure, translations } = req.body;
        if (!slug || !title || !author) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await fs.mkdir(WORKS_DIR, { recursive: true });
        const safeSlug = sanitizeSlug(slug);
        const filePath = path.join(WORKS_DIR, `${safeSlug}.ts`);

        const structureStr = JSON.stringify(structure || [], null, 2).replace(/"([^("]+)":/g, '$1:').replace(/"/g, '\"');
        // Build TS file
        const fileContent = `import { Work } from '@/types/blog';

const work: Work = {
  title: '${escapeString(title)}',
  author: '${escapeString(author)}',
  year: '${escapeString(year || '')}',
  summary: '${escapeString(summary || '')}',
  takeaway: '${escapeString(takeaway || '')}',
  structure: ${JSON.stringify(structure || [], null, 2)},
  translations: ${JSON.stringify(translations || {}, null, 2)}
};

export default work;
`;
        await fs.writeFile(filePath, fileContent, 'utf-8');
        res.status(201).json({ success: true, slug: safeSlug });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to save work' });
    }
});

// DELETE work
app.delete('/api/works/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(WORKS_DIR, `${slug}.ts`);
        await fs.unlink(filePath);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to delete work' });
    }
});

// WORK DETAILS (JSON)
app.get('/api/works/:slug/details', async (req, res) => {
    try {
        const { slug } = req.params;
        await fs.mkdir(WORKS_DETAILS_DIR, { recursive: true });
        const filePath = path.join(WORKS_DETAILS_DIR, `${slug}.json`);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (e: any) {
        if (e.code === 'ENOENT') return res.status(404).json({ error: 'Not found' });
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch work details' });
    }
});

app.post('/api/works/:slug/details', async (req, res) => {
    try {
        const { slug } = req.params;
        await fs.mkdir(WORKS_DETAILS_DIR, { recursive: true });
        const filePath = path.join(WORKS_DETAILS_DIR, `${slug}.json`);
        await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
        res.status(201).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to save work details' });
    }
});

app.delete('/api/works/:slug/details', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(WORKS_DETAILS_DIR, `${slug}.json`);
        await fs.unlink(filePath);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to delete work details' });
    }
});


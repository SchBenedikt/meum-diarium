
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Note: Rate limiting should be added for production use
// Consider using express-rate-limit for API endpoints
// Example: app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

const CONTENT_DIR = path.resolve(__dirname, '../src/content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
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
    // Matches key or "key" or 'key'
    const regex = new RegExp(`['"]?${key}['"]?:\\s*['"\`](.*?)['"\`],?`);
    const match = content.match(regex);
    return match ? match[1] : '';
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
    // Matches key: `...` allowing optional comma or whitespace after
    const regex = new RegExp(`['"]?${key}['"]?:\\s*\`([\\s\\S]*?)\`(?=\\s*,|\\s*})`);
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
                            excerpt: extractString(content, 'excerpt'),
                            historicalDate: extractString(content, 'historicalDate'),
                            readingTime: extractNumber(content, 'readingTime') || 5, // Default to 5 if missing
                            tags: extractStringArray(content, 'tags')
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
        const { id, slug, author, title, content, excerpt, translations, tags, historicalDate, historicalYear, readingTime, coverImage, latinTitle } = req.body;

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

// ... (POST authors code omitted for brevity but remains same) ...

// ============ LEXICON API ============
const LEXICON_DIR = path.join(CONTENT_DIR, 'lexicon');

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
                    definition: extractTemplateLiteral(content, 'definition'),
                    category: extractString(content, 'category'),
                    etymology: extractTemplateLiteral(content, 'etymology'),
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

        // Helper to extract translation block
        const extractLexiconTranslation = (lang: string) => {
            const block = extractObject(content, lang); // expects en: { ... } logic from extractObject
            return {
                term: extractString(block, 'term'),
                definition: extractTemplateLiteral(block, 'definition'),
                etymology: extractTemplateLiteral(block, 'etymology'),
                category: extractString(block, 'category'),
                variants: extractStringArray(block, 'variants')
            };
        };

        const entry = {
            slug: extractString(content, 'slug'),
            term: extractString(content, 'term'),
            definition: extractTemplateLiteral(content, 'definition'),
            category: extractString(content, 'category'),
            etymology: extractTemplateLiteral(content, 'etymology'),
            variants: extractStringArray(content, 'variants'),
            relatedTerms: extractStringArray(content, 'relatedTerms'),
            translations: {
                en: extractLexiconTranslation('en'),
                la: extractLexiconTranslation('la')
            }
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

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});


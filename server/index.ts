
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

const CONTENT_DIR = path.resolve(__dirname, '../src/content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');

// Helper to sanitize slug
const sanitizeSlug = (slug: string) => slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

// Helper to escape strings for template literal
const escapeContent = (content: string) => {
    return content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
};

const escapeString = (str: string) => {
    return str.replace(/'/g, "\\'");
};

// GET all authors
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
                        // In a real app we might parse the file, but for listing we might trust the filename or simple regex
                        // For simplicity, just return basic info based on filename
                        allPosts.push({
                            id: file.replace('.ts', ''), // temp id
                            author,
                            slug: file.replace('.ts', ''),
                        })
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
const AUTHORS_FILE = path.join(CONTENT_DIR, '../data/authors.ts');
const DATA_DIR = path.resolve(__dirname, '../src/data');

// POST creates/updates author
app.post('/api/authors', async (req, res) => {
    try {
        const { id, name, latinName, title, years, birthYear, deathYear, description, heroImage, theme, color, translations } = req.body;

        if (!id || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Read existing authors file
        const authorsFilePath = path.join(DATA_DIR, 'authors.ts');
        let fileContent = await fs.readFile(authorsFilePath, 'utf-8');

        // Check if author already exists
        const authorRegex = new RegExp(`${id}:\\s*\\{[^}]+\\}`, 's');
        const authorEntry = `${id}: {
    id: '${id}',
    name: '${escapeString(name)}',
    latinName: '${escapeString(latinName || '')}',
    title: '${escapeString(title || '')}',
    years: '${escapeString(years || '')}',
    birthYear: ${birthYear || 0},
    deathYear: ${deathYear || 0},
    description: '${escapeString(description || '')}',
    heroImage: '${heroImage || ''}',
    theme: '${theme || 'theme-caesar'}',
    color: '${color || 'hsl(25, 95%, 53%)'}',
  }`;

        if (authorRegex.test(fileContent)) {
            // Update existing
            fileContent = fileContent.replace(authorRegex, authorEntry);
        } else {
            // Add new - insert before closing brace
            fileContent = fileContent.replace(/\};\s*$/, `  ${authorEntry},\n};`);
        }

        await fs.writeFile(authorsFilePath, fileContent, 'utf-8');
        console.log(`Saved author: ${id}`);

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save author' });
    }
});

// DELETE author
app.delete('/api/authors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const authorsFilePath = path.join(DATA_DIR, 'authors.ts');
        let fileContent = await fs.readFile(authorsFilePath, 'utf-8');

        // Remove author entry
        const authorRegex = new RegExp(`\\s*${id}:\\s*\\{[^}]+\\},?`, 'gs');
        fileContent = fileContent.replace(authorRegex, '');

        await fs.writeFile(authorsFilePath, fileContent, 'utf-8');
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete author' });
    }
});

// ============ LEXICON API ============
const LEXICON_DIR = path.join(CONTENT_DIR, 'lexicon');

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


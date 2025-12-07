
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

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

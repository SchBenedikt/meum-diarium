import fs from 'node:fs';
import path from 'node:path';
import { authors as authorMap } from '../src/data/authors';
import { works as worksMap } from '../src/data/works';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../src/content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const WORKS_DIR = path.join(CONTENT_DIR, 'works');
const WORKS_DETAILS_DIR = path.join(CONTENT_DIR, 'works-details');
const LEXICON_DIR = path.join(CONTENT_DIR, 'lexicon');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');
const OUT_DIR = path.resolve(__dirname, '../public/api');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper functions (replicated from server/index.ts)
function extractString(content: string, key: string): string {
    const regex = new RegExp(`['"]?${key}['"]?:\\s*(["'\`])([\\s\\S]*?)(?<!\\\\)\\1,?`);
    const match = content.match(regex);
    return match ? match[2] : '';
}

function extractTemplateLiteral(content: string, key: string): string {
    const regex = new RegExp(`['"]?${key}['"]?:\\s*\`([\\s\\S]*?)(?<!\\\\)\`(?=\\s*,|\\s*})`);
    const match = content.match(regex);
    return match ? match[1] : '';
}

function extractStringOrTemplate(content: string, key: string): string {
    const tmpl = extractTemplateLiteral(content, key);
    if (tmpl) return tmpl;
    return extractString(content, key) || '';
}

async function exportCatalog() {
    const counts = {
        posts: 0,
        lexicon: 0,
        works: 0,
        authors: Object.keys(authorMap).length
    };

    // Count lexicon
    if (fs.existsSync(LEXICON_DIR)) {
        counts.lexicon = fs.readdirSync(LEXICON_DIR).filter(f => f.endsWith('.ts')).length;
    }

    // Count works
    if (fs.existsSync(WORKS_DIR)) {
        counts.works = fs.readdirSync(WORKS_DIR).filter(f => f.endsWith('.ts')).length;
    }

    // Count posts
    if (fs.existsSync(POSTS_DIR)) {
        const authors = fs.readdirSync(POSTS_DIR);
        for (const author of authors) {
            const dir = path.join(POSTS_DIR, author);
            if (fs.statSync(dir).isDirectory()) {
                counts.posts += fs.readdirSync(dir).filter(f => f.endsWith('.ts')).length;
            }
        }
    }

    const catalog = {
        timestamp: new Date().toISOString().split('T')[0],
        counts,
        available_authors: Object.keys(authorMap)
    };

    fs.writeFileSync(path.join(OUT_DIR, 'catalog.json'), JSON.stringify(catalog, null, 2));
    console.log('✅ Exported catalog.json');
}

async function exportAboutPages() {
    if (fs.existsSync(PAGES_DIR)) {
        const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));
        for (const f of files) {
            if (f === 'about.json') {
                fs.copyFileSync(path.join(PAGES_DIR, f), path.join(OUT_DIR, 'about.json'));
            } else if (f.startsWith('author-about-')) {
                const author = f.replace('author-about-', '').replace('.json', '');
                const authorDir = path.join(OUT_DIR, 'pages');
                if (!fs.existsSync(authorDir)) fs.mkdirSync(authorDir, { recursive: true });
                fs.copyFileSync(path.join(PAGES_DIR, f), path.join(authorDir, `${author}.json`));
            }
        }
    }
    console.log('✅ Exported about pages');
}

async function exportWorks() {
    const worksSummary = [];
    if (fs.existsSync(WORKS_DIR)) {
        const files = fs.readdirSync(WORKS_DIR).filter(f => f.endsWith('.ts'));
        for (const f of files) {
            const slug = f.replace('.ts', '');
            const data = (worksMap as any)[slug];
            if (data) {
                worksSummary.push({
                    slug,
                    title: data.title,
                    author: data.author,
                    year: data.year
                });
                // Also copy work details if exists
                const detailFile = path.join(WORKS_DETAILS_DIR, `${slug}.json`);
                if (fs.existsSync(detailFile)) {
                    const detailsOutDir = path.join(OUT_DIR, 'works-details');
                    if (!fs.existsSync(detailsOutDir)) fs.mkdirSync(detailsOutDir, { recursive: true });
                    fs.copyFileSync(detailFile, path.join(detailsOutDir, `${slug}.json`));
                }
            }
        }
    }
    fs.writeFileSync(path.join(OUT_DIR, 'works.json'), JSON.stringify(worksSummary, null, 2));
    console.log('✅ Exported works.json and details');
}

async function exportPosts() {
    const postsSummary = [];
    const postsOutDir = path.join(OUT_DIR, 'posts');
    if (!fs.existsSync(postsOutDir)) fs.mkdirSync(postsOutDir, { recursive: true });

    if (fs.existsSync(POSTS_DIR)) {
        const authors = fs.readdirSync(POSTS_DIR);
        for (const author of authors) {
            const authorDir = path.join(POSTS_DIR, author);
            if (fs.statSync(authorDir).isDirectory()) {
                const files = fs.readdirSync(authorDir).filter(f => f.endsWith('.ts'));
                for (const f of files) {
                    const content = fs.readFileSync(path.join(authorDir, f), 'utf-8');
                    const slug = f.replace('.ts', '');

                    const post = {
                        slug,
                        author,
                        title: extractString(content, 'title'),
                        date: extractString(content, 'date'),
                        excerpt: extractString(content, 'excerpt'),
                        content: {
                            diary: extractTemplateLiteral(content, 'diary'),
                            scientific: extractTemplateLiteral(content, 'scientific')
                        }
                    };

                    postsSummary.push({ slug, author, title: post.title });

                    const authorOutDir = path.join(postsOutDir, author);
                    if (!fs.existsSync(authorOutDir)) fs.mkdirSync(authorOutDir, { recursive: true });
                    fs.writeFileSync(path.join(authorOutDir, `${slug}.json`), JSON.stringify(post, null, 2));
                }
            }
        }
    }
    fs.writeFileSync(path.join(OUT_DIR, 'posts.json'), JSON.stringify(postsSummary, null, 2));
    console.log('✅ Exported posts and summaries');
}

async function exportLexicon() {
    const lexiconSummary = [];
    const lexiconOutDir = path.join(OUT_DIR, 'lexicon');
    if (!fs.existsSync(lexiconOutDir)) fs.mkdirSync(lexiconOutDir, { recursive: true });

    if (fs.existsSync(LEXICON_DIR)) {
        const files = fs.readdirSync(LEXICON_DIR).filter(f => f.endsWith('.ts'));
        for (const f of files) {
            const content = fs.readFileSync(path.join(LEXICON_DIR, f), 'utf-8');
            const slug = f.replace('.ts', '');
            const entry = {
                slug,
                term: extractString(content, 'term'),
                definition: extractStringOrTemplate(content, 'definition'),
                category: extractString(content, 'category')
            };
            lexiconSummary.push({ slug, term: entry.term });
            fs.writeFileSync(path.join(lexiconOutDir, `${slug}.json`), JSON.stringify(entry, null, 2));
        }
    }
    fs.writeFileSync(path.join(OUT_DIR, 'lexicon.json'), JSON.stringify(lexiconSummary, null, 2));
    console.log('✅ Exported lexicon and summaries');
}

async function run() {
    await exportCatalog();
    await exportAboutPages();
    await exportWorks();
    await exportPosts();
    await exportLexicon();
    console.log('🚀 API data export complete!');
}

run().catch(console.error);

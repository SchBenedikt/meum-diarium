import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { authors as authorMap } from '../src/data/authors';
import { works as worksMap } from '../src/data/works';
import { timelineEvents } from '../src/data/timeline';
import { buildTimelineEvents } from '../src/lib/timeline-builder';
import type { BlogPost, LexiconEntry, TagWithTranslations } from '../src/types/blog';

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

async function loadModuleDefault<T>(filePath: string, fallbackKeys: string[] = []): Promise<T | null> {
    try {
        const mod = await import(pathToFileURL(filePath).href);
        if (mod?.default) return mod.default as T;
        for (const key of fallbackKeys) {
            if (mod?.[key]) return mod[key] as T;
        }
        return null;
    } catch (err) {
        console.warn(`⚠️ Failed to import ${filePath}:`, err);
        return null;
    }
}

function normalizeTagId(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function countWords(value: string): number {
    return value
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean).length;
}

async function loadAllPosts(): Promise<BlogPost[]> {
    const posts: BlogPost[] = [];

    if (!fs.existsSync(POSTS_DIR)) return posts;

    const authors = fs.readdirSync(POSTS_DIR);
    for (const author of authors) {
        const authorDir = path.join(POSTS_DIR, author);
        if (!fs.statSync(authorDir).isDirectory()) continue;
        const files = fs.readdirSync(authorDir).filter(f => f.endsWith('.ts'));
        for (const f of files) {
            const filePath = path.join(authorDir, f);
            const slug = f.replace('.ts', '');
            const post = await loadModuleDefault<BlogPost>(filePath, ['post']);
            if (!post) continue;
            posts.push({
                ...post,
                slug: post.slug || slug,
                author: (post.author as any) || (author as any)
            });
        }
    }

    return posts;
}

async function loadAllLexicon(): Promise<LexiconEntry[]> {
    const entries: LexiconEntry[] = [];

    if (!fs.existsSync(LEXICON_DIR)) return entries;

    const files = fs.readdirSync(LEXICON_DIR).filter(f => f.endsWith('.ts'));
    for (const f of files) {
        const filePath = path.join(LEXICON_DIR, f);
        const entry = await loadModuleDefault<LexiconEntry>(filePath, ['entry']);
        if (!entry) continue;
        entries.push(entry);
    }

    return entries;
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

async function exportPosts(posts: BlogPost[]) {
    const postsSummary = [];
    const postsOutDir = path.join(OUT_DIR, 'posts');
    if (!fs.existsSync(postsOutDir)) fs.mkdirSync(postsOutDir, { recursive: true });

    for (const post of posts) {
        if (!post?.slug || !post?.author) continue;
        postsSummary.push({
            slug: post.slug,
            author: post.author,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            historicalDate: post.historicalDate,
            historicalYear: post.historicalYear,
            readingTime: post.readingTime,
            tags: post.tags,
            tagsWithTranslations: post.tagsWithTranslations || []
        });

        const authorOutDir = path.join(postsOutDir, post.author);
        if (!fs.existsSync(authorOutDir)) fs.mkdirSync(authorOutDir, { recursive: true });
        fs.writeFileSync(path.join(authorOutDir, `${post.slug}.json`), JSON.stringify(post, null, 2));
    }

    fs.writeFileSync(path.join(OUT_DIR, 'posts.json'), JSON.stringify(postsSummary, null, 2));
    console.log('✅ Exported posts and summaries');
}

async function exportLexicon(entries: LexiconEntry[]) {
    const lexiconSummary = [];
    const lexiconOutDir = path.join(OUT_DIR, 'lexicon');
    if (!fs.existsSync(lexiconOutDir)) fs.mkdirSync(lexiconOutDir, { recursive: true });

    for (const entry of entries) {
        if (!entry?.slug) continue;
        lexiconSummary.push({ slug: entry.slug, term: entry.term });
        fs.writeFileSync(path.join(lexiconOutDir, `${entry.slug}.json`), JSON.stringify(entry, null, 2));
    }

    fs.writeFileSync(path.join(OUT_DIR, 'lexicon.json'), JSON.stringify(lexiconSummary, null, 2));
    console.log('✅ Exported lexicon and summaries');
}

async function exportAuthors() {
    const authorsOutDir = path.join(OUT_DIR, 'authors');
    if (!fs.existsSync(authorsOutDir)) fs.mkdirSync(authorsOutDir, { recursive: true });

    const authors = Object.values(authorMap);
    const summary = authors.map((author) => ({
        id: author.id,
        name: author.name,
        title: author.title,
        years: author.years,
        description: author.description,
        heroImage: author.heroImage,
        theme: author.theme,
        color: author.color,
        highlights: author.highlights || [],
        translations: author.translations || {}
    }));

    for (const author of authors) {
        fs.writeFileSync(path.join(authorsOutDir, `${author.id}.json`), JSON.stringify(author, null, 2));
    }

    fs.writeFileSync(path.join(OUT_DIR, 'authors.json'), JSON.stringify(summary, null, 2));
    console.log('✅ Exported authors');
}

async function exportTags(posts: BlogPost[]) {
    const tagMap = new Map<string, { id: string; translations: { de: string; en: string; la: string }; count: number }>();

    for (const post of posts) {
        const fallbackTags = (post.tags || []).map(tag => ({
            id: normalizeTagId(tag),
            translations: { de: tag, en: tag, la: tag }
        }));
        const tags = post.tagsWithTranslations && post.tagsWithTranslations.length > 0
            ? post.tagsWithTranslations
            : fallbackTags;

        for (const tag of tags) {
            const id = (tag as TagWithTranslations).id || normalizeTagId(tag.translations.de || tag.translations.en || tag.translations.la);
            const existing = tagMap.get(id) || { id, translations: { de: '', en: '', la: '' }, count: 0 };
            existing.count += 1;
            existing.translations = {
                de: tag.translations.de || existing.translations.de,
                en: tag.translations.en || existing.translations.en || tag.translations.de,
                la: tag.translations.la || existing.translations.la || tag.translations.de
            };
            tagMap.set(id, existing);
        }
    }

    const tags = Array.from(tagMap.values()).sort((a, b) => a.translations.de.localeCompare(b.translations.de));
    fs.writeFileSync(path.join(OUT_DIR, 'tags.json'), JSON.stringify(tags, null, 2));
    console.log('✅ Exported tags');
}

async function exportTimeline(posts: BlogPost[]) {
    const events = buildTimelineEvents('de', posts, timelineEvents, { deduplicate: true })
        .filter(event => Number.isFinite(event.year));

    fs.writeFileSync(path.join(OUT_DIR, 'timeline.json'), JSON.stringify(events, null, 2));
    console.log('✅ Exported timeline');
}

async function exportSearchIndex(posts: BlogPost[], lexiconEntries: LexiconEntry[]) {
    const items: any[] = [];

    const tagLabels = (post: BlogPost, lang: 'de' | 'en' | 'la') => {
        if (post.tagsWithTranslations && post.tagsWithTranslations.length > 0) {
            return post.tagsWithTranslations.map(tag => tag.translations[lang] || tag.translations.de);
        }
        return post.tags || [];
    };

    for (const post of posts) {
        items.push({
            type: 'post',
            slug: post.slug,
            author: post.author,
            title: post.title,
            excerpt: post.excerpt,
            tags: tagLabels(post, 'de'),
            translations: {
                de: {
                    title: post.translations?.de?.title || post.title,
                    excerpt: post.translations?.de?.excerpt || post.excerpt,
                    tags: tagLabels(post, 'de')
                },
                en: post.translations?.en ? {
                    title: post.translations.en.title || post.title,
                    excerpt: post.translations.en.excerpt || post.excerpt,
                    tags: tagLabels(post, 'en')
                } : undefined,
                la: post.translations?.la ? {
                    title: post.translations.la.title || post.title,
                    excerpt: post.translations.la.excerpt || post.excerpt,
                    tags: tagLabels(post, 'la')
                } : undefined
            }
        });
    }

    for (const entry of lexiconEntries) {
        items.push({
            type: 'lexicon',
            slug: entry.slug,
            term: entry.term,
            definition: entry.definition,
            category: entry.category,
            translations: entry.translations || {}
        });
    }

    for (const author of Object.values(authorMap)) {
        items.push({
            type: 'author',
            id: author.id,
            name: author.name,
            title: author.title,
            description: author.description,
            translations: author.translations || {}
        });
    }

    for (const [slug, work] of Object.entries(worksMap)) {
        items.push({
            type: 'work',
            slug,
            title: work.title,
            summary: work.summary,
            author: work.author,
            year: work.year,
            translations: work.translations || {}
        });
    }

    const index = {
        generatedAt: new Date().toISOString(),
        items
    };

    fs.writeFileSync(path.join(OUT_DIR, 'search.json'), JSON.stringify(index, null, 2));
    console.log('✅ Exported search index');
}

function normalizeHistoricalYear(year: unknown, historicalDate?: string): number | null {
    if (typeof year === 'number' && Number.isFinite(year)) return year;
    const value = typeof year === 'string' ? year : historicalDate;
    if (!value) return null;
    const trimmed = value.trim();
    const numeric = parseInt(trimmed.replace(/[^0-9-]/g, ''), 10);
    if (Number.isNaN(numeric)) return null;
    const isBCE = /v\.?\s*chr\.?/i.test(trimmed) || /bc/i.test(trimmed);
    const isCE = /n\.?\s*chr\.?/i.test(trimmed) || /ad/i.test(trimmed);
    if (isBCE) return -Math.abs(numeric);
    if (isCE) return Math.abs(numeric);
    return numeric;
}

async function exportStatsBase(posts: BlogPost[], lexiconEntries: LexiconEntry[]) {
    const years = posts
        .map(post => normalizeHistoricalYear(post.historicalYear, post.historicalDate))
        .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    const minYear = years.length ? Math.min(...years) : null;
    const maxYear = years.length ? Math.max(...years) : null;

    let readingMinutes = 0;
    let wordCount = 0;
    for (const post of posts) {
        readingMinutes += post.readingTime || 0;
        wordCount += countWords(post.content?.diary || '');
        wordCount += countWords(post.content?.scientific || '');
    }

    const stats = {
        generatedAt: new Date().toISOString(),
        counts: {
            posts: posts.length,
            lexicon: lexiconEntries.length,
            works: Object.keys(worksMap).length,
            authors: Object.keys(authorMap).length
        },
        yearRange: {
            min: minYear,
            max: maxYear
        },
        readingMinutes,
        wordCount
    };

    fs.writeFileSync(path.join(OUT_DIR, 'stats-base.json'), JSON.stringify(stats, null, 2));
    console.log('✅ Exported stats base');
}

async function run() {
    const posts = await loadAllPosts();
    const lexiconEntries = await loadAllLexicon();

    await exportCatalog();
    await exportAboutPages();
    await exportWorks();
    await exportPosts(posts);
    await exportLexicon(lexiconEntries);
    await exportAuthors();
    await exportTags(posts);
    await exportTimeline(posts);
    await exportSearchIndex(posts, lexiconEntries);
    await exportStatsBase(posts, lexiconEntries);
    console.log('🚀 API data export complete!');
}

run().catch(console.error);

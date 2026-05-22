import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');
const baseUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de').replace(/\/$/, '');

type SitemapEntry = {
  loc: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
};

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const writeXml = async (relativePath: string, content: string) => {
  await writeFile(path.join(publicDir, relativePath), content, 'utf8');
};

const toUrl = (pathname: string) => `${baseUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

const buildUrlset = (entries: SitemapEntry[]) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
  .map((entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}${entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : ''}${entry.priority ? `\n    <priority>${entry.priority}</priority>` : ''}\n  </url>`)
  .join('\n')}\n</urlset>\n`;

const buildSitemapIndex = (entries: { loc: string; lastmod?: string }[]) => `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
  .map((entry) => `  <sitemap>\n    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}\n  </sitemap>`)
  .join('\n')}\n</sitemapindex>\n`;

const readJson = async <T,>(relativePath: string, fallback: T): Promise<T> => {
  try {
    return JSON.parse(await readFile(path.join(publicDir, relativePath), 'utf8')) as T;
  } catch {
    return fallback;
  }
};

const staticPages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/api', changefreq: 'monthly', priority: '0.6' },
  { path: '/agb', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.3' },
  { path: '/design', changefreq: 'yearly', priority: '0.4' },
  { path: '/images', changefreq: 'monthly', priority: '0.5' },
  { path: '/ki', changefreq: 'monthly', priority: '0.8' },
  { path: '/legal', changefreq: 'yearly', priority: '0.3' },
  { path: '/learn', changefreq: 'weekly', priority: '0.8' },
  { path: '/learn/grammar', changefreq: 'weekly', priority: '0.7' },
  { path: '/learn/practice', changefreq: 'weekly', priority: '0.7' },
  { path: '/learn/rhetoric', changefreq: 'weekly', priority: '0.6' },
  { path: '/lexicon', changefreq: 'weekly', priority: '0.8' },
  { path: '/oer', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/reader', changefreq: 'weekly', priority: '0.7' },
  { path: '/relationships', changefreq: 'monthly', priority: '0.5' },
  { path: '/schema-org', changefreq: 'monthly', priority: '0.4' },
  { path: '/stats', changefreq: 'weekly', priority: '0.5' },
  { path: '/timeline', changefreq: 'weekly', priority: '0.9' },
];

const authorIds = ['caesar', 'augustus', 'cicero', 'catilina', 'seneca', 'sallust', 'sokrates'];

async function main() {
  const postsIndex = await readJson<{ posts?: Array<{ slug?: string; author?: string; date?: string }> }>('posts/index.json', {});
  const works = await readJson<Array<{ slug?: string; author?: string }>>('api/works.json', []);
  const lexicon = await readJson<Array<{ slug?: string }>>('api/lexicon.json', []);

  const pagesEntries: SitemapEntry[] = staticPages.map((page) => ({
    loc: toUrl(page.path),
    changefreq: page.changefreq,
    priority: page.priority,
  }));

  const authorEntries: SitemapEntry[] = authorIds.flatMap((author) => ([
    { loc: toUrl(`/${author}`), changefreq: 'weekly', priority: '0.9' },
    { loc: toUrl(`/${author}/about`), changefreq: 'monthly', priority: '0.8' },
    { loc: toUrl(`/${author}/chat`), changefreq: 'weekly', priority: '0.7' },
    { loc: toUrl(`/${author}/simulation`), changefreq: 'weekly', priority: '0.7' },
  ]));

  const postEntries: SitemapEntry[] = (postsIndex.posts || [])
    .filter((post): post is { slug: string; author: string; date?: string } => Boolean(post?.slug && post?.author))
    .map((post) => ({
      loc: toUrl(`/${post.author}/${post.slug}`),
      lastmod: post.date ? new Date(post.date).toISOString().slice(0, 10) : undefined,
      changefreq: 'monthly',
      priority: '0.7',
    }));

  const workEntries: SitemapEntry[] = works
    .filter((work): work is { slug: string; author: string } => Boolean(work?.slug && work?.author))
    .map((work) => ({
      loc: toUrl(`/${work.author}/works/${work.slug}`),
      changefreq: 'monthly',
      priority: '0.8',
    }));

  const lexiconEntries: SitemapEntry[] = lexicon
    .filter((entry): entry is { slug: string } => Boolean(entry?.slug))
    .map((entry) => ({
      loc: toUrl(`/lexicon/${entry.slug}`),
      changefreq: 'monthly',
      priority: '0.6',
    }));

  await writeXml('sitemap-pages.xml', buildUrlset(pagesEntries));
  await writeXml('sitemap-authors.xml', buildUrlset(authorEntries));
  await writeXml('sitemap-content.xml', buildUrlset([...postEntries, ...workEntries, ...lexiconEntries]));
  await writeXml('sitemap.xml', buildSitemapIndex([
    { loc: toUrl('/sitemap-pages.xml') },
    { loc: toUrl('/sitemap-authors.xml') },
    { loc: toUrl('/sitemap-content.xml') },
  ]));

  console.log('Generated sitemap files in public/');
}

await main();

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { authors as authorMap } from '../src/data/authors';
import { works as worksMap } from '../src/data/works';

export function getSiteUrl() {
  const envUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.CF_PAGES_URL || process.env.PUBLIC_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  // Fallback for local/dev
  if (process.env.NODE_ENV === 'production') {
    return 'https://meum-diarium.xn--schchner-2za.de';
  }
  return 'http://localhost:5173';
}

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export function url(loc: string, lastmod?: string, opts?: { changefreq?: ChangeFreq; priority?: number }) {
  const full = `${getSiteUrl()}${loc.startsWith('/') ? loc : `/${loc}`}`;
  const lm = lastmod || new Date().toISOString();
  const cf = opts?.changefreq ? `\n    <changefreq>${opts.changefreq}</changefreq>` : '';
  const pr = typeof opts?.priority === 'number' ? `\n    <priority>${Math.max(0, Math.min(1, opts.priority)).toFixed(1)}</priority>` : '';
  return `  <url>\n    <loc>${full}</loc>\n    <lastmod>${lm}</lastmod>${cf}${pr}\n  </url>`;
}

function unique<T>(arr: T[]) { return Array.from(new Set(arr)); }

export async function generateSitemap() {
  const urls: string[] = [];

  // Core pages
  urls.push(url('/', undefined, { changefreq: 'daily', priority: 1.0 }));
  urls.push(url('/timeline', undefined, { changefreq: 'weekly', priority: 0.6 }));
  urls.push(url('/search', undefined, { changefreq: 'weekly', priority: 0.5 }));

  // Authors and their chat pages
  const authorIds = Object.keys(authorMap);
  for (const aid of authorIds) {
    urls.push(url(`/${aid}`, undefined, { changefreq: 'weekly', priority: 0.8 }));
    urls.push(url(`/${aid}/chat`, undefined, { changefreq: 'weekly', priority: 0.7 }));
  }

  // Works
  for (const slug of Object.keys(worksMap)) {
    const work = (worksMap as any)[slug];
    const author = work?.author;
    if (author) urls.push(url(`/${author}/works/${slug}`, undefined, { changefreq: 'monthly', priority: 0.8 }));
  }

  // Lexicon entries (by filename)
  const lexiconDir = path.resolve(process.cwd(), 'src/content/lexicon');
  if (fs.existsSync(lexiconDir)) {
    const files = fs.readdirSync(lexiconDir).filter(f => f.endsWith('.ts'));
    for (const f of files) {
      const slug = f.replace(/\.ts$/, '');
      urls.push(url(`/lexicon/${slug}`, undefined, { changefreq: 'monthly', priority: 0.7 }));
    }
  }

  // Posts: /src/content/posts/<authorId>/*.ts => /<authorId>/posts/<slug>
  const postsRoot = path.resolve(process.cwd(), 'src/content/posts');
  if (fs.existsSync(postsRoot)) {
    const authorDirs = fs.readdirSync(postsRoot).filter(d => fs.statSync(path.join(postsRoot, d)).isDirectory());
    for (const aid of authorDirs) {
      const dir = path.join(postsRoot, aid);
      const postFiles = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
      for (const f of postFiles) {
        const slug = f.replace(/\.ts$/, '');
        urls.push(url(`/${aid}/posts/${slug}`, undefined, { changefreq: 'monthly', priority: 0.9 }));
      }
    }
  }

  // Deduplicate
  const finalUrls = unique(urls);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${finalUrls.join('\n')}\n</urlset>\n`;

  const outDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outFile, xml, 'utf8');
  console.log(`Sitemap written: ${outFile} (${finalUrls.length} URLs)`);
}

// If executed directly via tsx, run once
if (import.meta.url.endsWith('/scripts/generate-sitemap.ts')) {
  generateSitemap().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

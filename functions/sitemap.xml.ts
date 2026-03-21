import { getDb } from './db/client';
import { posts, works } from './db/schema';
import type { PagesContext } from './types';

const BASE_URL = 'https://meum-diarium.xn--schchner-2za.de';

const TODAY = new Date().toISOString().split('T')[0];

/** Static pages that are always included in the sitemap. */
const STATIC_URLS: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = [
    { loc: '/', changefreq: 'daily', priority: '1.0', lastmod: TODAY },
    { loc: '/about', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
    { loc: '/timeline', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
    { loc: '/lexicon', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
    { loc: '/search', changefreq: 'weekly', priority: '0.7', lastmod: TODAY },
    { loc: '/learn', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
    { loc: '/learn/grammar', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
    { loc: '/learn/practice', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
    { loc: '/learn/rhetoric', changefreq: 'weekly', priority: '0.8', lastmod: TODAY },
    { loc: '/vocab', changefreq: 'weekly', priority: '0.7', lastmod: TODAY },
    { loc: '/reader', changefreq: 'weekly', priority: '0.7', lastmod: TODAY },
    { loc: '/oer', changefreq: 'monthly', priority: '0.6', lastmod: TODAY },
    { loc: '/api', changefreq: 'monthly', priority: '0.6', lastmod: TODAY },
    { loc: '/stats', changefreq: 'weekly', priority: '0.7', lastmod: TODAY },
    // Author pages
    { loc: '/caesar', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
    { loc: '/cicero', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
    { loc: '/augustus', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
    { loc: '/seneca', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
    { loc: '/catilina', changefreq: 'weekly', priority: '0.9', lastmod: TODAY },
    // Author about pages
    { loc: '/caesar/about', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
    { loc: '/cicero/about', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
    { loc: '/augustus/about', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
    { loc: '/seneca/about', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
    { loc: '/catilina/about', changefreq: 'monthly', priority: '0.7', lastmod: TODAY },
    // Works pages
    { loc: '/caesar/works/de-bello-gallico', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/caesar/works/de-bello-civili', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/cicero/works/de-re-publica', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/cicero/works/de-officiis', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/cicero/works/in-catilinam', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/cicero/works/philippicae', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/augustus/works/res-gestae', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/seneca/works/de-ira', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/seneca/works/epistulae-morales', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    { loc: '/catilina/works/catilinae-coniuratio', changefreq: 'monthly', priority: '0.8', lastmod: TODAY },
    // Legal pages
    { loc: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: TODAY },
    { loc: '/legal', changefreq: 'yearly', priority: '0.3', lastmod: TODAY },
    { loc: '/cookies', changefreq: 'yearly', priority: '0.3', lastmod: TODAY },
    { loc: '/agb', changefreq: 'yearly', priority: '0.3', lastmod: TODAY },
];

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function buildUrl(path: string): string {
    return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function urlEntry(
    loc: string,
    opts: { changefreq?: string; priority?: string; lastmod?: string | null } = {}
): string {
    const parts = [`  <url>\n    <loc>${escapeXml(loc)}</loc>`];
    if (opts.lastmod) parts.push(`\n    <lastmod>${opts.lastmod}</lastmod>`);
    if (opts.changefreq) parts.push(`\n    <changefreq>${opts.changefreq}</changefreq>`);
    if (opts.priority) parts.push(`\n    <priority>${opts.priority}</priority>`);
    parts.push('\n  </url>');
    return parts.join('');
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
    const seen = new Set<string>();
    const entries: string[] = [];

    // Add static URLs
    for (const item of STATIC_URLS) {
        const loc = buildUrl(item.loc);
        if (!seen.has(loc)) {
            seen.add(loc);
            entries.push(urlEntry(loc, { changefreq: item.changefreq, priority: item.priority, lastmod: item.lastmod }));
        }
    }

    // Add dynamic blog post and works URLs from D1 database
    if (context.env?.DB) {
        try {
            const db = getDb(context.env);

            // Fetch all posts (slug, authorId, date)
            const allPosts = await db
                .select({ slug: posts.slug, authorId: posts.authorId, date: posts.date })
                .from(posts)
                .all();

            for (const post of allPosts) {
                if (!post?.slug) continue;
                const slug = String(post.slug).replace(/^\/+|\/+$/g, '');
                const author = String(post.authorId || '').toLowerCase().replace(/^\/+|\/+$/g, '');
                const loc = author ? buildUrl(`/${author}/${slug}`) : buildUrl(`/${slug}`);
                if (seen.has(loc)) continue;
                seen.add(loc);
                const lastmod = post.date ? new Date(post.date).toISOString().split('T')[0] : null;
                entries.push(urlEntry(loc, { changefreq: 'weekly', priority: '0.8', lastmod }));
            }

            // Fetch all works (id/slug, authorId)
            const allWorks = await db
                .select({ id: works.id, authorId: works.authorId, date: works.date })
                .from(works)
                .all();

            for (const work of allWorks) {
                if (!work?.id) continue;
                const slug = String(work.id).replace(/^\/+|\/+$/g, '');
                const author = String(work.authorId || '').toLowerCase().replace(/^\/+|\/+$/g, '');
                const loc = author ? buildUrl(`/${author}/works/${slug}`) : buildUrl(`/works/${slug}`);
                if (seen.has(loc)) continue;
                seen.add(loc);
                entries.push(urlEntry(loc, { changefreq: 'monthly', priority: '0.8' }));
            }
        } catch (err) {
            console.error('[sitemap.xml] DB error:', err);
            // Continue with static entries only
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
};

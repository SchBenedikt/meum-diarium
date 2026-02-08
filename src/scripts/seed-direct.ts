import { glob } from 'glob';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { authors } from '../data/authors';
import { works } from '../data/works';
import { lexicon } from '../data/lexicon';
const execAsync = promisify(exec);
// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
function escape(str: string | undefined | null): string {
    if (str === undefined || str === null) return 'NULL';
    return "'" + str.replace(/'/g, "''").replace(/\n/g, '\\n') + "'";
}
function json(obj: unknown): string {
    if (obj === undefined || obj === null) return 'NULL';
    return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'";
}
// Helper to escape for shell (zsh/bash) inside double quotes
function escapeShellArg(str: string): string {
    // We wrap the whole command in "..."
    // So we need to escape ", $, `, and \
    return str.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\$/g, '\\$')
        .replace(/`/g, '\\`');
}
async function executeSqlStatement(sql: string, description: string) {
    try {
        const escapedSql = escapeShellArg(sql.trim());
        // 
        await execAsync(`npx wrangler d1 execute meum-diarium --remote --command "${escapedSql}" --yes`);
    } catch (e: unknown) {
        console.error(`❌ Failed: ${description}`, e instanceof Error ? e.message : String(e));
        // Retry
        try {
            await delay(2000);
            const escapedSql = escapeShellArg(sql.trim());
            await execAsync(`npx wrangler d1 execute meum-diarium --remote --command "${escapedSql}" --yes`);
        } catch (retryError) {
            console.error(`❌ Retry Failed: ${description}`);
        }
    }
}
(async () => {
    // --- Authors ---
    let authorsSql = '';
    for (const key in authors) {
        const author = authors[key];
        authorsSql += `REPLACE INTO authors (id, name, latin_name, title, years, birth_year, death_year, description, hero_image, theme, color, highlights) VALUES (${escape(author.id)}, ${escape(author.name)}, ${escape(author.latinName)}, ${escape(author.title)}, ${escape(author.years)}, ${author.birthYear}, ${author.deathYear}, ${escape(author.description)}, ${escape(author.heroImage)}, ${escape(author.theme)}, ${escape(author.color)}, ${json(author.highlights)});`;
    }
    // Authors is small enough for one command
    await executeSqlStatement(authorsSql, 'Authors');
    await delay(1000);
    // --- Works ---
    let worksSql = '';
    for (const key in works) {
        const work = works[key];
        worksSql += `REPLACE INTO works (id, title, author_id, description, type, date, cover_image, content) VALUES (${escape(key)}, ${escape(work.title)}, ${escape(work.author)}, ${escape((work as { description?: string }).description || '')}, 'work', NULL, NULL, ${json(work)});`;
    }
    await executeSqlStatement(worksSql, 'Works');
    await delay(1000);
    // --- Lexicon (One by one) ---
    for (let i = 0; i < lexicon.length; i++) {
        const entry = lexicon[i];
        const chunkSql = `REPLACE INTO lexicon (slug, term, variants, definition, category, etymology, related_terms, translations) VALUES (${escape(entry.slug)}, ${escape(entry.term)}, ${json(entry.variants)}, ${escape(entry.definition)}, ${escape(entry.category)}, ${escape(entry.etymology)}, ${json(entry.relatedTerms)}, ${json(entry.translations)});`;
        await executeSqlStatement(chunkSql, `Lexicon ${i + 1}/${lexicon.length}: ${entry.slug}`);
        // Small delay to be nice
        await delay(500);
    }
    // --- Posts (One by one) ---
    const postsDir = path.join(process.cwd(), 'src/content/posts');
    const postFiles = glob.sync('**/*.ts', { cwd: postsDir });
    for (let i = 0; i < postFiles.length; i++) {
        const file = postFiles[i];
        const fullPath = path.join(postsDir, file);
        try {
            const module = await import(fullPath);
            const post = module.post || module.default;
            if (!post) continue;
            const id = post.slug;
            const historicalYear = parseInt(post.historicalDate?.match(/-?\d+/)?.[0] || '0');
            const postSql = `REPLACE INTO posts (id, slug, author_id, title, excerpt, historical_date, historical_year, date, reading_time, tags, cover_image, content, translations) VALUES (${escape(id)}, ${escape(post.slug)}, ${escape(post.author)}, ${escape(post.title)}, ${escape(post.excerpt)}, ${escape(post.historicalDate)}, ${historicalYear}, ${escape(post.date)}, ${parseInt(post.readingTime) || 0}, ${json(post.tags)}, ${escape(post.image)}, ${json(post.content)}, ${json(post.translations)});`;
            await executeSqlStatement(postSql, `Post ${i + 1}/${postFiles.length}: ${post.slug}`);
            await delay(1000);
        } catch (e) {
            console.error(`Error preparing post ${file}:`, e);
        }
    }
    process.exit(0);
})();

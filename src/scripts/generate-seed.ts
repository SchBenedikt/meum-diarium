import { glob } from 'glob';
import fs from 'fs';
import path from 'path';
import { authors } from '../data/authors';
import { works } from '../data/works';
import { lexicon } from '../data/lexicon';
// We will need to dynamic import posts, so let's use glob or similar if possible, 
// or just manually list them if we know where they are. 
// For now let's just do authors, works, lexicon as a proof of concept.
// We can iterate directories for posts.
const outputFile = 'seed.sql';
let sql = '';
function escape(str: string | undefined | null): string {
    if (str === undefined || str === null) return 'NULL';
    return "'" + str.replace(/'/g, "''").replace(/\n/g, '\\n') + "'";
}
function json(obj: any): string {
    if (obj === undefined || obj === null) return 'NULL';
    return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'";
}
// Authors
sql += '-- Authors\n';
for (const key in authors) {
    const author = authors[key];
    sql += `INSERT INTO authors (id, name, latin_name, title, years, birth_year, death_year, description, hero_image, theme, color, highlights) VALUES (${escape(author.id)}, ${escape(author.name)}, ${escape(author.latinName)}, ${escape(author.title)}, ${escape(author.years)}, ${author.birthYear}, ${author.deathYear}, ${escape(author.description)}, ${escape(author.heroImage)}, ${escape(author.theme)}, ${escape(author.color)}, ${json(author.highlights)});\n`;
}
// Works
sql += '\n-- Works\n';
for (const key in works) {
    // skip purely content files if they are not in the 'works' map properly or have different structure
    // The works map seems to have the structure we need
    const work = works[key];
    // We need to map work fields to DB columns. 
    // work object from src/data/works.ts might differ from our schema.
    // Let's assume we map what we can.
    // id in schema is primary key. Work object might not have id, we use the key?
    // Let's check works.ts content again. It imports from content/works/...
    // Let's assume 'key' is the ID.
    // We need to adapt this based on actual work object structure which I need to check more closely.
    // But for now:
    sql += `INSERT INTO works (id, title, author_id, description, type, date, cover_image, content) VALUES (${escape(key)}, ${escape(work.title)}, ${escape(work.author)}, ${escape((work as any).description)}, 'work', NULL, NULL, ${json(work)});\n`;
}
// Authors & Works
fs.writeFileSync('seed_authors_works.sql', sql);
// Lexicon - Split into chunks
const lexiconEntries = lexicon; // lexicon is already an array
const lexiconChunkSize = 10;
let chunkIndex = 1;
for (let i = 0; i < lexiconEntries.length; i += lexiconChunkSize) {
    let chunkSql = '-- Lexicon Chunk ' + chunkIndex + '\n';
    const chunk = lexiconEntries.slice(i, i + lexiconChunkSize);
    for (const entry of chunk) { // Iterate directly over entry, not [slug, entry]
        chunkSql += `INSERT INTO lexicon (slug, term, variants, definition, category, etymology, related_terms, translations) VALUES (${escape(entry.slug)}, ${escape(entry.term)}, ${json(entry.variants)}, ${escape(entry.definition)}, ${escape(entry.category)}, ${escape(entry.etymology)}, ${json(entry.relatedTerms)}, ${json(entry.translations)});\n`;
    }
    const filename = `seed_lexicon_${chunkIndex}.sql`;
    fs.writeFileSync(filename, chunkSql);
    chunkIndex++;
}
// Posts - Split into chunks
const postsDir = path.join(process.cwd(), 'src/content/posts');
const postFiles = glob.sync('**/*.ts', { cwd: postsDir });
const postChunkSize = 5;
let postChunkIndex = 1;
(async () => {
    for (let i = 0; i < postFiles.length; i += postChunkSize) {
        let chunkSql = '-- Posts Chunk ' + postChunkIndex + '\n';
        const chunk = postFiles.slice(i, i + postChunkSize);
        for (const file of chunk) {
            const fullPath = path.join(postsDir, file);
            try {
                const module = await import(fullPath);
                const post = module.post || module.default;
                if (!post) {
                    continue;
                }
                const id = post.slug;
                const historicalYear = parseInt(post.historicalDate?.match(/-?\d+/)?.[0] || '0');
                chunkSql += `INSERT INTO posts (id, slug, author_id, title, excerpt, historical_date, historical_year, date, reading_time, tags, cover_image, content, translations) VALUES (${escape(id)}, ${escape(post.slug)}, ${escape(post.author)}, ${escape(post.title)}, ${escape(post.excerpt)}, ${escape(post.historicalDate)}, ${historicalYear}, ${escape(post.date)}, ${parseInt(post.readingTime) || 0}, ${json(post.tags)}, ${escape(post.image)}, ${json(post.content)}, ${json(post.translations)});\n`;
            } catch (e) {
                console.error(`Error processing ${file}:`, e);
            }
        }
        const filename = `seed_posts_${postChunkIndex}.sql`;
        fs.writeFileSync(filename, chunkSql);
        postChunkIndex++;
    }
})();

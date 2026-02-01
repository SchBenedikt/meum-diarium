
import { exec } from 'child_process';
import { promisify } from 'util';
// Direct imports of JSONs. tsx handles this.
import ovid from '../data/latin/ovid-metamorphoses.json';
import caesar from '../data/latin/caesar-de-bello-gallico.json';

const execAsync = promisify(exec);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function escape(str: string | undefined | null): string {
    if (str === undefined || str === null) return 'NULL';
    return "'" + str.replace(/'/g, "''").replace(/\n/g, '\\n') + "'";
}

function escapeShellArg(str: string): string {
    return str.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\$/g, '\\$')
        .replace(/`/g, '\\`');
}

async function executeSqlStatement(sql: string, description: string) {
    try {
        console.log(`Executing ${description}...`);
        const escapedSql = escapeShellArg(sql.trim());
        await execAsync(`npx wrangler d1 execute meum-diarium --remote --command "${escapedSql}" --yes`);
        console.log(`✅ Success: ${description}`);
    } catch (e: any) {
        console.error(`❌ Failed: ${description}`, e.message);
        try {
            console.log('Retrying after 2s...');
            await delay(2000);
            const escapedSql = escapeShellArg(sql.trim());
            await execAsync(`npx wrangler d1 execute meum-diarium --remote --command "${escapedSql}" --yes`);
            console.log(`✅ Retry Success: ${description}`);
        } catch (retryError) {
            console.error(`❌ Retry Failed: ${description}`);
        }
    }
}

(async () => {
    // --- Ovid ---
    console.log('Seeding Ovid Metamorphoses...');
    for (const book of ovid.books) {
        // We insert lines individually to avoid huge commands
        for (let i = 0; i < book.lines.length; i++) {
            const line = book.lines[i];
            const sql = `INSERT INTO latin_texts (work_id, book, verse, latin_text) VALUES ('met', ${book.id}, ${i + 1}, ${escape(line)});`;
            await executeSqlStatement(sql, `Ovid Book ${book.id} Line ${i + 1}`);
            await delay(100); // Fast but safe
        }
    }

    // --- Caesar ---
    console.log('Seeding Caesar Gallic War...');
    // Caesar structure: book -> chapters -> lines
    for (const book of caesar.books) {
        // @ts-ignore - The type definition in my head matches JSON but let's be safe
        if (!book.chapters) continue;

        for (const chapter of book.chapters) {
            for (let i = 0; i < chapter.lines.length; i++) {
                const line = chapter.lines[i];
                // Use 'section' for generic line/sentence index within chapter
                const sql = `INSERT INTO latin_texts (work_id, book, chapter, section, latin_text) VALUES ('dbg', ${book.id}, ${chapter.id}, ${i + 1}, ${escape(line)});`;
                await executeSqlStatement(sql, `Caesar Book ${book.id} Chap ${chapter.id} Line ${i + 1}`);
                await delay(100);
            }
        }
    }

    console.log('--- LATIN TEXTS SEEDING COMPLETE ---');
    process.exit(0);
})();

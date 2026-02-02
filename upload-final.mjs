import { glob } from 'glob';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Lade alle Posts...\n');

const postFiles = await glob('src/content/posts/**/*.ts', {
  cwd: join(__dirname),
  ignore: ['**/node_modules/**']
});

const allPosts = [];

for (const file of postFiles) {
  try {
    const filePath = join(__dirname, file);
    const module = await import(filePath);
    const post = module.default;
    if (post) {
      allPosts.push(post);
    }
  } catch (error) {}
}

console.log(`✅ ${allPosts.length} Posts geladen\n`);

// Get existing posts from remote
console.log('📊 Hole aktuelle Posts aus Remote-DB...\n');
let existingPosts = [];
try {
  const output = execSync('npx wrangler d1 execute DB --command="SELECT id, title FROM posts;" --remote --yes', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  // Parse table output
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('│') && !line.includes('───') && !line.includes('id')) {
      const match = line.match(/│\s*([^\s│]+)\s*│/);
      if (match && match[1]) {
        existingPosts.push(match[1]);
      }
    }
  }
  console.log(`✅ ${existingPosts.length} Posts bereits in Remote-DB\n`);
} catch (error) {
  console.log('⚠️  Fehler beim Abrufen, fahre fort...\n');
}

// Find missing posts
const missingPosts = allPosts.filter(p => !existingPosts.includes(p.id));
console.log(`🎯 ${missingPosts.length} Posts müssen hochgeladen werden\n`);

if (missingPosts.length === 0) {
  console.log('🎉 Alle Posts sind bereits hochgeladen!');
  process.exit(0);
}

// Show missing posts
console.log('📋 Fehlende Posts:');
missingPosts.forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.author}: ${p.title.substring(0, 60)}`);
});
console.log('\n' + '='.repeat(70) + '\n');

const escapeQuotes = (str) => str ? str.replace(/'/g, "''") : '';

const createPostSQL = (post) => {
  const contentJson = JSON.stringify(post.content);
  const translationsJson = JSON.stringify(post.translations || {});
  const tagsJson = JSON.stringify(post.tags || []);
  
  return `INSERT OR REPLACE INTO posts (id, slug, author_id, title, excerpt, historical_date, historical_year, date, reading_time, tags, cover_image, content, translations) 
VALUES ('${post.id}', '${escapeQuotes(post.slug)}', '${escapeQuotes(post.author)}', '${escapeQuotes(post.title)}', '${escapeQuotes(post.excerpt || '')}', '${escapeQuotes(post.historicalDate || '')}', ${post.historicalYear || 'NULL'}, '${escapeQuotes(post.date || '')}', ${post.readingTime || 0}, '${escapeQuotes(tagsJson)}', '${escapeQuotes(post.coverImage || '')}', '${escapeQuotes(contentJson)}', '${escapeQuotes(translationsJson)}');`;
};

let successCount = 0;
let failCount = 0;

for (let i = 0; i < missingPosts.length; i++) {
  const post = missingPosts[i];
  const sql = createPostSQL(post);
  const filename = `temp-post-${i + 1}.sql`;
  
  await writeFile(filename, sql);
  
  const displayTitle = post.title.length > 55 ? post.title.substring(0, 55) + '...' : post.title;
  console.log(`\n📝 [${i + 1}/${missingPosts.length}] ${displayTitle}`);
  console.log(`   ID: ${post.id} | Autor: ${post.author}`);
  
  let success = false;
  
  for (let attempt = 1; attempt <= 3 && !success; attempt++) {
    try {
      const output = execSync(`npx wrangler d1 execute DB --file=${filename} --remote --yes`, {
        encoding: 'utf-8',
        timeout: 45000,
        stdio: 'pipe'
      });
      
      if (output.includes('successfully') || output.includes('Executed')) {
        console.log(`   ✅ Erfolgreich hochgeladen`);
        successCount++;
        success = true;
      } else {
        throw new Error('Unexpected output');
      }
    } catch (error) {
      if (attempt < 3) {
        console.log(`   ⚠️  Versuch ${attempt} fehlgeschlagen, warte 10 Sekunden...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      } else {
        console.log(`   ❌ FEHLGESCHLAGEN nach 3 Versuchen`);
        console.log(`   Fehler: ${error.message.substring(0, 100)}`);
        failCount++;
      }
    }
  }
  
  // Longer pause between posts to avoid rate limiting
  if (i < missingPosts.length - 1) {
    console.log(`   ⏳ Warte 8 Sekunden...`);
    await new Promise(resolve => setTimeout(resolve, 8000));
  }
}

console.log('\n' + '='.repeat(70));
console.log('\n🎉 UPLOAD ABGESCHLOSSEN!\n');
console.log(`✅ Erfolgreich: ${successCount}/${missingPosts.length}`);
console.log(`❌ Fehlgeschlagen: ${failCount}/${missingPosts.length}`);

if (failCount > 0) {
  console.log('\n⚠️  Einige Posts konnten nicht hochgeladen werden.');
  console.log('💡 Versuche das Script erneut auszuführen.');
}

console.log('\n📊 Überprüfe finale Anzahl...\n');
try {
  execSync('npx wrangler d1 execute DB --command="SELECT COUNT(*) as total FROM posts;" --remote --yes', {
    stdio: 'inherit'
  });
} catch (error) {}

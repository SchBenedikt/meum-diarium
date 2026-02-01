#!/usr/bin/env tsx
/**
 * Database Verification Script
 * 
 * This script verifies that the Cloudflare D1 database is properly populated
 * with all posts and lexicon entries.
 * 
 * Usage:
 *   npx tsx scripts/verify-database.ts [--remote]
 * 
 * Options:
 *   --remote    Check the remote production database (default: local)
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DbCount {
  count: number;
}

interface Author {
  id: string;
  name: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  author_id: string;
}

interface LexiconEntry {
  slug: string;
  term: string;
  category: string;
}

const isRemote = process.argv.includes('--remote');
const dbFlag = isRemote ? '--remote' : '--local';
const dbName = 'meum-diarium';

console.log(`\n🔍 Verifying ${isRemote ? 'REMOTE' : 'LOCAL'} D1 Database: ${dbName}\n`);
console.log('━'.repeat(60));

async function runQuery<T = any>(sql: string): Promise<T[]> {
  try {
    const command = `npx wrangler d1 execute ${dbName} ${dbFlag} --command "${sql.replace(/"/g, '\\"')}" --json`;
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('wrangler')) {
      console.error('Query error:', stderr);
      return [];
    }
    
    let result: any;
    try {
      result = JSON.parse(stdout);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON from wrangler output');
      console.error('   This might indicate an issue with the wrangler command or database connection');
      console.error('   Raw output:', stdout.substring(0, 200));
      return [];
    }
    
    // Handle different output formats
    if (Array.isArray(result)) {
      return result[0]?.results || result[0] || [];
    } else if (result?.results) {
      return result.results;
    } else if (result?.[0]?.results) {
      return result[0].results;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to execute query:', sql);
    console.error('Error:', error);
    return [];
  }
}

async function checkTableExists(tableName: string): Promise<boolean> {
  const result = await runQuery<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
  );
  return result.length > 0;
}

async function getCount(tableName: string): Promise<number> {
  const result = await runQuery<DbCount>(`SELECT COUNT(*) as count FROM ${tableName}`);
  return result[0]?.count || 0;
}

async function verifyAuthors(): Promise<void> {
  console.log('\n📚 Authors Table');
  console.log('─'.repeat(60));
  
  const exists = await checkTableExists('authors');
  if (!exists) {
    console.log('❌ Table does not exist');
    return;
  }
  
  const count = await getCount('authors');
  const authors = await runQuery<Author>('SELECT id, name FROM authors ORDER BY id');
  
  console.log(`✓ Found ${count} authors`);
  if (authors.length > 0) {
    authors.forEach(author => {
      console.log(`  • ${author.id}: ${author.name}`);
    });
  }
  
  if (count < 5) {
    console.log('⚠️  Expected at least 5 authors (Caesar, Cicero, Augustus, Catilina, Seneca)');
  }
}

async function verifyPosts(): Promise<void> {
  console.log('\n📝 Posts Table');
  console.log('─'.repeat(60));
  
  const exists = await checkTableExists('posts');
  if (!exists) {
    console.log('❌ Table does not exist');
    return;
  }
  
  const count = await getCount('posts');
  console.log(`✓ Found ${count} posts`);
  
  // Check posts by author
  const postsByAuthor = await runQuery<{ author_id: string; count: number }>(
    'SELECT author_id, COUNT(*) as count FROM posts GROUP BY author_id ORDER BY count DESC'
  );
  
  if (postsByAuthor.length > 0) {
    console.log('\nPosts by author:');
    postsByAuthor.forEach(row => {
      console.log(`  • ${row.author_id}: ${row.count} posts`);
    });
  }
  
  // Sample a few posts
  const samplePosts = await runQuery<Post>(
    'SELECT id, slug, title, author_id FROM posts ORDER BY date DESC LIMIT 5'
  );
  
  if (samplePosts.length > 0) {
    console.log('\nRecent posts:');
    samplePosts.forEach(post => {
      console.log(`  • [${post.author_id}] ${post.title}`);
      console.log(`    → ${post.slug}`);
    });
  }
  
  if (count < 42) {
    console.log(`\n⚠️  Expected at least 42 posts, found ${count}`);
  }
}

async function verifyLexicon(): Promise<void> {
  console.log('\n📖 Lexicon Table');
  console.log('─'.repeat(60));
  
  const exists = await checkTableExists('lexicon');
  if (!exists) {
    console.log('❌ Table does not exist');
    return;
  }
  
  const count = await getCount('lexicon');
  console.log(`✓ Found ${count} lexicon entries`);
  
  // Check entries by category
  const entriesByCategory = await runQuery<{ category: string; count: number }>(
    'SELECT category, COUNT(*) as count FROM lexicon WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC'
  );
  
  if (entriesByCategory.length > 0) {
    console.log('\nEntries by category:');
    entriesByCategory.forEach(row => {
      console.log(`  • ${row.category || 'uncategorized'}: ${row.count} entries`);
    });
  }
  
  // Sample a few entries
  const sampleEntries = await runQuery<LexiconEntry>(
    'SELECT slug, term, category FROM lexicon ORDER BY term LIMIT 5'
  );
  
  if (sampleEntries.length > 0) {
    console.log('\nSample entries:');
    sampleEntries.forEach(entry => {
      console.log(`  • ${entry.term} [${entry.category || 'uncategorized'}]`);
      console.log(`    → /lexicon/${entry.slug}`);
    });
  }
  
  if (count < 92) {
    console.log(`\n⚠️  Expected at least 92 lexicon entries, found ${count}`);
  }
}

async function verifyWorks(): Promise<void> {
  console.log('\n📜 Works Table');
  console.log('─'.repeat(60));
  
  const exists = await checkTableExists('works');
  if (!exists) {
    console.log('❌ Table does not exist');
    return;
  }
  
  const count = await getCount('works');
  console.log(`✓ Found ${count} works`);
  
  const works = await runQuery<{ id: string; title: string; author_id: string }>(
    'SELECT id, title, author_id FROM works ORDER BY author_id, title'
  );
  
  if (works.length > 0) {
    console.log('\nAll works:');
    works.forEach(work => {
      console.log(`  • ${work.title}`);
      console.log(`    Author: ${work.author_id}, ID: ${work.id}`);
    });
  }
}

async function verifySummary(): Promise<void> {
  console.log('\n📊 Summary');
  console.log('━'.repeat(60));
  
  const tables = ['authors', 'posts', 'lexicon', 'works', 'vocabulary', 'latin_texts'];
  const counts: Record<string, number> = {};
  
  for (const table of tables) {
    const exists = await checkTableExists(table);
    if (exists) {
      counts[table] = await getCount(table);
    } else {
      counts[table] = -1; // Table doesn't exist
    }
  }
  
  console.log('\nTable counts:');
  for (const [table, count] of Object.entries(counts)) {
    if (count === -1) {
      console.log(`  ❌ ${table}: table does not exist`);
    } else if (count === 0) {
      console.log(`  ⚠️  ${table}: empty`);
    } else {
      console.log(`  ✓ ${table}: ${count} rows`);
    }
  }
  
  // Overall status
  console.log('\n' + '━'.repeat(60));
  
  const hasAllTables = Object.values(counts).every(c => c >= 0);
  const hasContent = counts.authors > 0 && counts.posts > 0 && counts.lexicon > 0;
  
  if (!hasAllTables) {
    console.log('❌ Database schema is incomplete. Run migrations first:');
    console.log('   npx wrangler d1 migrations apply meum-diarium --remote');
  } else if (!hasContent) {
    console.log('⚠️  Database exists but is empty. Run the seed script:');
    console.log('   ./apply_seeds.sh');
  } else if (counts.posts < 42 || counts.lexicon < 92) {
    console.log('⚠️  Database is partially populated. Consider re-running seed script:');
    console.log('   ./apply_seeds.sh');
  } else {
    console.log('✅ Database is fully populated and ready!');
    console.log('   All posts and lexicon entries are in the database.');
  }
}

async function main() {
  try {
    await verifyAuthors();
    await verifyPosts();
    await verifyLexicon();
    await verifyWorks();
    await verifySummary();
    
    console.log('\n' + '━'.repeat(60));
    console.log('✓ Verification complete\n');
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  }
}

main();

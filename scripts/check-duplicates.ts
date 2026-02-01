#!/usr/bin/env tsx
/**
 * Check Seed Files for Duplicate Entries
 * 
 * This script scans all seed files to detect duplicate slugs/IDs
 * that would cause UNIQUE constraint failures.
 * 
 * Usage:
 *   npx tsx scripts/check-duplicates.ts
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface DuplicateReport {
  table: string;
  column: string;
  value: string;
  files: string[];
  count: number;
}

const duplicates: DuplicateReport[] = [];

function extractInsertValues(sql: string, table: string): { column: string; values: string[] } {
  // Note: This regex only matches single-row INSERT statements
  // Multi-row inserts like INSERT INTO table (...) VALUES (...), (...) are not supported
  // and will only capture the first row
  const regex = new RegExp(`INSERT INTO ${table}\\s*\\(([^)]+)\\)\\s*VALUES\\s*\\(([^;]+)\\)`, 'gi');
  const matches = [...sql.matchAll(regex)];
  
  if (matches.length === 0) return { column: '', values: [] };
  
  // Get the first column (usually the ID/slug)
  const columns = matches[0][1].split(',').map(c => c.trim());
  const primaryColumn = columns[0];
  
  const values: string[] = [];
  
  for (const match of matches) {
    const valuesPart = match[2];
    // Extract the first value (corresponding to primary column)
    // Note: This simple split approach may fail if the value contains commas (even when quoted)
    // For production use, consider a proper SQL parser
    const firstValue = valuesPart.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    values.push(firstValue);
  }
  
  return { column: primaryColumn, values };
}

function checkTable(tableName: string, pattern: string) {
  console.log(`\n🔍 Checking ${tableName} table...`);
  
  const files = readdirSync('.').filter(f => f.match(pattern));
  
  if (files.length === 0) {
    console.log(`  ℹ️  No seed files found matching pattern: ${pattern}`);
    return;
  }
  
  console.log(`  Found ${files.length} seed file(s)`);
  
  const allValues = new Map<string, string[]>();
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const { column, values } = extractInsertValues(content, tableName);
      
      if (values.length > 0) {
        console.log(`    ${file}: ${values.length} entries`);
        
        for (const value of values) {
          if (!allValues.has(value)) {
            allValues.set(value, []);
          }
          allValues.get(value)!.push(file);
        }
      }
    } catch (err) {
      console.error(`  ⚠️  Error reading ${file}:`, err);
    }
  }
  
  // Find duplicates
  const dupes = Array.from(allValues.entries())
    .filter(([_, files]) => files.length > 1)
    .map(([value, files]) => ({
      table: tableName,
      column: 'id/slug',
      value,
      files,
      count: files.length
    }));
  
  if (dupes.length > 0) {
    console.log(`  ❌ Found ${dupes.length} duplicate(s):`);
    dupes.forEach(d => {
      console.log(`     • "${d.value}" appears in:`);
      d.files.forEach(f => console.log(`       - ${f}`));
    });
    duplicates.push(...dupes);
  } else {
    console.log(`  ✅ No duplicates found`);
  }
}

console.log('━'.repeat(60));
console.log('🔎 Checking Seed Files for Duplicate Entries');
console.log('━'.repeat(60));

// Check each table
checkTable('authors', /seed_authors_works\.sql/);
checkTable('works', /seed_authors_works\.sql/);
checkTable('lexicon', /seed_lexicon_\d+\.sql/);
checkTable('posts', /seed_posts(_\d+)?\.sql/);

// Summary
console.log('\n' + '━'.repeat(60));
console.log('📊 Summary');
console.log('━'.repeat(60));

if (duplicates.length === 0) {
  console.log('✅ No duplicate entries found!');
  console.log('   All seed files are clean and ready to use.');
} else {
  console.log(`❌ Found ${duplicates.length} duplicate entry/entries`);
  console.log('\nDuplicates by table:');
  
  const byTable = new Map<string, DuplicateReport[]>();
  duplicates.forEach(d => {
    if (!byTable.has(d.table)) {
      byTable.set(d.table, []);
    }
    byTable.get(d.table)!.push(d);
  });
  
  byTable.forEach((dupes, table) => {
    console.log(`\n  ${table}: ${dupes.length} duplicate(s)`);
    dupes.forEach(d => {
      console.log(`    • "${d.value}"`);
    });
  });
  
  console.log('\n⚠️  Action Required:');
  console.log('  1. Review the duplicate entries listed above');
  console.log('  2. Remove duplicates from the seed files');
  console.log('  3. Or ensure cleanup runs before seeding');
  
  process.exit(1);
}

console.log('━'.repeat(60));

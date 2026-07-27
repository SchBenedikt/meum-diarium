import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as vocabSchema from '../../functions/db/vocab-schema';
import fs from 'fs';
import path from 'path';

const VOCAB_DB_PATH = path.resolve(import.meta.dirname, '../../vocab.sqlite');

let dbInstance: ReturnType<typeof drizzle> | null = null;
let dbError: string | null = null;

try {
  if (!fs.existsSync(VOCAB_DB_PATH)) {
    dbError = `Vocabulary database not found at ${VOCAB_DB_PATH}. Run the setup script to create it.`;
  } else {
    const sqlite = new Database(VOCAB_DB_PATH, { readonly: true });
    dbInstance = drizzle(sqlite, { schema: vocabSchema });
  }
} catch (err: any) {
  dbError = err.message;
}

export const getLocalVocabDb = () => {
  if (dbError) {
    throw new Error(`Vocab database error: ${dbError}`);
  }
  if (!dbInstance) {
    throw new Error('Vocab database not initialized');
  }
  return dbInstance;
};

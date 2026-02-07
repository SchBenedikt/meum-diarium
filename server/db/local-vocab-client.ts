import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as vocabSchema from '../../functions/db/vocab-schema';

// Create database instance for local development
const sqlite = new Database('./token.sqlite', { readonly: true });

export const getLocalVocabDb = () => {
    return drizzle(sqlite, { schema: vocabSchema });
};

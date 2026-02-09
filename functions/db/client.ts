import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const getDb = (env: any) => {
    return drizzle(env.DB, { schema });
};

export const getVocabDb = (env: any) => {
    return drizzle(env.vocab, { schema });
};

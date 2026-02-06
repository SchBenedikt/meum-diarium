import { drizzle } from 'drizzle-orm/d1';
import * as vocabSchema from './vocab-schema';

export const getVocabDb = (env: any) => {
    return drizzle(env.vocab, { schema: vocabSchema });
};

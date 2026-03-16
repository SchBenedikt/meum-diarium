import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as postsSchema from './posts-schema';

// Create database instance for local development
const sqlite = new Database('./posts.sqlite', { readonly: true });

export const getLocalPostsDb = () => {
    return drizzle(sqlite, { schema: postsSchema });
};

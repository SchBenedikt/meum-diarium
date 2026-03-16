import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  author: text('author'),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  historicalDate: text('historicalDate'),
  historicalYear: integer('historicalYear'),
  date: text('date'),
  readingTime: integer('readingTime'),
  tags: text('tags'),
  coverImage: text('coverImage'),
  diary: text('diary'),
  scientific: text('scientific'),
});

export type Post = typeof posts.$inferSelect;

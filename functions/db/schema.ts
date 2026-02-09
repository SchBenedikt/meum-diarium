import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Authors Table
export const authors = sqliteTable('authors', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    latinName: text('latin_name'),
    title: text('title'),
    years: text('years'),
    birthYear: integer('birth_year'),
    deathYear: integer('death_year'),
    description: text('description'),
    heroImage: text('hero_image'),
    theme: text('theme'),
    color: text('color'),
    highlights: text('highlights', { mode: 'json' }), // JSON array of highlights
});

// Works Table
export const works = sqliteTable('works', {
    id: text('id').primaryKey(), // e.g., 'de-bello-gallico'
    title: text('title').notNull(),
    authorId: text('author_id').references(() => authors.id),
    description: text('description'),
    type: text('type'), // e.g., 'war_commentary', 'speech'
    date: text('date'),
    coverImage: text('cover_image'),
    content: text('content', { mode: 'json' }), // Structured content if needed, or link to text table
});

// Blog Posts Table
export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    authorId: text('author_id').references(() => authors.id),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    historicalDate: text('historical_date'),
    historicalYear: integer('historical_year'),
    date: text('date'), // Publication date YYYY-MM-DD
    readingTime: integer('reading_time'),
    tags: text('tags', { mode: 'json' }),
    coverImage: text('cover_image'),
    content: text('content', { mode: 'json' }).notNull(), // { diary: "...", scientific: "..." }
    translations: text('translations', { mode: 'json' }), // { en: { ... }, la: { ... } }
});

// Users Table (for comment tracking only)
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    displayName: text('display_name'),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    preferences: text('preferences', { mode: 'json' }), // User preferences
    createdAt: text('created_at').notNull().default(new Date().toISOString()),
    updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
    lastLoginAt: text('last_login_at'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

// Lexicon Table
export const lexicon = sqliteTable('lexicon', {
    slug: text('slug').primaryKey(),
    term: text('term').notNull(),
    variants: text('variants'), // Store as raw text, parse manually to handle malformed data
    definition: text('definition').notNull(),
    category: text('category'),
    etymology: text('etymology'),
    relatedTerms: text('related_terms'), // Store as raw text, parse manually
    translations: text('translations'), // Store as raw text, parse manually
});

// Vocabulary Table (New structure for learning)
export const vocabulary = sqliteTable('vocabulary', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    latin: text('latin').notNull(),
    german: text('german').notNull(),
    english: text('english'),
    type: text('type'), // noun, verb, adjective, etc.
    gender: text('gender'), // m, f, n
    conjugation: text('conjugation'), // a-konj, e-konj, etc.
    declination: text('declination'), // a-dekl, o-dekl, etc.
    forms: text('forms', { mode: 'json' }), // { genitive: "...", perfect: "..." }
    exampleSentence: text('example_sentence'),
    exampleTranslation: text('example_translation'),
    tags: text('tags', { mode: 'json' }), // e.g. ["Grundwortschatz", "Krieg"]
});

// Latin Texts (Full books like De Bello Gallico)
export const latinTexts = sqliteTable('latin_texts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    workId: text('work_id').references(() => works.id),
    book: integer('book'),
    chapter: integer('chapter'),
    section: integer('section'),
    verse: integer('verse'),
    latinText: text('latin_text').notNull(),
    germanTranslation: text('german_translation'),
    englishTranslation: text('english_translation'),
    annotations: text('annotations', { mode: 'json' }), // Grammar explanations etc.
});

// Comments Table (with user support)
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').references(() => users.id),
  parentId: text('parent_id').references(() => comments.id), // For threaded comments
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  isEdited: integer('is_edited', { mode: 'boolean' }).default(false),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  likesCount: integer('likes_count').default(0),
});

// User Commenting Activity Table (for tracking)
export const userCommentingActivity = sqliteTable('user_commenting_activity', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  commentId: text('comment_id').notNull().references(() => comments.id),
  action: text('action').notNull(), // 'created', 'edited', 'deleted', 'liked'
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  metadata: text('metadata', { mode: 'json' }), // Additional data like previous content
});

// Relations
export const worksRelations = relations(works, ({ one, many }) => ({
    author: one(authors, {
        fields: [works.authorId],
        references: [authors.id],
    }),
    posts: many(posts),
    latinTexts: many(latinTexts),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
    works: many(works),
    posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(authors, {
        fields: [posts.authorId],
        references: [authors.id],
    }),
    comments: many(comments),
}));

export const usersRelations = relations(users, ({ many }) => ({
    comments: many(comments),
    commentingActivities: many(userCommentingActivity),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: 'commentReplies'
    }),
    replies: many(comments, {
        relationName: 'commentReplies'
    }),
    activities: many(userCommentingActivity),
}));

export const userCommentingActivityRelations = relations(userCommentingActivity, ({ one }) => ({
    user: one(users, {
        fields: [userCommentingActivity.userId],
        references: [users.id],
    }),
    comment: one(comments, {
        fields: [userCommentingActivity.commentId],
        references: [comments.id],
    }),
}));

export const latinTextsRelations = relations(latinTexts, ({ one }) => ({
    work: one(works, {
        fields: [latinTexts.workId],
        references: [works.id],
    }),
}));

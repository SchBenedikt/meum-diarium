import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

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

    // Content stored as JSON to keep structure (diary vs scientific)
    content: text('content', { mode: 'json' }).notNull(), // { diary: "...", scientific: "..." }

    // Translations
    translations: text('translations', { mode: 'json' }), // { en: { ... }, la: { ... } }
});

// Lexicon Table
export const lexicon = sqliteTable('lexicon', {
    slug: text('slug').primaryKey(),
    term: text('term').notNull(),
    variants: text('variants', { mode: 'json' }),
    definition: text('definition').notNull(),
    category: text('category'),
    etymology: text('etymology'),
    relatedTerms: text('related_terms', { mode: 'json' }),
    translations: text('translations', { mode: 'json' }),
});

// Vocabulary Table (New structure for learning)
export const vocabulary = sqliteTable('vocabulary', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    latin: text('latin').notNull(),
    german: text('german').notNull(),
    english: text('english'),

    // Grammar info
    type: text('type'), // noun, verb, adjective, etc.
    gender: text('gender'), // m, f, n
    conjugation: text('conjugation'), // a-konj, e-konj, etc.
    declination: text('declination'), // a-dekl, o-dekl, etc.

    // Detailed forms (JSON)
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

// Relations
export const worksRelations = relations(works, ({ one }) => ({
    author: one(authors, {
        fields: [works.authorId],
        references: [authors.id],
    }),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
    works: many(works),
    posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
    author: one(authors, {
        fields: [posts.authorId],
        references: [authors.id],
    }),
}));

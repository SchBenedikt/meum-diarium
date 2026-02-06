import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// VOC Table - Main vocabulary entries
export const voc = sqliteTable('VOC', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    vokId: text('vok_id').notNull().unique(),
    latin: text('latin'),
    desc: text('desc'), // German description
    html: text('html'), // Formatted HTML description
    key: text('key').notNull(),
    grammar: text('grammar'), // Grammar type (e.g., "Verb, a-Konj.")
    typnr: integer('typnr'), // Type number for categorization
}, (table) => ({
    idx1: index('idx1').on(table.key),
    idx2: index('idx2').on(table.vokId),
    idx5: index('idx5').on(table.typnr),
}));

// GRAMMAR Table - Grammar forms and conjugation/declension patterns
export const grammar = sqliteTable('GRAMMAR', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    vokId: text('vok_id').notNull(),
    nr: text('nr'), // Form number
    form: text('form'), // The actual form text
}, (table) => ({
    idx3: index('idx3').on(table.vokId),
}));

// FORM Table - Detailed forms with grammatical descriptions
export const form = sqliteTable('FORM', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    vokId: text('vok_id').notNull(),
    form: text('form').notNull(), // The actual form (e.g., "Achilles")
    bestimmung: text('bestimmung'), // Description (e.g., "Nom. Sg.")
}, (table) => ({
    idx4: index('idx4').on(table.form),
}));

// Relations
export const vocRelations = relations(voc, ({ many }) => ({
    grammarForms: many(grammar),
    forms: many(form),
}));

export const grammarRelations = relations(grammar, ({ one }) => ({
    vocabulary: one(voc, {
        fields: [grammar.vokId],
        references: [voc.vokId],
    }),
}));

export const formRelations = relations(form, ({ one }) => ({
    vocabulary: one(voc, {
        fields: [form.vokId],
        references: [voc.vokId],
    }),
}));

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

// Users Table
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

// Comments Table
export const comments = sqliteTable('comments', {
    id: text('id').primaryKey(),
    postId: text('post_id').notNull().references(() => posts.id),
    userId: text('user_id').notNull().references(() => users.id),
    parentId: text('parent_id').references(() => comments.id), // For threaded comments
    content: text('content').notNull(),
    createdAt: text('created_at').notNull().default(new Date().toISOString()),
    updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
    isEdited: integer('is_edited', { mode: 'boolean' }).default(false),
    isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    likesCount: integer('likes_count').default(0),
});

// User Reading Progress Table
export const userReadingProgress = sqliteTable('user_reading_progress', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    postId: text('post_id').notNull().references(() => posts.id),
    startedAt: text('started_at').notNull().default(new Date().toISOString()),
    completedAt: text('completed_at'), // null if not completed
    readingTimeSeconds: integer('reading_time_seconds').default(0),
    progressPercentage: integer('progress_percentage').default(0), // 0-100
    lastPosition: integer('last_position').default(0), // Character position in text
    isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
    createdAt: text('created_at').notNull().default(new Date().toISOString()),
    updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

// User Commenting Activity Table
export const userCommentingActivity = sqliteTable('user_commenting_activity', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    commentId: text('comment_id').notNull().references(() => comments.id),
    action: text('action').notNull(), // 'created', 'edited', 'deleted', 'liked'
    createdAt: text('created_at').notNull().default(new Date().toISOString()),
    metadata: text('metadata', { mode: 'json' }), // Additional data like previous content
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

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(authors, {
        fields: [posts.authorId],
        references: [authors.id],
    }),
    comments: many(comments),
    readingProgress: many(userReadingProgress),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
    comments: many(comments),
    readingProgress: many(userReadingProgress),
    commentingActivity: many(userCommentingActivity),
    achievements: many(userAchievements),
    xp: one(userXp),
    savedArticles: many(userSavedArticles),
    readArticles: many(userReadArticles),
    sentFriendRequests: many(friendships, { relationName: 'sentRequests' }),
    receivedFriendRequests: many(friendships, { relationName: 'receivedRequests' }),
    activities: many(activityFeed),
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
        relationName: 'commentReplies',
    }),
    replies: many(comments, {
        relationName: 'commentReplies',
    }),
    activity: many(userCommentingActivity),
}));

export const userReadingProgressRelations = relations(userReadingProgress, ({ one }) => ({
    user: one(users, {
        fields: [userReadingProgress.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [userReadingProgress.postId],
        references: [posts.id],
    }),
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

// Achievements Table
export const achievements = sqliteTable('achievements', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    icon: text('icon').notNull(), // Icon name or emoji
    category: text('category').notNull(), // 'reading', 'vocabulary', 'grammar', 'social', 'streak'
    xpReward: integer('xp_reward').notNull().default(0),
    requirementType: text('requirement_type').notNull(), // 'posts_read', 'words_learned', 'streak_days', 'friends_count'
    requirementValue: integer('requirement_value').notNull(),
    isHidden: integer('is_hidden', { mode: 'boolean' }).default(false),
    createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// User Achievements Table
export const userAchievements = sqliteTable('user_achievements', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    achievementId: text('achievement_id').notNull().references(() => achievements.id),
    unlockedAt: text('unlocked_at').notNull().default(new Date().toISOString()),
    progress: integer('progress').default(0), // For partial progress tracking
});

// User XP Table
export const userXp = sqliteTable('user_xp', {
    userId: text('user_id').primaryKey().references(() => users.id),
    totalXp: integer('total_xp').default(0),
    level: integer('level').default(1),
    currentLevelXp: integer('current_level_xp').default(0),
    xpToNextLevel: integer('xp_to_next_level').default(100),
    streakDays: integer('streak_days').default(0),
    lastActivityDate: text('last_activity_date'),
    longestStreak: integer('longest_streak').default(0),
    updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

// User Saved Articles Table
export const userSavedArticles = sqliteTable('user_saved_articles', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    postId: text('post_id').notNull().references(() => posts.id),
    savedAt: text('saved_at').notNull().default(new Date().toISOString()),
});

// User Read Articles Table
export const userReadArticles = sqliteTable('user_read_articles', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    postId: text('post_id').notNull().references(() => posts.id),
    readAt: text('read_at').notNull().default(new Date().toISOString()),
});

// Friendships Table
export const friendships = sqliteTable('friendships', {
    id: text('id').primaryKey(),
    requesterId: text('requester_id').notNull().references(() => users.id),
    addresseeId: text('addressee_id').notNull().references(() => users.id),
    status: text('status').notNull().default('pending'), // 'pending', 'accepted', 'declined'
    requestedAt: text('requested_at').notNull().default(new Date().toISOString()),
    respondedAt: text('responded_at'),
});

// Activity Feed Table
export const activityFeed = sqliteTable('activity_feed', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    activityType: text('activity_type').notNull(), // 'achievement_unlocked', 'level_up', 'streak_milestone'
    activityData: text('activity_data').notNull(), // JSON with activity details
    createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// Relations for new tables
export const achievementsRelations = relations(achievements, ({ many }) => ({
    userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
    user: one(users, {
        fields: [userAchievements.userId],
        references: [users.id],
    }),
    achievement: one(achievements, {
        fields: [userAchievements.achievementId],
        references: [achievements.id],
    }),
}));

export const userXpRelations = relations(userXp, ({ one }) => ({
    user: one(users, {
        fields: [userXp.userId],
        references: [users.id],
    }),
}));

export const userSavedArticlesRelations = relations(userSavedArticles, ({ one }) => ({
    user: one(users, {
        fields: [userSavedArticles.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [userSavedArticles.postId],
        references: [posts.id],
    }),
}));

export const userReadArticlesRelations = relations(userReadArticles, ({ one }) => ({
    user: one(users, {
        fields: [userReadArticles.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [userReadArticles.postId],
        references: [posts.id],
    }),
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
    requester: one(users, {
        fields: [friendships.requesterId],
        references: [users.id],
    }),
    addressee: one(users, {
        fields: [friendships.addresseeId],
        references: [users.id],
    }),
}));

export const activityFeedRelations = relations(activityFeed, ({ one }) => ({
    user: one(users, {
        fields: [activityFeed.userId],
        references: [users.id],
    }),
}));


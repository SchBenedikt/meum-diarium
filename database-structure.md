# Complete Database Schema - Meum Diarium

This document shows the complete database structure including all tables and their relationships.

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TEXT
);
```

### 2. Posts Table
```sql
CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    historical_date TEXT,
    reading_time INTEGER DEFAULT 0,
    tags TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TEXT,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 3. Authors Table
```sql
CREATE TABLE authors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    bio TEXT,
    birth_year INTEGER,
    death_year INTEGER,
    era TEXT,
    image_url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Works Table
```sql
CREATE TABLE works (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    language TEXT,
    year_composed TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);
```

### 5. Comments Table
```sql
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);
```

### 6. User Reading Progress Table
```sql
CREATE TABLE user_reading_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    reading_time INTEGER DEFAULT 0,
    progress_percentage REAL DEFAULT 0.0,
    last_read_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE(user_id, post_id)
);
```

## Achievements & XP System Tables

### 7. Achievements Table
```sql
CREATE TABLE achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('reading', 'vocabulary', 'grammar', 'social', 'streak')),
    xp_reward INTEGER NOT NULL DEFAULT 0,
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('posts_read', 'words_learned', 'streak_days', 'friends_count', 'vocabulary_mastered', 'grammar_completed')),
    requirement_value INTEGER NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 8. User Achievements Table
```sql
CREATE TABLE user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);
```

### 9. User XP Table
```sql
CREATE TABLE user_xp (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_level_xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 10. User Saved Articles Table
```sql
CREATE TABLE user_saved_articles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE(user_id, post_id)
);
```

### 11. User Read Articles Table
```sql
CREATE TABLE user_read_articles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    read_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE(user_id, post_id)
);
```

### 12. Activity Feed Table
```sql
CREATE TABLE activity_feed (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('article_read', 'vocabulary_learned', 'grammar_exercise', 'daily_login', 'streak_milestone', 'friend_joined', 'level_up', 'achievement_unlocked')),
    activity_data TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Social Features Tables

### 13. Friendships Table
```sql
CREATE TABLE friendships (
    id TEXT PRIMARY KEY,
    requester_id TEXT NOT NULL,
    addressee_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (addressee_id) REFERENCES users(id),
    CHECK (requester_id != addressee_id)
);
```

## Content Tables

### 14. Tags Table
```sql
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3B82F6',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 15. Post Tags Table (Junction)
```sql
CREATE TABLE post_tags (
    post_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

## Vocabulary System Tables (separate database)

### 16. VOC Table (Vocabulary)
```sql
CREATE TABLE VOC (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    LATEIN TEXT NOT NULL,
    DEUTSCH TEXT NOT NULL,
    ART TEXT,
    GENUS TEXT,
    WORTART TEXT
);
```

### 17. FORM Table (Word Forms)
```sql
CREATE TABLE FORM (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    VOCID INTEGER NOT NULL,
    FORM TEXT NOT NULL,
    BESCHREIBUNG TEXT,
    FOREIGN KEY (VOCID) REFERENCES VOC(ID)
);
```

### 18. GRAMMAR Table (Grammar Patterns)
```sql
CREATE TABLE GRAMMAR (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    VOCID INTEGER NOT NULL,
    TYP TEXT NOT NULL,
    FORM TEXT NOT NULL,
    BESCHREIBUNG TEXT,
    FOREIGN KEY (VOCID) REFERENCES VOC(ID)
);
```

## Indexes

### Performance Indexes
```sql
-- Core tables
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(is_published, published_at);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_user_reading_progress_user_id ON user_reading_progress(user_id);
CREATE INDEX idx_user_reading_progress_post_id ON user_reading_progress(post_id);

-- Achievements system
CREATE INDEX idx_user_xp_user_id ON user_xp(user_id);
CREATE INDEX idx_user_xp_total_xp ON user_xp(total_xp DESC);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_saved_articles_user_id ON user_saved_articles(user_id);
CREATE INDEX idx_user_saved_articles_post_id ON user_saved_articles(post_id);
CREATE INDEX idx_user_read_articles_user_id ON user_read_articles(user_id);
CREATE INDEX idx_user_read_articles_post_id ON user_read_articles(post_id);
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);

-- Social features
CREATE INDEX idx_friendships_requester_id ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee_id ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Content
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- Vocabulary
CREATE INDEX idx_form_vocid ON FORM(VOCID);
CREATE INDEX idx_grammar_vocid ON GRAMMAR(VOCID);
CREATE INDEX idx_voc_latein ON VOC(LATEIN);
CREATE INDEX idx_voc_deutsch ON VOC(DEUTSCH);
```

## Relationships Summary

### User Relations
- `users` → `posts` (author_id)
- `users` → `comments` (user_id)
- `users` → `user_reading_progress` (user_id)
- `users` → `user_xp` (user_id)
- `users` → `user_achievements` (user_id)
- `users` → `user_saved_articles` (user_id)
- `users` → `user_read_articles` (user_id)
- `users` → `activity_feed` (user_id)
- `users` → `friendships` (requester_id, addressee_id)

### Content Relations
- `posts` → `comments` (post_id)
- `posts` → `user_reading_progress` (post_id)
- `posts` → `user_saved_articles` (post_id)
- `posts` → `user_read_articles` (post_id)
- `posts` ↔ `tags` (via post_tags)

### Achievement Relations
- `achievements` ↔ `users` (via user_achievements)
- `achievements` → `user_achievements` (achievement_id)

### Author Relations
- `authors` → `works` (author_id)

### Vocabulary Relations
- `VOC` → `FORM` (VOCID)
- `VOC` → `GRAMMAR` (VOCID)

## Notes

1. **Reading Tracking**: The `user_read_articles` table only tracks if an article was opened (read_at timestamp), not progress percentage.
2. **Article Saving**: The `user_saved_articles` table allows users to save individual articles for later reading.
3. **XP System**: XP is calculated based on activities and stored in `user_xp` table.
4. **Achievements**: Users unlock achievements based on various activities tracked in `user_achievements`.
5. **Social Features**: Friend relationships are managed through `friendships` table with different statuses.
6. **Vocabulary**: Separate database with 36,140+ Latin vocabulary entries.
7. **Activity Feed**: All user activities are logged for tracking and achievement unlocking.

# Database Migration: Achievements System

This migration adds the necessary tables for the achievements, XP system, and social features.

## New Tables

### 1. Achievements Table
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

### 2. User Achievements Table
```sql
CREATE TABLE user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);
```

### 3. User XP Table
```sql
CREATE TABLE user_xp (
    user_id TEXT PRIMARY KEY,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_level_xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    streak_days INTEGER DEFAULT 0,
    last_activity_date TEXT,
    longest_streak INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4. User Saved Articles Table
```sql
CREATE TABLE user_saved_articles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(user_id, post_id)
);
```

### 5. User Read Articles Table
```sql
CREATE TABLE user_read_articles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    read_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(user_id, post_id)
);
```

### 6. Friendships Table
```sql
CREATE TABLE friendships (
    id TEXT PRIMARY KEY,
    requester_id TEXT NOT NULL,
    addressee_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TEXT,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(requester_id, addressee_id)
);
```

### 7. Activity Feed Table
```sql
CREATE TABLE activity_feed (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('achievement_unlocked', 'level_up', 'streak_milestone', 'friend_joined')),
    activity_data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Indexes for Performance

```sql
-- Achievements indexes
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_requirement ON achievements(requirement_type, requirement_value);

-- User achievements indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

-- User XP indexes
CREATE INDEX idx_user_xp_total_xp ON user_xp(total_xp DESC);
CREATE INDEX idx_user_xp_level ON user_xp(level DESC);
CREATE INDEX idx_user_xp_streak ON user_xp(streak_days DESC);

-- Saved articles indexes
CREATE INDEX idx_user_saved_articles_user_id ON user_saved_articles(user_id);
CREATE INDEX idx_user_saved_articles_saved_at ON user_saved_articles(saved_at DESC);

-- Read articles indexes
CREATE INDEX idx_user_read_articles_user_id ON user_read_articles(user_id);
CREATE INDEX idx_user_read_articles_read_at ON user_read_articles(read_at DESC);

-- Friendships indexes
CREATE INDEX idx_friendships_requester ON friendships(requester_id, status);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id, status);
CREATE INDEX idx_friendships_status ON friendships(status, requested_at);

-- Activity feed indexes
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id, created_at DESC);
CREATE INDEX idx_activity_feed_type ON activity_feed(activity_type, created_at DESC);
```

## Initial Achievement Data

```sql
-- Reading Achievements
INSERT INTO achievements (id, title, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES
('first_steps', 'Erste Schritte', 'Lies deinen ersten Artikel', '📖', 'reading', 10, 'posts_read', 1),
('bookworm', 'Bücherwurm', 'Lies 10 Artikel', '📚', 'reading', 50, 'posts_read', 10),
('scholar', 'Gelehrter', 'Lies 50 Artikel', '🎓', 'reading', 100, 'posts_read', 50),
('historian', 'Historiker', 'Lies 100 Artikel', '🏛️', 'reading', 200, 'posts_read', 100);

-- Vocabulary Achievements
INSERT INTO achievements (id, title, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES
('word_collector', 'Wortsammler', 'Lerne 10 Wörter', '📝', 'vocabulary', 25, 'words_learned', 10),
('vocabulary_master', 'Vokabelmeister', 'Lerne 100 Wörter', '🏆', 'vocabulary', 100, 'words_learned', 100),
('latin_expert', 'Latein-Experte', 'Lerne 500 Wörter', '🌟', 'vocabulary', 500, 'words_learned', 500);

-- Streak Achievements
INSERT INTO achievements (id, title, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES
('consistent_reader', 'Beständiger Leser', '3-Tage-Lesestrecke', '🔥', 'streak', 30, 'streak_days', 3),
('dedicated_scholar', 'Hingebungsvoller Gelehrter', '7-Tage-Lesestrecke', '💪', 'streak', 50, 'streak_days', 7),
('latin_devotee', 'Latein-Verehrer', '30-Tage-Lesestrecke', '🌟', 'streak', 150, 'streak_days', 30),
('immortal_reader', 'Unsterblicher Leser', '100-Tage-Lesestrecke', '👑', 'streak', 500, 'streak_days', 100);

-- Social Achievements
INSERT INTO achievements (id, title, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES
('making_friends', 'Freunde finden', 'Füge deinen ersten Freund hinzu', '🤝', 'social', 20, 'friends_count', 1),
('social_butterfly', 'Sozialer Schmetterling', 'Füge 10 Freunde hinzu', '🦋', 'social', 100, 'friends_count', 10),
('mentor', 'Mentor', 'Ein Freund erreicht Level 10', '🎯', 'social', 50, 'friends_count', 1);

-- Grammar Achievements
INSERT INTO achievements (id, title, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES
('grammar_novice', 'Grammatik-Anfänger', 'Schließe erste Grammatikübung ab', '📖', 'grammar', 15, 'grammar_completed', 1),
('grammar_expert', 'Grammatik-Experte', 'Schließe 25 Grammatikübungen ab', '🎓', 'grammar', 100, 'grammar_completed', 25);
```

## Notes

- All foreign key constraints include `ON DELETE CASCADE` to maintain data integrity
- Indexes are created for optimal query performance on leaderboards and user stats
- Achievement categories are enforced with CHECK constraints
- Initial achievement data provides a good starting point for user engagement
- XP rewards are balanced to encourage progressive engagement

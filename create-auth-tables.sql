-- Create Users Table for Authentication
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    preferences TEXT, -- JSON string for user preferences
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1))
);

-- Create Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    parent_id TEXT,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_edited INTEGER DEFAULT 0 CHECK (is_edited IN (0, 1)),
    is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)),
    likes_count INTEGER DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);

-- Create User Reading Progress Table
CREATE TABLE IF NOT EXISTS user_reading_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    reading_time_seconds INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_position INTEGER DEFAULT 0,
    is_completed INTEGER DEFAULT 0 CHECK (is_completed IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Create User Commenting Activity Table
CREATE TABLE IF NOT EXISTS user_commenting_activity (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('created', 'edited', 'deleted', 'liked')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT, -- JSON string for additional data
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user_id ON user_reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_post_id ON user_reading_progress(post_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_is_completed ON user_reading_progress(is_completed);

CREATE INDEX IF NOT EXISTS idx_user_commenting_activity_user_id ON user_commenting_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_commenting_activity_comment_id ON user_commenting_activity(comment_id);
CREATE INDEX IF NOT EXISTS idx_user_commenting_activity_created_at ON user_commenting_activity(created_at);

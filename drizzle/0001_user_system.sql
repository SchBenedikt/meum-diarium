-- Create users table
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text,
	`bio` text,
	`avatar_url` text,
	`preferences` text,
	`created_at` text NOT NULL DEFAULT (current_timestamp),
	`updated_at` text NOT NULL DEFAULT (current_timestamp),
	`last_login_at` text,
	`is_active` integer DEFAULT true,
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);

-- Create comments table
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`parent_id` text,
	`content` text NOT NULL,
	`created_at` text NOT NULL DEFAULT (current_timestamp),
	`updated_at` text NOT NULL DEFAULT (current_timestamp),
	`is_edited` integer DEFAULT false,
	`is_deleted` integer DEFAULT false,
	`likes_count` integer DEFAULT 0,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create user_reading_progress table
CREATE TABLE `user_reading_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`post_id` text NOT NULL,
	`started_at` text NOT NULL DEFAULT (current_timestamp),
	`completed_at` text,
	`reading_time_seconds` integer DEFAULT 0,
	`progress_percentage` integer DEFAULT 0,
	`last_position` integer DEFAULT 0,
	`is_completed` integer DEFAULT false,
	`created_at` text NOT NULL DEFAULT (current_timestamp),
	`updated_at` text NOT NULL DEFAULT (current_timestamp),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create user_commenting_activity table
CREATE TABLE `user_commenting_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`comment_id` text NOT NULL,
	`action` text NOT NULL,
	`created_at` text NOT NULL DEFAULT (current_timestamp),
	`metadata` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create indexes for better performance
CREATE INDEX `idx_comments_post_id` ON `comments` (`post_id`);
CREATE INDEX `idx_comments_user_id` ON `comments` (`user_id`);
CREATE INDEX `idx_comments_parent_id` ON `comments` (`parent_id`);
CREATE INDEX `idx_comments_created_at` ON `comments` (`created_at`);
CREATE INDEX `idx_user_reading_progress_user_id` ON `user_reading_progress` (`user_id`);
CREATE INDEX `idx_user_reading_progress_post_id` ON `user_reading_progress` (`post_id`);
CREATE INDEX `idx_user_reading_progress_user_post` ON `user_reading_progress` (`user_id`, `post_id`);
CREATE INDEX `idx_user_commenting_activity_user_id` ON `user_commenting_activity` (`user_id`);
CREATE INDEX `idx_user_commenting_activity_comment_id` ON `user_commenting_activity` (`comment_id`);
CREATE INDEX `idx_users_email` ON `users` (`email`);
CREATE INDEX `idx_users_username` ON `users` (`username`);
CREATE INDEX `idx_users_created_at` ON `users` (`created_at`);

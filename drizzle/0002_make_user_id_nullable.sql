-- Make user_id nullable in comments table to support anonymous comments
ALTER TABLE `comments` RENAME TO `comments_old`;

CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text,
	`author_name` text,
	`author_email` text,
	`parent_id` text,
	`content` text NOT NULL,
	`is_deleted` integer DEFAULT false,
	`created_at` text NOT NULL DEFAULT (current_timestamp),
	`updated_at` text NOT NULL DEFAULT (current_timestamp),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE no action
);

INSERT INTO `comments` SELECT * FROM `comments_old`;

DROP TABLE `comments_old`;

CREATE INDEX `idx_comments_post_id` ON `comments` (`post_id`);
CREATE INDEX `idx_comments_user_id` ON `comments` (`user_id`);
CREATE INDEX `idx_comments_parent_id` ON `comments` (`parent_id`);
CREATE INDEX `idx_comments_created_at` ON `comments` (`created_at`);

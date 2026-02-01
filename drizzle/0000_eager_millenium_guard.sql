CREATE TABLE `authors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`latin_name` text,
	`title` text,
	`years` text,
	`birth_year` integer,
	`death_year` integer,
	`description` text,
	`hero_image` text,
	`theme` text,
	`color` text,
	`highlights` text
);
--> statement-breakpoint
CREATE TABLE `latin_texts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_id` text,
	`book` integer,
	`chapter` integer,
	`section` integer,
	`verse` integer,
	`latin_text` text NOT NULL,
	`german_translation` text,
	`english_translation` text,
	`annotations` text,
	FOREIGN KEY (`work_id`) REFERENCES `works`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lexicon` (
	`slug` text PRIMARY KEY NOT NULL,
	`term` text NOT NULL,
	`variants` text,
	`definition` text NOT NULL,
	`category` text,
	`etymology` text,
	`related_terms` text,
	`translations` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`author_id` text,
	`title` text NOT NULL,
	`excerpt` text,
	`historical_date` text,
	`historical_year` integer,
	`date` text,
	`reading_time` integer,
	`tags` text,
	`cover_image` text,
	`content` text NOT NULL,
	`translations` text,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`latin` text NOT NULL,
	`german` text NOT NULL,
	`english` text,
	`type` text,
	`gender` text,
	`conjugation` text,
	`declination` text,
	`forms` text,
	`example_sentence` text,
	`example_translation` text,
	`tags` text
);
--> statement-breakpoint
CREATE TABLE `works` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author_id` text,
	`description` text,
	`type` text,
	`date` text,
	`cover_image` text,
	`content` text,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action
);

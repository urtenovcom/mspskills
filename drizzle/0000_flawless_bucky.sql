CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `categories_owner` ON `categories` (`owner`);--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`details` text NOT NULL,
	`tags` text NOT NULL,
	`github` text NOT NULL,
	`website` text NOT NULL,
	`image` text NOT NULL,
	`installation` text NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entries_owner` ON `entries` (`owner`);
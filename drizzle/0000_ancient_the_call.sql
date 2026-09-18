CREATE TABLE `FileMetadatas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`extension` text NOT NULL,
	`size` integer NOT NULL,
	`creationTime` text NOT NULL,
	`mime` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL,
	`sha` text,
	`extension` text,
	`category` text DEFAULT 'Others'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Files_path_unique` ON `Files` (`path`);--> statement-breakpoint
CREATE UNIQUE INDEX `Files_sha_unique` ON `Files` (`sha`);
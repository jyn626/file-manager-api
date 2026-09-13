ALTER TABLE `Files` ADD `category` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `Files_sha_unique` ON `Files` (`sha`);
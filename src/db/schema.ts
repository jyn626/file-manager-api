import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const files = sqliteTable('Files', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  path: text('path').notNull().unique(),
  sha: text('sha').unique(),
  extension: text('extension'),
  category: text('category', {
    enum: ['Document', 'Image', 'Video', 'Audio', 'Others'],
  }).default('Others'),
});

export const fileMetadatas = sqliteTable('FileMetadatas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull(),
  extension: text('extension').notNull(),
  size: text('size').notNull(),
  creationTime: text('creationTime').notNull(),
  mime: text('mime').notNull(),
});

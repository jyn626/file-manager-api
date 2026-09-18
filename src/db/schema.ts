import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

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
  size: integer('size').notNull(),
  creationTime: text('creationTime').notNull(),
  mime: text('mime').notNull(),
  fileId: integer('fileId')
    .notNull()
    .references(() => files.id)
    .unique(),
});

export const filesRelations = relations(files, ({ one }) => ({
  fileMetadatas: one(fileMetadatas, {
    fields: [files.id],
    references: [fileMetadatas.fileId],
  }),
}));

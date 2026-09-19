import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { resolve } from 'node:path'
import * as schema from './schema'

const sqlite = new Database(resolve(process.cwd(), 'sqlite.db'))

export const db = drizzle(sqlite, { schema });

migrate(db, {
  migrationsFolder: resolve(process.cwd(), 'drizzle'),
});

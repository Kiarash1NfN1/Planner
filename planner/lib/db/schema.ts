import { integer, text, primaryKey, sqliteTable, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// --- AUTHENTICATION ---
export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	name: text("name"),
	email: text("email").notNull().unique(),
	password: text("password"),
});

// --- DAILY ROUTINES ---
export const routines = sqliteTable("routines", {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    repeatDays: text('repeat_days', { mode: 'json' }).$type<number[]>(), // e.g., [1, 3, 5] for Mon, Wed, Fri
    postpone: integer('postpone', { mode: 'boolean' }).default(false),
});

// --- CHUNKS ---
export const chunks = sqliteTable("chunks", {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    intervalDays: integer('interval_days').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const chunkItems = sqliteTable("chunk_items", {
    id: text('id').primaryKey(),
    chunkId: text('chunkId').notNull().references(() => chunks.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    progress: integer('progress').default(0), // 0-100
});

// --- BOARDS (TRELLO) ---
export const boards = sqliteTable('boards', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
});

export const boardColumns = sqliteTable('board_columns', {
    id: text('id').primaryKey(),
    boardId: text('boardId').notNull().references(() => boards.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    order: real('order').notNull(),
});

export const boardTasks = sqliteTable('board_tasks', {
  id: text('id').primaryKey(),
  columnId: text('columnId').notNull().references(() => boardColumns.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  order: real('order').notNull(),
});
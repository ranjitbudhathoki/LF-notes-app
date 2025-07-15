import { sql, relations } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const notes = sqliteTable("notes", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  slug: text().notNull().unique(),
  isPinned: integer({ mode: "boolean" }).notNull().default(false),
  content: text().notNull(),
  userId: int()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  theme: text().notNull(),
  userId: int()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const noteCategories = sqliteTable("note_categories", {
  id: int().primaryKey({ autoIncrement: true }),
  noteId: int()
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  categoryId: int()
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  categories: many(categories),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  noteCategories: many(noteCategories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  noteCategories: many(noteCategories),
}));
export const noteCategoriesRelations = relations(noteCategories, ({ one }) => ({
  note: one(notes, {
    fields: [noteCategories.noteId],
    references: [notes.id],
  }),
  category: one(categories, {
    fields: [noteCategories.categoryId],
    references: [categories.id],
  }),
}));

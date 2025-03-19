import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clients = sqliteTable("clients", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  company: text().default(""),
  rate: real().default(0),
});

export const timeEntries = sqliteTable("time_entries", {
  id: int().primaryKey({ autoIncrement: true }),
  clientId: int().notNull(),
  date: text().notNull(),
  duration: real().default(0),
  description: text().default(""),
});

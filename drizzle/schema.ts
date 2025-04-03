import { int, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Clients table
export const clients = sqliteTable("clients", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique(),
  hourlyRate: real("hourly_rate").notNull().default(0),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Time Entries table
export const timeEntries = sqliteTable("time_entries", {
  id: int().primaryKey({ autoIncrement: true }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  description: text("description"),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time"),
  duration: integer("duration"), // In minutes
  createdAt: text("created_at").default(new Date().toISOString()),
});

export type TimeEntry = typeof timeEntries.$inferInsert;

// Transactions table
export const transactions = sqliteTable("transactions", {
  id: int().primaryKey({ autoIncrement: true }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

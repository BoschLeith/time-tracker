import { int, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Clients table
export const clients = sqliteTable("clients", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").unique(),
  hourlyRate: real("hourly_rate").notNull().default(0),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Projects table
export const projects = sqliteTable("projects", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: integer("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Time Entries table
export const timeEntries = sqliteTable("time_entries", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  description: text("description"),
  date: text("date").notNull(),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time"),
  duration: integer("duration"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

// Transactions table
export const transactions = sqliteTable("transactions", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

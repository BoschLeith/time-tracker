import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clientsTable = sqliteTable("clients_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  company: text().default(""),
  rate: real().default(0),
});

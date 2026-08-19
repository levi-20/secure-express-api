import { sql } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  uuid,
  timestamp
} from 'drizzle-orm/pg-core'


export const User = pgTable(
  "user", // table name
  {

    id: uuid("id").default(sql`uuidv7()`).primaryKey(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    passwordHash: varchar("password_hash", { length: 255 }).notNull(),

    createdAt: timestamp("created_at", { precision: 3, withTimezone: true }).notNull().defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()

  }
);

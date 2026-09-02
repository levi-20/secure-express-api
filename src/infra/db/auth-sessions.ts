
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { User } from "./user.js";
import { sql } from "drizzle-orm";

export const AuthSession = pgTable(

  "auth_sessions",
  {
    id: uuid("id").default(sql`uuidv7()`).primaryKey(),

    userId: uuid("user_id").notNull().references(() => User.id, { onDelete: "cascade" }),

    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),

    expiresAt: timestamp("expires_at", { withTimezone: true, precision: 3 }).notNull(),

    revokedAt: timestamp("revoked_at", { withTimezone: true, precision: 3 }),

    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 }).notNull().defaultNow(),

  },
  (table) => [

    index("auth_session_user_id_idx").on(table.userId),

    index("auth_sessions_expires_at_idx").on(table.expiresAt)
  ]
)

import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { User } from "./user.js";
import { sql } from "drizzle-orm";

export const RefreshToken = pgTable(
  "refresh_tokens", // table name
  {
    id: uuid("id").default(sql`uuidv7()`).primaryKey(),

    userId: uuid("user_id").notNull().references(() => User.id, { onDelete: "cascade" }),

    familyId: uuid("family_id").notNull(),

    tokenHash: varchar("token_hash", { length: 254 }).notNull().unique(),

    expiresAt: timestamp("expires_at", { withTimezone: true, precision: 3 }).notNull(),

    revokedAt: timestamp("revoked_at", { withTimezone: true, precision: 3 }),

    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 }).notNull().defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 3 }).notNull().defaultNow(),

  },
  (table) => [
    index("refresh_token_user_id_idx").on(table.userId),

    index("refresh_token_family_id_idx").on(table.familyId),

    index("refresh_token_expires_at_idx").on(table.expiresAt)
  ]
)

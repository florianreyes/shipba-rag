import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";

import { nanoid } from "@/lib/utils";

export const users = pgTable("users", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  auth_id: uuid("auth_id").unique(),  // Nullable to support existing users
  name: text("name"),  // Nullable to allow initial creation without name
  mail: text("mail").unique().notNull(),
  x_handle: text("x_handle"),
  telegram_handle: text("telegram_handle"),
  instagram_handle: text("instagram_handle"),
  content: text("content").default(""),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

// Schema for users - used to validate API requests
export const insertUserSchema = z.object({
  auth_id: z.string().uuid().optional(),
  name: z.string().nullable(),  // Allow null for initial creation
  mail: z.string().email(),  // Add email validation
  x_handle: z.string().optional().nullable(),
  telegram_handle: z.string().optional().nullable(),
  instagram_handle: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});

// Type for users - used to type API request params and within Components
export type NewUserParams = z.infer<typeof insertUserSchema>;

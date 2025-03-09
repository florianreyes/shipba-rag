import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";

export const users = pgTable("users", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  mail: text("mail").notNull(),
  x_handle: text("x_handle"),
  telegram_handle: text("telegram_handle"),
  instagram_handle: text("instagram_handle"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for users - used to validate API requests
export const insertUserSchema = createSelectSchema(users)
  .extend({
    x_handle: z.string().optional().nullable(),
    telegram_handle: z.string().optional().nullable(),
    instagram_handle: z.string().optional().nullable(),
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

// Type for users - used to type API request params and within Components
export type NewUserParams = z.infer<typeof insertUserSchema>;

import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";

export const workspaces = pgTable("workspaces", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for workspaces - used to validate API requests
export const insertWorkspaceSchema = createSelectSchema(workspaces)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
  });

// Type for workspaces - used to type API request params and within Components
export type NewWorkspaceParams = z.infer<typeof insertWorkspaceSchema>;

import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";
import { workspaces } from "./workspaces";
import { users } from "./users";

export const workspacesUsers = pgTable("workspaces_users", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  workspaceId: varchar("workspace_id", { length: 191 })
    .notNull()
    .references(() => workspaces.id),
  userId: varchar("user_id", { length: 191 }).notNull().references(
    () => users.id,
    { onDelete: "cascade" },),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`)
});

// Schema for workspace users - used to validate API requests
export const insertWorkspaceUserSchema = createSelectSchema(workspacesUsers)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
  });

// Type for workspace users - used to type API request params and within Components
export type NewWorkspaceUserParams = z.infer<typeof insertWorkspaceUserSchema>;

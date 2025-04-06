ALTER TABLE "workspaces_users" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces_users" ADD COLUMN "invited_by" varchar(191);--> statement-breakpoint
ALTER TABLE "workspaces_users" ADD COLUMN "invited_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspaces_users" ADD CONSTRAINT "workspaces_users_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
-- Note: drizzle-kit's diff also wanted to (re)create "newsletter_subscribers"
-- here because migration 0000 never included it — that table was created
-- directly in the database out-of-band, bypassing Drizzle migrations. That
-- statement was removed from this file since the table already exists in
-- prod; only the new site_settings table needs to be created.
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"order_completion_email_subject" text DEFAULT '' NOT NULL,
	"order_completion_email_body" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

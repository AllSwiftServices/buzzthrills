CREATE TABLE "blocked_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blocked_date" date NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "blocked_dates_blocked_date_key" UNIQUE("blocked_date")
);
--> statement-breakpoint
ALTER TABLE "blocked_dates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Public read access to blocked dates" ON "blocked_dates" AS PERMISSIVE FOR SELECT TO public USING (true);
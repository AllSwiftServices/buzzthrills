-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."call_slot" AS ENUM('morning', 'afternoon', 'evening', 'night');--> statement-breakpoint
CREATE TYPE "public"."call_status" AS ENUM('pending', 'scheduled', 'delivered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('lite', 'plus', 'orbit', 'corporate');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'expired', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'caller');--> statement-breakpoint
CREATE TABLE "special_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"discount_percent" integer,
	"is_active" boolean DEFAULT true,
	"banner_url" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "special_offers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"recipient_name" text NOT NULL,
	"recipient_phone" text NOT NULL,
	"relationship" text,
	"occasion_type" text NOT NULL,
	"occasion_date" date NOT NULL,
	"call_type" text NOT NULL,
	"status" "call_status" DEFAULT 'pending',
	"scheduled_slot" "call_slot" DEFAULT 'morning',
	"is_express" boolean DEFAULT false,
	"custom_message" text,
	"recording_url" text,
	"assigned_to" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"admin_notes" text,
	"failure_reason" text,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
ALTER TABLE "calls" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role" "user_role" DEFAULT 'user',
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_suspended" boolean DEFAULT false,
	CONSTRAINT "auth_accounts_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "auth_sessions_refresh_token_key" UNIQUE("refresh_token")
);
--> statement-breakpoint
ALTER TABLE "auth_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth_otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "auth_otps" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "digital_letters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid,
	"recipient_name" text NOT NULL,
	"message" text NOT NULL,
	"voice_note_url" text,
	"qr_identifier" text NOT NULL,
	"unfurled_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"background_music_url" text,
	"video_url" text,
	"theme" text DEFAULT 'parchment' NOT NULL,
	"tier" text DEFAULT 'standard' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"admin_notes" text,
	"created_by_admin" boolean DEFAULT false NOT NULL,
	"recipient_phone" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"recipient_photo_url" text,
	"wants_scannable" boolean DEFAULT false NOT NULL,
	"scannable_status" text DEFAULT 'none' NOT NULL,
	"additional_comments" text,
	"request_admin_voice" boolean DEFAULT false NOT NULL,
	"request_admin_letter" boolean DEFAULT false NOT NULL,
	"recipient_email" text,
	CONSTRAINT "digital_letters_qr_identifier_key" UNIQUE("qr_identifier"),
	CONSTRAINT "digital_letters_scannable_status_check" CHECK (scannable_status = ANY (ARRAY['none'::text, 'pending'::text, 'printed'::text, 'shipped'::text])),
	CONSTRAINT "digital_letters_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
	CONSTRAINT "digital_letters_theme_check" CHECK (theme = ANY (ARRAY['parchment'::text, 'royal'::text, 'modern'::text])),
	CONSTRAINT "digital_letters_tier_check" CHECK (tier = ANY (ARRAY['standard'::text, 'premium'::text]))
);
--> statement-breakpoint
ALTER TABLE "digital_letters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"role" "user_role" DEFAULT 'user',
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"account_id" uuid,
	"location" text,
	"age_grade" text,
	"corporate_details" jsonb,
	"is_unsubscribed" boolean DEFAULT false,
	"is_suspended" boolean DEFAULT false,
	CONSTRAINT "profiles_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"call_id" uuid,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'NGN',
	"provider" text NOT NULL,
	"provider_reference" text NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "payments_provider_reference_key" UNIQUE("provider_reference")
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"author_name" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"video_url" text,
	"rating" integer,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "testimonials_rating_check" CHECK ((rating >= 1) AND (rating <= 5))
);
--> statement-breakpoint
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan" "plan_type" NOT NULL,
	"status" "subscription_status" DEFAULT 'active',
	"calls_made" integer DEFAULT 0,
	"total_calls" integer NOT NULL,
	"start_date" timestamp with time zone DEFAULT now(),
	"next_billing_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"billing_cycle" text DEFAULT 'monthly' NOT NULL,
	CONSTRAINT "subscriptions_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "subscriptions_billing_cycle_check" CHECK (billing_cycle = ANY (ARRAY['monthly'::text, 'annual'::text]))
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "newsletter_subscribers_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "special_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"occasion_emoji" text DEFAULT '🎉' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"call_date" date,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "special_calls" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."auth_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_letters" ADD CONSTRAINT "digital_letters_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."auth_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."auth_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "public"."calls"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."auth_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."auth_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_digital_letters_qr" ON "digital_letters" USING btree ("qr_identifier" text_ops);--> statement-breakpoint
CREATE INDEX "idx_digital_letters_scannable" ON "digital_letters" USING btree ("scannable_status" text_ops) WHERE (wants_scannable = true);--> statement-breakpoint
CREATE INDEX "idx_digital_letters_status" ON "digital_letters" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_special_calls_active" ON "special_calls" USING btree ("active" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE VIEW "public"."analytics_summary" WITH (security_invoker = on) AS (SELECT ( SELECT count(*) AS count FROM calls WHERE calls.status = 'delivered'::call_status) AS total_calls_delivered, ( SELECT count(*) AS count FROM profiles WHERE profiles.role = 'user'::user_role) AS total_users, ( SELECT count(*) AS count FROM subscriptions WHERE subscriptions.status = 'canceled'::subscription_status) AS churned_clients, ( SELECT count(*) AS count FROM calls WHERE calls.status = 'pending'::call_status) AS unfinished_bookings);--> statement-breakpoint
CREATE POLICY "Public read access to special offers" ON "special_offers" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Admins can manage calls" ON "calls" AS PERMISSIVE FOR ALL TO public USING ((( SELECT auth_accounts.role
   FROM auth_accounts
  WHERE (auth_accounts.id = get_account_id())) = 'admin'::user_role));--> statement-breakpoint
CREATE POLICY "Callers can update their assigned calls" ON "calls" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Callers can view their assigned calls" ON "calls" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can view own calls" ON "calls" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can view own account" ON "auth_accounts" AS PERMISSIVE FOR SELECT TO public USING ((id = auth_accounts_id()));--> statement-breakpoint
CREATE POLICY "Users can delete own sessions" ON "auth_sessions" AS PERMISSIVE FOR DELETE TO public USING ((user_id = auth_accounts_id()));--> statement-breakpoint
CREATE POLICY "Users can view own sessions" ON "auth_sessions" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage letters" ON "digital_letters" AS PERMISSIVE FOR ALL TO public USING ((( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::user_role));--> statement-breakpoint
CREATE POLICY "Anyone can view published letters" ON "digital_letters" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can insert their own letters" ON "digital_letters" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own draft letters" ON "digital_letters" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view own letters" ON "digital_letters" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can update suspension status" ON "profiles" AS PERMISSIVE FOR UPDATE TO public USING ((( SELECT profiles_1.role
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())) = 'admin'::user_role)) WITH CHECK ((( SELECT profiles_1.role
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())) = 'admin'::user_role));--> statement-breakpoint
CREATE POLICY "Admins can view all profiles" ON "profiles" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can view own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can view all payments" ON "payments" AS PERMISSIVE FOR SELECT TO public USING ((auth_accounts_role() = 'admin'::text));--> statement-breakpoint
CREATE POLICY "Users can view own payments" ON "payments" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage testimonials" ON "testimonials" AS PERMISSIVE FOR ALL TO public USING ((auth_accounts_role() = 'admin'::text));--> statement-breakpoint
CREATE POLICY "Superheroes can view verified testimonials" ON "testimonials" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can view own subscriptions" ON "subscriptions" AS PERMISSIVE FOR SELECT TO public USING ((get_account_id() = user_id));--> statement-breakpoint
CREATE POLICY "Admins can view subscribers" ON "newsletter_subscribers" AS PERMISSIVE FOR SELECT TO public USING ((auth_accounts_role() = 'admin'::text));--> statement-breakpoint
CREATE POLICY "Anyone can subscribe" ON "newsletter_subscribers" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage special calls" ON "special_calls" AS PERMISSIVE FOR ALL TO public USING ((( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::user_role));--> statement-breakpoint
CREATE POLICY "Anyone can view active special calls" ON "special_calls" AS PERMISSIVE FOR SELECT TO public;
*/
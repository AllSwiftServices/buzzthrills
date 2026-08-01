import {
  pgTable, pgEnum, pgPolicy, pgView, uuid, text, integer, numeric,
  boolean, timestamp, date, jsonb, bigint, unique, index, check, foreignKey,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export const userRole = pgEnum('user_role', ['user', 'admin', 'caller']);
export const callStatus = pgEnum('call_status', ['pending', 'scheduled', 'delivered', 'failed']);
export const callSlot = pgEnum('call_slot', ['morning', 'afternoon', 'evening', 'night']);
export const planType = pgEnum('plan_type', ['lite', 'plus', 'orbit', 'corporate']);
export const subscriptionStatus = pgEnum('subscription_status', ['active', 'expired', 'canceled']);

// ─────────────────────────────────────────────
// Auth (custom — bypasses Supabase Auth, see custom_auth.sql history)
// ─────────────────────────────────────────────

// full_name/email/role/is_suspended are duplicated onto `profiles` below
// (public-profile extension table) and kept in sync in both directions by a
// DB trigger, not application code — see
// src/db/migrations/0002_sync_profiles_auth_accounts_fields.sql. Drizzle has
// no declarative API for triggers, so `db:generate`/`pull` will never show
// this — it's real but invisible to the schema diff.
export const authAccounts = pgTable('auth_accounts', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  email: text().notNull(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: userRole().default('user'),
  isVerified: boolean('is_verified').default(false),
  isSuspended: boolean('is_suspended').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  unique('auth_accounts_email_key').on(table.email),
  // auth_accounts_id() reads the account id off the request's custom JWT (see src/lib/auth.ts) — not auth.uid().
  pgPolicy('Users can view own account', { as: 'permissive', for: 'select', to: ['public'], using: sql`(id = auth_accounts_id())` }),
]);

export const authSessions = pgTable('auth_sessions', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').notNull(),
  refreshToken: text('refresh_token').notNull(),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.userId], foreignColumns: [authAccounts.id], name: 'auth_sessions_user_id_fkey' }).onDelete('cascade'),
  unique('auth_sessions_refresh_token_key').on(table.refreshToken),
  pgPolicy('Users can view own sessions', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Users can delete own sessions', { as: 'permissive', for: 'delete', to: ['public'], using: sql`(user_id = auth_accounts_id())` }),
]);

// RLS is enabled with zero policies — default-deny for anon/authenticated,
// only the service-role API routes (supabaseAdmin) can touch OTPs.
export const authOtps = pgTable('auth_otps', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  email: text().notNull(),
  code: text().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}).enableRLS();

// ─────────────────────────────────────────────
// Profiles
// ─────────────────────────────────────────────

export const profiles = pgTable('profiles', {
  id: uuid().primaryKey().notNull(),
  fullName: text('full_name').notNull(),
  email: text().notNull(),
  phone: text(),
  role: userRole().default('user'),
  avatarUrl: text('avatar_url'),
  location: text(),
  ageGrade: text('age_grade'),
  corporateDetails: jsonb('corporate_details'),
  isUnsubscribed: boolean('is_unsubscribed').default(false),
  isSuspended: boolean('is_suspended').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  // profiles.id === auth_accounts.id (1:1 extension table for public-facing
  // profile fields, private/auth-only fields stay on auth_accounts).
  foreignKey({ columns: [table.id], foreignColumns: [authAccounts.id], name: 'profiles_id_fkey' }).onDelete('cascade'),
  unique('profiles_email_key').on(table.email),
  pgPolicy('Users can view own profile', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Admins can view all profiles', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Admins can update suspension status', {
    as: 'permissive', for: 'update', to: ['public'],
    using: sql`(( SELECT profiles_1.role
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())) = 'admin'::user_role)`,
    withCheck: sql`(( SELECT profiles_1.role
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())) = 'admin'::user_role)`,
  }),
]);

// ─────────────────────────────────────────────
// Calls (bookable "surprise call" experiences)
// ─────────────────────────────────────────────

export const calls = pgTable('calls', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id'),
  assignedTo: uuid('assigned_to'), // the caller this call is assigned to
  recipientName: text('recipient_name').notNull(),
  recipientPhone: text('recipient_phone').notNull(),
  relationship: text(),
  occasionType: text('occasion_type').notNull(),
  occasionDate: date('occasion_date').notNull(),
  callType: text('call_type').notNull(),
  status: callStatus().default('pending'),
  scheduledSlot: callSlot('scheduled_slot').default('morning'),
  isExpress: boolean('is_express').default(false),
  isInternational: boolean('is_international').default(false),
  customMessage: text('custom_message'),
  recordingUrl: text('recording_url'),
  adminNotes: text('admin_notes'),
  failureReason: text('failure_reason'),
  metadata: jsonb().default({}), // booking questionnaire payload (sender, recipient, call-specific Q&A, final notes)
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.userId], foreignColumns: [profiles.id], name: 'calls_user_id_fkey' }),
  foreignKey({ columns: [table.assignedTo], foreignColumns: [profiles.id], name: 'calls_assigned_to_fkey' }),
  pgPolicy('Users can view own calls', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Callers can view their assigned calls', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Callers can update their assigned calls', { as: 'permissive', for: 'update', to: ['public'] }),
  pgPolicy('Admins can manage calls', {
    as: 'permissive', for: 'all', to: ['public'],
    using: sql`(( SELECT auth_accounts.role
   FROM auth_accounts
  WHERE (auth_accounts.id = get_account_id())) = 'admin'::user_role)`,
  }),
]);

export const specialCalls = pgTable('special_calls', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  description: text().default('').notNull(),
  occasionEmoji: text('occasion_emoji').default('🎉').notNull(),
  price: integer().default(0).notNull(),
  currency: text().default('NGN').notNull(),
  active: boolean().default(false).notNull(),
  callDate: date('call_date'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_special_calls_active').using('btree', table.active.asc().nullsLast().op('timestamptz_ops'), table.createdAt.desc().nullsFirst().op('timestamptz_ops')),
  pgPolicy('Anyone can view active special calls', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Admins can manage special calls', {
    as: 'permissive', for: 'all', to: ['public'],
    using: sql`(( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::user_role)`,
  }),
]);

// ─────────────────────────────────────────────
// Digital Letters
// ─────────────────────────────────────────────

export const digitalLetters = pgTable('digital_letters', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  senderId: uuid('sender_id'),
  recipientName: text('recipient_name').notNull(),
  recipientPhone: text('recipient_phone'),
  recipientEmail: text('recipient_email'),
  recipientPhotoUrl: text('recipient_photo_url'),
  message: text().notNull(),
  voiceNoteUrl: text('voice_note_url'),
  backgroundMusicUrl: text('background_music_url'),
  videoUrl: text('video_url'),
  theme: text().default('parchment').notNull(),
  tier: text().default('standard').notNull(),
  status: text().default('draft').notNull(),
  wantsScannable: boolean('wants_scannable').default(false).notNull(),
  scannableStatus: text('scannable_status').default('none').notNull(),
  requestAdminVoice: boolean('request_admin_voice').default(false).notNull(),
  requestAdminLetter: boolean('request_admin_letter').default(false).notNull(),
  additionalComments: text('additional_comments'),
  adminNotes: text('admin_notes'),
  createdByAdmin: boolean('created_by_admin').default(false).notNull(),
  qrIdentifier: text('qr_identifier').notNull(),
  unfurledCount: integer('unfurled_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_digital_letters_qr').using('btree', table.qrIdentifier.asc().nullsLast().op('text_ops')),
  index('idx_digital_letters_status').using('btree', table.status.asc().nullsLast().op('text_ops')),
  index('idx_digital_letters_scannable').using('btree', table.scannableStatus.asc().nullsLast().op('text_ops')).where(sql`(wants_scannable = true)`),
  foreignKey({ columns: [table.senderId], foreignColumns: [profiles.id], name: 'digital_letters_sender_id_fkey' }),
  unique('digital_letters_qr_identifier_key').on(table.qrIdentifier),
  check('digital_letters_theme_check', sql`theme = ANY (ARRAY['parchment'::text, 'royal'::text, 'modern'::text])`),
  check('digital_letters_tier_check', sql`tier = ANY (ARRAY['standard'::text, 'premium'::text])`),
  check('digital_letters_status_check', sql`status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text, 'processing'::text])`),
  check('digital_letters_scannable_status_check', sql`scannable_status = ANY (ARRAY['none'::text, 'pending'::text, 'printed'::text, 'shipped'::text])`),
  pgPolicy('Users can view own letters', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Anyone can view published letters', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Users can insert their own letters', { as: 'permissive', for: 'insert', to: ['public'] }),
  pgPolicy('Users can update their own draft letters', { as: 'permissive', for: 'update', to: ['public'] }),
  pgPolicy('Admins can manage letters', {
    as: 'permissive', for: 'all', to: ['public'],
    using: sql`(( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::user_role)`,
  }),
]);

// ─────────────────────────────────────────────
// Subscriptions & Payments
// ─────────────────────────────────────────────

export const subscriptions = pgTable('subscriptions', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').notNull(),
  plan: planType().notNull(),
  status: subscriptionStatus().default('active'),
  billingCycle: text('billing_cycle').default('monthly').notNull(),
  callsMade: integer('calls_made').default(0),
  totalCalls: integer('total_calls').notNull(),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'string' }).defaultNow(),
  nextBillingDate: timestamp('next_billing_date', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.userId], foreignColumns: [profiles.id], name: 'subscriptions_user_id_fkey' }).onDelete('cascade'),
  unique('subscriptions_user_id_key').on(table.userId),
  check('subscriptions_billing_cycle_check', sql`billing_cycle = ANY (ARRAY['monthly'::text, 'annual'::text])`),
  pgPolicy('Users can view own subscriptions', { as: 'permissive', for: 'select', to: ['public'], using: sql`(get_account_id() = user_id)` }),
]);

export const payments = pgTable('payments', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').notNull(),
  callId: uuid('call_id'),
  amount: numeric({ precision: 12, scale: 2 }).notNull(),
  currency: text().default('NGN'),
  provider: text().notNull(),
  providerReference: text('provider_reference').notNull(),
  status: text().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.userId], foreignColumns: [authAccounts.id], name: 'payments_user_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.callId], foreignColumns: [calls.id], name: 'payments_call_id_fkey' }).onDelete('set null'),
  unique('payments_provider_reference_key').on(table.providerReference),
  pgPolicy('Users can view own payments', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Admins can view all payments', { as: 'permissive', for: 'select', to: ['public'], using: sql`(auth_accounts_role() = 'admin'::text)` }),
]);

// ─────────────────────────────────────────────
// Marketing (offers, newsletter, testimonials)
// ─────────────────────────────────────────────

export const specialOffers = pgTable('special_offers', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  description: text(),
  discountPercent: integer('discount_percent'),
  isActive: boolean('is_active').default(true),
  bannerUrl: text('banner_url'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, () => [
  pgPolicy('Public read access to special offers', { as: 'permissive', for: 'select', to: ['public'], using: sql`true` }),
]);

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  email: text().notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  unique('newsletter_subscribers_email_key').on(table.email),
  pgPolicy('Anyone can subscribe', { as: 'permissive', for: 'insert', to: ['public'] }),
  pgPolicy('Admins can view subscribers', { as: 'permissive', for: 'select', to: ['public'], using: sql`(auth_accounts_role() = 'admin'::text)` }),
]);

export const testimonials = pgTable('testimonials', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id'),
  authorName: text('author_name').notNull(),
  content: text().notNull(),
  imageUrl: text('image_url'),
  videoUrl: text('video_url'),
  rating: integer(),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.userId], foreignColumns: [authAccounts.id], name: 'testimonials_user_id_fkey' }).onDelete('set null'),
  check('testimonials_rating_check', sql`(rating >= 1) AND (rating <= 5)`),
  pgPolicy('Superheroes can view verified testimonials', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Admins can manage testimonials', { as: 'permissive', for: 'all', to: ['public'], using: sql`(auth_accounts_role() = 'admin'::text)` }),
]);

// ─────────────────────────────────────────────
// Views
// ─────────────────────────────────────────────

export const analyticsSummary = pgView('analytics_summary', {
  totalCallsDelivered: bigint('total_calls_delivered', { mode: 'number' }),
  totalUsers: bigint('total_users', { mode: 'number' }),
  churnedClients: bigint('churned_clients', { mode: 'number' }),
  unfinishedBookings: bigint('unfinished_bookings', { mode: 'number' }),
}).with({ securityInvoker: true }).as(sql`SELECT ( SELECT count(*) AS count FROM calls WHERE calls.status = 'delivered'::call_status) AS total_calls_delivered, ( SELECT count(*) AS count FROM profiles WHERE profiles.role = 'user'::user_role) AS total_users, ( SELECT count(*) AS count FROM subscriptions WHERE subscriptions.status = 'canceled'::subscription_status) AS churned_clients, ( SELECT count(*) AS count FROM calls WHERE calls.status = 'pending'::call_status) AS unfinished_bookings`);

// ─────────────────────────────────────────────
// Relations
// ─────────────────────────────────────────────

export const authAccountsRelations = relations(authAccounts, ({ many }) => ({
  authSessions: many(authSessions),
  profiles: many(profiles),
  payments: many(payments),
  testimonials: many(testimonials),
}));

export const authSessionsRelations = relations(authSessions, ({ one }) => ({
  authAccount: one(authAccounts, { fields: [authSessions.userId], references: [authAccounts.id] }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  authAccount: one(authAccounts, { fields: [profiles.id], references: [authAccounts.id] }),
  callsBooked: many(calls, { relationName: 'calls_userId_profiles_id' }),
  callsAssigned: many(calls, { relationName: 'calls_assignedTo_profiles_id' }),
  digitalLetters: many(digitalLetters),
  subscriptions: many(subscriptions),
}));

export const callsRelations = relations(calls, ({ one, many }) => ({
  booker: one(profiles, { fields: [calls.userId], references: [profiles.id], relationName: 'calls_userId_profiles_id' }),
  caller: one(profiles, { fields: [calls.assignedTo], references: [profiles.id], relationName: 'calls_assignedTo_profiles_id' }),
  payments: many(payments),
}));

export const digitalLettersRelations = relations(digitalLetters, ({ one }) => ({
  sender: one(profiles, { fields: [digitalLetters.senderId], references: [profiles.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  profile: one(profiles, { fields: [subscriptions.userId], references: [profiles.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  authAccount: one(authAccounts, { fields: [payments.userId], references: [authAccounts.id] }),
  call: one(calls, { fields: [payments.callId], references: [calls.id] }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  authAccount: one(authAccounts, { fields: [testimonials.userId], references: [authAccounts.id] }),
}));

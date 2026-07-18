-- ⚠️ HISTORICAL — superseded by src/db/schema/index.ts (Drizzle ORM schema-as-code).
-- This file (and the other supabase_migration_*.sql / migrations/*.sql / custom_auth.sql /
-- rls_integration.sql files alongside it) documents how the schema evolved by hand over time,
-- but is no longer the source of truth and should not be re-run.
-- To see the current live schema, read src/db/schema/index.ts. To change the schema, edit that
-- file and run `npm run db:generate` then `npm run db:migrate` — see CLAUDE.md.

-- BUZZTHRILLS SUPABASE SCHEMA

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('user', 'admin', 'caller');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'canceled');
CREATE TYPE call_status AS ENUM ('pending', 'scheduled', 'delivered', 'failed');
CREATE TYPE call_slot AS ENUM ('morning', 'afternoon', 'evening', 'night');
CREATE TYPE plan_type AS ENUM ('lite', 'plus', 'orbit', 'corporate');

-- 2. PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan plan_type NOT NULL,
  status subscription_status DEFAULT 'active',
  calls_made INTEGER DEFAULT 0,
  total_calls INTEGER NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','annual')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CALLS (ONE-OFF & SUBSCRIPTION)
CREATE TABLE calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  relationship TEXT,
  occasion_type TEXT NOT NULL,
  occasion_date DATE NOT NULL,
  call_type TEXT NOT NULL,
  status call_status DEFAULT 'pending',
  scheduled_slot call_slot DEFAULT 'morning',
  is_express BOOLEAN DEFAULT FALSE,
  custom_message TEXT,
  recording_url TEXT,
  admin_notes TEXT,
  failure_reason TEXT,
  assigned_to UUID REFERENCES profiles(id), -- Assigned Caller
  metadata JSONB DEFAULT '{}'::jsonb, -- Booking questionnaire payload (sender, recipient, call-specific Q&A, final notes)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DIGITAL LETTERS
CREATE TABLE digital_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id),
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT,
  message TEXT NOT NULL,
  voice_note_url TEXT,
  background_music_url TEXT,
  video_url TEXT,
  recipient_photo_url TEXT,
  theme TEXT NOT NULL DEFAULT 'parchment' CHECK (theme IN ('parchment','royal','modern')),
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard','premium')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  wants_scannable BOOLEAN NOT NULL DEFAULT false,
  scannable_status TEXT NOT NULL DEFAULT 'none' CHECK (scannable_status IN ('none','pending','printed','shipped')),
  admin_notes TEXT,
  created_by_admin BOOLEAN NOT NULL DEFAULT false,
  qr_identifier TEXT UNIQUE NOT NULL,
  unfurled_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SPECIAL OFFERS
CREATE TABLE special_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS POLICIES (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to special offers" ON special_offers FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own calls" ON calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own letters" ON digital_letters FOR SELECT USING (auth.uid() = sender_id);

-- Admins can view everything
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Admins can manage calls" ON calls FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 8. ANALYTICS VIEWS
CREATE VIEW analytics_summary WITH (security_invoker = on) AS
SELECT 
  (SELECT COUNT(*) FROM calls WHERE status = 'delivered') as total_calls_delivered,
  (SELECT COUNT(*) FROM profiles WHERE role = 'user') as total_users,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'canceled') as churned_clients,
  (SELECT COUNT(*) FROM calls WHERE status = 'pending') as unfinished_bookings;

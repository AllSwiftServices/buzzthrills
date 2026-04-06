-- 1. AUTHENTICATION HELPERS (For Custom Auth Schema)
-- These functions extract the superhero ID and role from the custom JWT claims.

CREATE OR REPLACE FUNCTION auth_accounts_id()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json ->> 'id', '')::UUID;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION auth_accounts_role()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json ->> 'role', '');
$$ LANGUAGE SQL STABLE;

-- 2. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth_accounts(id) ON DELETE CASCADE NOT NULL,
  call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  provider TEXT NOT NULL, -- 'paystack', 'stripe', 'flutterwave'
  provider_reference TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'successful', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE RLS FOR PAYMENTS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO AVOID DUPLICATES IF RUN MULTIPLE TIMES
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth_accounts_id() = user_id);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (auth_accounts_role() = 'admin');

-- 4. ENHANCE PROFILES (Demographics & Segmentation)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS age_grade TEXT, -- 'Gen Z', 'Millennial', 'Gen X', 'Alpha'
ADD COLUMN IF NOT EXISTS corporate_details JSONB,
ADD COLUMN IF NOT EXISTS is_unsubscribed BOOLEAN DEFAULT FALSE;

-- 5. TESTIMONIALS TABLE 
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth_accounts(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENABLE RLS FOR TESTIMONIALS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superheroes can view verified testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;

CREATE POLICY "Superheroes can view verified testimonials" ON testimonials FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (auth_accounts_role() = 'admin');

-- 7. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

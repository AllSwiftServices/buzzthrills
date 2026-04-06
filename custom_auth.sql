-- CUSTOM AUTHENTICATION SCHEMA (Bypassing Supabase Auth)

-- 1. ACCOUNTS
CREATE TABLE IF NOT EXISTS auth_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SESSIONS (Refresh Tokens)
CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth_accounts(id) ON DELETE CASCADE NOT NULL,
  refresh_token TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OTP VERIFICATION
CREATE TABLE IF NOT EXISTS auth_otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LINK PROFILES TO CUSTOM ACCOUNTS
-- We need to migrate the profiles table to point to auth_accounts instead of auth.users
-- Since this is a major change, we'll first add a nullable column and later migrate data.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES auth_accounts(id) ON DELETE CASCADE;

-- 5. RLS UPDATES (CRITICAL)
-- We will need to update RLS policies to check the session token or a custom claim.
-- For now, we'll allow the API routes (using service role) to bypass RLS.
-- frontend queries will need a different approach (e.g. session-based RLS).

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION expire_otps() RETURNS trigger AS $$
BEGIN
  DELETE FROM auth_otps WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- RLS INTEGRATION FOR CUSTOM JWT
-- Bypassing auth.users but keeping native security policies

-- 1. UTILITY FUNCTION
-- This extracts the 'sub' (User ID) from the custom JWT.
-- If the project uses standard Supabase secret, this is already available in auth.jwt().
-- However, we make it explicit to support our custom ID mapping.

-- 1. UTILITY FUNCTION
-- This extracts the 'sub' (User ID) from our custom bespoke JWT.
-- We move this to the public schema to avoid 'permission denied' on the auth schema.

CREATE OR REPLACE FUNCTION public.get_account_id() 
RETURNS uuid AS $$
  SELECT 
    COALESCE(
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub'),
      (current_setting('request.jwt.claim.sub', true))
    )::uuid;
$$ LANGUAGE sql STABLE;

-- 2. UPDATE POLICIES FOR ALL TABLES
-- We effectively replace 'auth.uid()' with our new 'public.get_account_id()'

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT USING (public.get_account_id() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT USING (
  (SELECT role FROM auth_accounts WHERE id = public.get_account_id()) = 'admin'
);

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions 
FOR SELECT USING (public.get_account_id() = user_id);

-- CALLS
DROP POLICY IF EXISTS "Users can view own calls" ON calls;
CREATE POLICY "Users can view own calls" ON calls 
FOR SELECT USING (public.get_account_id() = user_id);

DROP POLICY IF EXISTS "Admins can manage calls" ON calls;
CREATE POLICY "Admins can manage calls" ON calls 
FOR ALL USING (
  (SELECT role FROM auth_accounts WHERE id = public.get_account_id()) = 'admin'
);

-- DIGITAL LETTERS
DROP POLICY IF EXISTS "Users can view own letters" ON digital_letters;
CREATE POLICY "Users can view own letters" ON digital_letters 
FOR SELECT USING (public.get_account_id() = sender_id);

-- 3. SCHEMA MIGRATION Cleanup
-- Ensure existing profiles point to our new accounts (for future data)
-- For existing data, one would need a manual migration script.

-- SUPABASE SECURITY ISSUES FIX MIGRATION
-- Fixes RLS Disabled, Security Definer View, and Sensitive Columns Exposed

-- 1. Enable RLS on special_offers
ALTER TABLE IF EXISTS public.special_offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access to special offers" ON public.special_offers;
CREATE POLICY "Public read access to special offers" ON public.special_offers FOR SELECT USING (true);

-- 2. Enable RLS on auth_accounts
ALTER TABLE IF EXISTS public.auth_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own account" ON public.auth_accounts;
-- Note: if auth_accounts_id() is not defined, this policy creation might fail.
-- But since it's defined in previous migrations, we use it.
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'auth_accounts_id') THEN
    EXECUTE 'CREATE POLICY "Users can view own account" ON public.auth_accounts FOR SELECT USING (id = auth_accounts_id())';
  END IF;
END $$;

-- 3. Enable RLS on auth_sessions (Also fixes "Sensitive Columns Exposed")
ALTER TABLE IF EXISTS public.auth_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.auth_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.auth_sessions;
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'auth_accounts_id') THEN
    EXECUTE 'CREATE POLICY "Users can view own sessions" ON public.auth_sessions FOR SELECT USING (user_id = auth_accounts_id())';
    EXECUTE 'CREATE POLICY "Users can delete own sessions" ON public.auth_sessions FOR DELETE USING (user_id = auth_accounts_id())';
  END IF;
END $$;

-- 4. Enable RLS on auth_otps
ALTER TABLE IF EXISTS public.auth_otps ENABLE ROW LEVEL SECURITY;
-- No policies needed for auth_otps. Backend accesses via service_role.

-- 5. Enable RLS on newsletter_subscribers
ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'auth_accounts_role') THEN
    EXECUTE 'CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (auth_accounts_role() = ''admin'')';
  END IF;
END $$;

-- 6. Fix Security Definer View for analytics_summary
DROP VIEW IF EXISTS public.analytics_summary;
CREATE VIEW public.analytics_summary WITH (security_invoker = on) AS
SELECT 
  (SELECT COUNT(*) FROM calls WHERE status = 'delivered') as total_calls_delivered,
  (SELECT COUNT(*) FROM profiles WHERE role = 'user') as total_users,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'canceled') as churned_clients,
  (SELECT COUNT(*) FROM calls WHERE status = 'pending') as unfinished_bookings;

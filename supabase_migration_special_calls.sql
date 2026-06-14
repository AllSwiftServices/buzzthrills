-- Migration: create special_calls table for admin-managed occasion call banners.
-- Run once against the production Supabase project.

CREATE TABLE IF NOT EXISTS special_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  occasion_emoji TEXT NOT NULL DEFAULT '🎉',
  price INTEGER NOT NULL DEFAULT 0,       -- price in kobo (multiply by 100 for Paystack)
  currency TEXT NOT NULL DEFAULT 'NGN',
  active BOOLEAN NOT NULL DEFAULT false,
  call_date DATE,                          -- optional target date, e.g. 2026-02-14
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast public query
CREATE INDEX IF NOT EXISTS idx_special_calls_active ON special_calls(active, created_at DESC);

-- Enable RLS
ALTER TABLE special_calls ENABLE ROW LEVEL SECURITY;

-- RLS policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view active special calls' AND tablename = 'special_calls'
  ) THEN
    CREATE POLICY "Anyone can view active special calls"
      ON special_calls FOR SELECT
      USING (active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage special calls' AND tablename = 'special_calls'
  ) THEN
    CREATE POLICY "Admins can manage special calls"
      ON special_calls FOR ALL
      USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
  END IF;
END$$;

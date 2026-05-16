-- Migration: add billing_cycle to subscriptions and enforce one active subscription per user.
-- Run once against the production Supabase project.

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT NOT NULL DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly','annual'));

-- The verify route upserts subscriptions with onConflict: 'user_id', which requires
-- a unique constraint on user_id. Older deployments may not have it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_key'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END$$;

-- Migration: enrich call records with the booking questionnaire metadata and
-- add the 4th time slot (Evening).
-- Run once against the production Supabase project.

-- 1. JSONB column on calls for the structured booking questionnaire.
ALTER TABLE calls
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Add 'evening' to the call_slot enum if not already there.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'evening'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'call_slot')
  ) THEN
    ALTER TYPE call_slot ADD VALUE 'evening' AFTER 'afternoon';
  END IF;
END$$;

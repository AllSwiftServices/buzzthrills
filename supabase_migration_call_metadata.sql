-- ⚠️ HISTORICAL — superseded by src/db/schema/index.ts (Drizzle ORM schema-as-code).
-- This file (and the other supabase_migration_*.sql / migrations/*.sql / custom_auth.sql /
-- rls_integration.sql files alongside it) documents how the schema evolved by hand over time,
-- but is no longer the source of truth and should not be re-run.
-- To see the current live schema, read src/db/schema/index.ts. To change the schema, edit that
-- file and run `npm run db:generate` then `npm run db:migrate` — see CLAUDE.md.

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

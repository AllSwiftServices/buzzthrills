-- ⚠️ HISTORICAL — superseded by src/db/schema/index.ts (Drizzle ORM schema-as-code).
-- This file (and the other supabase_migration_*.sql / migrations/*.sql / custom_auth.sql /
-- rls_integration.sql files alongside it) documents how the schema evolved by hand over time,
-- but is no longer the source of truth and should not be re-run.
-- To see the current live schema, read src/db/schema/index.ts. To change the schema, edit that
-- file and run `npm run db:generate` then `npm run db:migrate` — see CLAUDE.md.

-- Migration: add additional_comments, request_admin_voice, admin_notes,
-- request_admin_letter, and 'processing' status to the digital_letters table.
-- Run once against the production Supabase project.

ALTER TABLE digital_letters
  ADD COLUMN IF NOT EXISTS additional_comments   TEXT,
  ADD COLUMN IF NOT EXISTS request_admin_voice   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_notes           TEXT,
  ADD COLUMN IF NOT EXISTS request_admin_letter  BOOLEAN NOT NULL DEFAULT false;

-- Allow 'processing' as a letter status (admin work in progress after payment)
ALTER TABLE digital_letters
  DROP CONSTRAINT IF EXISTS digital_letters_status_check;

ALTER TABLE digital_letters
  ADD CONSTRAINT digital_letters_status_check
  CHECK (status IN ('draft', 'processing', 'published', 'archived'));

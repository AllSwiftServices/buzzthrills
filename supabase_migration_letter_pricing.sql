-- ⚠️ HISTORICAL — superseded by src/db/schema/index.ts (Drizzle ORM schema-as-code).
-- This file (and the other supabase_migration_*.sql / migrations/*.sql / custom_auth.sql /
-- rls_integration.sql files alongside it) documents how the schema evolved by hand over time,
-- but is no longer the source of truth and should not be re-run.
-- To see the current live schema, read src/db/schema/index.ts. To change the schema, edit that
-- file and run `npm run db:generate` then `npm run db:migrate` — see CLAUDE.md.

-- Migration: switch digital_letters to flat-base pricing with add-ons.
-- Adds a recipient photo and a scannable physical-fulfilment flag.
-- Run once against the production Supabase project.

ALTER TABLE digital_letters
  ADD COLUMN IF NOT EXISTS recipient_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS wants_scannable BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS scannable_status TEXT NOT NULL DEFAULT 'none'
    CHECK (scannable_status IN ('none','pending','printed','shipped'));

CREATE INDEX IF NOT EXISTS idx_digital_letters_scannable
  ON digital_letters(scannable_status)
  WHERE wants_scannable = true;

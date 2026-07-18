-- ⚠️ HISTORICAL — superseded by src/db/schema/index.ts (Drizzle ORM schema-as-code).
-- This file (and the other supabase_migration_*.sql / migrations/*.sql / custom_auth.sql /
-- rls_integration.sql files alongside it) documents how the schema evolved by hand over time,
-- but is no longer the source of truth and should not be re-run.
-- To see the current live schema, read src/db/schema/index.ts. To change the schema, edit that
-- file and run `npm run db:generate` then `npm run db:migrate` — see CLAUDE.md.

-- Migration: Add optional recipient_email column to digital_letters table.
-- Run this in your Supabase Project's SQL Editor to update your database.

ALTER TABLE digital_letters
  ADD COLUMN IF NOT EXISTS recipient_email TEXT;

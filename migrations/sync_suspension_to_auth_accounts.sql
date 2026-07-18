-- ⚠️ HISTORICAL — superseded by src/db/schema/index.ts (Drizzle ORM schema-as-code).
-- This file (and the other supabase_migration_*.sql / migrations/*.sql / custom_auth.sql /
-- rls_integration.sql files alongside it) documents how the schema evolved by hand over time,
-- but is no longer the source of truth and should not be re-run.
-- To see the current live schema, read src/db/schema/index.ts. To change the schema, edit that
-- file and run `npm run db:generate` then `npm run db:migrate` — see CLAUDE.md.

-- MIGRATION: SYNC SUSPENSION STATUS TO auth_accounts
-- is_suspended previously only existed on `profiles`, but the JWT (role +
-- suspension) is signed from `auth_accounts` at login/refresh. Without this
-- column there, suspending a user in the admin panel never actually revoked
-- their access token.

ALTER TABLE IF EXISTS auth_accounts
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;

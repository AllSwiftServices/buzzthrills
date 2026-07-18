-- ⚠️ HISTORICAL — superseded by src/db/schema/index.ts (Drizzle ORM schema-as-code).
-- This file (and the other supabase_migration_*.sql / migrations/*.sql / custom_auth.sql /
-- rls_integration.sql files alongside it) documents how the schema evolved by hand over time,
-- but is no longer the source of truth and should not be re-run.
-- To see the current live schema, read src/db/schema/index.ts. To change the schema, edit that
-- file and run `npm run db:generate` then `npm run db:migrate` — see CLAUDE.md.

-- MIGRATION: CALLER ROLE RLS POLICIES
-- The `caller` role already existed on the `user_role` enum but had no RLS
-- policies of its own — only 'user' (own rows) and 'admin' (everything)
-- were covered, so a caller querying via RLS (rather than the service-role
-- API routes) could see nothing. These let a caller read and update only
-- the calls assigned to them (status/recording/failure_reason), same scope
-- the /api/caller/* routes already enforce server-side.

DROP POLICY IF EXISTS "Callers can view their assigned calls" ON calls;
CREATE POLICY "Callers can view their assigned calls" ON calls FOR SELECT USING (
  assigned_to = auth.uid()
);

DROP POLICY IF EXISTS "Callers can update their assigned calls" ON calls;
CREATE POLICY "Callers can update their assigned calls" ON calls FOR UPDATE USING (
  assigned_to = auth.uid()
)
WITH CHECK (
  assigned_to = auth.uid()
);

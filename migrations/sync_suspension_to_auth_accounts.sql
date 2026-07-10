-- MIGRATION: SYNC SUSPENSION STATUS TO auth_accounts
-- is_suspended previously only existed on `profiles`, but the JWT (role +
-- suspension) is signed from `auth_accounts` at login/refresh. Without this
-- column there, suspending a user in the admin panel never actually revoked
-- their access token.

ALTER TABLE IF EXISTS auth_accounts
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;

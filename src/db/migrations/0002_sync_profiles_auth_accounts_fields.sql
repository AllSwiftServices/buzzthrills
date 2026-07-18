-- auth_accounts and profiles independently store full_name/email/role/is_suspended
-- and were being kept in sync by hand in application code (easy to forget on any
-- new write path). These triggers make the DB itself the source of truth for
-- consistency: writing either table's copy of these columns propagates to the
-- other automatically. The `IS DISTINCT FROM` guard in the WHERE clause is what
-- stops this from ping-ponging forever — the second hop's values already match,
-- so its UPDATE affects zero rows and the opposite trigger never fires again.

CREATE OR REPLACE FUNCTION sync_auth_account_to_profile() RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET full_name = NEW.full_name,
      email = NEW.email,
      role = NEW.role,
      is_suspended = NEW.is_suspended,
      updated_at = NOW()
  WHERE id = NEW.id
    AND (full_name IS DISTINCT FROM NEW.full_name
      OR email IS DISTINCT FROM NEW.email
      OR role IS DISTINCT FROM NEW.role
      OR is_suspended IS DISTINCT FROM NEW.is_suspended);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sync_profile_to_auth_account() RETURNS trigger AS $$
BEGIN
  UPDATE auth_accounts
  SET full_name = NEW.full_name,
      email = NEW.email,
      role = NEW.role,
      is_suspended = NEW.is_suspended,
      updated_at = NOW()
  WHERE id = NEW.id
    AND (full_name IS DISTINCT FROM NEW.full_name
      OR email IS DISTINCT FROM NEW.email
      OR role IS DISTINCT FROM NEW.role
      OR is_suspended IS DISTINCT FROM NEW.is_suspended);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_auth_account_to_profile ON auth_accounts;
CREATE TRIGGER trg_sync_auth_account_to_profile
  AFTER UPDATE OF full_name, email, role, is_suspended ON auth_accounts
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_account_to_profile();

DROP TRIGGER IF EXISTS trg_sync_profile_to_auth_account ON profiles;
CREATE TRIGGER trg_sync_profile_to_auth_account
  AFTER UPDATE OF full_name, email, role, is_suspended ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_to_auth_account();

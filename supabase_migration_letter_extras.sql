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

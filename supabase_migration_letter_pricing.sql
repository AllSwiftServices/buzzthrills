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

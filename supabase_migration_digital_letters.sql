-- Migration: extend digital_letters to support real user-created letters with
-- music + voice/video uploads, themes, status lifecycle, and admin tooling.
-- Run once against the production Supabase project.

ALTER TABLE digital_letters
  ADD COLUMN IF NOT EXISTS background_music_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'parchment'
    CHECK (theme IN ('parchment','royal','modern')),
  ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'standard'
    CHECK (tier IN ('standard','premium')),
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','archived')),
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recipient_phone TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_digital_letters_qr ON digital_letters(qr_identifier);
CREATE INDEX IF NOT EXISTS idx_digital_letters_status ON digital_letters(status);

-- RLS policies for the new lifecycle
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published letters' AND tablename = 'digital_letters') THEN
    CREATE POLICY "Anyone can view published letters"
      ON digital_letters FOR SELECT
      USING (status = 'published');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own letters' AND tablename = 'digital_letters') THEN
    CREATE POLICY "Users can insert their own letters"
      ON digital_letters FOR INSERT
      WITH CHECK (auth.uid() = sender_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own draft letters' AND tablename = 'digital_letters') THEN
    CREATE POLICY "Users can update their own draft letters"
      ON digital_letters FOR UPDATE
      USING (auth.uid() = sender_id AND status = 'draft');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage letters' AND tablename = 'digital_letters') THEN
    CREATE POLICY "Admins can manage letters"
      ON digital_letters FOR ALL
      USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
  END IF;
END$$;

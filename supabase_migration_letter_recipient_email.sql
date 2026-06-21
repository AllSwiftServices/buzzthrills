-- Migration: Add optional recipient_email column to digital_letters table.
-- Run this in your Supabase Project's SQL Editor to update your database.

ALTER TABLE digital_letters
  ADD COLUMN IF NOT EXISTS recipient_email TEXT;

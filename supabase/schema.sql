-- Bloom MVP schema
-- Run this in Supabase SQL editor to create the entries table

CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entries TEXT[] NOT NULL,
  mood TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'ghibli',
  scene_prompt TEXT,
  image_url TEXT,
  card_url TEXT,
  prompt_version TEXT NOT NULL DEFAULT 'v1',
  prediction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'generating', 'processing', 'complete', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_entries_prediction_id ON entries (prediction_id)
  WHERE prediction_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries (created_at DESC);

-- Storage buckets (create via Supabase dashboard or API):
-- 1. "scenes" — AI-generated scene PNGs
-- 2. "cards"  — composited share card PNGs (cached)

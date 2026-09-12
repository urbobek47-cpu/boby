-- BOBY Storefront — Supabase PostgreSQL Schema for Artwork Persistence
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS public.artworks (
  slug TEXT PRIMARY KEY,
  title JSONB NOT NULL,
  story JSONB NOT NULL,
  materials JSONB NOT NULL,
  discipline TEXT NOT NULL,
  category JSONB NOT NULL,
  inventory_kind TEXT NOT NULL,
  availability TEXT NOT NULL,
  dimensions JSONB NOT NULL,
  price_agorot BIGINT NOT NULL,
  shipping_size_band TEXT NOT NULL,
  is_fragile BOOLEAN NOT NULL DEFAULT FALSE,
  images JSONB NOT NULL,
  artist JSONB NOT NULL,
  edition_size INT,
  edition_number INT,
  lead_time_days INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all artwork records
CREATE POLICY "Allow public read access on artworks"
  ON public.artworks FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

-- Allow insert/update/delete via service role or authenticated requests
CREATE POLICY "Allow full access on artworks"
  ON public.artworks FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

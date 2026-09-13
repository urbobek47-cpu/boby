-- ============================================================================
-- BOBY — Complete PostgreSQL / Supabase Database Schema
--
-- Includes tables for:
--  1. Artists (public.artists)
--  2. Artworks (public.artworks)
--  3. Inventory (public.inventory)
--  4. Reservations (public.reservations) — with partial unique index for qty=1 protection (CLAUDE.md §5.3 & Spike 4)
--  5. Orders (public.orders)
--
-- Safe to copy-paste directly into the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper Functions & Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. Artists Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artists (
  slug TEXT PRIMARY KEY,
  display_name JSONB NOT NULL,    -- { "he": "...", "en": "..." }
  location JSONB NOT NULL,        -- { "he": "...", "en": "..." }
  bio JSONB NOT NULL,             -- { "he": "...", "en": "..." }
  portrait_public_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_artists_updated_at ON public.artists;
CREATE TRIGGER set_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 2. Artworks Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artworks (
  slug TEXT PRIMARY KEY,
  title JSONB NOT NULL,           -- { "he": "...", "en": "..." }
  story JSONB NOT NULL,           -- { "he": "...", "en": "..." }
  materials JSONB NOT NULL,       -- { "he": ["..."], "en": ["..."] }
  discipline TEXT NOT NULL,       -- ceramics, jewelry, painting, sculpture, wood, textile, judaica
  category JSONB NOT NULL,        -- { "he": "...", "en": "..." }
  inventory_kind TEXT NOT NULL,   -- UNIQUE, LIMITED_EDITION, MADE_TO_ORDER
  availability TEXT NOT NULL DEFAULT 'available', -- available, reserved, sold
  dimensions JSONB NOT NULL,      -- { heightCm, widthCm, depthCm, weightGrams }
  price_agorot BIGINT NOT NULL,   -- integer agorot (VAT inclusive)
  shipping_size_band TEXT NOT NULL, -- SMALL, MEDIUM, LARGE, OVERSIZE_QUOTE
  is_fragile BOOLEAN NOT NULL DEFAULT FALSE,
  images JSONB NOT NULL,          -- Array of ArtworkImage objects
  artist JSONB NOT NULL,          -- Full artist snapshot object
  artist_slug TEXT REFERENCES public.artists(slug) ON DELETE SET NULL,
  edition_size INT,               -- LIMITED_EDITION
  edition_number INT,             -- LIMITED_EDITION
  lead_time_days INT,             -- MADE_TO_ORDER
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_artworks_updated_at ON public.artworks;
CREATE TRIGGER set_artworks_updated_at
  BEFORE UPDATE ON public.artworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_artworks_discipline ON public.artworks(discipline);
CREATE INDEX IF NOT EXISTS idx_artworks_inventory_kind ON public.artworks(inventory_kind);
CREATE INDEX IF NOT EXISTS idx_artworks_availability ON public.artworks(availability);
CREATE INDEX IF NOT EXISTS idx_artworks_artist_slug ON public.artworks(artist_slug);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON public.artworks(created_at DESC);

-- ----------------------------------------------------------------------------
-- 3. Inventory Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
  slug TEXT PRIMARY KEY REFERENCES public.artworks(slug) ON DELETE CASCADE,
  inventory_kind TEXT NOT NULL,   -- UNIQUE, LIMITED_EDITION, MADE_TO_ORDER
  quantity INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_inventory_updated_at ON public.inventory;
CREATE TRIGGER set_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 4. Reservations Table (Spike 4 / CLAUDE.md §5.3 Atomic Reservation Guard)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY DEFAULT ('res_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),
  artwork_slug TEXT NOT NULL REFERENCES public.artworks(slug) ON DELETE CASCADE,
  cart_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  released_at TIMESTAMPTZ
);

-- Partial Unique Index Rule (Spike 4): At most ONE ACTIVE reservation per artwork
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_artwork_reservation
  ON public.reservations (artwork_slug)
  WHERE released_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_reservations_cart_id ON public.reservations(cart_id);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON public.reservations(expires_at);

-- ----------------------------------------------------------------------------
-- 5. Orders Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ord_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),
  human_readable_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',         -- created, processing, completed, cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending_payment', -- pending_payment, paid, failed
  buyer JSONB NOT NULL,                           -- { name, email, phone, shippingAddress }
  gift JSONB,                                     -- { recipientName, recipientPhone, giftMessage }
  lines JSONB NOT NULL,                           -- Array of OrderLine objects
  totals JSONB NOT NULL,                          -- { subtotalAgorot, shippingAgorot, totalAgorot, vatAgorot }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS) & Access Policies
-- ----------------------------------------------------------------------------
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 1. Artists RLS
DROP POLICY IF EXISTS "Allow public read access on artists" ON public.artists;
CREATE POLICY "Allow public read access on artists"
  ON public.artists FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS "Allow full access on artists" ON public.artists;
CREATE POLICY "Allow full access on artists"
  ON public.artists FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- 2. Artworks RLS
DROP POLICY IF EXISTS "Allow public read access on artworks" ON public.artworks;
CREATE POLICY "Allow public read access on artworks"
  ON public.artworks FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS "Allow full access on artworks" ON public.artworks;
CREATE POLICY "Allow full access on artworks"
  ON public.artworks FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- 3. Inventory RLS
DROP POLICY IF EXISTS "Allow public read access on inventory" ON public.inventory;
CREATE POLICY "Allow public read access on inventory"
  ON public.inventory FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS "Allow full access on inventory" ON public.inventory;
CREATE POLICY "Allow full access on inventory"
  ON public.inventory FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- 4. Reservations RLS
DROP POLICY IF EXISTS "Allow public read access on reservations" ON public.reservations;
CREATE POLICY "Allow public read access on reservations"
  ON public.reservations FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS "Allow full access on reservations" ON public.reservations;
CREATE POLICY "Allow full access on reservations"
  ON public.reservations FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- 5. Orders RLS
DROP POLICY IF EXISTS "Allow public read access on orders" ON public.orders;
CREATE POLICY "Allow public read access on orders"
  ON public.orders FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS "Allow full access on orders" ON public.orders;
CREATE POLICY "Allow full access on orders"
  ON public.orders FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

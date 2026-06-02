
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS pending_changes jsonb,
  ADD COLUMN IF NOT EXISTS pending_changes_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_listings_pending_changes
  ON public.listings ((pending_changes IS NOT NULL));

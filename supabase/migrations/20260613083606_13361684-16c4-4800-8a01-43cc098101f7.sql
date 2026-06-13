
ALTER TABLE public.accommodations
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS business_type text,
  ADD COLUMN IF NOT EXISTS segment text;

CREATE INDEX IF NOT EXISTS accommodations_category_idx ON public.accommodations (category);
CREATE INDEX IF NOT EXISTS accommodations_subcategory_idx ON public.accommodations (subcategory);

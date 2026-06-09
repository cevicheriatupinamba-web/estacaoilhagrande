
-- Accommodations table for imported pousadas
CREATE TABLE IF NOT EXISTS public.accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text DEFAULT 'Pousada',
  source_url text,
  source_platform text,
  location text,
  address text,
  neighborhood text,
  city text DEFAULT 'Ilha Grande',
  state text DEFAULT 'Rio de Janeiro',
  country text DEFAULT 'Brasil',
  latitude numeric,
  longitude numeric,
  short_description text,
  full_description text,
  rating numeric,
  review_count integer,
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  rooms jsonb NOT NULL DEFAULT '[]'::jsonb,
  house_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  checkin_time text,
  checkout_time text,
  whatsapp text,
  instagram text,
  website text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','inactive')),
  is_featured boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.accommodations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accommodations TO authenticated;
GRANT ALL ON public.accommodations TO service_role;

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published accommodations"
ON public.accommodations FOR SELECT
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage accommodations - insert"
ON public.accommodations FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage accommodations - update"
ON public.accommodations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage accommodations - delete"
ON public.accommodations FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_accommodations_status ON public.accommodations(status);
CREATE INDEX IF NOT EXISTS idx_accommodations_slug ON public.accommodations(slug);

CREATE TRIGGER trg_accommodations_updated_at
BEFORE UPDATE ON public.accommodations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

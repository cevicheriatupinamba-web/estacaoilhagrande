
-- Enums
CREATE TYPE public.listing_category AS ENUM ('hospedagem','restaurante','passeio','experiencia');
CREATE TYPE public.listing_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.listing_plan AS ENUM ('gratuito','destaque','premium');

-- Table
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category public.listing_category NOT NULL,
  subcategory TEXT,
  short_description TEXT,
  description TEXT,
  address TEXT,
  neighborhood TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  email TEXT,
  website TEXT,
  price_range TEXT,
  opening_hours TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  services TEXT[] NOT NULL DEFAULT '{}',
  extras JSONB NOT NULL DEFAULT '{}'::jsonb,
  plan public.listing_plan NOT NULL DEFAULT 'gratuito',
  status public.listing_status NOT NULL DEFAULT 'pending',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_category ON public.listings(category);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_owner ON public.listings(owner_id);

-- Grants (public-readable for approved; auth-write controlled by RLS)
GRANT SELECT ON public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;

-- RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved listings"
  ON public.listings FOR SELECT
  USING (status = 'approved' OR auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Authenticated can create own listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners update own listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins update any listing"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Owners delete own listings"
  ON public.listings FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins delete any listing"
  ON public.listings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_listings_updated
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-photos','listing-photos',true);

CREATE POLICY "Listing photos public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-photos');

CREATE POLICY "Auth can upload listing photos to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can update own listing photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can delete own listing photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

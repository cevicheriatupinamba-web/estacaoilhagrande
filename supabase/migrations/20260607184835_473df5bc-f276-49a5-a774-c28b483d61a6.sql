
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT ALL ON public.blog_categories TO service_role;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories readable by all" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "admins manage categories" ON public.blog_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  category_slug text REFERENCES public.blog_categories(slug) ON DELETE SET NULL,
  author text DEFAULT 'Estação Ilha Grande',
  reading_minutes int DEFAULT 5,
  seo_title text,
  seo_description text,
  keywords text,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published posts readable" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "admins read all posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX blog_posts_published_idx ON public.blog_posts(published, published_at DESC);
CREATE INDEX blog_posts_category_idx ON public.blog_posts(category_slug);

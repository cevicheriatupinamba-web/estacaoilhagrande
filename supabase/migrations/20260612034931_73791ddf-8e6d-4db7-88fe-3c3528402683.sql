
-- ============================================================
-- CMS Foundation: pages, page_sections, page_content
-- ============================================================

-- PAGES ------------------------------------------------------
CREATE TABLE public.pages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  is_system   boolean NOT NULL DEFAULT false,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pages_public_read_published" ON public.pages
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "pages_admin_insert" ON public.pages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "pages_admin_update" ON public.pages
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "pages_admin_delete" ON public.pages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') AND is_system = false);

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PAGE_SECTIONS ----------------------------------------------
CREATE TABLE public.page_sections (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id       uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_key   text NOT NULL,
  kind          text NOT NULL DEFAULT 'generic',
  title         text,
  subtitle      text,
  content       text,
  image_url     text,
  video_url     text,
  button_text   text,
  button_link   text,
  extra         jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order    int NOT NULL DEFAULT 0,
  is_visible    boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, section_key)
);

CREATE INDEX page_sections_page_id_idx ON public.page_sections(page_id, sort_order);

GRANT SELECT ON public.page_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT ALL ON public.page_sections TO service_role;

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_sections_public_read" ON public.page_sections
  FOR SELECT TO anon, authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR (
      is_visible = true
      AND EXISTS (SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.status = 'published')
    )
  );

CREATE POLICY "page_sections_admin_write" ON public.page_sections
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PAGE_CONTENT (key/value extensible) ------------------------
CREATE TABLE public.page_content (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id       uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  content_key   text NOT NULL,
  content_value jsonb,
  content_type  text NOT NULL DEFAULT 'text'
                CHECK (content_type IN ('text','html','json','image','video','url','number','boolean','faq','testimonial','seo')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, content_key)
);

CREATE INDEX page_content_page_id_idx ON public.page_content(page_id);

GRANT SELECT ON public.page_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.page_content TO authenticated;
GRANT ALL ON public.page_content TO service_role;

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_content_public_read" ON public.page_content
  FOR SELECT TO anon, authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR EXISTS (SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.status = 'published')
  );

CREATE POLICY "page_content_admin_write" ON public.page_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED default pages -----------------------------------------
INSERT INTO public.pages (slug, title, description, status, is_system, sort_order) VALUES
  ('home',              'Home',              'Página inicial do portal',                 'published', true,  1),
  ('como-chegar',       'Como Chegar',       'Como chegar em Ilha Grande',               'published', true,  2),
  ('onde-ficar',        'Onde Ficar',        'Hospedagens em Ilha Grande',               'published', true,  3),
  ('onde-comer',        'Onde Comer',        'Restaurantes em Ilha Grande',              'published', true,  4),
  ('o-que-fazer',       'O Que Fazer',       'Atrações e atividades em Ilha Grande',     'published', true,  5),
  ('praias',            'Praias',            'Praias de Ilha Grande',                    'published', true,  6),
  ('trilhas',           'Trilhas',           'Trilhas e caminhadas em Ilha Grande',      'published', true,  7),
  ('passeios',          'Passeios',          'Passeios de barco e tours',                'published', true,  8),
  ('eventos',           'Eventos',           'Eventos e agenda cultural',                'published', true,  9),
  ('roteiros',          'Roteiros',          'Roteiros de viagem',                       'published', true, 10),
  ('agencia-oficial',   'Agência Oficial',   'Agência Oficial Estação Ilha Grande',      'published', true, 11),
  ('sobre',             'Sobre',             'Sobre a Estação Ilha Grande',              'published', true, 12),
  ('contato',           'Contato',           'Fale conosco',                             'published', true, 13),
  ('rodape',            'Rodapé',            'Configurações do rodapé global',           'published', true, 99)
ON CONFLICT (slug) DO NOTHING;

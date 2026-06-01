
-- Tabela pousadas
CREATE TABLE public.pousadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  nome text NOT NULL,
  email text,
  telefone text,
  cidade text,
  estado text,
  endereco text,
  descricao text,
  website text,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pousadas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pousadas TO authenticated;
GRANT ALL ON public.pousadas TO service_role;

ALTER TABLE public.pousadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved pousadas"
  ON public.pousadas FOR SELECT
  USING (status = 'aprovado' OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can insert own pousadas"
  ON public.pousadas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own pousadas"
  ON public.pousadas FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own pousadas"
  ON public.pousadas FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins manage all pousadas"
  ON public.pousadas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger: impedir que dono altere status
CREATE OR REPLACE FUNCTION public.prevent_owner_pousada_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Not allowed to modify status' USING ERRCODE = '42501';
  END IF;
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'Not allowed to change owner' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER pousadas_prevent_owner_privileged_updates
  BEFORE UPDATE ON public.pousadas
  FOR EACH ROW EXECUTE FUNCTION public.prevent_owner_pousada_status_change();

CREATE TRIGGER pousadas_set_updated_at
  BEFORE UPDATE ON public.pousadas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela pousada_imagens
CREATE TABLE public.pousada_imagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pousada_id uuid NOT NULL REFERENCES public.pousadas(id) ON DELETE CASCADE,
  imagem_url text NOT NULL,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pousada_imagens TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pousada_imagens TO authenticated;
GRANT ALL ON public.pousada_imagens TO service_role;

ALTER TABLE public.pousada_imagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View images of approved or owned pousadas"
  ON public.pousada_imagens FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pousadas p
    WHERE p.id = pousada_imagens.pousada_id
      AND (p.status = 'aprovado' OR p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  ));

CREATE POLICY "Owners manage own pousada images"
  ON public.pousada_imagens FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.pousadas p
    WHERE p.id = pousada_imagens.pousada_id
      AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pousadas p
    WHERE p.id = pousada_imagens.pousada_id
      AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  ));

CREATE INDEX idx_pousada_imagens_pousada_id ON public.pousada_imagens(pousada_id);
CREATE INDEX idx_pousadas_status ON public.pousadas(status);
CREATE INDEX idx_pousadas_owner_id ON public.pousadas(owner_id);

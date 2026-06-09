
-- ============ INVITES ============
CREATE TABLE public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  email text NOT NULL,
  role public.app_role NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  accepted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE INDEX idx_invites_token ON public.invites(token);
CREATE INDEX idx_invites_email ON public.invites(lower(email));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invites TO authenticated;
GRANT ALL ON public.invites TO service_role;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage invites" ON public.invites
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PLATFORM SETTINGS ============
CREATE TABLE public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings readable" ON public.platform_settings
  FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Admins read all settings" ON public.platform_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write settings" ON public.platform_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PLANS ============
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BRL',
  billing_period text NOT NULL DEFAULT 'monthly',
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  trial_days integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans readable" ON public.plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage plans" ON public.plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.plans (slug, name, price_cents, benefits, sort_order) VALUES
  ('gratuito', 'Gratuito', 0, '["Anúncio básico","Foto principal","Contato WhatsApp"]'::jsonb, 1),
  ('basico', 'Básico', 9700, '["Anúncio completo","Até 10 fotos","WhatsApp + Instagram","Estatísticas básicas"]'::jsonb, 2),
  ('destaque', 'Destaque', 19700, '["Tudo do Básico","Selo Destaque","Posição prioritária","Até 30 fotos","Estatísticas avançadas"]'::jsonb, 3),
  ('premium', 'Premium', 39700, '["Tudo do Destaque","Topo da categoria","Fotos ilimitadas","Suporte prioritário","Promoções exclusivas"]'::jsonb, 4);

-- ============ AUDIT LOG ============
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  before jsonb,
  after jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_created ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_resource ON public.audit_log(resource_type, resource_id);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit" ON public.audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ RPCs ============

-- create_invite: admins only, returns token
CREATE OR REPLACE FUNCTION public.create_invite(_email text, _role public.app_role, _days integer DEFAULT 7)
RETURNS TABLE(id uuid, token text, expires_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_id uuid;
  v_exp timestamptz;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem criar convites' USING ERRCODE = '42501';
  END IF;
  v_token := encode(gen_random_bytes(18), 'base64');
  v_token := replace(replace(replace(v_token, '/', '_'), '+', '-'), '=', '');
  v_exp := now() + make_interval(days => GREATEST(_days, 1));
  INSERT INTO public.invites (token, email, role, invited_by, expires_at)
  VALUES (v_token, lower(trim(_email)), _role, auth.uid(), v_exp)
  RETURNING invites.id INTO v_id;
  RETURN QUERY SELECT v_id, v_token, v_exp;
END;
$$;

-- accept_invite: any authenticated user with matching email (or open token) can accept
CREATE OR REPLACE FUNCTION public.accept_invite(_token text)
RETURNS TABLE(role public.app_role, success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv public.invites%ROWTYPE;
  v_uid uuid := auth.uid();
  v_email text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN QUERY SELECT NULL::public.app_role, false, 'Faça login primeiro'; RETURN;
  END IF;
  SELECT * INTO v_inv FROM public.invites WHERE token = _token;
  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::public.app_role, false, 'Convite inválido'; RETURN;
  END IF;
  IF v_inv.status <> 'pending' THEN
    RETURN QUERY SELECT NULL::public.app_role, false, 'Convite já foi usado ou cancelado'; RETURN;
  END IF;
  IF v_inv.expires_at < now() THEN
    UPDATE public.invites SET status = 'expired' WHERE id = v_inv.id;
    RETURN QUERY SELECT NULL::public.app_role, false, 'Convite expirado'; RETURN;
  END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  IF lower(v_email) <> v_inv.email THEN
    RETURN QUERY SELECT NULL::public.app_role, false, 'Este convite foi enviado para outro e-mail'; RETURN;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, v_inv.role)
    ON CONFLICT (user_id, role) DO NOTHING;
  UPDATE public.invites SET status = 'accepted', accepted_at = now(), accepted_by = v_uid
    WHERE id = v_inv.id;
  INSERT INTO public.audit_log (actor_id, actor_email, action, resource_type, resource_id, after)
    VALUES (v_uid, v_email, 'invite.accept', 'invite', v_inv.id::text, to_jsonb(v_inv));
  RETURN QUERY SELECT v_inv.role, true, 'Convite aceito';
END;
$$;

-- get_dashboard_kpis: admin KPIs for a period
CREATE OR REPLACE FUNCTION public.get_dashboard_kpis(_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since timestamptz := now() - make_interval(days => GREATEST(_days, 1));
  v_mrr numeric := 0;
  v_active int := 0;
  v_new int := 0;
  v_cancelled int := 0;
  v_leads int := 0;
  v_listings int := 0;
  v_events int := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  SELECT COALESCE(SUM(p.price_cents),0)::numeric / 100, COUNT(*)
    INTO v_mrr, v_active
    FROM public.subscriptions s
    LEFT JOIN public.plans p ON p.slug = s.plan
    WHERE s.status = 'active';
  SELECT COUNT(*) INTO v_new FROM public.subscriptions WHERE created_at >= v_since;
  SELECT COUNT(*) INTO v_cancelled FROM public.subscriptions WHERE status = 'cancelled' AND updated_at >= v_since;
  SELECT COUNT(*) INTO v_leads FROM public.lead_requests WHERE created_at >= v_since;
  SELECT COUNT(*) INTO v_listings FROM public.listings;
  SELECT COUNT(*) INTO v_events FROM public.listing_events WHERE created_at >= v_since;
  RETURN jsonb_build_object(
    'mrr', v_mrr, 'arr', v_mrr * 12,
    'active_subscriptions', v_active,
    'new_subscriptions', v_new,
    'cancelled', v_cancelled,
    'churn_rate', CASE WHEN v_active > 0 THEN round((v_cancelled::numeric / v_active) * 100, 2) ELSE 0 END,
    'leads', v_leads,
    'listings', v_listings,
    'events', v_events,
    'period_days', _days
  );
END;
$$;

-- Seed default platform settings
INSERT INTO public.platform_settings (key, value, is_public) VALUES
  ('institutional', '{"name":"Estação Ilha Grande","whatsapp":"","email":"","instagram":"","facebook":"","cnpj":""}'::jsonb, true),
  ('seo', '{"title":"Estação Ilha Grande","description":"O guia completo da Ilha Grande","og_image":""}'::jsonb, true),
  ('integrations', '{"google_analytics":"","google_maps":"","meta_pixel":""}'::jsonb, false)
ON CONFLICT (key) DO NOTHING;

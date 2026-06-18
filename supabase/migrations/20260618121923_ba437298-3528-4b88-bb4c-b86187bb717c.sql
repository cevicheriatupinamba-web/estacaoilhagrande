
-- SPRINT 1: AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (user_id, name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1))
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::public.app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- REVOKE de funções DEFINER
REVOKE EXECUTE ON FUNCTION public.admin_confirm_payment(uuid, numeric, text, integer, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_list_subscriptions() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_financial_kpis(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_dashboard_kpis(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_whatsapp_funnel(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_invite(text, public.app_role, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.find_user_id_by_email(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.accept_invite(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_listing_whatsapp_stats(uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_advertiser_financials() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_confirm_payment(uuid, numeric, text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_subscriptions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_financial_kpis(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_kpis(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_whatsapp_funnel(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invite(text, public.app_role, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_user_id_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_listing_whatsapp_stats(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_advertiser_financials() TO authenticated;

-- SPRINT 2: TRIAL TRIGGER
DROP TRIGGER IF EXISTS trg_auto_trial_on_listing ON public.listings;
CREATE TRIGGER trg_auto_trial_on_listing
  AFTER INSERT ON public.listings FOR EACH ROW EXECUTE FUNCTION public.auto_create_trial_subscription();

-- SPRINT 2: BACKUP
CREATE TABLE IF NOT EXISTS public.backup_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'completed',
  size_bytes bigint DEFAULT 0,
  tables_count int DEFAULT 0,
  rows_count int DEFAULT 0,
  payload jsonb,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_snapshots TO authenticated;
GRANT ALL ON public.backup_snapshots TO service_role;
ALTER TABLE public.backup_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage backups" ON public.backup_snapshots FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.create_backup_snapshot(_name text, _kind text DEFAULT 'manual')
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id uuid; v_payload jsonb := '{}'::jsonb; v_total_rows int := 0; v_tables_count int := 0;
  v_table text; v_data jsonb; v_count int;
  v_tables text[] := ARRAY['profiles','user_roles','listings','accommodations','pousadas','pousada_imagens',
    'subscriptions','subscription_payments','plans','lead_requests','listing_events','pages','page_sections',
    'page_content','blog_posts','blog_categories','platform_settings','invites','favorites',
    'activity_logs','audit_log','cms_banners','cms_menu_items'];
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  FOREACH v_table IN ARRAY v_tables LOOP
    BEGIN
      EXECUTE format('SELECT COALESCE(jsonb_agg(t),''[]''::jsonb), COUNT(*) FROM public.%I t', v_table)
        INTO v_data, v_count;
      v_payload := v_payload || jsonb_build_object(v_table, v_data);
      v_total_rows := v_total_rows + v_count;
      v_tables_count := v_tables_count + 1;
    EXCEPTION WHEN undefined_table THEN CONTINUE;
    END;
  END LOOP;
  INSERT INTO public.backup_snapshots(name, kind, status, size_bytes, tables_count, rows_count, payload, created_by)
  VALUES (_name, _kind, 'completed', length(v_payload::text), v_tables_count, v_total_rows, v_payload, auth.uid())
  RETURNING id INTO v_id;
  RETURN v_id;
END; $$;
REVOKE EXECUTE ON FUNCTION public.create_backup_snapshot(text, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.create_backup_snapshot(text, text) TO authenticated;

-- SPRINT 3: CMS BANNERS + MENU
CREATE TABLE IF NOT EXISTS public.cms_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  cta_label text,
  position text NOT NULL DEFAULT 'home_hero',
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_banners TO authenticated;
GRANT ALL ON public.cms_banners TO service_role;
ALTER TABLE public.cms_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active banners" ON public.cms_banners FOR SELECT
  USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage banners" ON public.cms_banners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_banners_updated_at BEFORE UPDATE ON public.cms_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.cms_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL DEFAULT 'header',
  label text NOT NULL,
  url text NOT NULL,
  parent_id uuid REFERENCES public.cms_menu_items(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  open_in_new_tab boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_menu_items TO authenticated;
GRANT ALL ON public.cms_menu_items TO service_role;
ALTER TABLE public.cms_menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active menu items" ON public.cms_menu_items FOR SELECT
  USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage menu items" ON public.cms_menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_menu_items_updated_at BEFORE UPDATE ON public.cms_menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

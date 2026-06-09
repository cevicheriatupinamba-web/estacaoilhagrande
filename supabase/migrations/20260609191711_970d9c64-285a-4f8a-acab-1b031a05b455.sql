
-- 1) Extend plans table with commercial fields
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS photo_limit int NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS video_limit int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured_in_search boolean NOT NULL DEFAULT false;

-- 2) Align canonical plan pricing & metadata
UPDATE public.plans SET price_cents = 0,     trial_days = 0, photo_limit = 1,         video_limit = 0,  featured_in_search = false, badge = NULL,         description = 'Anúncio básico para começar a aparecer na Estação Ilha Grande.' WHERE slug = 'gratuito';
UPDATE public.plans SET price_cents = 9700,  trial_days = 7, photo_limit = 10,        video_limit = 0,  featured_in_search = false, badge = 'Básico',     description = 'Ideal para pequenos negócios começarem a vender pelo WhatsApp.' WHERE slug = 'basico';
UPDATE public.plans SET price_cents = 19700, trial_days = 7, photo_limit = 30,        video_limit = 2,  featured_in_search = true,  badge = 'Destaque',   description = 'Posição prioritária nas categorias com mais fotos e vídeos.' WHERE slug = 'destaque';
UPDATE public.plans SET price_cents = 29700, trial_days = 7, photo_limit = 999,       video_limit = 10, featured_in_search = true,  badge = 'Premium',    description = 'Topo da categoria, fotos ilimitadas e atendimento prioritário.' WHERE slug = 'premium';

-- 3) Insert 'Básico' plan if missing (some older seeds skipped it)
INSERT INTO public.plans (slug, name, price_cents, currency, billing_period, benefits, trial_days, active, sort_order, photo_limit, video_limit, featured_in_search, badge, description)
SELECT 'basico','Básico',9700,'BRL','monthly','["Anúncio completo","Até 10 fotos","WhatsApp + Instagram","Estatísticas básicas"]'::jsonb,7,true,2,10,0,false,'Básico','Ideal para pequenos negócios começarem a vender pelo WhatsApp.'
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE slug='basico');

-- 4) Extend subscriptions
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS auto_renew boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS trial_end timestamptz,
  ADD COLUMN IF NOT EXISTS sequence_number bigserial;

-- 5) Extend subscription_payments
ALTER TABLE public.subscription_payments
  ADD COLUMN IF NOT EXISTS invoice_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS due_date timestamptz;

-- 6) Sequential invoice numbers EIG-YYYY-000001
CREATE SEQUENCE IF NOT EXISTS public.invoice_seq;

CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := 'EIG-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.invoice_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_set_invoice_number ON public.subscription_payments;
CREATE TRIGGER trg_set_invoice_number
  BEFORE INSERT ON public.subscription_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

-- 7) Auto-create trial subscription on new listing
CREATE OR REPLACE FUNCTION public.auto_create_trial_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_slug text;
  v_price_cents int;
  v_trial_days int;
  v_now timestamptz := now();
BEGIN
  -- Skip if listing already has an active subscription
  IF EXISTS (SELECT 1 FROM public.subscriptions WHERE listing_id = NEW.id AND status IN ('active','pending','trial')) THEN
    RETURN NEW;
  END IF;

  -- Default to básico plan with 7-day trial
  SELECT slug, price_cents, GREATEST(trial_days, 7)
    INTO v_plan_slug, v_price_cents, v_trial_days
  FROM public.plans
  WHERE slug = 'basico' AND active = true
  LIMIT 1;

  IF v_plan_slug IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.subscriptions(
    listing_id, owner_id, plan, status, monthly_amount, billing_cycle,
    started_at, current_period_start, current_period_end, trial_end, auto_renew, notes
  ) VALUES (
    NEW.id, NEW.owner_id, v_plan_slug::listing_plan, 'active',
    v_price_cents::numeric / 100, 'monthly',
    v_now, v_now, v_now + make_interval(days => v_trial_days),
    v_now + make_interval(days => v_trial_days), true,
    'Período de teste gratuito de ' || v_trial_days || ' dias.'
  );

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_auto_trial_sub ON public.listings;
CREATE TRIGGER trg_auto_trial_sub
  AFTER INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_trial_subscription();

-- 8) RPC: confirm a manual payment (admin only)
CREATE OR REPLACE FUNCTION public.admin_confirm_payment(
  _subscription_id uuid,
  _amount numeric,
  _method text DEFAULT 'manual',
  _months int DEFAULT 1,
  _notes text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sub public.subscriptions%ROWTYPE;
  v_new_end timestamptz;
  v_payment_id uuid;
  v_invoice text;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE='42501';
  END IF;

  SELECT * INTO v_sub FROM public.subscriptions WHERE id = _subscription_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'subscription not found' USING ERRCODE='P0002'; END IF;

  v_new_end := GREATEST(COALESCE(v_sub.current_period_end, now()), now()) + make_interval(months => GREATEST(_months,1));

  INSERT INTO public.subscription_payments(
    subscription_id, amount, payment_method, status, paid_at,
    period_start, period_end, notes
  ) VALUES (
    _subscription_id, _amount, _method, 'paid', now(),
    GREATEST(COALESCE(v_sub.current_period_end, now()), now()),
    v_new_end, _notes
  )
  RETURNING id, invoice_number INTO v_payment_id, v_invoice;

  UPDATE public.subscriptions
     SET status = 'active',
         current_period_start = GREATEST(COALESCE(current_period_end, now()), now()),
         current_period_end = v_new_end,
         trial_end = NULL,
         updated_at = now()
   WHERE id = _subscription_id;

  RETURN jsonb_build_object(
    'payment_id', v_payment_id,
    'invoice_number', v_invoice,
    'new_period_end', v_new_end
  );
END $$;

-- 9) RPC: advertiser financials (self)
CREATE OR REPLACE FUNCTION public.get_advertiser_financials()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_subs jsonb;
  v_payments jsonb;
  v_total_paid numeric;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'auth required' USING ERRCODE='42501'; END IF;

  SELECT COALESCE(jsonb_agg(row), '[]'::jsonb) INTO v_subs FROM (
    SELECT s.id, s.listing_id, l.name AS listing_name, s.plan::text AS plan, s.status,
           s.monthly_amount, s.billing_cycle, s.started_at,
           s.current_period_start, s.current_period_end, s.trial_end, s.auto_renew,
           GREATEST(0, EXTRACT(DAY FROM (COALESCE(s.current_period_end, now()) - now()))::int) AS days_remaining
      FROM public.subscriptions s
      LEFT JOIN public.listings l ON l.id = s.listing_id
     WHERE s.owner_id = v_uid
     ORDER BY s.created_at DESC
  ) row;

  SELECT COALESCE(jsonb_agg(row), '[]'::jsonb) INTO v_payments FROM (
    SELECT p.id, p.subscription_id, p.invoice_number, p.amount, p.payment_method,
           p.status, p.paid_at, p.due_date, p.period_start, p.period_end, p.created_at
      FROM public.subscription_payments p
      JOIN public.subscriptions s ON s.id = p.subscription_id
     WHERE s.owner_id = v_uid
     ORDER BY p.created_at DESC
     LIMIT 100
  ) row;

  SELECT COALESCE(SUM(p.amount),0) INTO v_total_paid
    FROM public.subscription_payments p
    JOIN public.subscriptions s ON s.id = p.subscription_id
   WHERE s.owner_id = v_uid AND p.status = 'paid';

  RETURN jsonb_build_object(
    'subscriptions', v_subs,
    'payments', v_payments,
    'total_paid', v_total_paid
  );
END $$;

-- 10) RPC: admin financial KPIs (richer than get_dashboard_kpis)
CREATE OR REPLACE FUNCTION public.get_financial_kpis(_days int DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since timestamptz := now() - make_interval(days => GREATEST(_days,1));
  v_mrr numeric := 0;
  v_active int := 0;
  v_trial int := 0;
  v_expired int := 0;
  v_overdue int := 0;
  v_revenue_period numeric := 0;
  v_total_revenue numeric := 0;
  v_by_plan jsonb;
  v_series jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE='42501';
  END IF;

  SELECT COALESCE(SUM(monthly_amount),0), COUNT(*)
    INTO v_mrr, v_active
    FROM public.subscriptions
   WHERE status = 'active' AND (current_period_end IS NULL OR current_period_end > now());

  SELECT COUNT(*) INTO v_trial   FROM public.subscriptions WHERE status='active' AND trial_end IS NOT NULL AND trial_end > now();
  SELECT COUNT(*) INTO v_expired FROM public.subscriptions WHERE current_period_end IS NOT NULL AND current_period_end < now();
  SELECT COUNT(*) INTO v_overdue FROM public.subscription_payments WHERE status='pending' AND due_date IS NOT NULL AND due_date < now();

  SELECT COALESCE(SUM(amount),0) INTO v_revenue_period FROM public.subscription_payments WHERE status='paid' AND paid_at >= v_since;
  SELECT COALESCE(SUM(amount),0) INTO v_total_revenue  FROM public.subscription_payments WHERE status='paid';

  SELECT COALESCE(jsonb_agg(row), '[]'::jsonb) INTO v_by_plan FROM (
    SELECT s.plan::text AS plan,
           COUNT(*) FILTER (WHERE s.status='active') AS active_count,
           COALESCE(SUM(s.monthly_amount) FILTER (WHERE s.status='active'),0) AS mrr
      FROM public.subscriptions s
     GROUP BY s.plan
     ORDER BY mrr DESC
  ) row;

  -- Daily revenue series
  SELECT COALESCE(jsonb_agg(row ORDER BY (row->>'date') ASC), '[]'::jsonb) INTO v_series FROM (
    SELECT to_char(date_trunc('day', paid_at), 'YYYY-MM-DD') AS date,
           SUM(amount) AS revenue
      FROM public.subscription_payments
     WHERE status='paid' AND paid_at >= v_since
     GROUP BY 1
  ) row;

  RETURN jsonb_build_object(
    'mrr', v_mrr,
    'arr', v_mrr * 12,
    'active', v_active,
    'in_trial', v_trial,
    'expired', v_expired,
    'overdue', v_overdue,
    'revenue_period', v_revenue_period,
    'total_revenue', v_total_revenue,
    'by_plan', v_by_plan,
    'series', v_series,
    'period_days', _days
  );
END $$;

-- 11) RPC: list all subscriptions for admin
CREATE OR REPLACE FUNCTION public.admin_list_subscriptions()
RETURNS TABLE(
  id uuid, listing_id uuid, listing_name text,
  owner_id uuid, owner_email text, owner_name text,
  plan text, status text, monthly_amount numeric, billing_cycle text,
  started_at timestamptz, current_period_start timestamptz, current_period_end timestamptz,
  trial_end timestamptz, auto_renew boolean, days_remaining int,
  last_payment_at timestamptz, total_paid numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id, s.listing_id, l.name AS listing_name,
    s.owner_id, u.email::text AS owner_email,
    COALESCE(p.name, split_part(u.email,'@',1)) AS owner_name,
    s.plan::text, s.status, s.monthly_amount, s.billing_cycle,
    s.started_at, s.current_period_start, s.current_period_end,
    s.trial_end, s.auto_renew,
    GREATEST(0, EXTRACT(DAY FROM (COALESCE(s.current_period_end, now()) - now()))::int) AS days_remaining,
    (SELECT MAX(paid_at) FROM public.subscription_payments WHERE subscription_id = s.id AND status='paid') AS last_payment_at,
    COALESCE((SELECT SUM(amount) FROM public.subscription_payments WHERE subscription_id = s.id AND status='paid'),0) AS total_paid
  FROM public.subscriptions s
  LEFT JOIN public.listings l ON l.id = s.listing_id
  LEFT JOIN auth.users u ON u.id = s.owner_id
  LEFT JOIN public.profiles p ON p.user_id = s.owner_id
  WHERE public.has_role(auth.uid(),'admin')
  ORDER BY s.created_at DESC
$$;

-- 12) Restrict admin RPC access to authenticated
REVOKE EXECUTE ON FUNCTION public.admin_confirm_payment(uuid, numeric, text, int, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_financial_kpis(int) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_list_subscriptions() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_advertiser_financials() FROM anon, public;

GRANT EXECUTE ON FUNCTION public.admin_confirm_payment(uuid, numeric, text, int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_financial_kpis(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_subscriptions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_advertiser_financials() TO authenticated;

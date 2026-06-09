
-- 1) Add advertiser role (safe if not yet present)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'advertiser';

-- 2) Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  plan public.listing_plan NOT NULL DEFAULT 'gratuito',
  status text NOT NULL DEFAULT 'active',
  monthly_amount numeric(10,2),
  annual_amount numeric(10,2),
  billing_cycle text NOT NULL DEFAULT 'monthly',
  started_at timestamptz NOT NULL DEFAULT now(),
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner reads own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS subscriptions_owner_idx ON public.subscriptions(owner_id);
CREATE INDEX IF NOT EXISTS subscriptions_listing_idx ON public.subscriptions(listing_id);

-- 3) Subscription payments
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  payment_method text,
  status text NOT NULL DEFAULT 'paid',
  paid_at timestamptz,
  period_start timestamptz,
  period_end timestamptz,
  reference text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscription_payments TO authenticated;
GRANT ALL ON public.subscription_payments TO service_role;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner reads own payments" ON public.subscription_payments
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.id = subscription_id AND s.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage payments" ON public.subscription_payments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS subscription_payments_sub_idx ON public.subscription_payments(subscription_id, paid_at DESC);

-- 4) Listing events (analytics)
CREATE TABLE IF NOT EXISTS public.listing_events (
  id bigserial PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  session_id text,
  user_id uuid,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.listing_events TO anon, authenticated;
GRANT SELECT ON public.listing_events TO authenticated;
GRANT ALL ON public.listing_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.listing_events_id_seq TO anon, authenticated;
ALTER TABLE public.listing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log listing events" ON public.listing_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Owner and admin read events" ON public.listing_events
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id AND l.owner_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS listing_events_listing_time_idx
  ON public.listing_events(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS listing_events_listing_type_time_idx
  ON public.listing_events(listing_id, event_type, created_at DESC);

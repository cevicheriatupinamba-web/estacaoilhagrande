
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS whatsapp_message text;

ALTER TABLE public.listing_events ADD COLUMN IF NOT EXISTS device text;
ALTER TABLE public.listing_events ADD COLUMN IF NOT EXISTS category text;

CREATE OR REPLACE FUNCTION public.set_listing_event_category()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.category IS NULL AND NEW.listing_id IS NOT NULL THEN
    SELECT category::text INTO NEW.category FROM public.listings WHERE id = NEW.listing_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_listing_event_category ON public.listing_events;
CREATE TRIGGER trg_set_listing_event_category
  BEFORE INSERT ON public.listing_events
  FOR EACH ROW EXECUTE FUNCTION public.set_listing_event_category();

CREATE INDEX IF NOT EXISTS idx_listing_events_category_type ON public.listing_events(category, event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_listing_events_device ON public.listing_events(device);

UPDATE public.listing_events e
   SET category = l.category::text
  FROM public.listings l
 WHERE e.listing_id = l.id AND e.category IS NULL;

INSERT INTO public.platform_settings (key, value, is_public)
VALUES
  ('agency_whatsapp', to_jsonb('5521996704427'::text), true),
  ('agency_message',  to_jsonb('Olá! Vim pela Estação Ilha Grande e quero falar com a Agência Oficial.'::text), true)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_listing_whatsapp_stats(_listing_id uuid, _days integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_owner uuid;
  v_category text;
  v_since timestamptz := now() - make_interval(days => GREATEST(_days, 1));
  v_views int := 0;
  v_clicks int := 0;
  v_rank int := 0;
  v_total int := 0;
BEGIN
  SELECT owner_id, category::text INTO v_owner, v_category FROM public.listings WHERE id = _listing_id;
  IF v_owner IS NULL THEN RAISE EXCEPTION 'listing not found' USING ERRCODE='P0002'; END IF;
  IF auth.uid() <> v_owner AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE='42501';
  END IF;
  SELECT COUNT(*) INTO v_views  FROM public.listing_events WHERE listing_id=_listing_id AND event_type='view'     AND created_at >= v_since;
  SELECT COUNT(*) INTO v_clicks FROM public.listing_events WHERE listing_id=_listing_id AND event_type='whatsapp' AND created_at >= v_since;
  WITH ranked AS (
    SELECT listing_id, COUNT(*) AS c FROM public.listing_events
     WHERE event_type='whatsapp' AND created_at >= v_since AND category = v_category
     GROUP BY listing_id
  ), with_rank AS (
    SELECT listing_id, c, RANK() OVER (ORDER BY c DESC) AS rnk FROM ranked
  )
  SELECT COALESCE(rnk,0), (SELECT COUNT(*) FROM ranked) INTO v_rank, v_total
    FROM with_rank WHERE listing_id = _listing_id;
  RETURN jsonb_build_object(
    'views', v_views, 'whatsapp_clicks', v_clicks,
    'conversion_rate', CASE WHEN v_views>0 THEN round((v_clicks::numeric/v_views)*100,2) ELSE 0 END,
    'category', v_category, 'category_rank', COALESCE(v_rank,0), 'category_size', COALESCE(v_total,0),
    'period_days', _days
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_whatsapp_funnel(_days integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_since timestamptz := now() - make_interval(days => GREATEST(_days, 1));
  v_top_advertisers jsonb;
  v_top_categories jsonb;
  v_by_device jsonb;
  v_totals jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  SELECT COALESCE(jsonb_agg(row), '[]'::jsonb) INTO v_top_advertisers FROM (
    SELECT l.id, l.name, l.category::text AS category, l.plan::text AS plan,
           COUNT(e.*) FILTER (WHERE e.event_type='whatsapp') AS clicks,
           COUNT(e.*) FILTER (WHERE e.event_type='view')     AS views
      FROM public.listings l
      JOIN public.listing_events e ON e.listing_id = l.id AND e.created_at >= v_since
     GROUP BY l.id, l.name, l.category, l.plan
    HAVING COUNT(e.*) FILTER (WHERE e.event_type='whatsapp') > 0
     ORDER BY clicks DESC LIMIT 10
  ) row;
  SELECT COALESCE(jsonb_agg(row), '[]'::jsonb) INTO v_top_categories FROM (
    SELECT COALESCE(category,'(sem categoria)') AS category,
           COUNT(*) FILTER (WHERE event_type='whatsapp') AS clicks,
           COUNT(*) FILTER (WHERE event_type='view')     AS views
      FROM public.listing_events WHERE created_at >= v_since
     GROUP BY 1 ORDER BY clicks DESC
  ) row;
  SELECT COALESCE(jsonb_agg(row), '[]'::jsonb) INTO v_by_device FROM (
    SELECT COALESCE(device,'desconhecido') AS device,
           COUNT(*) FILTER (WHERE event_type='whatsapp') AS clicks
      FROM public.listing_events WHERE created_at >= v_since
     GROUP BY 1 ORDER BY clicks DESC
  ) row;
  SELECT jsonb_build_object(
    'views',  COUNT(*) FILTER (WHERE event_type='view'),
    'clicks', COUNT(*) FILTER (WHERE event_type='whatsapp'),
    'leads',  (SELECT COUNT(*) FROM public.lead_requests WHERE created_at >= v_since)
  ) INTO v_totals FROM public.listing_events WHERE created_at >= v_since;
  RETURN jsonb_build_object(
    'totals', v_totals, 'top_advertisers', v_top_advertisers,
    'top_categories', v_top_categories, 'by_device', v_by_device,
    'period_days', _days
  );
END;
$$;

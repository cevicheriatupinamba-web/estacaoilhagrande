CREATE TABLE public.lead_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  source TEXT DEFAULT 'anuncie',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.lead_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.lead_requests TO authenticated;
GRANT ALL ON public.lead_requests TO service_role;

ALTER TABLE public.lead_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead" ON public.lead_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.lead_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads" ON public.lead_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads" ON public.lead_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lead_requests_updated_at
  BEFORE UPDATE ON public.lead_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
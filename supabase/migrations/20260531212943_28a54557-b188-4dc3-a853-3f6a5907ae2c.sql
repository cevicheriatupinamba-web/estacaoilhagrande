-- Block owners from modifying moderation/billing columns via a trigger.
-- Admins (has_role(..., 'admin')) and service_role keep full control.

CREATE OR REPLACE FUNCTION public.prevent_owner_privileged_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role and admins to change anything
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- For everyone else (owners), forbid changes to protected columns
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Not allowed to modify status' USING ERRCODE = '42501';
  END IF;
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    RAISE EXCEPTION 'Not allowed to modify plan' USING ERRCODE = '42501';
  END IF;
  IF NEW.featured IS DISTINCT FROM OLD.featured THEN
    RAISE EXCEPTION 'Not allowed to modify featured' USING ERRCODE = '42501';
  END IF;
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'Not allowed to change owner' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_owner_privileged_updates ON public.listings;
CREATE TRIGGER trg_prevent_owner_privileged_updates
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.prevent_owner_privileged_updates();

-- Tighten the owner UPDATE policy with an explicit WITH CHECK that re-asserts ownership
DROP POLICY IF EXISTS "Owners update own listings" ON public.listings;
CREATE POLICY "Owners update own listings"
ON public.listings
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);
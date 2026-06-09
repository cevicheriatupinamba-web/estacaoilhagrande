CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.create_invite(_email text, _role app_role, _days integer DEFAULT 7)
 RETURNS TABLE(id uuid, token text, expires_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_token text;
  v_id uuid;
  v_exp timestamptz;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem criar convites' USING ERRCODE = '42501';
  END IF;
  v_token := encode(extensions.gen_random_bytes(18), 'hex');
  v_exp := now() + make_interval(days => GREATEST(_days, 1));
  INSERT INTO public.invites (token, email, role, invited_by, expires_at)
  VALUES (v_token, lower(trim(_email)), _role, auth.uid(), v_exp)
  RETURNING invites.id INTO v_id;
  RETURN QUERY SELECT v_id, v_token, v_exp;
END;
$function$;
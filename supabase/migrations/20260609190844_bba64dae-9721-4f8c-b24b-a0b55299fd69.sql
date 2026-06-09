
REVOKE EXECUTE ON FUNCTION public.get_dashboard_kpis(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_whatsapp_funnel(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_invite(text, public.app_role, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.find_user_id_by_email(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM anon, public;

GRANT EXECUTE ON FUNCTION public.get_dashboard_kpis(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_whatsapp_funnel(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invite(text, public.app_role, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_user_id_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO authenticated;

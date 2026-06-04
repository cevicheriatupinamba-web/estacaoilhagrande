DROP TRIGGER IF EXISTS prevent_owner_pousada_status_change_trg ON public.pousadas;
CREATE TRIGGER prevent_owner_pousada_status_change_trg
BEFORE UPDATE ON public.pousadas
FOR EACH ROW EXECUTE FUNCTION public.prevent_owner_pousada_status_change();
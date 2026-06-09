import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ROLE_LABEL, AppRole } from "@/lib/admin/permissions";
import { ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import SEO from "@/components/SEO";

export default function InviteAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<"idle" | "validating" | "loading-invite" | "accepting" | "done" | "error">("loading-invite");
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState<{ email: string; role: AppRole; expires_at: string } | null>(null);
  const [acceptedRole, setAcceptedRole] = useState<AppRole | null>(null);

  // Fetch invite metadata (public via RLS? No — table is admin-only; so we use RPC-less peek via accept_invite dry-run is not safe).
  // Instead, we just attempt accept once logged in. Before login, show generic invite landing.
  useEffect(() => {
    // Try to look up invite info via a lightweight read (will only work for admins; for others we just skip).
    supabase.from("invites").select("email, role, expires_at, status").eq("token", token!).maybeSingle()
      .then(({ data }) => {
        if (data) setInfo({ email: data.email, role: data.role as AppRole, expires_at: data.expires_at });
        setState("idle");
      });
  }, [token]);

  async function accept() {
    if (!user) {
      navigate(`/login?redirect=/invite/${token}`);
      return;
    }
    setState("accepting");
    const { data, error } = await supabase.rpc("accept_invite", { _token: token! });
    if (error) {
      setState("error");
      setMessage(error.message);
      return;
    }
    const row = (data as any[])?.[0];
    if (row?.success) {
      setAcceptedRole(row.role as AppRole);
      setState("done");
      // Refresh roles in AuthContext
      setTimeout(() => {
        const r = row.role as AppRole;
        if (["super_admin", "admin", "financial_manager", "content_manager", "support_agent"].includes(r))
          navigate("/admin");
        else if (r === "advertiser") navigate("/dashboard");
        else navigate("/minha-conta");
      }, 1500);
    } else {
      setState("error");
      setMessage(row?.message || "Não foi possível aceitar o convite");
    }
  }

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 grid place-items-center px-5 py-16">
      <SEO title="Aceitar convite · Estação Ilha Grande" description="Aceite seu convite" path={`/invite/${token}`} noIndex />
      <div className="w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 grid place-items-center mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl">Convite Estação Ilha Grande</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Você foi convidado(a) para integrar a plataforma.
          </p>
        </div>

        {info && (
          <div className="rounded-xl bg-muted/40 border border-border p-4 mb-6 text-sm space-y-1">
            <div><span className="text-muted-foreground">E-mail:</span> <span className="font-semibold">{info.email}</span></div>
            <div><span className="text-muted-foreground">Papel:</span> <span className="font-semibold">{ROLE_LABEL[info.role]}</span></div>
            <div><span className="text-muted-foreground">Expira:</span> {new Date(info.expires_at).toLocaleDateString("pt-BR")}</div>
          </div>
        )}

        {state === "done" && (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold">Convite aceito!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Acesso de <strong>{acceptedRole && ROLE_LABEL[acceptedRole]}</strong> aplicado. Redirecionando…
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="text-center py-4">
            <XCircle className="w-12 h-12 mx-auto text-rose-500 mb-2" />
            <p className="font-semibold">Não foi possível aceitar</p>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        )}

        {state === "accepting" && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Aplicando convite…</p>
          </div>
        )}

        {(state === "idle" || state === "loading-invite") && (
          <div className="space-y-3">
            {!user ? (
              <>
                <Button className="w-full" onClick={() => navigate(`/login?redirect=/invite/${token}`)}>
                  Entrar para aceitar
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate(`/cadastro?redirect=/invite/${token}`)}>
                  Criar conta
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Use o mesmo e-mail do convite ({info?.email ?? "indicado pelo admin"}).
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-center text-muted-foreground mb-2">
                  Logado como <strong>{user.email}</strong>
                </p>
                <Button className="w-full" onClick={accept}>Aceitar convite</Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

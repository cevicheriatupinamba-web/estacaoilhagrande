import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PLAN_LABEL } from "@/lib/listings-api";
import { PLAN_PRICE } from "@/lib/advertiser/api";
import { Button } from "@/components/ui/button";
import {
  CreditCard, CheckCircle2, Clock, AlertCircle, Crown, MessageCircle, Sparkles, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_META: Record<string, { label: string; icon: any; cls: string }> = {
  active:    { label: "Ativa",     icon: CheckCircle2, cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  pending:   { label: "Pendente",  icon: Clock,        cls: "bg-amber-100 text-amber-800 border-amber-300" },
  suspended: { label: "Suspensa",  icon: AlertCircle,  cls: "bg-orange-100 text-orange-800 border-orange-300" },
  cancelled: { label: "Cancelada", icon: AlertCircle,  cls: "bg-rose-100 text-rose-800 border-rose-300" },
  expired:   { label: "Expirada",  icon: AlertCircle,  cls: "bg-rose-100 text-rose-800 border-rose-300" },
};

const PLAN_BENEFITS: Record<string, string[]> = {
  gratuito: ["Página da empresa", "1 foto", "Contato por WhatsApp", "SEO básico"],
  destaque: ["Tudo do Gratuito", "Galeria com 5 fotos", "Destaque nas categorias", "Selo Verificado", "Melhor posicionamento"],
  premium:  ["Tudo do Destaque", "Galeria ilimitada + vídeos", "Pin Premium no mapa", "Prioridade máxima na busca", "Selo Premium", "Suporte prioritário"],
};

function fmtBRL(n: number | null | undefined) {
  if (n == null) return "—";
  return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function daysUntil(iso: string | null | undefined) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

const WHATSAPP_SUPPORT = "5521996704427"; // Estação Ilha Grande — agência oficial

export default function MinhaAssinatura() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subs, setSubs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      const [{ data: s }, { data: l }] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
        supabase.from("listings").select("id,name").eq("owner_id", user.id),
      ]);
      setSubs(s || []);
      setListings(l || []);
      if (s && s.length) {
        const { data: p } = await supabase
          .from("subscription_payments")
          .select("*")
          .in("subscription_id", s.map(x => x.id))
          .order("paid_at", { ascending: false })
          .limit(50);
        setPayments(p || []);
      }
      setLoading(false);
    })();
  }, [user]);

  if (!user) return <Navigate to="/login?next=/minha-assinatura" replace />;

  const primary = subs.find(s => s.status === "active") ?? subs[0];
  const renewalDays = primary ? daysUntil(primary.current_period_end) : null;
  const meta = primary ? STATUS_META[primary.status] ?? STATUS_META.active : STATUS_META.active;
  const StatusIcon = meta.icon;
  const listingName = primary ? (listings.find(l => l.id === primary.listing_id)?.name ?? "") : "";

  const supportMsg = encodeURIComponent(
    `Olá! Sou ${user.email} e gostaria de falar sobre minha assinatura${listingName ? ` do anúncio "${listingName}"` : ""}.`
  );
  const supportLink = `https://wa.me/${WHATSAPP_SUPPORT}?text=${supportMsg}`;

  if (loading) return <p className="text-muted-foreground">Carregando…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl">Minha assinatura</h1>
        <p className="text-muted-foreground text-sm">Controle seu plano, status e histórico financeiro.</p>
      </div>

      {!primary ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <CreditCard className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-lg">Nenhuma assinatura ativa ainda.</p>
          <p className="text-muted-foreground text-sm mb-6">
            Assim que a equipe da Estação Ilha Grande configurar seu plano, ele aparece aqui.
          </p>
          <Button asChild variant="hero">
            <a href={supportLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-1" /> Falar com a equipe
            </a>
          </Button>
        </div>
      ) : (
        <>
          {/* Status card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 md:p-8 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-300/80 font-bold mb-1">Plano atual</div>
                <h2 className="font-display font-bold text-3xl flex items-center gap-2">
                  {PLAN_LABEL[primary.plan as keyof typeof PLAN_LABEL]}
                  {primary.plan === "premium" && <Crown className="w-6 h-6 text-amber-400" />}
                  {primary.plan === "destaque" && <Star className="w-6 h-6 text-emerald-400" />}
                </h2>
                <div className="mt-2">
                  <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase", meta.cls)}>
                    <StatusIcon className="w-3.5 h-3.5" /> {meta.label}
                  </span>
                </div>
                {listingName && <p className="text-sm text-slate-300 mt-3">Anúncio: <span className="font-semibold text-white">{listingName}</span></p>}
              </div>
              <div className="text-right">
                <div className="text-xs uppercase text-amber-300/70 tracking-wider font-bold">Valor {primary.billing_cycle === "annual" ? "anual" : "mensal"}</div>
                <div className="text-3xl font-display font-bold">
                  {fmtBRL(primary.billing_cycle === "annual" ? primary.annual_amount : primary.monthly_amount)}
                </div>
                {primary.current_period_end && (
                  <div className="text-xs text-slate-300 mt-2">
                    Renovação em <span className={cn(
                      "font-semibold",
                      renewalDays !== null && renewalDays <= 7 ? "text-rose-300" :
                      renewalDays !== null && renewalDays <= 15 ? "text-amber-300" : "text-white"
                    )}>
                      {renewalDays !== null && renewalDays >= 0
                        ? `${renewalDays} dia${renewalDays === 1 ? "" : "s"}`
                        : "atrasada"}
                    </span>
                    <div className="text-[11px] text-slate-400">{fmtDate(primary.current_period_end)}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              <Info label="Contratado em" value={fmtDate(primary.started_at)} />
              <Info label="Ciclo" value={primary.billing_cycle === "annual" ? "Anual" : "Mensal"} />
              <Info label="Início do período" value={fmtDate(primary.current_period_start)} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild variant="outline" className="border-amber-300/40 text-amber-100 bg-amber-300/10 hover:bg-amber-300/20 hover:text-white">
                <a href={supportLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-1" /> Renovar / mudar plano
                </a>
              </Button>
              <Button asChild variant="outline" className="border-amber-300/40 text-amber-100 bg-amber-300/10 hover:bg-amber-300/20 hover:text-white">
                <Link to="/financeiro/faturas">Ver todas as faturas</Link>
              </Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-display font-bold">Benefícios incluídos</h3>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {(PLAN_BENEFITS[primary.plan] || []).map(b => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Plans grid */}
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <h3 className="font-display font-bold mb-4">Planos disponíveis</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {(["gratuito", "destaque", "premium"] as const).map(p => {
                const price = PLAN_PRICE[p];
                const isCurrent = primary.plan === p;
                return (
                  <div key={p} className={cn(
                    "rounded-2xl border p-5 flex flex-col",
                    isCurrent ? "border-amber-400 bg-amber-50/40" : "border-border bg-muted/30",
                    p === "destaque" && !isCurrent && "ring-1 ring-emerald-300"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-lg">{PLAN_LABEL[p]}</span>
                      {p === "destaque" && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">Melhor custo</span>}
                      {p === "premium" && <Crown className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div className="text-2xl font-display font-bold">
                      {price.monthly > 0 ? `${fmtBRL(price.monthly)}` : "Grátis"}
                      {price.monthly > 0 && <span className="text-sm text-muted-foreground font-normal">/mês</span>}
                    </div>
                    {price.annual > 0 && (
                      <div className="text-xs text-emerald-700 mt-1">
                        ou {fmtBRL(price.annual)}/ano · economize {fmtBRL(price.monthly * 12 - price.annual)}
                      </div>
                    )}
                    <ul className="mt-4 space-y-1.5 text-xs text-foreground/80 flex-1">
                      {(PLAN_BENEFITS[p] || []).slice(0, 4).map(b => (
                        <li key={b} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> {b}
                        </li>
                      ))}
                    </ul>
                    <Button asChild size="sm" className="mt-4" variant={isCurrent ? "outline" : "hero"} disabled={isCurrent}>
                      {isCurrent
                        ? <span>Plano atual</span>
                        : <a href={supportLink} target="_blank" rel="noopener noreferrer">Falar com a equipe</a>}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payments */}
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <h3 className="font-display font-bold mb-4">Histórico financeiro</h3>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum pagamento registrado ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-muted-foreground border-b">
                      <th className="py-2 pr-3">Data</th>
                      <th className="py-2 pr-3">Valor</th>
                      <th className="py-2 pr-3">Método</th>
                      <th className="py-2 pr-3">Período</th>
                      <th className="py-2 pr-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-2 pr-3">{fmtDate(p.paid_at || p.created_at)}</td>
                        <td className="py-2 pr-3 font-semibold tabular-nums">{fmtBRL(p.amount)}</td>
                        <td className="py-2 pr-3">{p.payment_method || "—"}</td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground">
                          {p.period_start && p.period_end
                            ? `${fmtDate(p.period_start)} → ${fmtDate(p.period_end)}`
                            : "—"}
                        </td>
                        <td className="py-2 pr-3">
                          <span className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                            p.status === "paid" && "bg-emerald-100 text-emerald-800",
                            p.status === "pending" && "bg-amber-100 text-amber-800",
                            (p.status === "refunded" || p.status === "cancelled") && "bg-rose-100 text-rose-800",
                          )}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-amber-300/70 font-bold">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}

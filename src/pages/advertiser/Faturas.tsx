import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Receipt, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENCY_WHATSAPP_DEFAULT } from "@/lib/whatsapp";

const STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  paid:      { label: "Paga",      cls: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  pending:   { label: "Pendente",  cls: "bg-amber-100 text-amber-800",     icon: Clock },
  overdue:   { label: "Vencida",   cls: "bg-rose-100 text-rose-800",       icon: XCircle },
  cancelled: { label: "Cancelada", cls: "bg-slate-200 text-slate-700",     icon: XCircle },
  refunded:  { label: "Reembolso", cls: "bg-violet-100 text-violet-800",   icon: XCircle },
};

function fmtBRL(n: number | null | undefined) {
  return Number(n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR");
}

export default function Faturas() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.rpc("get_advertiser_financials" as any);
      const d = (data as any) ?? {};
      setPayments(d.payments ?? []);
      setSubscriptions(d.subscriptions ?? []);
      setLoading(false);
    })();
  }, [user]);

  if (!user) return <Navigate to="/login?next=/financeiro/faturas" replace />;

  const subById: Record<string, any> = Object.fromEntries((subscriptions ?? []).map(s => [s.id, s]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="font-display font-bold text-3xl">Faturas</h1>
          <p className="text-muted-foreground text-sm">Histórico financeiro completo da sua conta.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <Link to="/financeiro"><ArrowLeft className="w-4 h-4 mr-1" /> Voltar</Link>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1" /> Imprimir / PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando…</p>
      ) : payments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <Receipt className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-lg">Nenhuma fatura emitida ainda.</p>
          <p className="text-muted-foreground text-sm mb-4">
            Ao confirmar seu primeiro pagamento, a fatura aparece aqui automaticamente.
          </p>
          <Button asChild variant="hero">
            <a href={`https://wa.me/${AGENCY_WHATSAPP_DEFAULT}?text=${encodeURIComponent("Olá! Quero ativar minha assinatura na Estação Ilha Grande.")}`}
              target="_blank" rel="noopener noreferrer">
              Falar com a equipe
            </a>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Nº fatura</th>
                  <th className="text-left px-4 py-3">Plano</th>
                  <th className="text-left px-4 py-3">Período</th>
                  <th className="text-left px-4 py-3">Vencimento</th>
                  <th className="text-right px-4 py-3">Valor</th>
                  <th className="text-left px-4 py-3">Método</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => {
                  const meta = STATUS[p.status] ?? STATUS.pending;
                  const Icon = meta.icon;
                  const sub = subById[p.subscription_id];
                  return (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-xs">{p.invoice_number ?? "—"}</td>
                      <td className="px-4 py-3 uppercase text-xs font-semibold">{sub?.plan ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {p.period_start && p.period_end
                          ? `${fmtDate(p.period_start)} → ${fmtDate(p.period_end)}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">{fmtDate(p.due_date || p.period_end)}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">{fmtBRL(p.amount)}</td>
                      <td className="px-4 py-3 text-xs uppercase">{p.payment_method ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", meta.cls)}>
                          <Icon className="w-3 h-3" /> {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

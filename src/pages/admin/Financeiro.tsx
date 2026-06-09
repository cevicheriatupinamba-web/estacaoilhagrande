import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign, TrendingUp, Users, AlertTriangle, Clock, CheckCircle2, Receipt, Search,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const PERIODS = [
  { id: "7d", label: "7 dias", days: 7 },
  { id: "30d", label: "30 dias", days: 30 },
  { id: "90d", label: "90 dias", days: 90 },
  { id: "ytd", label: "Ano", days: 365 },
] as const;

const PLAN_COLOR: Record<string, string> = {
  gratuito: "bg-slate-200 text-slate-800",
  basico: "bg-sky-100 text-sky-800",
  destaque: "bg-emerald-100 text-emerald-800",
  premium: "bg-amber-100 text-amber-800",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  expired: "bg-rose-100 text-rose-800",
  cancelled: "bg-slate-200 text-slate-700",
  suspended: "bg-orange-100 text-orange-800",
};

function fmtBRL(n: number | null | undefined) {
  return Number(n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR");
}

interface SubRow {
  id: string; listing_id: string; listing_name: string;
  owner_id: string; owner_email: string; owner_name: string;
  plan: string; status: string;
  monthly_amount: number; billing_cycle: string;
  started_at: string; current_period_start: string; current_period_end: string;
  trial_end: string | null; auto_renew: boolean; days_remaining: number;
  last_payment_at: string | null; total_paid: number;
}

export default function Financeiro() {
  const { toast } = useToast();
  const [period, setPeriod] = useState<typeof PERIODS[number]>(PERIODS[1]);
  const [kpis, setKpis] = useState<any>(null);
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // payment modal
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<SubRow | null>(null);
  const [amount, setAmount] = useState("0");
  const [method, setMethod] = useState<"pix" | "cartao" | "manual">("pix");
  const [months, setMonths] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [period.id]);

  async function load() {
    setLoading(true);
    const [{ data: k }, { data: list, error: e }] = await Promise.all([
      supabase.rpc("get_financial_kpis" as any, { _days: period.days }),
      supabase.rpc("admin_list_subscriptions" as any),
    ]);
    if (e) toast({ title: "Erro", description: e.message, variant: "destructive" });
    setKpis(k);
    setSubs((list as SubRow[]) ?? []);
    setLoading(false);
  }

  function openPayment(s: SubRow) {
    setActiveSub(s);
    setAmount(String(s.monthly_amount ?? 0));
    setMethod("pix");
    setMonths(1);
    setNotes("");
    setPaymentOpen(true);
  }

  async function confirmPayment() {
    if (!activeSub) return;
    const value = parseFloat(amount.replace(",", "."));
    if (!value || value <= 0) {
      toast({ title: "Valor inválido", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.rpc("admin_confirm_payment" as any, {
      _subscription_id: activeSub.id,
      _amount: value,
      _method: method,
      _months: months,
      _notes: notes || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao registrar", description: error.message, variant: "destructive" });
      return;
    }
    const inv = (data as any)?.invoice_number ?? "fatura";
    toast({ title: "Pagamento registrado", description: `${inv} • renovação estendida em ${months} mês(es)` });
    setPaymentOpen(false);
    load();
  }

  const filtered = useMemo(() => {
    return subs.filter(s => {
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return s.listing_name?.toLowerCase().includes(q)
        || s.owner_email?.toLowerCase().includes(q)
        || s.owner_name?.toLowerCase().includes(q)
        || s.plan?.toLowerCase().includes(q);
    });
  }, [subs, search, filterStatus]);

  const series = (kpis?.series ?? []).map((d: any) => ({
    date: String(d.date).slice(5),
    revenue: Number(d.revenue),
  }));
  const byPlan = (kpis?.by_plan ?? []).map((p: any) => ({
    plan: p.plan,
    mrr: Number(p.mrr),
    count: Number(p.active_count),
  }));

  return (
    <div>
      <PageHeader
        title="Financeiro"
        subtitle="MRR, assinaturas, pagamentos e inadimplentes em um só lugar"
        actions={
          <div className="flex flex-wrap gap-1.5 bg-card border border-border rounded-xl p-1">
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                  period.id === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}>
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {loading || !kpis ? (
        <div className="text-muted-foreground">Carregando…</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <StatCard label="MRR" value={fmtBRL(kpis.mrr)} icon={DollarSign} accent="emerald" hint="Recorrência mensal ativa" />
            <StatCard label="ARR projetado" value={fmtBRL(kpis.arr)} icon={TrendingUp} accent="primary" hint="MRR × 12" />
            <StatCard label="Assinaturas ativas" value={kpis.active} icon={Users} accent="emerald" hint={`${kpis.in_trial} em teste`} />
            <StatCard label="Inadimplentes" value={kpis.overdue} icon={AlertTriangle} accent="rose" hint={`${kpis.expired} expiradas`} />
            <StatCard label={`Receita ${period.label.toLowerCase()}`} value={fmtBRL(kpis.revenue_period)} icon={Receipt} accent="amber" />
            <StatCard label="Receita acumulada" value={fmtBRL(kpis.total_revenue)} icon={DollarSign} accent="primary" />
            <StatCard label="Em período de teste" value={kpis.in_trial} icon={Clock} accent="sky" />
            <StatCard label="Expiradas" value={kpis.expired} icon={AlertTriangle} accent="rose" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
              <h3 className="font-display font-bold text-lg mb-4">Receita diária</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <AreaChart data={series} margin={{ left: -10, right: 8 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip formatter={(v: any) => fmtBRL(Number(v))} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#rev)" name="Receita" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="font-display font-bold text-lg mb-4">MRR por plano</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={byPlan} margin={{ left: -10, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="plan" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip formatter={(v: any, n: any) => n === "mrr" ? fmtBRL(Number(v)) : v} />
                    <Legend />
                    <Bar dataKey="mrr" name="MRR" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="count" name="Assinaturas" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Subscriptions table */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-4 flex flex-wrap items-center gap-2 border-b border-border">
              <h3 className="font-display font-bold flex-1">Assinaturas ({filtered.length})</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8 h-9 w-64" placeholder="Buscar anúncio, e-mail, plano"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Todos status</option>
                <option value="active">Ativas</option>
                <option value="pending">Pendentes</option>
                <option value="expired">Expiradas</option>
                <option value="cancelled">Canceladas</option>
                <option value="suspended">Suspensas</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-3 py-2">Anúncio</th>
                    <th className="text-left px-3 py-2">Anunciante</th>
                    <th className="text-left px-3 py-2">Plano</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="text-right px-3 py-2">Valor</th>
                    <th className="text-right px-3 py-2">Renovação</th>
                    <th className="text-right px-3 py-2">Total pago</th>
                    <th className="text-right px-3 py-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Nenhuma assinatura.</td></tr>
                  )}
                  {filtered.map(s => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-3 py-2 max-w-[200px]">
                        <div className="font-medium truncate">{s.listing_name ?? "—"}</div>
                        <div className="text-[11px] text-muted-foreground">Desde {fmtDate(s.started_at)}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[200px]">
                        <div className="text-xs font-medium truncate">{s.owner_name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{s.owner_email}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", PLAN_COLOR[s.plan] ?? "bg-muted")}>
                          {s.plan}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", STATUS_COLOR[s.status] ?? "bg-muted")}>
                          {s.status}
                        </span>
                        {s.trial_end && new Date(s.trial_end) > new Date() && (
                          <div className="text-[10px] text-sky-700 mt-0.5">Em teste</div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtBRL(s.monthly_amount)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="text-xs">{fmtDate(s.current_period_end)}</div>
                        <div className={cn(
                          "text-[10px] font-semibold",
                          s.days_remaining <= 0 ? "text-rose-600" :
                          s.days_remaining <= 7 ? "text-amber-600" : "text-muted-foreground",
                        )}>
                          {s.days_remaining > 0 ? `${s.days_remaining} dias` : "vencida"}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-emerald-700 font-semibold">{fmtBRL(s.total_paid)}</td>
                      <td className="px-3 py-2 text-right">
                        <Button size="sm" variant="outline" onClick={() => openPayment(s)}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Registrar pagamento
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar pagamento manual</DialogTitle>
          </DialogHeader>
          {activeSub && (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <div className="font-semibold">{activeSub.listing_name}</div>
                <div className="text-xs text-muted-foreground">{activeSub.owner_email}</div>
                <div className="text-xs mt-1">Plano: <span className="font-semibold uppercase">{activeSub.plan}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="amt">Valor (R$)</Label>
                  <Input id="amt" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="met">Método</Label>
                  <select id="met" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={method} onChange={e => setMethod(e.target.value as any)}>
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="mon">Meses a estender</Label>
                  <Input id="mon" type="number" min={1} max={12} value={months}
                    onChange={e => setMonths(Math.max(1, parseInt(e.target.value || "1")))} />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea id="notes" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPaymentOpen(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={confirmPayment} disabled={saving}>
              <CheckCircle2 className="w-4 h-4 mr-1" /> Confirmar pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

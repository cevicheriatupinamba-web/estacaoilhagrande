import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_LABEL, PLAN_LABEL, STATUS_LABEL, type ListingRow, type ListingPlan, type ListingStatus } from "@/lib/listings-api";
import { Crown, Search, Check, X, ExternalLink, MessageCircle, Mail, Trash2 } from "lucide-react";
import { logActivity } from "@/lib/admin/activity";

const PLAN_PRICE = { gratuito: 0, destaque: 197, premium: 397 } as const;

export default function CRM() {
  const { toast } = useToast();
  const [rows, setRows] = useState<ListingRow[]>([]);
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<"all" | ListingPlan>("all");
  const [status, setStatus] = useState<"all" | ListingStatus>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    setRows((data as ListingRow[]) ?? []);
    setLoading(false);
  }

  const filtered = useMemo(() => rows.filter(r => {
    if (plan !== "all" && r.plan !== plan) return false;
    if (status !== "all" && r.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      return (r.name + " " + (r.email ?? "") + " " + (r.whatsapp ?? "") + " " + (r.neighborhood ?? "")).toLowerCase().includes(s);
    }
    return true;
  }), [rows, q, plan, status]);

  async function update(id: string, patch: Partial<ListingRow>, action: string) {
    const { error } = await supabase.from("listings").update(patch).eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    await logActivity({ action, resource_type: "listing", resource_id: id, metadata: patch as never });
    toast({ title: "Atualizado" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir definitivamente este anunciante?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    await logActivity({ action: "listing.delete", resource_type: "listing", resource_id: id });
    toast({ title: "Removido" });
    load();
  }

  const totalRevenue = filtered.filter(r => r.status === "approved").reduce((s, r) => s + PLAN_PRICE[r.plan as keyof typeof PLAN_PRICE], 0);

  return (
    <div>
      <PageHeader
        title="CRM de anunciantes"
        subtitle={`${filtered.length} de ${rows.length} · MRR filtrado R$ ${totalRevenue.toLocaleString("pt-BR")}`}
      />

      <div className="rounded-2xl bg-card border border-border p-4 mb-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nome, e-mail, WhatsApp, bairro…" className="pl-9" />
        </div>
        <select value={plan} onChange={e => setPlan(e.target.value as any)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">Todos os planos</option>
          <option value="premium">Premium</option>
          <option value="destaque">Destaque</option>
          <option value="gratuito">Gratuito</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value as any)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Recusado</option>
        </select>
      </div>

      {loading ? <div className="text-muted-foreground">Carregando…</div> : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-muted/40 text-xs uppercase tracking-wide font-semibold text-muted-foreground">
            <div className="col-span-4">Empresa</div>
            <div className="col-span-2">Categoria</div>
            <div className="col-span-2">Plano</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3 text-right">Ações</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map(r => (
              <div key={r.id} className="md:grid md:grid-cols-12 md:gap-3 md:items-center px-5 py-4 hover:bg-muted/20">
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                    {r.photos?.[0] && <img src={r.photos[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate flex items-center gap-1.5">
                      {r.name}
                      {r.featured && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{r.email || r.whatsapp || r.neighborhood || "—"}</div>
                  </div>
                </div>
                <div className="col-span-2 text-sm mt-2 md:mt-0">{CATEGORY_LABEL[r.category]}</div>
                <div className="col-span-2 mt-2 md:mt-0">
                  <select value={r.plan} onChange={e => update(r.id, { plan: e.target.value as ListingPlan }, "listing.plan_change")}
                    className="h-8 px-2 rounded-md border border-input bg-background text-xs font-semibold">
                    <option value="gratuito">Gratuito</option>
                    <option value="destaque">Destaque</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="col-span-1 mt-2 md:mt-0">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    r.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    r.status === "pending"  ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>{STATUS_LABEL[r.status]}</span>
                </div>
                <div className="col-span-3 flex flex-wrap gap-1 mt-3 md:mt-0 md:justify-end">
                  {r.status !== "approved" && (
                    <Button size="sm" variant="default" className="h-8" onClick={() => update(r.id, { status: "approved" }, "listing.approve")}>
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {r.status !== "rejected" && (
                    <Button size="sm" variant="outline" className="h-8" onClick={() => update(r.id, { status: "rejected" }, "listing.reject")}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => update(r.id, { featured: !r.featured }, "listing.featured")}>
                    <Crown className={`w-3.5 h-3.5 ${r.featured ? "text-amber-500" : ""}`} />
                  </Button>
                  {r.whatsapp && (
                    <a href={`https://wa.me/${r.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                       className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted" aria-label={`WhatsApp de ${r.name}`}>
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </a>
                  )}
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted" aria-label={`E-mail de ${r.name}`}>
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a href={`/listagem/${r.slug}`} target="_blank" rel="noreferrer"
                     className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted" aria-label={`Abrir página de ${r.name}`}>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Button size="sm" variant="ghost" className="h-8 text-rose-600" onClick={() => remove(r.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-muted-foreground text-sm">Nenhum anunciante encontrado.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

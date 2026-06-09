import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { MessageSquare, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/admin/activity";

interface Lead {
  id: string; name: string; category: string; whatsapp: string | null; email: string | null;
  description: string | null; status: string; source: string | null; created_at: string;
}

const STATUS = ["new", "contacted", "converted", "lost"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "Novo", contacted: "Em contato", converted: "Convertido", lost: "Perdido",
};

export default function Leads() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"all" | typeof STATUS[number]>("all");

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await supabase.from("lead_requests").select("*").order("created_at", { ascending: false });
    setRows((data as Lead[]) ?? []);
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("lead_requests").update({ status }).eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { await logActivity({ action: "lead.status", resource_id: id, metadata: { status } }); load(); }
  }

  const counts = STATUS.reduce((acc, s) => ({ ...acc, [s]: rows.filter(r => r.status === s).length }), {} as Record<string, number>);
  const filtered = filter === "all" ? rows : rows.filter(r => r.status === filter);
  const conv = rows.length ? ((counts.converted ?? 0) / rows.length * 100).toFixed(1) : "0.0";

  return (
    <div>
      <PageHeader title="Leads" subtitle="Contatos recebidos via formulários do portal" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total" value={rows.length} icon={MessageSquare} accent="primary" />
        <StatCard label="Novos" value={counts.new ?? 0} accent="sky" />
        <StatCard label="Em contato" value={counts.contacted ?? 0} accent="amber" />
        <StatCard label="Convertidos" value={counts.converted ?? 0} accent="emerald" />
        <StatCard label="Conversão" value={`${conv}%`} accent="rose" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", ...STATUS] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"
            }`}>{s === "all" ? "Todos" : STATUS_LABEL[s]}</button>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border divide-y divide-border">
        {filtered.map(r => (
          <div key={r.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold">{r.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{r.category}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")}</span>
              </div>
              {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
              <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                {r.email && <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" /> {r.email}</a>}
                {r.whatsapp && <a href={`https://wa.me/${r.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" /> {r.whatsapp}</a>}
                {r.source && <span>via {r.source}</span>}
              </div>
            </div>
            <select value={r.status} onChange={e => setStatus(r.id, e.target.value)}
              className="h-9 px-2 rounded-md border border-input bg-background text-xs font-semibold">
              {STATUS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
        ))}
        {filtered.length === 0 && <div className="p-10 text-center text-muted-foreground text-sm">Sem leads neste filtro.</div>}
      </div>
    </div>
  );
}

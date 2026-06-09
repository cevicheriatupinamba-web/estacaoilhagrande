import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";

interface Log {
  id: string; actor_email: string | null; action: string;
  resource_type: string | null; resource_id: string | null;
  metadata: any; created_at: string;
}

export default function ActivityLog() {
  const [rows, setRows] = useState<Log[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(500)
      .then(({ data }) => setRows((data as Log[]) ?? []));
  }, []);

  const filtered = q ? rows.filter(r => (r.action + " " + (r.actor_email ?? "") + " " + (r.resource_type ?? "")).toLowerCase().includes(q.toLowerCase())) : rows;

  return (
    <div>
      <PageHeader title="Auditoria" subtitle="Histórico de ações administrativas" />
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filtrar por ação, autor ou recurso…"
        className="w-full md:max-w-md h-10 px-3 mb-4 rounded-lg border border-input bg-background text-sm" />
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr><th className="text-left p-3">Quando</th><th className="text-left p-3">Autor</th><th className="text-left p-3">Ação</th><th className="text-left p-3 hidden md:table-cell">Recurso</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")}</td>
                <td className="p-3 text-xs">{r.actor_email ?? "—"}</td>
                <td className="p-3 font-mono text-xs">{r.action}</td>
                <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{r.resource_type ?? "—"} {r.resource_id ? `· ${r.resource_id.slice(0, 8)}` : ""}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Sem registros.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

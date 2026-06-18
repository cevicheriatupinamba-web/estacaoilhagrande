import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Database, Download, Loader2, Plus, Trash2, HardDrive } from "lucide-react";

interface Snapshot {
  id: string;
  name: string;
  kind: string;
  status: string;
  size_bytes: number;
  tables_count: number;
  rows_count: number;
  created_at: string;
}

function fmtBytes(n: number) {
  if (!n) return "0 B";
  const u = ["B","KB","MB","GB"]; let i = 0; let v = n;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${u[i]}`;
}

export default function Backup() {
  const { toast } = useToast();
  const [list, setList] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("backup_snapshots" as any)
      .select("id,name,kind,status,size_bytes,tables_count,rows_count,created_at")
      .order("created_at", { ascending: false });
    setList((data as any) ?? []);
    setLoading(false);
  }

  async function create() {
    setCreating(true);
    const finalName = name.trim() || `Backup manual — ${new Date().toLocaleString("pt-BR")}`;
    const { error } = await supabase.rpc("create_backup_snapshot" as any, { _name: finalName, _kind: "manual" });
    setCreating(false);
    if (error) {
      toast({ title: "Falha ao criar backup", description: error.message, variant: "destructive" });
      return;
    }
    setName("");
    toast({ title: "Backup criado com sucesso" });
    load();
  }

  async function download(id: string, snapName: string) {
    setDownloading(id);
    const { data, error } = await supabase
      .from("backup_snapshots" as any)
      .select("payload,name,created_at")
      .eq("id", id)
      .maybeSingle();
    setDownloading(null);
    if (error || !data) {
      toast({ title: "Erro ao baixar", description: error?.message ?? "Backup não encontrado", variant: "destructive" });
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snapName.replace(/[^a-z0-9_-]+/gi, "_")}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  async function remove(id: string) {
    if (!confirm("Excluir este snapshot? A ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("backup_snapshots" as any).delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Backup excluído" });
    load();
  }

  const totalSize = list.reduce((s, x) => s + (x.size_bytes ?? 0), 0);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Backup do banco de dados"
        subtitle="Snapshots completos das tabelas do portal. Crie, baixe ou restaure manualmente."
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Snapshots</div>
          <div className="text-3xl font-display font-bold mt-1">{list.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Espaço total</div>
          <div className="text-3xl font-display font-bold mt-1">{fmtBytes(totalSize)}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Último backup</div>
          <div className="text-sm font-medium mt-2">
            {list[0] ? new Date(list[0].created_at).toLocaleString("pt-BR") : "Nenhum ainda"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Criar novo snapshot</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Nome (opcional) — ex: Antes da migração de planos"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={create} disabled={creating} className="gap-2">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {creating ? "Capturando dados…" : "Criar backup agora"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          O snapshot inclui: usuários, papéis, anúncios, planos, assinaturas, pagamentos, leads, eventos, páginas, blog, banners e menus.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h2 className="font-semibold flex items-center gap-2"><HardDrive className="w-4 h-4" /> Histórico</h2>
        </div>
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Carregando…</div>
        ) : list.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">Nenhum backup ainda. Crie o primeiro acima.</div>
        ) : (
          <div className="divide-y divide-border">
            {list.map(s => (
              <div key={s.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(s.created_at).toLocaleString("pt-BR")} · {s.tables_count} tabelas · {s.rows_count} registros · {fmtBytes(s.size_bytes)}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-secondary uppercase font-bold tracking-wide">{s.kind}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => download(s.id, s.name)} disabled={downloading === s.id} className="gap-1">
                    {downloading === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    Baixar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(s.id)} className="text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

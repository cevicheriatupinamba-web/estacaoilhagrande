import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Menu, Plus, Save, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  location: string;
  label: string;
  url: string;
  sort_order: number;
  open_in_new_tab: boolean;
  active: boolean;
}

const LOCATIONS = [
  { value: "header", label: "Cabeçalho" },
  { value: "footer", label: "Rodapé" },
  { value: "mobile", label: "Menu mobile" },
];

export default function Menus() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [tab, setTab] = useState("header");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("cms_menu_items" as any)
      .select("*").order("location").order("sort_order");
    setItems(((data as any) ?? []) as MenuItem[]);
    setLoading(false);
  }

  async function add() {
    const max = Math.max(0, ...items.filter(i => i.location === tab).map(i => i.sort_order));
    const { data, error } = await supabase
      .from("cms_menu_items" as any)
      .insert({ label: "Novo item", url: "/", location: tab, sort_order: max + 1, active: true } as any)
      .select().single();
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    setItems(prev => [...prev, data as any]);
  }

  function patch(id: string, p: Partial<MenuItem>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...p } : i));
  }

  async function save(it: MenuItem) {
    setSavingId(it.id);
    const { error } = await supabase.from("cms_menu_items" as any).update({
      label: it.label, url: it.url, location: it.location,
      sort_order: it.sort_order, open_in_new_tab: it.open_in_new_tab, active: it.active,
    } as any).eq("id", it.id);
    setSavingId(null);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Salvo" });
  }

  async function remove(id: string) {
    if (!confirm("Excluir este item de menu?")) return;
    const { error } = await supabase.from("cms_menu_items" as any).delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    setItems(prev => prev.filter(x => x.id !== id));
  }

  const filtered = useMemo(() => items.filter(i => i.location === tab).sort((a,b) => a.sort_order - b.sort_order), [items, tab]);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Menus do portal"
        subtitle="Cabeçalho, rodapé e menu mobile — sem código."
        actions={<Button onClick={add} className="gap-2"><Plus className="w-4 h-4" /> Novo item em "{LOCATIONS.find(l => l.value === tab)?.label}"</Button>}
      />

      <div className="flex gap-1 border-b border-border mb-6">
        {LOCATIONS.map(loc => (
          <button
            key={loc.value}
            onClick={() => setTab(loc.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === loc.value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {loc.label} <span className="text-xs opacity-60">({items.filter(i => i.location === loc.value).length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-10">Carregando…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <Menu className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum item neste menu. Clique em "Novo item" para começar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(it => (
            <div key={it.id} className="rounded-lg border border-border bg-card p-4 grid md:grid-cols-[80px_1fr_1fr_auto] gap-3 items-center">
              <Input type="number" value={it.sort_order} onChange={e => patch(it.id, { sort_order: parseInt(e.target.value || "0") })} className="h-9" />
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">Rótulo</Label>
                <Input value={it.label} onChange={e => patch(it.id, { label: e.target.value })} className="h-9" />
              </div>
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">URL</Label>
                <Input value={it.url} onChange={e => patch(it.id, { url: e.target.value })} className="h-9" placeholder="/hospedagem ou https://..." />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Switch checked={it.active} onCheckedChange={v => patch(it.id, { active: v })} />
                  <Label className="text-xs">Ativo</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <Switch checked={it.open_in_new_tab} onCheckedChange={v => patch(it.id, { open_in_new_tab: v })} />
                  <Label className="text-xs">Nova aba</Label>
                </div>
                <Button size="sm" onClick={() => save(it)} disabled={savingId === it.id}>
                  <Save className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(it.id)} className="text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

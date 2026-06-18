import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  cta_label: string | null;
  position: string;
  sort_order: number;
  active: boolean;
}

const POSITIONS = [
  { value: "home_hero", label: "Home — Hero principal" },
  { value: "home_secondary", label: "Home — Secundário" },
  { value: "sidebar", label: "Barra lateral" },
  { value: "footer", label: "Rodapé" },
];

export default function Banners() {
  const { toast } = useToast();
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("cms_banners" as any)
      .select("*")
      .order("position").order("sort_order");
    setItems(((data as any) ?? []) as Banner[]);
    setLoading(false);
  }

  async function add() {
    const { data, error } = await supabase
      .from("cms_banners" as any)
      .insert({ title: "Novo banner", image_url: "", position: "home_hero", active: false } as any)
      .select().single();
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    setItems(prev => [data as any, ...prev]);
  }

  function patch(id: string, p: Partial<Banner>) {
    setItems(prev => prev.map(b => b.id === id ? { ...b, ...p } : b));
  }

  async function save(b: Banner) {
    setSavingId(b.id);
    const { error } = await supabase.from("cms_banners" as any).update({
      title: b.title, subtitle: b.subtitle, image_url: b.image_url,
      link_url: b.link_url, cta_label: b.cta_label, position: b.position,
      sort_order: b.sort_order, active: b.active,
    } as any).eq("id", b.id);
    setSavingId(null);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Banner salvo" });
  }

  async function remove(id: string) {
    if (!confirm("Excluir este banner?")) return;
    const { error } = await supabase.from("cms_banners" as any).delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    setItems(prev => prev.filter(x => x.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Banners do portal"
        subtitle="Hero da home, secundários, sidebar e rodapé — tudo editável sem código."
        actions={<Button onClick={add} className="gap-2"><Plus className="w-4 h-4" /> Novo banner</Button>}
      />

      {loading ? (
        <div className="text-center text-muted-foreground py-10">Carregando…</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum banner cadastrado. Clique em "Novo banner" para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(b => (
            <div key={b.id} className="rounded-xl border border-border bg-card p-5">
              <div className="grid md:grid-cols-[200px_1fr] gap-5">
                <div>
                  {b.image_url ? (
                    <img src={b.image_url} alt={b.title} className="w-full aspect-video object-cover rounded-lg border border-border" />
                  ) : (
                    <div className="w-full aspect-video grid place-items-center bg-muted rounded-lg border border-dashed border-border text-xs text-muted-foreground">Sem imagem</div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Título</Label>
                      <Input value={b.title} onChange={e => patch(b.id, { title: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Posição</Label>
                      <select
                        value={b.position}
                        onChange={e => patch(b.id, { position: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Subtítulo</Label>
                    <Textarea rows={2} value={b.subtitle ?? ""} onChange={e => patch(b.id, { subtitle: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">URL da imagem</Label>
                    <Input value={b.image_url} onChange={e => patch(b.id, { image_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Link do botão</Label>
                      <Input value={b.link_url ?? ""} onChange={e => patch(b.id, { link_url: e.target.value })} placeholder="/hospedagem" />
                    </div>
                    <div>
                      <Label className="text-xs">Texto do botão</Label>
                      <Input value={b.cta_label ?? ""} onChange={e => patch(b.id, { cta_label: e.target.value })} placeholder="Ver mais" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={b.active} onCheckedChange={v => patch(b.id, { active: v })} />
                        <Label className="text-xs">Ativo</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Ordem</Label>
                        <Input type="number" value={b.sort_order} onChange={e => patch(b.id, { sort_order: parseInt(e.target.value || "0") })} className="w-20 h-8" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => remove(b.id)} className="text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" onClick={() => save(b)} disabled={savingId === b.id} className="gap-1">
                        <Save className="w-3.5 h-3.5" /> {savingId === b.id ? "Salvando…" : "Salvar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

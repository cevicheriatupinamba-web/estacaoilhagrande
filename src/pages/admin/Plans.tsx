import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Crown, Sparkles } from "lucide-react";

interface Plan {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  benefits: string[];
  trial_days: number;
  active: boolean;
  sort_order: number;
  description: string | null;
  badge: string | null;
  photo_limit: number;
  video_limit: number;
  featured_in_search: boolean;
}

export default function Plans() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("plans").select("*").order("sort_order");
    setPlans(((data as any[]) ?? []).map(p => ({ ...p, benefits: Array.isArray(p.benefits) ? p.benefits : [] })));
    setLoading(false);
  }

  function update(id: string, patch: Partial<Plan>) {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  }

  async function save(p: Plan) {
    setSavingId(p.id);
    const { error } = await supabase.from("plans").update({
      name: p.name,
      price_cents: p.price_cents,
      benefits: p.benefits,
      trial_days: p.trial_days,
      active: p.active,
      description: p.description,
      badge: p.badge,
      photo_limit: p.photo_limit,
      video_limit: p.video_limit,
      featured_in_search: p.featured_in_search,
    } as any).eq("id", p.id);
    setSavingId(null);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "Plano atualizado" });
  }

  return (
    <div>
      <PageHeader title="Planos" subtitle="Preços, limites, badges e benefícios da plataforma" />
      {loading ? (
        <div className="text-muted-foreground">Carregando…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map(p => (
            <div key={p.id} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase font-bold text-muted-foreground tracking-wide flex items-center gap-1">
                    {p.slug}
                    {p.slug === "premium" && <Crown className="w-3 h-3 text-amber-500" />}
                    {p.slug === "destaque" && <Sparkles className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <Input value={p.name} onChange={e => update(p.id, { name: e.target.value })}
                    className="font-display font-bold text-xl border-0 px-0 h-auto focus-visible:ring-0" />
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={p.active} onChange={e => update(p.id, { active: e.target.checked })} />
                  Ativo
                </label>
              </div>

              <div className="mb-3">
                <label className="text-xs text-muted-foreground">Descrição comercial</label>
                <Textarea rows={2} value={p.description ?? ""} onChange={e => update(p.id, { description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground">Preço (R$)</label>
                  <Input type="number" step="0.01" value={p.price_cents / 100}
                    onChange={e => update(p.id, { price_cents: Math.round(parseFloat(e.target.value || "0") * 100) })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Dias de trial</label>
                  <Input type="number" value={p.trial_days}
                    onChange={e => update(p.id, { trial_days: parseInt(e.target.value || "0") })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Limite de fotos</label>
                  <Input type="number" value={p.photo_limit}
                    onChange={e => update(p.id, { photo_limit: parseInt(e.target.value || "0") })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Limite de vídeos</label>
                  <Input type="number" value={p.video_limit}
                    onChange={e => update(p.id, { video_limit: parseInt(e.target.value || "0") })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Badge</label>
                  <Input value={p.badge ?? ""} onChange={e => update(p.id, { badge: e.target.value })} placeholder="Destaque, Premium…" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={p.featured_in_search}
                      onChange={e => update(p.id, { featured_in_search: e.target.checked })} />
                    Destaque na busca
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Benefícios (um por linha)</label>
                <Textarea rows={5} value={p.benefits.join("\n")}
                  onChange={e => update(p.id, { benefits: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} />
              </div>

              <Button size="sm" onClick={() => save(p)} disabled={savingId === p.id}>
                <Save className="w-3.5 h-3.5 mr-1" /> Salvar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

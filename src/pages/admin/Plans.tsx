import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface Plan {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  benefits: string[];
  trial_days: number;
  active: boolean;
  sort_order: number;
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
    }).eq("id", p.id);
    setSavingId(null);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "Plano atualizado" });
  }

  return (
    <div>
      <PageHeader title="Planos" subtitle="Gerencie os planos de assinatura, preços e benefícios" />
      {loading ? (
        <div className="text-muted-foreground">Carregando…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map(p => (
            <div key={p.id} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs uppercase font-bold text-muted-foreground tracking-wide">{p.slug}</div>
                  <Input value={p.name} onChange={e => update(p.id, { name: e.target.value })}
                    className="font-display font-bold text-xl border-0 px-0 h-auto" />
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={p.active} onChange={e => update(p.id, { active: e.target.checked })} />
                  Ativo
                </label>
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

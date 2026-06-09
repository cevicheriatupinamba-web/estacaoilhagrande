import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface Setting { key: string; value: any }

const TABS = [
  { key: "institutional", label: "Institucional", fields: [
    { k: "name", label: "Nome da plataforma" },
    { k: "whatsapp", label: "WhatsApp" },
    { k: "email", label: "E-mail" },
    { k: "instagram", label: "Instagram" },
    { k: "facebook", label: "Facebook" },
    { k: "cnpj", label: "CNPJ" },
  ]},
  { key: "seo", label: "SEO Global", fields: [
    { k: "title", label: "Meta title" },
    { k: "description", label: "Meta description", textarea: true },
    { k: "og_image", label: "OG Image URL" },
  ]},
  { key: "integrations", label: "Integrações", fields: [
    { k: "google_analytics", label: "Google Analytics ID" },
    { k: "google_maps", label: "Google Maps API key (pública)" },
    { k: "meta_pixel", label: "Meta Pixel ID" },
  ]},
];

export default function Settings() {
  const { toast } = useToast();
  const [tab, setTab] = useState(TABS[0].key);
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data: rows } = await supabase.from("platform_settings").select("key, value");
    const map: Record<string, any> = {};
    (rows as Setting[] ?? []).forEach(r => { map[r.key] = r.value || {}; });
    TABS.forEach(t => { if (!map[t.key]) map[t.key] = {}; });
    setData(map);
    setLoading(false);
  }

  function update(group: string, field: string, value: string) {
    setData(d => ({ ...d, [group]: { ...d[group], [field]: value } }));
  }

  async function save(group: string) {
    setSaving(true);
    const { error } = await supabase.from("platform_settings")
      .update({ value: data[group], updated_at: new Date().toISOString() })
      .eq("key", group);
    setSaving(false);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "Salvo com sucesso" });
  }

  const current = TABS.find(t => t.key === tab)!;

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Centro de controle global da plataforma" />

      <div className="flex flex-wrap gap-1.5 bg-card border border-border rounded-xl p-1 mb-6 w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}>{t.label}</button>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 max-w-2xl">
        {loading ? <div className="text-muted-foreground">Carregando…</div> : (
          <div className="space-y-4">
            {current.fields.map(f => (
              <div key={f.k}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                {(f as any).textarea ? (
                  <Textarea rows={3} value={data[current.key]?.[f.k] ?? ""}
                    onChange={e => update(current.key, f.k, e.target.value)} />
                ) : (
                  <Input value={data[current.key]?.[f.k] ?? ""}
                    onChange={e => update(current.key, f.k, e.target.value)} />
                )}
              </div>
            ))}
            <Button onClick={() => save(current.key)} disabled={saving}>
              <Save className="w-4 h-4 mr-1" /> Salvar {current.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

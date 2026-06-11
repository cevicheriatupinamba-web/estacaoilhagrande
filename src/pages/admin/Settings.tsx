import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe, Share2, Twitter, ShieldCheck, Code, MapPin, Building2, Tags, Sparkles } from "lucide-react";

interface Field { k: string; label: string; textarea?: boolean; placeholder?: string }
interface Group { key: string; label: string; icon: any; description: string; fields: Field[] }

const GROUPS: Group[] = [
  { key: "institutional", label: "Institucional", icon: Building2, description: "Identidade da plataforma e redes sociais.", fields: [
    { k: "name", label: "Nome da plataforma" },
    { k: "whatsapp", label: "WhatsApp" },
    { k: "email", label: "E-mail principal" },
    { k: "instagram", label: "Instagram (URL)" },
    { k: "facebook", label: "Facebook (URL)" },
    { k: "cnpj", label: "CNPJ" },
  ]},
  { key: "seo_meta", label: "Meta SEO", icon: Globe, description: "Título, descrição, keywords e canonical padrão do portal.", fields: [
    { k: "title", label: "Meta Title (≤ 60 caracteres)" },
    { k: "description", label: "Meta Description (≤ 160 caracteres)", textarea: true },
    { k: "keywords", label: "Keywords (separadas por vírgula)", textarea: true },
    { k: "canonical", label: "Canonical URL padrão", placeholder: "https://estacaoilhagrande.com.br" },
  ]},
  { key: "seo_og", label: "Open Graph", icon: Share2, description: "Como o site aparece quando compartilhado.", fields: [
    { k: "title", label: "OG Title" },
    { k: "description", label: "OG Description", textarea: true },
    { k: "image", label: "OG Image (URL 1200x630)" },
  ]},
  { key: "seo_twitter", label: "Twitter Card", icon: Twitter, description: "Card otimizado para Twitter/X.", fields: [
    { k: "title", label: "Twitter Title" },
    { k: "description", label: "Twitter Description", textarea: true },
    { k: "image", label: "Twitter Image" },
  ]},
  { key: "seo_verifications", label: "Verificações & Analytics", icon: ShieldCheck, description: "IDs de verificação e tracking.", fields: [
    { k: "google", label: "Google Site Verification" },
    { k: "bing", label: "Bing Site Verification" },
    { k: "ga4", label: "Google Analytics 4 (G-XXXXXXX)" },
    { k: "gsc", label: "Google Search Console (propriedade)" },
    { k: "gtm", label: "Google Tag Manager (GTM-XXXXXXX)" },
    { k: "meta_pixel", label: "Meta Pixel ID" },
  ]},
  { key: "seo_advanced", label: "Avançado & PWA", icon: Code, description: "Robots, favicon, manifest, tema.", fields: [
    { k: "robots", label: "robots.txt (apenas referência)", textarea: true },
    { k: "favicon", label: "Favicon URL" },
    { k: "apple_touch_icon", label: "Apple Touch Icon URL" },
    { k: "manifest", label: "Manifest PWA URL" },
    { k: "theme_color", label: "Theme color (hex)" },
    { k: "primary_color", label: "Cor principal (hex)" },
  ]},
  { key: "seo_local", label: "Local SEO", icon: MapPin, description: "Sinais geográficos para buscas locais.", fields: [
    { k: "city", label: "Cidade" },
    { k: "state", label: "Estado" },
    { k: "country", label: "País" },
    { k: "latitude", label: "Latitude" },
    { k: "longitude", label: "Longitude" },
    { k: "region", label: "Região turística" },
    { k: "phone", label: "Telefone" },
    { k: "whatsapp", label: "WhatsApp (sem +, ex: 5521...)" },
    { k: "email", label: "E-mail" },
  ]},
];

const CATEGORY_KEYS = [
  { k: "pousadas", label: "Pousadas" },
  { k: "restaurantes", label: "Restaurantes" },
  { k: "passeios", label: "Passeios" },
  { k: "praias", label: "Praias" },
  { k: "comercio", label: "Comércio Local" },
  { k: "agencia", label: "Agência" },
  { k: "guias", label: "Guias" },
  { k: "eventos", label: "Eventos" },
];

const ALL_KEYS = [...GROUPS.map(g => g.key), "seo_categories"];

export default function Settings() {
  const { toast } = useToast();
  const [tab, setTab] = useState<string>(GROUPS[0].key);
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data: rows } = await supabase.from("platform_settings").select("key, value").in("key", ALL_KEYS);
    const map: Record<string, any> = {};
    (rows ?? []).forEach((r: any) => { map[r.key] = r.value || (r.key === "seo_categories" ? {} : {}); });
    ALL_KEYS.forEach(k => { if (!map[k]) map[k] = {}; });
    setData(map);
    setLoading(false);
  }

  function update(group: string, field: string, value: string) {
    setData(d => ({ ...d, [group]: { ...d[group], [field]: value } }));
  }

  function updateCategory(cat: string, field: string, value: string) {
    setData(d => ({
      ...d,
      seo_categories: { ...d.seo_categories, [cat]: { ...(d.seo_categories?.[cat] || {}), [field]: value } }
    }));
  }

  async function saveGroup(group: string) {
    setSaving(true);
    const { error } = await supabase.from("platform_settings")
      .upsert({ key: group, value: data[group], updated_at: new Date().toISOString() }, { onConflict: "key" });
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    else toast({ title: "Configurações salvas", description: "As alterações refletem imediatamente no portal." });
  }

  const current = GROUPS.find(g => g.key === tab);

  return (
    <div>
      <PageHeader title="SEO Global Premium" subtitle="Central completa de SEO, schema, analytics e identidade da plataforma." />

      <div className="flex flex-wrap gap-1.5 bg-card border border-border rounded-xl p-1 mb-6">
        {GROUPS.map(g => {
          const Icon = g.icon;
          return (
            <button key={g.key} onClick={() => setTab(g.key)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                tab === g.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}>
              <Icon className="w-4 h-4" /> {g.label}
            </button>
          );
        })}
        <button onClick={() => setTab("seo_categories")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
            tab === "seo_categories" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}>
          <Tags className="w-4 h-4" /> SEO por categoria
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Carregando…</div> : (
        <>
          {tab === "seo_categories" ? (
            <div className="rounded-2xl bg-card border border-border p-6 max-w-4xl">
              <div className="mb-5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h2 className="font-semibold">SEO automático por categoria</h2>
                  <p className="text-sm text-muted-foreground">Esses defaults alimentam o SEO de cada hub e dos cards automáticos.</p>
                </div>
              </div>
              <div className="space-y-6">
                {CATEGORY_KEYS.map(cat => {
                  const v = data.seo_categories?.[cat.k] || {};
                  return (
                    <div key={cat.k} className="border border-border rounded-xl p-4 bg-muted/20">
                      <div className="font-semibold mb-3">{cat.label}</div>
                      <div className="space-y-3">
                        <Input placeholder="Title" value={v.title || ""} onChange={e => updateCategory(cat.k, "title", e.target.value)} />
                        <Textarea rows={2} placeholder="Description" value={v.description || ""} onChange={e => updateCategory(cat.k, "description", e.target.value)} />
                        <Input placeholder="Keywords" value={v.keywords || ""} onChange={e => updateCategory(cat.k, "keywords", e.target.value)} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button className="mt-6" onClick={() => saveGroup("seo_categories")} disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> Salvar SEO por categoria
              </Button>
            </div>
          ) : current && (
            <div className="rounded-2xl bg-card border border-border p-6 max-w-2xl">
              <div className="mb-5">
                <h2 className="font-semibold flex items-center gap-2"><current.icon className="w-4 h-4" /> {current.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{current.description}</p>
              </div>
              <div className="space-y-4">
                {current.fields.map(f => (
                  <div key={f.k}>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                    {f.textarea ? (
                      <Textarea rows={f.k === "robots" ? 8 : 3} placeholder={f.placeholder}
                        value={data[current.key]?.[f.k] ?? ""}
                        onChange={e => update(current.key, f.k, e.target.value)} />
                    ) : (
                      <Input placeholder={f.placeholder} value={data[current.key]?.[f.k] ?? ""}
                        onChange={e => update(current.key, f.k, e.target.value)} />
                    )}
                  </div>
                ))}
                <Button onClick={() => saveGroup(current.key)} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" /> Salvar {current.label}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

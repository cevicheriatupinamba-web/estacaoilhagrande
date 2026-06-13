import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link as LinkIcon, Code2, Wand2, Sparkles, Save, Globe2, AlertTriangle,
  Image as ImageIcon, MapPin, Star, Loader2, Download, BedDouble, ListChecks, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import {
  AccommodationDraft, buildTemplateFromBookingUrl, normalizeApifyJSON,
  parseAccommodationJSON, slugify, validateForPublish,
} from "@/lib/accommodations/parser";
import {
  CATEGORIES, SUBCATEGORIES, CATEGORY_ROUTE, CategoryKey, suggestClassification,
} from "@/lib/establishments/taxonomy";

const SAMPLE_JSON = JSON.stringify({
  name: "", source_url: "", source_platform: "",
  location: "", city: "Ilha Grande", state: "Rio de Janeiro", country: "Brasil",
  short_description: "", full_description: "",
  rating: "", review_count: "",
  amenities: [], photos: [], rooms: [],
  house_rules: { checkin: "", checkout: "", pets: "", children: "", payment: "", cancellation: "" },
  whatsapp: "", instagram: "", website: "",
  status: "draft", is_featured: false,
}, null, 2);

export default function ImportarEstabelecimento() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryKey | "">("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [draft, setDraft] = useState<AccommodationDraft | null>(null);
  const [busy, setBusy] = useState<null | "ai-rewrite" | "ai-seo" | "save" | "publish">(null);

  const subcatOptions = category ? SUBCATEGORIES[category] : [];

  // Reset subcat when category changes
  useEffect(() => { setSubcategory(""); }, [category]);

  // Auto-suggest based on draft name
  useEffect(() => {
    if (!draft?.name || category) return;
    const s = suggestClassification(draft.name);
    if (s.category) {
      setCategory(s.category);
      if (s.subcategory) setTimeout(() => setSubcategory(s.subcategory!), 0);
      toast.info(`Sugestão: ${s.category}${s.subcategory ? " · " + s.subcategory : ""}`, {
        description: "Confirme ou ajuste antes de publicar.",
      });
    }
  }, [draft?.name]);

  const validation = useMemo(() => (draft ? validateForPublish(draft) : null), [draft]);
  const requireClass = !category || !subcategory;

  const analyzeLink = () => {
    if (!bookingUrl.trim()) return toast.error("Cole um link do Booking.com");
    if (!category) return toast.error("Selecione a categoria antes de analisar o link");
    const tpl = buildTemplateFromBookingUrl(bookingUrl.trim());
    tpl.category = category;
    tpl.subcategory = subcategory || undefined;
    setJsonText(JSON.stringify(tpl, null, 2));
    setDraft(tpl);
    toast.success("Template gerado. Complete fotos, descrição e dados.");
  };

  const generatePreview = () => {
    const parsed = parseAccommodationJSON(jsonText);
    if (parsed.ok === false) { toast.error(parsed.error); setDraft(null); return; }
    const data = parsed.data;
    if (!data.slug && data.name) data.slug = slugify(data.name);
    if (category) data.category = category;
    if (subcategory) data.subcategory = subcategory;
    setDraft(data);
    toast.success("Prévia gerada");
  };

  const importApify = () => {
    const r = normalizeApifyJSON(jsonText);
    if (r.ok === false) {
      toast.error("Não foi possível importar o JSON", { description: r.errors.join("\n") });
      return;
    }
    const data = { ...r.data, category: category || r.data.category, subcategory };
    setDraft(data);
    setJsonText(JSON.stringify(data, null, 2));
    if (r.warnings.length) toast.warning("Importado com avisos", { description: r.warnings.join("\n") });
    toast.success(`Importado: ${data.photos.length} fotos, ${data.amenities.length} comodidades, ${data.rooms.length} quartos`);
  };

  const aiRewrite = async () => {
    if (!draft) return toast.error("Gere a prévia primeiro");
    setBusy("ai-rewrite");
    try {
      const { data, error } = await supabase.functions.invoke("accommodation-ai", {
        body: { action: "rewrite", name: draft.name, location: draft.location,
          description: draft.full_description || draft.short_description },
      });
      if (error) throw error;
      if (data?.description) {
        const next = { ...draft, full_description: data.description };
        setDraft(next); setJsonText(JSON.stringify(next, null, 2));
        toast.success("Descrição reescrita pela IA");
      }
    } catch (e: any) { toast.error(e.message ?? "Falha na IA"); }
    finally { setBusy(null); }
  };

  const aiSeo = async () => {
    if (!draft) return toast.error("Gere a prévia primeiro");
    setBusy("ai-seo");
    try {
      const { data, error } = await supabase.functions.invoke("accommodation-ai", {
        body: { action: "seo", name: draft.name, location: draft.location,
          description: draft.full_description || draft.short_description, amenities: draft.amenities },
      });
      if (error) throw error;
      const next: AccommodationDraft = {
        ...draft,
        seo_title: data?.title ?? draft.seo_title,
        seo_description: data?.meta_description ?? draft.seo_description,
        seo_keywords: data?.keywords ?? draft.seo_keywords,
        slug: data?.slug ? slugify(data.slug) : draft.slug,
        full_description: data?.optimized_text ?? draft.full_description,
      };
      setDraft(next); setJsonText(JSON.stringify(next, null, 2));
      toast.success("SEO gerado pela IA");
    } catch (e: any) { toast.error(e.message ?? "Falha na IA"); }
    finally { setBusy(null); }
  };

  const save = async (status: "draft" | "published") => {
    if (!draft) return toast.error("Gere a prévia primeiro");
    if (!category || !subcategory) return toast.error("Categoria e subcategoria são obrigatórias");
    const v = validateForPublish(draft);
    if (status === "published" && !v.ok) return toast.error(v.errors.join(" "));
    if (status === "draft" && v.warnings.length) toast.warning(v.warnings.join(" "));
    setBusy(status === "published" ? "publish" : "save");
    try {
      const payload: any = {
        ...draft, status,
        slug: draft.slug || slugify(draft.name),
        category, subcategory,
        segment: category,
        business_type: subcategory,
      };
      const { data, error } = await supabase.from("accommodations")
        .upsert(payload, { onConflict: "slug" })
        .select("slug,status").single();
      if (error) throw error;
      toast.success(status === "published" ? "Publicado no site!" : "Rascunho salvo");
      if (status === "published" && data?.slug) {
        const route = CATEGORY_ROUTE[category](data.slug);
        setTimeout(() => navigate(route), 600);
      }
    } catch (e: any) { toast.error(e.message ?? "Erro ao salvar"); }
    finally { setBusy(null); }
  };

  const cover = draft?.photos.find((p) => p.is_cover) ?? draft?.photos[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Importar Estabelecimento"
        subtitle="Cadastre rapidamente qualquer estabelecimento (hospedagem, restaurante, passeio, transporte etc.) a partir de um link ou JSON."
      />

      {/* ETAPA 1 — Categorização obrigatória */}
      <Card className="p-5 space-y-4 border-2 border-amber-300/60 bg-amber-50/30">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Tag className="w-4 h-4 text-amber-600" />
          Etapa 1 — Classificação (obrigatório)
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Categoria <span className="text-rose-600">*</span></Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">— Selecione —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Subcategoria <span className="text-rose-600">*</span></Label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={!category}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm disabled:opacity-50"
            >
              <option value="">— Selecione —</option>
              {subcatOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {requireClass && (
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Defina categoria e subcategoria antes de importar/publicar.
          </p>
        )}
      </Card>

      {/* ETAPA 2 — Fonte */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LinkIcon className="w-4 h-4" /> Etapa 2 — Link da fonte (Booking, Google etc.)
          </div>
          <Input
            placeholder="https://www.booking.com/hotel/br/..."
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
          />
          <Button onClick={analyzeLink} className="w-full" disabled={!category}>
            <Sparkles className="w-4 h-4 mr-2" /> Analisar link
          </Button>
          <p className="text-xs text-muted-foreground">
            Gera um template a partir do link. A categoria escolhida é mantida.
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Code2 className="w-4 h-4" /> Importar via JSON
          </div>
          <Textarea
            value={jsonText} onChange={(e) => setJsonText(e.target.value)}
            className="font-mono text-xs h-60" spellCheck={false}
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={generatePreview} className="flex-1 min-w-[140px]">
              <Wand2 className="w-4 h-4 mr-2" /> Gerar prévia
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white flex-1 min-w-[160px]"
              onClick={importApify}
            >
              <Download className="w-4 h-4 mr-2" /> Importar JSON Apify
            </Button>
            <Button variant="outline" onClick={() => setJsonText(SAMPLE_JSON)}>Resetar</Button>
          </div>
        </Card>
      </div>

      {draft && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <div><div className="text-2xl font-bold">{draft.photos.length}</div>
              <div className="text-xs text-muted-foreground">Fotos</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <ListChecks className="w-5 h-5 text-sky-600" />
            <div><div className="text-2xl font-bold">{draft.amenities.length}</div>
              <div className="text-xs text-muted-foreground">Comodidades</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <BedDouble className="w-5 h-5 text-violet-600" />
            <div><div className="text-2xl font-bold">{draft.rooms.length}</div>
              <div className="text-xs text-muted-foreground">Quartos</div></div>
          </Card>
        </div>
      )}

      {draft && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 text-white p-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge className="bg-white/20 text-white">{category || "Sem categoria"}</Badge>
                {subcategory && <Badge className="bg-white/20 text-white">{subcategory}</Badge>}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">{draft.name || "(sem nome)"}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-white/90">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {draft.location || "Ilha Grande"}</span>
                {draft.rating ? (
                  <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {draft.rating} {draft.review_count ? `(${draft.review_count})` : ""}</span>
                ) : null}
              </div>
            </div>
            <Badge variant="outline" className="border-white/30 text-white capitalize">{draft.status || "draft"}</Badge>
          </div>

          <div className="p-6 space-y-6">
            {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  {validation.errors.map((e, i) => <div key={i} className="text-red-700">• {e}</div>)}
                  {validation.warnings.map((w, i) => <div key={i} className="text-amber-700">• {w}</div>)}
                </div>
              </div>
            )}

            {cover && (
              <div className="grid grid-cols-3 gap-2">
                <img src={cover.url} alt={cover.alt || draft.name} className="col-span-3 aspect-[16/9] object-cover rounded-lg" />
                {draft.photos.filter((p) => p.url !== cover.url).slice(0, 6).map((p, i) => (
                  <img key={i} src={p.url} alt={p.alt || ""} className="aspect-square object-cover rounded" />
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button variant="outline" onClick={aiRewrite} disabled={busy === "ai-rewrite"}>
                {busy === "ai-rewrite" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                Reescrever descrição com IA
              </Button>
              <Button variant="outline" onClick={aiSeo} disabled={busy === "ai-seo"}>
                {busy === "ai-seo" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Gerar SEO
              </Button>
              <div className="flex-1" />
              <Button variant="secondary" onClick={() => save("draft")} disabled={busy === "save" || requireClass}>
                {busy === "save" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar como rascunho
              </Button>
              <Button onClick={() => save("published")} disabled={busy === "publish" || !validation?.ok || requireClass}>
                {busy === "publish" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe2 className="w-4 h-4 mr-2" />}
                Publicar no site
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

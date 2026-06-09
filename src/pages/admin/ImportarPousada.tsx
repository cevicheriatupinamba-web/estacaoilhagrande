import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as LinkIcon, Code2, Wand2, Sparkles, Save, Globe2, AlertTriangle, Image as ImageIcon, MapPin, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import {
  AccommodationDraft,
  buildTemplateFromBookingUrl,
  normalizeApifyJSON,
  parseAccommodationJSON,
  slugify,
  validateForPublish,
} from "@/lib/accommodations/parser";
import { Download, Image as ImageIcon2, BedDouble, ListChecks } from "lucide-react";

const SAMPLE_JSON = JSON.stringify(
  {
    name: "Pousada Casablanca",
    category: "Pousada",
    source_url: "https://www.booking.com/hotel/br/pousada-casablanca.pt-br.html",
    source_platform: "Booking.com",
    location: "Vila do Abraão, Ilha Grande",
    city: "Ilha Grande",
    state: "Rio de Janeiro",
    country: "Brasil",
    short_description: "",
    full_description: "",
    rating: "",
    review_count: "",
    amenities: [],
    photos: [],
    rooms: [],
    house_rules: { checkin: "", checkout: "", pets: "", children: "", payment: "", cancellation: "" },
    whatsapp: "",
    instagram: "",
    website: "",
    status: "draft",
    is_featured: false,
  },
  null,
  2
);

export default function ImportarPousada() {
  const navigate = useNavigate();
  const [bookingUrl, setBookingUrl] = useState("");
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [draft, setDraft] = useState<AccommodationDraft | null>(null);
  const [busy, setBusy] = useState<null | "ai-rewrite" | "ai-seo" | "save" | "publish">(null);

  const validation = useMemo(() => (draft ? validateForPublish(draft) : null), [draft]);

  const analyzeLink = () => {
    if (!bookingUrl.trim()) {
      toast.error("Cole um link do Booking.com");
      return;
    }
    const tpl = buildTemplateFromBookingUrl(bookingUrl.trim());
    setJsonText(JSON.stringify(tpl, null, 2));
    setDraft(tpl);
    toast.success("Template gerado a partir do link. Edite o JSON com fotos, descrição e comodidades.");
  };

  const generatePreview = () => {
    const parsed = parseAccommodationJSON(jsonText);
    if (parsed.ok === false) {
      toast.error(parsed.error);
      setDraft(null);
      return;
    }
    const data = parsed.data;
    if (!data.slug && data.name) data.slug = slugify(data.name);
    setDraft(data);
    toast.success("Prévia gerada");
  };

  const aiRewrite = async () => {
    if (!draft) return toast.error("Gere a prévia primeiro");
    setBusy("ai-rewrite");
    try {
      const { data, error } = await supabase.functions.invoke("accommodation-ai", {
        body: {
          action: "rewrite",
          name: draft.name,
          location: draft.location,
          description: draft.full_description || draft.short_description,
        },
      });
      if (error) throw error;
      if (data?.description) {
        const next = { ...draft, full_description: data.description };
        setDraft(next);
        setJsonText(JSON.stringify(next, null, 2));
        toast.success("Descrição reescrita pela IA");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Falha na IA");
    } finally {
      setBusy(null);
    }
  };

  const aiSeo = async () => {
    if (!draft) return toast.error("Gere a prévia primeiro");
    setBusy("ai-seo");
    try {
      const { data, error } = await supabase.functions.invoke("accommodation-ai", {
        body: {
          action: "seo",
          name: draft.name,
          location: draft.location,
          description: draft.full_description || draft.short_description,
          amenities: draft.amenities,
        },
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
      setDraft(next);
      setJsonText(JSON.stringify(next, null, 2));
      toast.success("SEO gerado pela IA");
    } catch (e: any) {
      toast.error(e.message ?? "Falha na IA");
    } finally {
      setBusy(null);
    }
  };

  const save = async (status: "draft" | "published") => {
    if (!draft) return toast.error("Gere a prévia primeiro");
    const v = validateForPublish(draft);
    if (status === "published" && !v.ok) {
      toast.error(v.errors.join(" "));
      return;
    }
    if (status === "draft" && v.warnings.length) {
      toast.warning(v.warnings.join(" "));
    }
    setBusy(status === "published" ? "publish" : "save");
    try {
      const payload: any = { ...draft, status, slug: draft.slug || slugify(draft.name) };
      const { data, error } = await supabase
        .from("accommodations")
        .upsert(payload, { onConflict: "slug" })
        .select("slug,status")
        .single();
      if (error) throw error;
      toast.success(status === "published" ? "Publicada no site!" : "Rascunho salvo");
      if (status === "published" && data?.slug) {
        setTimeout(() => navigate(`/pousadas/${data.slug}`), 600);
      }
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar");
    } finally {
      setBusy(null);
    }
  };

  const cover = draft?.photos.find((p) => p.is_cover) ?? draft?.photos[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Importar Pousada"
        subtitle="Cadastre rapidamente uma pousada a partir do Booking.com ou de um JSON manual."
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LinkIcon className="w-4 h-4" /> Link da pousada no Booking
          </div>
          <Input
            placeholder="https://www.booking.com/hotel/br/pousada-casablanca.pt-br.html"
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
          />
          <Button onClick={analyzeLink} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" /> Analisar link
          </Button>
          <p className="text-xs text-muted-foreground">
            Gera um template com nome e slug pré-preenchidos. Complete fotos, descrição e comodidades no campo JSON ao lado.
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Code2 className="w-4 h-4" /> Importar via JSON
          </div>
          <Textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="font-mono text-xs h-72"
            spellCheck={false}
          />
          <div className="flex gap-2">
            <Button onClick={generatePreview} className="flex-1">
              <Wand2 className="w-4 h-4 mr-2" /> Gerar prévia
            </Button>
            <Button variant="outline" onClick={() => setJsonText(SAMPLE_JSON)}>
              Resetar
            </Button>
          </div>
        </Card>
      </div>

      {draft && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 text-white p-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <Badge className="bg-white/20 text-white mb-2">{draft.category || "Pousada"}</Badge>
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Galeria</div>
                {cover ? (
                  <div className="grid grid-cols-3 gap-2">
                    <img src={cover.url} alt={cover.alt || draft.name} className="col-span-3 aspect-[16/9] object-cover rounded-lg" />
                    {draft.photos.filter((p) => p.url !== cover.url).slice(0, 6).map((p, i) => (
                      <img key={i} src={p.url} alt={p.alt || ""} className="aspect-square object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="aspect-[16/9] rounded-lg bg-muted grid place-items-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Descrição curta</div>
                  <p className="text-sm">{draft.short_description || <span className="text-muted-foreground italic">vazio</span>}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Descrição completa</div>
                  <p className="text-sm whitespace-pre-line">{draft.full_description || <span className="text-muted-foreground italic">vazio</span>}</p>
                </div>
                {draft.whatsapp && (
                  <div className="text-sm"><b>WhatsApp:</b> {draft.whatsapp}</div>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Comodidades</div>
              <div className="flex flex-wrap gap-1.5">
                {draft.amenities.length ? draft.amenities.map((a, i) => (
                  <Badge key={i} variant="secondary">{a}</Badge>
                )) : <span className="text-sm text-muted-foreground italic">nenhuma</span>}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Quartos</div>
              {draft.rooms.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {draft.rooms.map((r, i) => (
                    <div key={i} className="rounded-lg border p-3 text-sm">
                      <div className="font-semibold">{r.name}</div>
                      {r.capacity && <div className="text-xs text-muted-foreground">Capacidade: {r.capacity}</div>}
                      {r.description && <p className="mt-1 text-xs">{r.description}</p>}
                    </div>
                  ))}
                </div>
              ) : <span className="text-sm text-muted-foreground italic">nenhum quarto</span>}
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Regras</div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {Object.entries(draft.house_rules || {}).map(([k, v]) => (
                  v ? <div key={k} className="rounded border p-2"><b className="capitalize">{k}:</b> {v}</div> : null
                ))}
              </div>
            </div>

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
              <Button variant="secondary" onClick={() => save("draft")} disabled={busy === "save"}>
                {busy === "save" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar como rascunho
              </Button>
              <Button onClick={() => save("published")} disabled={busy === "publish" || !validation?.ok}>
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

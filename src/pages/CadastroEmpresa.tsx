import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  CATEGORY_LABEL, SUBCATEGORIES, slugify, PLAN_MEDIA_LIMITS,
  type ListingCategory, type ListingPlan,
} from "@/lib/listings-api";
import PlanMediaUploader, { uploadPendingMedia } from "@/components/PlanMediaUploader";
import { Sparkles, Crown, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(["hospedagem", "restaurante", "passeio", "experiencia"]),
  subcategory: z.string().trim().max(60).optional(),
  short_description: z.string().trim().min(10).max(180),
  description: z.string().trim().min(20).max(3000),
  address: z.string().trim().max(200).optional(),
  neighborhood: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  instagram: z.string().trim().max(60).optional(),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  website: z.string().trim().url().max(300).optional().or(z.literal("")),
  price_range: z.string().trim().max(60).optional(),
  opening_hours: z.string().trim().max(200).optional(),
  latitude: z.string().trim().optional(),
  longitude: z.string().trim().optional(),
});

const initial = {
  name: "", category: "hospedagem" as ListingCategory, subcategory: "",
  short_description: "", description: "",
  address: "", neighborhood: "", phone: "", whatsapp: "",
  instagram: "", email: "", website: "",
  price_range: "", opening_hours: "",
  latitude: "", longitude: "",
};

const PLAN_OPTIONS: { key: ListingPlan; name: string; price: string; icon: typeof Crown; tagline: string }[] = [
  { key: "gratuito", name: "Básico",   price: "R$ 97/mês",  icon: Award, tagline: "Para começar a aparecer" },
  { key: "destaque", name: "Destaque", price: "R$ 197/mês", icon: Star,  tagline: "Mais visibilidade + 1 vídeo" },
  { key: "premium",  name: "Premium",  price: "R$ 297/mês", icon: Crown, tagline: "Prioridade máxima + 3 vídeos" },
];

const CadastroEmpresa = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState(initial);
  const [plan, setPlan] = useState<ListingPlan>("gratuito");
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/login?next=/cadastro-empresa" replace />;

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const choosePlan = (k: ListingPlan) => {
    const lim = PLAN_MEDIA_LIMITS[k];
    setPlan(k);
    setNewPhotos(prev => prev.slice(0, lim.photos));
    setNewVideos(prev => prev.slice(0, lim.videos));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || "Verifique os campos";
      toast({ title: "Formulário inválido", description: first, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { photoUrls, videoUrls } = await uploadPendingMedia(user.id, newPhotos, newVideos);
      const baseSlug = slugify(form.name);
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      const { error } = await supabase.from("listings").insert({
        owner_id: user.id,
        name: form.name,
        slug,
        category: form.category,
        subcategory: form.subcategory || null,
        short_description: form.short_description,
        description: form.description,
        address: form.address || null,
        neighborhood: form.neighborhood || null,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        instagram: form.instagram || null,
        email: form.email || null,
        website: form.website || null,
        price_range: form.price_range || null,
        opening_hours: form.opening_hours || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        photos: photoUrls,
        videos: videoUrls,
      });
      if (error) throw error;
      toast({
        title: "Cadastro enviado!",
        description: "Sua listagem está aguardando aprovação do administrador.",
      });
      nav("/painel-anunciante");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <SEO title="Cadastro de empresa" description="Cadastre seu negócio no portal." path="/cadastro-empresa" noIndex />
    <div className="container py-10 max-w-4xl">
      <header className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sun/20 text-sun-foreground text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Cadastro de empresa
        </span>
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Anuncie seu negócio</h1>
        <p className="text-muted-foreground text-lg">
          Preencha os dados do seu estabelecimento. Após aprovação, ele aparecerá automaticamente nas páginas da categoria escolhida.
        </p>
      </header>

      <form onSubmit={submit} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft space-y-6">
        {/* Plano */}
        <section>
          <h3 className="font-display font-bold text-lg mb-3">Plano de anúncio</h3>
          <p className="text-xs text-muted-foreground mb-3">
            O plano define os limites de fotos e vídeos. A equipe confirma sua assinatura após a aprovação. <Link to="/anuncie" className="underline">Ver detalhes dos planos</Link>.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {PLAN_OPTIONS.map(p => {
              const ativo = plan === p.key;
              const Icon = p.icon;
              const lim = PLAN_MEDIA_LIMITS[p.key];
              return (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => choosePlan(p.key)}
                  className={cn(
                    "text-left rounded-2xl border-2 p-4 transition",
                    ativo ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <Icon className="w-4 h-4" />
                    <span className="font-display font-bold">{p.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{p.tagline}</p>
                  <p className="text-sm font-semibold">{p.price}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Até {lim.photos} fotos{lim.videos > 0 ? ` + ${lim.videos} vídeo${lim.videos > 1 ? "s" : ""}` : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Nome do estabelecimento *</Label>
            <Input required value={form.name} onChange={e => update("name", e.target.value)} maxLength={120} />
          </div>
          <div>
            <Label>Categoria *</Label>
            <select required value={form.category}
              onChange={e => update("category", e.target.value as ListingCategory)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              {(Object.keys(CATEGORY_LABEL) as ListingCategory[]).map(c => (
                <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Subcategoria</Label>
            <select value={form.subcategory}
              onChange={e => update("subcategory", e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              <option value="">Selecione…</option>
              {SUBCATEGORIES[form.category].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label>Descrição curta * <span className="text-muted-foreground">(até 180 caracteres)</span></Label>
            <Input required value={form.short_description}
              onChange={e => update("short_description", e.target.value)} maxLength={180} />
          </div>
          <div className="sm:col-span-2">
            <Label>Descrição completa *</Label>
            <Textarea required rows={5} value={form.description}
              onChange={e => update("description", e.target.value)} maxLength={3000} />
          </div>
        </section>

        <section>
          <h3 className="font-display font-bold text-lg mb-3">Localização & contato</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Endereço</Label>
              <Input value={form.address} onChange={e => update("address", e.target.value)} />
            </div>
            <div>
              <Label>Bairro / praia</Label>
              <Input value={form.neighborhood} onChange={e => update("neighborhood", e.target.value)} />
            </div>
            <div>
              <Label>Faixa de preço</Label>
              <Input placeholder="Ex: R$ 200–400 / casal" value={form.price_range}
                onChange={e => update("price_range", e.target.value)} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={e => update("phone", e.target.value)} />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input placeholder="55 24 99999-0000" value={form.whatsapp}
                onChange={e => update("whatsapp", e.target.value)} />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input placeholder="@seu_negocio" value={form.instagram}
                onChange={e => update("instagram", e.target.value)} />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Site oficial</Label>
              <Input type="url" placeholder="https://…" value={form.website}
                onChange={e => update("website", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Horário de funcionamento</Label>
              <Input placeholder="Ex: Seg–Dom 12h às 23h" value={form.opening_hours}
                onChange={e => update("opening_hours", e.target.value)} />
            </div>
            <div className="sm:col-span-2 rounded-2xl border border-dashed border-border p-4 bg-secondary/30">
              <div className="text-sm font-semibold mb-1">Coordenadas geográficas (opcional)</div>
              <p className="text-xs text-muted-foreground mb-3">
                Abra o <a className="underline" href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>,
                clique com o botão direito sobre o local e copie a latitude e longitude.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Latitude</Label>
                  <Input inputMode="decimal" placeholder="-23.1428" value={form.latitude}
                    onChange={e => update("latitude", e.target.value)} />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input inputMode="decimal" placeholder="-44.1731" value={form.longitude}
                    onChange={e => update("longitude", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-display font-bold text-lg mb-3">Fotos & vídeos</h3>
          <PlanMediaUploader
            plan={plan}
            existingPhotos={[]}
            existingVideos={[]}
            newPhotos={newPhotos}
            newVideos={newVideos}
            onChangeExistingPhotos={() => {}}
            onChangeExistingVideos={() => {}}
            onChangeNewPhotos={setNewPhotos}
            onChangeNewVideos={setNewVideos}
            disabled={submitting}
          />
        </section>

        <div className="rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
          ✓ Seu cadastro entra em <strong>análise</strong>. Assim que o administrador aprovar, ele aparece automaticamente no portal.
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Enviando…" : "Enviar cadastro"}
        </Button>
      </form>
    </div>
    </>
  );
};

export default CadastroEmpresa;

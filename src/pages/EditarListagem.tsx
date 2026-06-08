import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  CATEGORY_LABEL, SUBCATEGORIES, uploadListingPhoto,
  type ListingCategory, type ListingRow,
} from "@/lib/listings-api";
import { ArrowLeft, Save, Upload, X, Clock } from "lucide-react";
import SEO from "@/components/SEO";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
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
  amenities: z.string().trim().max(500).optional(),
  services: z.string().trim().max(500).optional(),
});

const CATEGORIES: ListingCategory[] = ["hospedagem", "restaurante", "passeio", "experiencia"];

type FormState = {
  name: string; category: ListingCategory; subcategory: string;
  short_description: string; description: string;
  address: string; neighborhood: string; phone: string; whatsapp: string;
  instagram: string; email: string; website: string; price_range: string;
  opening_hours: string; latitude: string; longitude: string;
  amenities: string; services: string;
};

const EditarListagem = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      if (error || !data) { toast({ title: "Listagem não encontrada", variant: "destructive" }); nav("/painel-anunciante"); return; }
      if ((data as any).owner_id !== user.id) { toast({ title: "Sem permissão", variant: "destructive" }); nav("/painel-anunciante"); return; }
      setListing(data);
      const pending = (data as any).pending_changes || {};
      const v = (k: string, fb: any) => (pending[k] !== undefined ? pending[k] : fb);
      setForm({
        name: v("name", data.name ?? ""),
        category: v("category", data.category),
        subcategory: v("subcategory", data.subcategory ?? ""),
        short_description: v("short_description", data.short_description ?? ""),
        description: v("description", data.description ?? ""),
        address: v("address", data.address ?? ""),
        neighborhood: v("neighborhood", data.neighborhood ?? ""),
        phone: v("phone", data.phone ?? ""),
        whatsapp: v("whatsapp", data.whatsapp ?? ""),
        instagram: v("instagram", data.instagram ?? ""),
        email: v("email", data.email ?? ""),
        website: v("website", data.website ?? ""),
        price_range: v("price_range", data.price_range ?? ""),
        opening_hours: v("opening_hours", data.opening_hours ?? ""),
        latitude: pending.latitude != null ? String(pending.latitude) : (data.latitude != null ? String(data.latitude) : ""),
        longitude: pending.longitude != null ? String(pending.longitude) : (data.longitude != null ? String(data.longitude) : ""),
        amenities: (v("amenities", data.amenities ?? []) as string[]).join(", "),
        services: (v("services", data.services ?? []) as string[]).join(", "),
      });
      setExistingPhotos(v("photos", data.photos ?? []) as string[]);
      setLoading(false);
    })();
  }, [id, user, nav, toast]);

  if (authLoading) return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to={`/login?next=/painel-anunciante/editar/${id}`} replace />;
  if (loading || !listing || !form) return <div className="container py-20 text-center text-muted-foreground">Carregando listagem…</div>;

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => p ? { ...p, [k]: v } : p);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const remaining = 8 - existingPhotos.length - newFiles.length;
    const arr = Array.from(list).slice(0, Math.max(0, remaining));
    setNewFiles(p => [...p, ...arr]);
    setNewPreviews(p => [...p, ...arr.map(f => URL.createObjectURL(f))]);
  };

  const removeExisting = (i: number) => setExistingPhotos(p => p.filter((_, idx) => idx !== i));
  const removeNew = (i: number) => {
    setNewFiles(p => p.filter((_, idx) => idx !== i));
    setNewPreviews(p => p.filter((_, idx) => idx !== i));
  };
  const moveExistingUp = (i: number) => {
    if (i === 0) return;
    setExistingPhotos(p => { const a = [...p]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  };

  const isLive = listing.status === "approved";
  const hasPending = !!listing.pending_changes && Object.keys(listing.pending_changes).length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || "Verifique os campos";
      toast({ title: "Formulário inválido", description: first, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const uploaded: string[] = [];
      for (const f of newFiles) {
        const url = await uploadListingPhoto(f, user.id);
        uploaded.push(url);
      }
      const finalPhotos = [...existingPhotos, ...uploaded];
      const toArr = (s: string) => s.split(",").map(x => x.trim()).filter(Boolean).slice(0, 30);

      const payload = {
        name: form.name,
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
        amenities: toArr(form.amenities),
        services: toArr(form.services),
        photos: finalPhotos,
      };

      if (isLive) {
        // Listagem já publicada → guarda alterações para aprovação do admin
        const { error } = await supabase
          .from("listings")
          .update({
            pending_changes: payload as any,
            pending_changes_at: new Date().toISOString(),
          } as any)
          .eq("id", listing.id);
        if (error) throw error;
        toast({
          title: "Alterações enviadas para aprovação",
          description: "Sua listagem continua publicada com as informações atuais. As mudanças aparecerão após a revisão.",
        });
      } else {
        // Ainda não publicada (pendente/rejeitada) → grava direto
        const { error } = await supabase.from("listings").update(payload as any).eq("id", listing.id);
        if (error) throw error;
        toast({
          title: "Alterações salvas",
          description: "Sua listagem continua em análise pelo administrador.",
        });
      }
      nav("/painel-anunciante");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <SEO title="Editar listagem" description="Edição privada de listagem." path="/painel-anunciante/editar" noIndex />
    <div className="container py-10 max-w-4xl">
      <Link to="/painel-anunciante" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar ao painel
      </Link>
      <header className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
          Editando · {CATEGORY_LABEL[form.category]}
        </span>
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">{listing.name}</h1>
        <p className="text-muted-foreground">
          {isLive
            ? "Sua listagem está publicada. Toda alteração precisa ser aprovada pelo administrador antes de aparecer no portal."
            : "Sua listagem ainda não foi publicada. Atualize os dados que desejar e o administrador fará a revisão."}
        </p>
      </header>

      {isLive && hasPending && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl border border-sun/40 bg-sun/10">
          <Clock className="w-5 h-5 text-sun-foreground shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-0.5">Você já tem alterações aguardando aprovação.</p>
            <p className="text-muted-foreground">
              O formulário abaixo mostra a versão proposta. Salvar novamente substitui as alterações pendentes.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft space-y-6">
        <section className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Nome do estabelecimento *</Label>
            <Input required value={form.name} onChange={e => update("name", e.target.value)} maxLength={120} />
          </div>
          <div>
            <Label>Categoria *</Label>
            <select value={form.category}
              onChange={e => update("category", e.target.value as ListingCategory)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
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
            <Label>Descrição curta *</Label>
            <Input required value={form.short_description} onChange={e => update("short_description", e.target.value)} maxLength={180} />
          </div>
          <div className="sm:col-span-2">
            <Label>Descrição completa *</Label>
            <Textarea required rows={5} value={form.description} onChange={e => update("description", e.target.value)} maxLength={3000} />
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
              <Input value={form.price_range} onChange={e => update("price_range", e.target.value)} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={e => update("phone", e.target.value)} />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input placeholder="55 24 99999-0000" value={form.whatsapp} onChange={e => update("whatsapp", e.target.value)} />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input placeholder="@seu_negocio" value={form.instagram} onChange={e => update("instagram", e.target.value)} />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Site oficial</Label>
              <Input type="url" placeholder="https://…" value={form.website} onChange={e => update("website", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Horário de funcionamento</Label>
              <Input value={form.opening_hours} onChange={e => update("opening_hours", e.target.value)} />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input inputMode="decimal" placeholder="-23.1428" value={form.latitude} onChange={e => update("latitude", e.target.value)} />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input inputMode="decimal" placeholder="-44.1731" value={form.longitude} onChange={e => update("longitude", e.target.value)} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-display font-bold text-lg mb-3">Comodidades & serviços</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Comodidades <span className="text-muted-foreground text-xs">(separe por vírgula)</span></Label>
              <Textarea rows={3} placeholder="Wi-Fi, Café da manhã, Piscina, Ar-condicionado"
                value={form.amenities} onChange={e => update("amenities", e.target.value)} />
            </div>
            <div>
              <Label>Serviços <span className="text-muted-foreground text-xs">(separe por vírgula)</span></Label>
              <Textarea rows={3} placeholder="Transfer, Reservas online, Aceita pet"
                value={form.services} onChange={e => update("services", e.target.value)} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-display font-bold text-lg mb-3">
            Fotos <span className="text-sm text-muted-foreground font-normal">(até 8 — a primeira é a capa)</span>
          </h3>

          {existingPhotos.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mb-2">Fotos atuais — clique no X para remover ou ↑ para mover para a capa.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {existingPhotos.map((src, i) => (
                  <div key={src} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExisting(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {i > 0 && (
                      <button type="button" onClick={() => moveExistingUp(i)}
                        className="absolute top-1 left-1 px-1.5 h-6 rounded-full bg-foreground/80 text-background text-[10px] font-bold">
                        ↑
                      </button>
                    )}
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold uppercase">Capa</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Adicionar novas fotos</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
          </label>

          {newPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {newPreviews.map((src, i) => (
                <div key={src} className="relative aspect-square rounded-xl overflow-hidden border border-primary/40">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNew(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold uppercase">Nova</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex gap-3">
          <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={saving}>
            <Save className="w-4 h-4 mr-1" /> {saving ? "Salvando…" : isLive ? "Enviar alterações para aprovação" : "Salvar alterações"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => nav("/painel-anunciante")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditarListagem;

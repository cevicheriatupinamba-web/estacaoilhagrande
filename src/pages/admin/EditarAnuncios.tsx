import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Search, Pencil, ExternalLink, Eye, EyeOff, Crown, Save, Loader2, ImageIcon, Trash2,
} from "lucide-react";
import { logActivity } from "@/lib/admin/activity";
import { slugify } from "@/lib/listings-api";

type Source = "listings" | "accommodations";

type Row = {
  id: string;
  source: Source;
  name: string;
  slug: string;
  category: string;
  subcategory?: string | null;
  status: string;
  plan?: string | null;
  featured?: boolean | null;
  cover?: string | null;
  source_platform?: string | null;
  source_type?: string | null;
  source_url?: string | null;
  imported_at?: string | null;
  created_at: string;
  updated_at: string;
  owner_id?: string | null;
  raw: any;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  approved: "Publicado",
  rejected: "Recusado",
  draft: "Rascunho",
  published: "Publicado",
  inactive: "Inativo",
};

const STATUS_COLOR: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800",
  published: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  draft: "bg-slate-100 text-slate-700",
  rejected: "bg-rose-100 text-rose-800",
  inactive: "bg-slate-200 text-slate-700",
};

function publicUrl(r: Row) {
  if (r.source === "accommodations") return `/pousadas/${r.slug}`;
  return `/listagem/${r.slug}`;
}

function pickCoverListings(raw: any): string | null {
  return Array.isArray(raw?.photos) && raw.photos.length ? String(raw.photos[0]) : null;
}
function pickCoverAcc(raw: any): string | null {
  const ph = Array.isArray(raw?.photos) ? raw.photos : [];
  if (!ph.length) return null;
  const cover = ph.find((p: any) => p?.is_cover) ?? ph[0];
  return cover?.url ?? null;
}

export default function EditarAnuncios() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [fSource, setFSource] = useState<"all" | Source>("all");
  const [fStatus, setFStatus] = useState<string>("all");
  const [fCategory, setFCategory] = useState<string>("all");
  const [fSubcategory, setFSubcategory] = useState<string>("all");
  const [fPlatform, setFPlatform] = useState<string>("all");
  const [editing, setEditing] = useState<Row | null>(null);
  const [search] = useSearchParams();

  async function load() {
    setLoading(true);
    const [l, a] = await Promise.all([
      supabase.from("listings").select("*").order("updated_at", { ascending: false }),
      supabase.from("accommodations").select("*").order("updated_at", { ascending: false }),
    ]);
    const lr: Row[] = ((l.data as any[]) || []).map((x) => ({
      id: x.id, source: "listings", name: x.name, slug: x.slug,
      category: x.category, subcategory: x.subcategory, status: x.status,
      plan: x.plan, featured: x.featured, cover: pickCoverListings(x),
      source_platform: x.source_platform, source_type: x.source_type,
      source_url: x.source_url, imported_at: x.imported_at,
      created_at: x.created_at, updated_at: x.updated_at, owner_id: x.owner_id, raw: x,
    }));
    const ar: Row[] = ((a.data as any[]) || []).map((x) => ({
      id: x.id, source: "accommodations", name: x.name, slug: x.slug,
      category: x.category || "Pousada", subcategory: x.subcategory, status: x.status,
      plan: null, featured: x.is_featured, cover: pickCoverAcc(x),
      source_platform: x.source_platform, source_type: null,
      source_url: x.source_url, imported_at: null,
      created_at: x.created_at, updated_at: x.updated_at, owner_id: x.created_by, raw: x,
    }));
    const all = [...lr, ...ar].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    setRows(all);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Deep-link edit via ?source=&id=&edit=1
  useEffect(() => {
    if (!rows.length) return;
    if (search.get("edit") !== "1") return;
    const id = search.get("id");
    const source = search.get("source") as Source | null;
    if (!id || !source) return;
    const found = rows.find((r) => r.id === id && r.source === source);
    if (found) setEditing(found);
  }, [rows, search]);

  const filtered = useMemo(() => rows.filter((r) => {
    if (fSource !== "all" && r.source !== fSource) return false;
    if (fStatus !== "all" && r.status !== fStatus) return false;
    if (fCategory !== "all" && String(r.category).toLowerCase() !== fCategory) return false;
    if (fSubcategory !== "all" && String(r.subcategory ?? "").toLowerCase() !== fSubcategory) return false;
    if (fPlatform !== "all") {
      const p = (r.source_platform || "").toLowerCase();
      if (fPlatform === "manual" && p) return false;
      if (fPlatform !== "manual" && !p.includes(fPlatform)) return false;
    }
    if (q) {
      const s = q.toLowerCase();
      const hay = `${r.name} ${r.slug} ${r.category} ${r.subcategory ?? ""} ${r.source_platform ?? ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  }), [rows, q, fSource, fStatus, fCategory, fSubcategory, fPlatform]);

  async function togglePublish(r: Row) {
    const next =
      r.source === "listings"
        ? r.status === "approved" ? "pending" : "approved"
        : r.status === "published" ? "draft" : "published";
    const { error } = await supabase.from(r.source).update({ status: next }).eq("id", r.id);
    if (error) return toast.error(error.message);
    await logActivity({
      action: `${r.source}.${next}`, resource_type: r.source, resource_id: r.id,
      metadata: { from: r.status, to: next },
    });
    toast.success(next === "approved" || next === "published" ? "Publicado" : "Despublicado");
    load();
  }

  async function remove(r: Row) {
    if (!confirm(`Excluir definitivamente "${r.name}"?`)) return;
    const { error } = await supabase.from(r.source).delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    await logActivity({ action: `${r.source}.delete`, resource_type: r.source, resource_id: r.id });
    toast.success("Excluído");
    load();
  }

  const categoryOptions = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => s.add(String(r.category).toLowerCase()));
    return Array.from(s).sort();
  }, [rows]);
  const subcategoryOptions = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => { if (r.subcategory) s.add(String(r.subcategory).toLowerCase()); });
    return Array.from(s).sort();
  }, [rows]);

  return (
    <div>
      <PageHeader
        title="Editar Anúncios"
        subtitle="Central de edição global: pousadas importadas, listings de anunciantes e cadastros manuais."
      />

      {/* Filters */}
      <Card className="p-4 mb-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, slug, categoria…" className="pl-9" />
        </div>
        <select value={fSource} onChange={(e) => setFSource(e.target.value as any)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">Todas as origens</option>
          <option value="listings">Listings (anunciantes)</option>
          <option value="accommodations">Pousadas (importadas)</option>
        </select>
        <select value={fPlatform} onChange={(e) => setFPlatform(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">Plataforma</option>
          <option value="manual">Manual / Anunciante</option>
          <option value="booking">Booking</option>
          <option value="apify">Apify</option>
        </select>
        <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">Categoria</option>
          {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={fSubcategory} onChange={(e) => setFSubcategory(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">Subcategoria</option>
          {subcategoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">Status</option>
          <option value="approved">Publicado (listings)</option>
          <option value="published">Publicado (pousada)</option>
          <option value="pending">Pendente</option>
          <option value="draft">Rascunho</option>
          <option value="rejected">Recusado</option>
          <option value="inactive">Inativo</option>
        </select>
      </Card>

      <div className="text-xs text-muted-foreground mb-2">{filtered.length} de {rows.length} anúncios</div>

      {loading ? (
        <div className="grid place-items-center py-12 text-muted-foreground"><Loader2 className="animate-spin w-5 h-5" /></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <Card key={`${r.source}:${r.id}`} className="p-3 flex items-center gap-3 hover:shadow-md transition">
              <div className="w-16 h-16 rounded-lg bg-muted shrink-0 overflow-hidden grid place-items-center">
                {r.cover ? (
                  <img src={r.cover} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-semibold truncate">{r.name}</div>
                  {r.featured && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                  <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
                  {r.plan && r.plan !== "gratuito" && <Badge className="text-[10px] bg-amber-500 text-white capitalize">{r.plan}</Badge>}
                  {r.source_platform && (
                    <Badge variant="secondary" className="text-[10px]">
                      Importado · {r.source_platform}
                    </Badge>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${STATUS_COLOR[r.status] ?? "bg-slate-100"}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  /{r.source === "accommodations" ? "pousadas" : "listagem"}/{r.slug} · atualizado {new Date(r.updated_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="outline" onClick={() => setEditing(r)} title="Editar">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" asChild title="Ver página">
                  <a href={publicUrl(r)} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => togglePublish(r)} title={r.status === "approved" || r.status === "published" ? "Despublicar" : "Publicar"}>
                  {r.status === "approved" || r.status === "published"
                    ? <EyeOff className="w-3.5 h-3.5" />
                    : <Eye className="w-3.5 h-3.5" />}
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={() => remove(r)} title="Excluir">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
          {!filtered.length && (
            <Card className="p-8 text-center text-sm text-muted-foreground">Nenhum anúncio encontrado.</Card>
          )}
        </div>
      )}

      <EditDrawer row={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
}

/* ---------------- Edit Drawer ---------------- */

function EditDrawer({ row, onClose, onSaved }: { row: Row | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(null);
  const [photosText, setPhotosText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!row) { setForm(null); return; }
    setForm({ ...row.raw });
    if (row.source === "listings") {
      setPhotosText(((row.raw.photos as string[]) || []).join("\n"));
    } else {
      const urls = (row.raw.photos || []).map((p: any) => p?.url).filter(Boolean);
      setPhotosText(urls.join("\n"));
    }
  }, [row]);

  if (!row || !form) return (
    <Sheet open={!!row} onOpenChange={(o) => !o && onClose()}>
      <SheetContent />
    </Sheet>
  );

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  async function save(publish?: boolean) {
    setSaving(true);
    try {
      const photoUrls = photosText.split("\n").map((s) => s.trim()).filter(Boolean);
      let patch: any = {};
      if (row.source === "listings") {
        patch = {
          name: form.name,
          slug: form.slug || slugify(form.name),
          subcategory: form.subcategory ?? null,
          short_description: form.short_description ?? null,
          description: form.description ?? null,
          address: form.address ?? null,
          neighborhood: form.neighborhood ?? null,
          phone: form.phone ?? null,
          whatsapp: form.whatsapp ?? null,
          email: form.email ?? null,
          website: form.website ?? null,
          instagram: form.instagram ?? null,
          plan: form.plan,
          featured: !!form.featured,
          status: publish ? "approved" : form.status,
          photos: photoUrls,
        };
      } else {
        const existing = Array.isArray(form.photos) ? form.photos : [];
        const photoObjs = photoUrls.map((url, i) => {
          const prev = existing.find((p: any) => p?.url === url);
          return { url, alt: prev?.alt ?? "", is_cover: i === 0 };
        });
        patch = {
          name: form.name,
          slug: form.slug || slugify(form.name),
          category: form.category,
          short_description: form.short_description ?? null,
          full_description: form.full_description ?? null,
          address: form.address ?? null,
          neighborhood: form.neighborhood ?? null,
          city: form.city ?? null,
          whatsapp: form.whatsapp ?? null,
          website: form.website ?? null,
          instagram: form.instagram ?? null,
          checkin_time: form.checkin_time ?? null,
          checkout_time: form.checkout_time ?? null,
          rating: form.rating ?? null,
          review_count: form.review_count ?? null,
          seo_title: form.seo_title ?? null,
          seo_description: form.seo_description ?? null,
          seo_keywords: form.seo_keywords ?? null,
          is_featured: !!form.is_featured,
          status: publish ? "published" : form.status,
          photos: photoObjs,
        };
      }
      const { error } = await supabase.from(row.source).update(patch).eq("id", row.id);
      if (error) throw error;
      await logActivity({
        action: `${row.source}.admin_edit`, resource_type: row.source, resource_id: row.id,
        metadata: { fields: Object.keys(patch) },
      });
      toast.success(publish ? "Publicado" : "Alterações salvas");
      onSaved();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const isAcc = row.source === "accommodations";

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Pencil className="w-4 h-4" /> Editar anúncio
          </SheetTitle>
          <SheetDescription>
            <Badge variant="outline">{row.source}</Badge>{" "}
            {row.source_platform && <Badge variant="secondary">Origem: {row.source_platform}</Badge>}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Nome</Label>
              <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div>
              <Label>Categoria</Label>
              <Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} disabled={!isAcc} />
            </div>
            {!isAcc && (
              <>
                <div>
                  <Label>Subcategoria</Label>
                  <Input value={form.subcategory ?? ""} onChange={(e) => set("subcategory", e.target.value)} />
                </div>
                <div>
                  <Label>Plano</Label>
                  <select value={form.plan} onChange={(e) => set("plan", e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="gratuito">Gratuito</option>
                    <option value="destaque">Destaque</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <Label>Status</Label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                {isAcc ? (
                  <>
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="inactive">Inativo</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Pendente</option>
                    <option value="approved">Publicado</option>
                    <option value="rejected">Recusado</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="feat"
                checked={!!(isAcc ? form.is_featured : form.featured)}
                onChange={(e) => set(isAcc ? "is_featured" : "featured", e.target.checked)}
              />
              <Label htmlFor="feat" className="cursor-pointer">Destaque (selo premium)</Label>
            </div>
          </div>

          <div>
            <Label>Descrição curta</Label>
            <Textarea
              rows={2}
              value={form.short_description ?? ""}
              onChange={(e) => set("short_description", e.target.value)}
            />
          </div>
          <div>
            <Label>Descrição completa</Label>
            <Textarea
              rows={6}
              value={(isAcc ? form.full_description : form.description) ?? ""}
              onChange={(e) => set(isAcc ? "full_description" : "description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Endereço</Label>
              <Input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div>
              <Label>Bairro</Label>
              <Input value={form.neighborhood ?? ""} onChange={(e) => set("neighborhood", e.target.value)} />
            </div>
            {isAcc && (
              <div>
                <Label>Cidade</Label>
                <Input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} />
              </div>
            )}
            <div>
              <Label>WhatsApp</Label>
              <Input value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
            </div>
            {!isAcc && (
              <div>
                <Label>Telefone</Label>
                <Input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
              </div>
            )}
            <div>
              <Label>Website</Label>
              <Input value={form.website ?? ""} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} />
            </div>
            {!isAcc && (
              <div>
                <Label>E-mail</Label>
                <Input value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
              </div>
            )}
            {isAcc && (
              <>
                <div>
                  <Label>Check-in</Label>
                  <Input value={form.checkin_time ?? ""} onChange={(e) => set("checkin_time", e.target.value)} />
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Input value={form.checkout_time ?? ""} onChange={(e) => set("checkout_time", e.target.value)} />
                </div>
                <div>
                  <Label>Avaliação</Label>
                  <Input type="number" step="0.1" value={form.rating ?? ""} onChange={(e) => set("rating", e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div>
                  <Label>Nº de reviews</Label>
                  <Input type="number" value={form.review_count ?? ""} onChange={(e) => set("review_count", e.target.value ? Number(e.target.value) : null)} />
                </div>
              </>
            )}
          </div>

          <div>
            <Label>Galeria (uma URL por linha — primeira é a capa)</Label>
            <Textarea
              rows={6}
              value={photosText}
              onChange={(e) => setPhotosText(e.target.value)}
              className="font-mono text-xs"
            />
            <div className="text-xs text-muted-foreground mt-1">{photosText.split("\n").filter((s) => s.trim()).length} foto(s)</div>
          </div>

          {isAcc && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>SEO · Título</Label>
                <Input value={form.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>SEO · Meta description</Label>
                <Textarea rows={2} value={form.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>SEO · Keywords</Label>
                <Input value={form.seo_keywords ?? ""} onChange={(e) => set("seo_keywords", e.target.value)} />
              </div>
            </div>
          )}

          {row.source_url && (
            <div className="text-xs text-muted-foreground">
              Origem: <a className="underline" target="_blank" rel="noreferrer" href={row.source_url}>{row.source_url}</a>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t sticky bottom-0 bg-background py-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button variant="secondary" onClick={() => save(false)} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
            <Button onClick={() => save(true)} disabled={saving} className="flex-1">
              <Eye className="w-4 h-4 mr-2" /> Salvar e publicar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

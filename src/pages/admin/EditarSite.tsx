import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Save, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Copy,
  FileText, ExternalLink, Loader2, Search, Globe,
} from "lucide-react";

type PageStatus = "draft" | "published" | "archived";

interface CMSPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: PageStatus;
  is_system: boolean;
  sort_order: number;
  updated_at: string;
}

interface CMSSection {
  id: string;
  page_id: string;
  section_key: string;
  kind: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
  is_visible: boolean;
}

const PUBLIC_ROUTE: Record<string, string> = {
  home: "/",
  "como-chegar": "/como-chegar-em-ilha-grande",
  "onde-ficar": "/hospedagem",
  "onde-comer": "/onde-comer",
  "o-que-fazer": "/o-que-fazer",
  praias: "/praias",
  trilhas: "/trilhas",
  passeios: "/passeios",
  eventos: "/eventos",
  roteiros: "/roteiros",
  "agencia-oficial": "/agencia-oficial",
  sobre: "/sobre",
  contato: "/contato",
  rodape: "/",
};

const STATUS_BADGE: Record<PageStatus, string> = {
  draft: "bg-amber-100 text-amber-800 border-amber-200",
  published: "bg-emerald-100 text-emerald-800 border-emerald-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function EditarSite() {
  const { toast } = useToast();
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => { loadPages(); }, []);

  async function loadPages() {
    setLoadingPages(true);
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast({ title: "Erro ao carregar páginas", description: error.message, variant: "destructive" });
    setPages((data as CMSPage[]) ?? []);
    setLoadingPages(false);
  }

  const filtered = useMemo(
    () => pages.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())),
    [pages, search]
  );

  const selected = pages.find(p => p.id === selectedId) ?? null;

  async function createPage() {
    const title = prompt("Título da nova página:");
    if (!title) return;
    const slug = prompt("Slug (ex: minha-pagina):", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    if (!slug) return;
    const { data, error } = await supabase
      .from("pages")
      .insert({ title, slug, status: "draft", sort_order: pages.length + 1 })
      .select()
      .single();
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Página criada" });
    await loadPages();
    setSelectedId((data as CMSPage).id);
  }

  return (
    <div>
      <PageHeader
        title="Editar Site"
        subtitle="CMS visual — gerencie todo o conteúdo institucional do portal sem código."
        actions={
          <Button onClick={createPage}>
            <Plus className="w-4 h-4 mr-1" /> Nova página
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar — lista de páginas */}
        <aside className="rounded-2xl bg-card border border-border overflow-hidden h-fit lg:sticky lg:top-20">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar página…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-border">
            {loadingPages ? (
              <div className="p-6 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Nenhuma página encontrada.</div>
            ) : filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left p-3 hover:bg-muted/40 transition flex items-start gap-3 ${
                  selectedId === p.id ? "bg-muted/60" : ""
                }`}
              >
                <FileText className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${STATUS_BADGE[p.status]}`}>
                  {p.status === "published" ? "ON" : p.status === "draft" ? "DRAFT" : "ARQ"}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Editor */}
        <div className="min-w-0">
          {!selected ? (
            <div className="rounded-2xl bg-card border border-border p-12 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl font-bold">Selecione uma página para editar</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Use a lista ao lado para escolher qual conteúdo institucional você quer ajustar.
              </p>
            </div>
          ) : (
            <PageEditor key={selected.id} page={selected} onPageChange={loadPages} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ====================== PAGE EDITOR ====================== */

function PageEditor({ page, onPageChange }: { page: CMSPage; onPageChange: () => void }) {
  const { toast } = useToast();
  const [meta, setMeta] = useState({ title: page.title, description: page.description ?? "", status: page.status });
  const [savingMeta, setSavingMeta] = useState(false);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    setMeta({ title: page.title, description: page.description ?? "", status: page.status });
    loadSections();
  }, [page.id]);

  async function loadSections() {
    setLoadingSections(true);
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_id", page.id)
      .order("sort_order", { ascending: true });
    if (error) toast({ title: "Erro ao carregar seções", description: error.message, variant: "destructive" });
    setSections((data as CMSSection[]) ?? []);
    setLoadingSections(false);
  }

  async function saveMeta() {
    setSavingMeta(true);
    const { error } = await supabase
      .from("pages")
      .update({ title: meta.title, description: meta.description || null, status: meta.status })
      .eq("id", page.id);
    setSavingMeta(false);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Página salva" });
    onPageChange();
  }

  async function addSection() {
    const key = prompt("Chave única da seção (ex: hero, destaques, cta):");
    if (!key) return;
    const { error } = await supabase.from("page_sections").insert({
      page_id: page.id,
      section_key: key.toLowerCase().replace(/[^a-z0-9_-]+/g, "-"),
      title: "Nova seção",
      sort_order: sections.length + 1,
    });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    await loadSections();
  }

  async function moveSection(id: string, dir: -1 | 1) {
    const idx = sections.findIndex(s => s.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sections.length) return;
    const a = sections[idx];
    const b = sections[swap];
    await Promise.all([
      supabase.from("page_sections").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("page_sections").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    await loadSections();
  }

  async function deleteSection(id: string) {
    if (!confirm("Excluir esta seção? Esta ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("page_sections").delete().eq("id", id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Seção excluída" });
    await loadSections();
  }

  async function duplicateSection(s: CMSSection) {
    const { id, ...rest } = s;
    const { error } = await supabase.from("page_sections").insert({
      ...rest,
      section_key: `${s.section_key}-copy-${Date.now().toString(36)}`,
      sort_order: sections.length + 1,
      title: (s.title ?? "") + " (cópia)",
    });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    await loadSections();
  }

  async function deletePage() {
    if (page.is_system) return toast({ title: "Página do sistema", description: "Páginas padrão não podem ser excluídas.", variant: "destructive" });
    if (!confirm(`Excluir "${page.title}" e todas suas seções?`)) return;
    const { error } = await supabase.from("pages").delete().eq("id", page.id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Página excluída" });
    onPageChange();
  }

  const publicHref = PUBLIC_ROUTE[page.slug] ?? `/${page.slug}`;

  return (
    <div className="space-y-6">
      {/* Header / meta */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border ${STATUS_BADGE[meta.status]}`}>
            {meta.status}
          </span>
          {page.is_system && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border bg-sky-50 text-sky-700 border-sky-200">
              Página do sistema
            </span>
          )}
          <div className="text-xs text-muted-foreground">/{page.slug}</div>
          <div className="ml-auto flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={publicHref} target="_blank" rel="noreferrer">
                <Eye className="w-4 h-4 mr-1" /> Visualizar
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
            {!page.is_system && (
              <Button variant="outline" size="sm" onClick={deletePage} className="text-rose-600 hover:text-rose-700">
                <Trash2 className="w-4 h-4 mr-1" /> Excluir
              </Button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Título</label>
            <Input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descrição interna</label>
            <Textarea rows={2} value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</label>
            <select
              value={meta.status}
              onChange={e => setMeta(m => ({ ...m, status: e.target.value as PageStatus }))}
              className="w-full h-10 px-3 rounded-md border border-border bg-background"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>

        <Button onClick={saveMeta} disabled={savingMeta} className="mt-5">
          {savingMeta ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          Salvar página
        </Button>
      </div>

      {/* Seções */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-xl">Seções da página</h3>
            <p className="text-sm text-muted-foreground">Reordene, oculte ou edite cada bloco exibido nesta página.</p>
          </div>
          <Button onClick={addSection}><Plus className="w-4 h-4 mr-1" /> Nova seção</Button>
        </div>

        {loadingSections ? (
          <div className="py-10 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : sections.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl">
            Nenhuma seção criada ainda. Clique em <strong>“Nova seção”</strong> para começar.
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((s, idx) => (
              <SectionEditor
                key={s.id}
                section={s}
                isFirst={idx === 0}
                isLast={idx === sections.length - 1}
                onMoveUp={() => moveSection(s.id, -1)}
                onMoveDown={() => moveSection(s.id, 1)}
                onDuplicate={() => duplicateSection(s)}
                onDelete={() => deleteSection(s.id)}
                onSaved={loadSections}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================== SECTION EDITOR ====================== */

function SectionEditor({
  section, isFirst, isLast,
  onMoveUp, onMoveDown, onDuplicate, onDelete, onSaved,
}: {
  section: CMSSection;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(section);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(section), [section.id]);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("page_sections").update({
      title: draft.title,
      subtitle: draft.subtitle,
      content: draft.content,
      image_url: draft.image_url,
      video_url: draft.video_url,
      button_text: draft.button_text,
      button_link: draft.button_link,
      is_visible: draft.is_visible,
    }).eq("id", section.id);
    setSaving(false);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Seção salva" });
    onSaved();
  }

  async function toggleVisibility() {
    const { error } = await supabase.from("page_sections")
      .update({ is_visible: !section.is_visible }).eq("id", section.id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    onSaved();
  }

  return (
    <div className={`border border-border rounded-xl overflow-hidden ${!section.is_visible ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-2 p-3 bg-muted/30">
        <button onClick={() => setOpen(o => !o)} className="flex-1 text-left min-w-0">
          <div className="font-semibold text-sm truncate">{section.title || section.section_key}</div>
          <div className="text-xs text-muted-foreground truncate">
            {section.section_key} · ordem {section.sort_order}
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={toggleVisibility} title={section.is_visible ? "Ocultar" : "Exibir"} className="p-1.5 rounded hover:bg-muted">
            {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
          </button>
          <button onClick={onMoveUp} disabled={isFirst} className="p-1.5 rounded hover:bg-muted disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1.5 rounded hover:bg-muted disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
          <button onClick={onDuplicate} title="Duplicar" className="p-1.5 rounded hover:bg-muted"><Copy className="w-4 h-4" /></button>
          <button onClick={onDelete} title="Excluir" className="p-1.5 rounded hover:bg-muted text-rose-600"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-3 bg-card">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Título</label>
              <Input value={draft.title ?? ""} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Subtítulo</label>
              <Input value={draft.subtitle ?? ""} onChange={e => setDraft(d => ({ ...d, subtitle: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Conteúdo / descrição</label>
            <Textarea rows={4} value={draft.content ?? ""} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Imagem (URL)</label>
              <Input placeholder="https://…" value={draft.image_url ?? ""} onChange={e => setDraft(d => ({ ...d, image_url: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Vídeo (URL)</label>
              <Input placeholder="https://…" value={draft.video_url ?? ""} onChange={e => setDraft(d => ({ ...d, video_url: e.target.value }))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Texto do botão</label>
              <Input value={draft.button_text ?? ""} onChange={e => setDraft(d => ({ ...d, button_text: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Link do botão</label>
              <Input placeholder="/rota ou https://…" value={draft.button_link ?? ""} onChange={e => setDraft(d => ({ ...d, button_link: e.target.value }))} />
            </div>
          </div>
          {draft.image_url && (
            <div className="mt-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Preview da imagem</div>
              <img src={draft.image_url} alt="" className="max-h-40 rounded-lg border border-border object-cover" />
            </div>
          )}
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              Salvar seção
            </Button>
            <label className="text-sm flex items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                checked={draft.is_visible}
                onChange={e => setDraft(d => ({ ...d, is_visible: e.target.checked }))}
              />
              Visível no site
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

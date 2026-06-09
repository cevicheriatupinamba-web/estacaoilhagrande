import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Eye, EyeOff, Trash2 } from "lucide-react";
import { logActivity } from "@/lib/admin/activity";

interface Post { id: string; slug: string; title: string; published: boolean; published_at: string | null; created_at: string; category_slug: string | null; reading_minutes: number | null }

export default function Content() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Post[]>([]);

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await supabase.from("blog_posts").select("id, slug, title, published, published_at, created_at, category_slug, reading_minutes")
      .order("created_at", { ascending: false });
    setRows((data as Post[]) ?? []);
  }

  async function toggle(p: Post) {
    const next = !p.published;
    const { error } = await supabase.from("blog_posts")
      .update({ published: next, published_at: next ? new Date().toISOString() : null }).eq("id", p.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { await logActivity({ action: next ? "post.publish" : "post.unpublish", resource_id: p.id }); load(); }
  }

  async function remove(id: string) {
    if (!confirm("Excluir este conteúdo?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { await logActivity({ action: "post.delete", resource_id: id }); load(); }
  }

  return (
    <div>
      <PageHeader title="Conteúdo editorial" subtitle={`${rows.length} posts cadastrados`} />

      <div className="rounded-2xl bg-card border border-border divide-y divide-border">
        {rows.map(p => (
          <div key={p.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                <span>/{p.slug}</span>
                {p.category_slug && <span>· {p.category_slug}</span>}
                {p.reading_minutes && <span>· {p.reading_minutes} min</span>}
                <span>· {new Date(p.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
              p.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
            }`}>{p.published ? "Publicado" : "Rascunho"}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => toggle(p)}>
                {p.published ? <><EyeOff className="w-3.5 h-3.5 mr-1" /> Despublicar</> : <><Eye className="w-3.5 h-3.5 mr-1" /> Publicar</>}
              </Button>
              <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="h-9 px-3 rounded-md border border-input hover:bg-muted grid place-items-center" aria-label={`Abrir post ${p.title}`}>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => remove(p.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="p-10 text-center text-muted-foreground text-sm">Nenhum conteúdo ainda.</div>}
      </div>
    </div>
  );
}

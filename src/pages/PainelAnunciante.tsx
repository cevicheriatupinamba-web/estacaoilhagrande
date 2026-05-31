import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyListings, STATUS_LABEL, PLAN_LABEL, CATEGORY_LABEL, type ListingRow } from "@/lib/listings-api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, ExternalLink, Trash2 } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-sun text-sun-foreground",
  approved: "bg-forest text-forest-foreground",
  rejected: "bg-destructive text-destructive-foreground",
};

const PainelAnunciante = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<ListingRow[]>([]);
  const [fetching, setFetching] = useState(true);

  const load = () => {
    if (!user) return;
    setFetching(true);
    fetchMyListings(user.id).then(setItems).finally(() => setFetching(false));
  };

  useEffect(() => { load(); }, [user]);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/login?next=/painel-anunciante" replace />;

  const remove = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta listagem?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Removida" }); load(); }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-4xl mb-2">Painel do anunciante</h1>
          <p className="text-muted-foreground">Gerencie suas listagens no portal Ilha Go.</p>
        </div>
        <Button asChild variant="hero">
          <Link to="/cadastro-empresa"><Plus className="w-4 h-4 mr-1" /> Novo cadastro</Link>
        </Button>
      </div>

      {fetching ? (
        <p className="text-muted-foreground">Carregando suas listagens…</p>
      ) : items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-10 text-center">
          <p className="text-muted-foreground mb-4">Você ainda não tem nenhum cadastro.</p>
          <Button asChild variant="hero">
            <Link to="/cadastro-empresa">Cadastrar meu primeiro negócio</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(l => (
            <article key={l.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-secondary shrink-0">
                {l.photos?.[0] && <img src={l.photos[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-display font-bold text-xl">{l.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor[l.status]}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-semibold uppercase">
                    {CATEGORY_LABEL[l.category]}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase">
                    Plano {PLAN_LABEL[l.plan]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{l.short_description}</p>
                <div className="flex flex-wrap gap-2">
                  {l.status === "approved" && (
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/listagem/${l.slug}`}>
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Ver no portal
                      </Link>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => remove(l.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remover
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PainelAnunciante;

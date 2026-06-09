import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyListings, STATUS_LABEL, PLAN_LABEL, CATEGORY_LABEL, type ListingRow } from "@/lib/listings-api";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Pencil, ImageIcon, MapPin, Phone, MessageCircle, Globe, Instagram } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-amber-500 text-white",
  approved: "bg-emerald-600 text-white",
  rejected: "bg-rose-600 text-white",
};

export default function MinhaEmpresa() {
  const { user } = useAuth();
  const [items, setItems] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchMyListings(user.id).then(setItems).finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login?next=/minha-empresa" replace />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">Minha empresa</h1>
          <p className="text-muted-foreground text-sm">Edite seus dados, fotos, contato e localização.</p>
        </div>
        <Button asChild variant="hero">
          <Link to="/cadastro-empresa"><Plus className="w-4 h-4 mr-1" /> Novo anúncio</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando seus anúncios…</p>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-muted-foreground mb-4">Você ainda não tem nenhum anúncio.</p>
          <Button asChild variant="hero"><Link to="/cadastro-empresa">Cadastrar meu negócio</Link></Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(l => (
            <article key={l.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-secondary shrink-0 relative">
                {l.photos?.[0] ? (
                  <img src={l.photos[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-8 h-8" /></div>
                )}
                <span className="absolute top-2 left-2 inline-flex items-center text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-black/60 text-white">
                  {l.photos?.length || 0} fotos
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-display font-bold text-xl">{l.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor[l.status] ?? "bg-secondary"}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                  {(l as any).pending_changes && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold uppercase">
                      Alterações em análise
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-semibold uppercase">
                    {CATEGORY_LABEL[l.category]}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase">
                    Plano {PLAN_LABEL[l.plan]}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{l.short_description}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                  {l.address && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {l.address}</span>}
                  {l.whatsapp && <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {l.whatsapp}</span>}
                  {l.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {l.phone}</span>}
                  {l.website && <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" /> site</span>}
                  {l.instagram && <span className="inline-flex items-center gap-1"><Instagram className="w-3 h-3" /> {l.instagram}</span>}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="hero">
                    <Link to={`/painel-anunciante/editar/${l.id}`}><Pencil className="w-3.5 h-3.5 mr-1" /> Editar anúncio</Link>
                  </Button>
                  {l.status === "approved" && (
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/listagem/${l.slug}`} target="_blank">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Ver no portal
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

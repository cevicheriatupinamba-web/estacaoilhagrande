import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { places, roteiros, tips, categories } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllListingsAdmin, STATUS_LABEL, PLAN_LABEL, CATEGORY_LABEL,
  type ListingRow, type ListingPlan, type ListingStatus,
} from "@/lib/listings-api";
import { Check, X, Star, Crown } from "lucide-react";

interface AdReq { id: number; name: string; category: string; whatsapp: string; email: string; description: string; status: string; createdAt: string }

const statusColor: Record<string, string> = {
  pending: "bg-sun text-sun-foreground",
  approved: "bg-forest text-forest-foreground",
  rejected: "bg-destructive text-destructive-foreground",
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [reqs, setReqs] = useState<AdReq[]>([]);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [filter, setFilter] = useState<"all" | ListingStatus>("pending");

  const loadListings = () => fetchAllListingsAdmin().then(setListings).catch(() => {});

  useEffect(() => {
    setReqs(JSON.parse(localStorage.getItem("ilhago_ad_requests") || "[]"));
    loadListings();
  }, []);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const updateStatus = (id: number, status: string) => {
    const next = reqs.map(r => r.id === id ? { ...r, status } : r);
    setReqs(next);
    localStorage.setItem("ilhago_ad_requests", JSON.stringify(next));
    toast({ title: `Solicitação ${status}` });
  };

  const updateListing = async (id: string, patch: Partial<ListingRow>) => {
    const { error } = await supabase.from("listings").update(patch).eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Atualizado" }); loadListings(); }
  };

  const approvePending = async (l: any) => {
    const patch = { ...(l.pending_changes || {}), pending_changes: null, pending_changes_at: null };
    const { error } = await supabase.from("listings").update(patch as any).eq("id", l.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Alterações aplicadas" }); loadListings(); }
  };

  const rejectPending = async (id: string) => {
    const { error } = await supabase.from("listings")
      .update({ pending_changes: null, pending_changes_at: null } as any).eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Alterações recusadas" }); loadListings(); }
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Remover esta listagem definitivamente?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Removida" }); loadListings(); }
  };

  const filtered = filter === "all" ? listings : listings.filter(l => l.status === filter);
  const pendingCount = listings.filter(l => l.status === "pending").length;
  const pendingEditsCount = listings.filter(l => !!(l as any).pending_changes).length;


  return (
    <div className="container py-10">
      <h1 className="font-display font-bold text-4xl mb-2">Painel admin</h1>
      <p className="text-muted-foreground mb-8">Gerencie cadastros, listagens e conteúdo.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          ["Cadastros", listings.length],
          ["Pendentes", pendingCount],
          ["Lugares", places.length],
          ["Roteiros", roteiros.length],
          ["Solicitações", reqs.length],
        ].map(([l, n]) => (
          <div key={l} className="bg-card rounded-2xl p-4 border border-border">
            <div className="text-xs text-muted-foreground">{l}</div>
            <div className="font-display font-bold text-2xl text-gradient-ocean">{n}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="listings">
            Cadastros{pendingCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-sun text-sun-foreground text-[10px] font-bold">{pendingCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="requests">Solicitações antigas</TabsTrigger>
          <TabsTrigger value="places">Lugares</TabsTrigger>
          <TabsTrigger value="routes">Roteiros</TabsTrigger>
          <TabsTrigger value="tips">Dicas</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["pending", "approved", "rejected", "all"] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"}`}>
                {s === "all" ? "Todos" : s === "pending" ? "Pendentes" : s === "approved" ? "Aprovados" : "Recusados"}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground p-6 bg-card rounded-2xl border border-border">Nenhum cadastro nesta categoria.</p>
          ) : filtered.map(l => (
            <article key={l.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-secondary shrink-0">
                {l.photos?.[0] && <img src={l.photos[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-display font-bold text-xl">{l.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor[l.status]}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-semibold uppercase">
                    {CATEGORY_LABEL[l.category]}{l.subcategory ? ` · ${l.subcategory}` : ""}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase">
                    {PLAN_LABEL[l.plan]}
                  </span>
                  {l.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold uppercase inline-flex items-center gap-1">
                      <Star className="w-3 h-3" /> Destaque
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{l.short_description}</p>
                <p className="text-xs text-muted-foreground">
                  {l.whatsapp && <>WA: {l.whatsapp} · </>}
                  {l.email && <>{l.email} · </>}
                  {l.neighborhood}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {l.status !== "approved" && (
                    <Button size="sm" variant="hero" onClick={() => updateListing(l.id, { status: "approved" })}>
                      <Check className="w-3.5 h-3.5 mr-1" /> Aprovar
                    </Button>
                  )}
                  {l.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => updateListing(l.id, { status: "rejected" })}>
                      <X className="w-3.5 h-3.5 mr-1" /> Recusar
                    </Button>
                  )}
                  <select value={l.plan}
                    onChange={e => updateListing(l.id, { plan: e.target.value as ListingPlan })}
                    className="h-9 px-2 rounded-lg border border-input bg-background text-xs">
                    {(["gratuito", "destaque", "premium"] as const).map(p => (
                      <option key={p} value={p}>Plano: {PLAN_LABEL[p]}</option>
                    ))}
                  </select>
                  <Button size="sm" variant="ghost" onClick={() => updateListing(l.id, { featured: !l.featured })}>
                    <Crown className="w-3.5 h-3.5 mr-1" /> {l.featured ? "Remover destaque" : "Marcar destaque"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteListing(l.id)}>Remover</Button>
                </div>
              </div>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="requests">
          {reqs.length === 0 ? (
            <p className="text-muted-foreground p-6 bg-card rounded-2xl border border-border">Sem solicitações antigas.</p>
          ) : (
            <div className="space-y-3">
              {reqs.map(r => (
                <article key={r.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{r.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{r.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "aprovado" ? "bg-forest text-forest-foreground" : r.status === "recusado" ? "bg-destructive text-destructive-foreground" : "bg-sun"}`}>{r.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{r.description}</p>
                    <p className="text-xs text-muted-foreground">{r.whatsapp} · {r.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="hero" onClick={() => updateStatus(r.id, "aprovado")}>Aprovar</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "recusado")}>Recusar</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="places">
          <div className="bg-card rounded-2xl border border-border divide-y divide-border">
            {places.map(p => (
              <div key={p.id} className="p-4 flex items-center gap-3">
                <img src={p.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.category} · ★ {p.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="routes">
          <div className="grid md:grid-cols-2 gap-3">
            {roteiros.map(r => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.duration} · {r.steps.length} etapas</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid md:grid-cols-2 gap-3">
            {tips.map(t => (
              <div key={t.title} className="bg-card border border-border rounded-2xl p-4">
                <div className="font-medium">{t.icon} {t.title}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

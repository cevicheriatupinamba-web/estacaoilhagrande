import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { places, roteiros, tips, categories } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdReq { id: number; name: string; category: string; whatsapp: string; email: string; description: string; status: string; createdAt: string }

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [reqs, setReqs] = useState<AdReq[]>([]);

  useEffect(() => {
    setReqs(JSON.parse(localStorage.getItem("ilhago_ad_requests") || "[]"));
  }, []);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const updateStatus = (id: number, status: string) => {
    const next = reqs.map(r => r.id === id ? { ...r, status } : r);
    setReqs(next);
    localStorage.setItem("ilhago_ad_requests", JSON.stringify(next));
    toast({ title: `Solicitação ${status}` });
  };

  return (
    <div className="container py-10">
      <h1 className="font-display font-bold text-4xl mb-2">Painel admin</h1>
      <p className="text-muted-foreground mb-8">Gerencie conteúdo e solicitações.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          ["Lugares", places.length],
          ["Categorias", categories.length],
          ["Roteiros", roteiros.length],
          ["Dicas", tips.length],
          ["Solicitações", reqs.length],
        ].map(([l, n]) => (
          <div key={l} className="bg-card rounded-2xl p-4 border border-border">
            <div className="text-xs text-muted-foreground">{l}</div>
            <div className="font-display font-bold text-2xl text-gradient-ocean">{n}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="requests">
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="places">Lugares</TabsTrigger>
          <TabsTrigger value="routes">Roteiros</TabsTrigger>
          <TabsTrigger value="tips">Dicas</TabsTrigger>
          <TabsTrigger value="cats">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          {reqs.length === 0 ? (
            <p className="text-muted-foreground p-6 bg-card rounded-2xl border border-border">Sem solicitações ainda. Teste enviando uma em /anuncie.</p>
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
                <Button size="sm" variant="outline">Editar</Button>
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

        <TabsContent value="cats">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(c => (
              <div key={c.key} className="bg-card border border-border rounded-2xl p-4">
                <div className="font-medium">{c.emoji} {c.label}</div>
                <div className="text-xs text-muted-foreground">{places.filter(p => p.category === c.key).length} lugares</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

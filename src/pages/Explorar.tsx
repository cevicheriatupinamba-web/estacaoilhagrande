import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { categories, places, CategoryKey } from "@/data/mockData";
import PlaceCard from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

const Explorar = () => {
  const [params, setParams] = useSearchParams();
  const initialCat = params.get("cat") as CategoryKey | null;
  const initialQ = params.get("q") || "";
  const [cat, setCat] = useState<CategoryKey | "all">(initialCat || "all");
  const [q, setQ] = useState(initialQ);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return places
      .filter(p => {
        if (cat !== "all" && p.category !== cat) return false;
        if (!term) return true;
        const haystack = [
          p.name,
          p.shortDescription,
          p.fullDescription,
          p.location,
          p.category,
          ...(p.tags ?? []),
          ...(p.tips ?? []),
        ].join(" ").toLowerCase();
        return haystack.includes(term);
      })
      .sort((a, b) => {
        // Premium → destaque (rating ≥ 4.8) → restantes
        const ap = a.premium ? 0 : a.rating >= 4.8 ? 1 : 2;
        const bp = b.premium ? 0 : b.rating >= 4.8 ? 1 : 2;
        if (ap !== bp) return ap - bp;
        return b.rating - a.rating;
      });
  }, [cat, q]);

  const setCategory = (k: CategoryKey | "all") => {
    setCat(k);
    const np = new URLSearchParams(params);
    if (k === "all") np.delete("cat"); else np.set("cat", k);
    setParams(np, { replace: true });
  };

  return (
    <>
    <SEO
      title="Explorar Ilha Grande — Busca por pousadas, restaurantes e passeios"
      description="Busque por nome, categoria ou localização tudo o que Ilha Grande oferece: pousadas, restaurantes, passeios, trilhas e mais."
      path="/explorar"
      keywords="explorar ilha grande, buscar ilha grande, mapa ilha grande, lugares ilha grande"
    />
    <div className="container py-10">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">Explorar a ilha</h1>
        <p className="text-muted-foreground">Encontre o melhor de Ilha Grande</p>
      </header>

      <div className="bg-card rounded-2xl p-3 flex flex-col sm:flex-row gap-2 shadow-soft border border-border mb-6">
        <div className="flex-1 flex items-center gap-2 px-3 bg-secondary rounded-xl">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Buscar nome, descrição ou local..."
            className="w-full bg-transparent outline-none py-2.5 text-sm" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-5 px-5 sm:mx-0 sm:px-0">
        <button onClick={() => setCategory("all")}
          className={cn("shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-smooth border",
            cat === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary")}>
          <Filter className="w-3.5 h-3.5 inline mr-1.5" /> Todas
        </button>
        {categories.filter(c => !["dicas", "nao-fazer"].includes(c.key)).map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            className={cn("shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-smooth border",
              cat === c.key ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary")}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border">
          <p className="text-muted-foreground mb-4">Nenhum resultado encontrado.</p>
          <Button variant="outline" onClick={() => { setQ(""); setCategory("all"); }}>Limpar filtros</Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} resultado(s)</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <PlaceCard key={p.id} place={p} />)}
          </div>
        </>
      )}
    </div>
    <Disclaimer />
    </>
  );
};

export default Explorar;

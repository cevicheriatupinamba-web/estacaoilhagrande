import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { fetchApprovedByCategory, SUBCATEGORIES, type ListingCategory, type ListingRow } from "@/lib/listings-api";
import DbListingCard from "./DbListingCard";
import PremiumUpsell from "./PremiumUpsell";

interface Props {
  category: ListingCategory;
  title?: string;
  subtitle?: string;
}

const DbListingSection = ({
  category,
  title = "Anunciantes verificados",
  subtitle = "Estabelecimentos cadastrados na nossa plataforma",
}: Props) => {
  const [items, setItems] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [sub, setSub] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [amenity, setAmenity] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchApprovedByCategory(category)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  const neighborhoods = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => { if (i.neighborhood) set.add(i.neighborhood); });
    return Array.from(set).sort();
  }, [items]);

  const amenities = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => (i.amenities || []).forEach(a => a && set.add(a)));
    return Array.from(set).sort().slice(0, 12);
  }, [items]);

  const subcats = SUBCATEGORIES[category] || [];
  const presentSubcats = subcats.filter(s => items.some(i => i.subcategory === s));

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(l => {
      if (sub && l.subcategory !== sub) return false;
      if (neighborhood && l.neighborhood !== neighborhood) return false;
      if (amenity && !(l.amenities || []).includes(amenity)) return false;
      if (term) {
        const hay = `${l.name} ${l.short_description ?? ""} ${l.description ?? ""} ${l.neighborhood ?? ""} ${l.address ?? ""}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [items, q, sub, neighborhood, amenity]);

  const activeCount = [sub, neighborhood, amenity, q].filter(Boolean).length;
  const clearAll = () => { setSub(""); setNeighborhood(""); setAmenity(""); setQ(""); };

  if (loading) {
    return (
      <section className="container py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-3xl bg-secondary/60 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container py-8">
        <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-dashed border-primary/30 p-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            Seja o primeiro
          </span>
          <h3 className="font-display font-bold text-2xl mb-2">Cadastre seu negócio aqui</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
            Apareça neste portal para milhares de turistas que planejam a viagem à Ilha Grande.
          </p>
          <Link to="/cadastro-empresa" className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition">
            Cadastrar agora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-bold">{title}</span>
          <h2 className="font-display font-black text-2xl md:text-3xl">{subtitle}</h2>
        </div>
        <Link to="/cadastro-empresa" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
          Anunciar aqui <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-card border border-border rounded-2xl p-3 mb-5 flex flex-col gap-3 shadow-soft">
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex items-center gap-2 px-3 bg-secondary rounded-xl">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar por nome, bairro ou descrição…"
              className="w-full bg-transparent outline-none py-2.5 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(s => !s)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:border-primary transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {activeCount}
              </span>
            )}
          </button>
          {activeCount > 0 && (
            <button type="button" onClick={clearAll}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition">
              <X className="w-3.5 h-3.5" /> Limpar
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-border">
            {presentSubcats.length > 0 && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Tipo</label>
                <select value={sub} onChange={e => setSub(e.target.value)}
                  className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="">Todos</option>
                  {presentSubcats.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            {neighborhoods.length > 0 && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Bairro / praia</label>
                <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                  className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="">Todos</option>
                  {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            {amenities.length > 0 && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Comodidade</label>
                <select value={amenity} onChange={e => setAmenity(e.target.value)}
                  className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="">Qualquer</option>
                  {amenities.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {presentSubcats.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pt-1 pb-1 -mx-1 px-1">
            <button onClick={() => setSub("")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                sub === "" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"
              }`}>
              Todos
            </button>
            {presentSubcats.map(s => (
              <button key={s} onClick={() => setSub(s === sub ? "" : s)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                  sub === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"
                }`}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border">
          <p className="text-muted-foreground mb-3">Nenhum resultado para esses filtros.</p>
          <button onClick={clearAll} className="text-sm font-semibold text-primary hover:underline">
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <PremiumUpsell variant="compact" category={category} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(l => <DbListingCard key={l.id} l={l} />)}
          </div>
          <div className="mt-10">
            <PremiumUpsell />
          </div>
        </>
      )}

      {/* CTA Anuncie aqui */}
      <div className="mt-10 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-sun/10 border border-primary/20 p-6 md:p-8 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
          Anuncie aqui
        </span>
        <h3 className="font-display font-bold text-2xl md:text-3xl mb-2">
          Quer aparecer nesta página?
        </h3>
        <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
          Cadastre seu negócio na Estação Ilha Grande e apareça para milhares de turistas todo mês.
        </p>
        <Link to="/anuncie"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
          Quero anunciar meu negócio <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default DbListingSection;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchApprovedByCategory, type ListingCategory, type ListingRow } from "@/lib/listings-api";
import DbListingCard from "./DbListingCard";

interface Props {
  category: ListingCategory;
  title?: string;
  subtitle?: string;
}

const DbListingSection = ({ category, title = "Anunciantes verificados", subtitle = "Estabelecimentos cadastrados na nossa plataforma" }: Props) => {
  const [items, setItems] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedByCategory(category)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading || items.length === 0) {
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map(l => <DbListingCard key={l.id} l={l} />)}
      </div>
    </section>
  );
};

export default DbListingSection;

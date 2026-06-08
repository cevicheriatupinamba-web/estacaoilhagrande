import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import TieredCard from "@/components/TieredCard";
import { STATIC_ITEMS, tierByIndex } from "@/lib/staticDetails";

const Servicos = () => {
  const items = STATIC_ITEMS["servicos"];
  return (
    <>
      <SEO
        title="Serviços em Ilha Grande: transfer, comércio, fotografia e mais"
        description="Guia completo de serviços em Ilha Grande: transfer, taxi boat, comércio local, fotografia, aluguel de equipamentos, beleza e serviços gerais."
        path="/servicos"
        keywords="serviços ilha grande, transfer ilha grande, taxi boat ilha grande, comércio em ilha grande, prestadores ilha grande"
        breadcrumbs={[{ name: "Serviços em Ilha Grande", path: "/servicos" }]}
      />
      <Breadcrumbs items={[{ name: "Serviços", path: "/servicos" }]} />

      <section className="bg-gradient-to-br from-primary/10 via-background to-sun/10 py-12">
        <div className="container">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
            Guia comercial
          </span>
          <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Serviços em Ilha Grande</h1>
          <p className="text-muted-foreground max-w-2xl">
            Transfer, comércio local, fotógrafos, aluguel de equipamentos e prestadores de
            confiança em toda a Ilha Grande.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <TieredCard key={item.slug} item={item} tier={tierByIndex(i)} />
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-sun/10 border border-primary/20 p-8 text-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">
            Presta serviços em Ilha Grande?
          </h2>
          <p className="text-muted-foreground mb-5 max-w-xl mx-auto">
            Cadastre seu negócio na Estação Ilha Grande e seja encontrado por milhares de turistas todo mês.
          </p>
          <Link to="/anuncie"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
            Anunciar meu serviço <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Servicos;

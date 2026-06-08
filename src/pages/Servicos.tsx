import { Link } from "react-router-dom";
import { ArrowRight, Truck, Camera, ShoppingBag, Sparkles, Anchor, Store, Wrench } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const GRUPOS = [
  {
    icon: Anchor,
    title: "Transfer & Taxi Boat",
    desc: "Translado Rio/Angra ↔ Ilha Grande, taxi boat entre praias e lanchas privativas.",
    to: "/transfer-ilha-grande",
    cta: "Ver transfers",
  },
  {
    icon: Truck,
    title: "Transporte",
    desc: "Como chegar e se locomover dentro da ilha — barcas, escunas e traslados.",
    to: "/como-chegar-em-ilha-grande",
    cta: "Ver transporte",
  },
  {
    icon: Camera,
    title: "Fotografia turística",
    desc: "Fotógrafos locais para ensaios, casamentos e cobertura de passeios.",
    to: "/anuncie",
    cta: "Anuncie aqui",
  },
  {
    icon: ShoppingBag,
    title: "Comércio local",
    desc: "Mercados, lojas de artesanato, lojas de praia, tabacarias e bancas.",
    to: "/comercio-local-ilha-grande",
    cta: "Ver comércio",
  },
  {
    icon: Store,
    title: "Aluguel de equipamentos",
    desc: "Snorkel, prancha, SUP, caiaque e equipamentos de trilha.",
    to: "/anuncie",
    cta: "Anuncie aqui",
  },
  {
    icon: Sparkles,
    title: "Beleza, estética e bem-estar",
    desc: "Massagem, terapias, salão de beleza e estética na vila.",
    to: "/anuncie",
    cta: "Anuncie aqui",
  },
  {
    icon: Wrench,
    title: "Serviços gerais",
    desc: "Manutenção, lavanderia, eventos e prestadores locais.",
    to: "/anuncie",
    cta: "Anuncie aqui",
  },
];

const Servicos = () => (
  <>
    <SEO
      title="Serviços em Ilha Grande: transfer, comércio, fotografia e mais"
      description="Guia completo de serviços em Ilha Grande: transfer, taxi boat, comércio local, fotografia, aluguel de equipamentos, beleza e serviços gerais. Anuncie seu negócio."
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
          Encontre transfer, comércio local, fotógrafos, aluguel de equipamentos e prestadores
          de confiança em toda a Ilha Grande.
        </p>
      </div>
    </section>

    <section className="container py-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GRUPOS.map(g => {
          const Icon = g.icon;
          return (
            <Link
              key={g.title}
              to={g.to}
              className="group bg-card rounded-3xl border border-border/60 p-6 hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-xl mb-2">{g.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{g.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                {g.cta} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          );
        })}
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

export default Servicos;

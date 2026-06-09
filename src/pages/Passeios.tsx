import { useMemo, useState } from "react";
import {
  DollarSign, AlertTriangle, Check, X, Sparkles,
  Sun, CloudRain, Compass, Camera, Waves, Heart, Leaf,
} from "lucide-react";
import { boatTours } from "@/data/listings";
import Disclaimer from "@/components/Disclaimer";
import DbListingSection from "@/components/DbListingSection";
import TieredCard from "@/components/TieredCard";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { themedImage } from "@/lib/images";
import { curatedTourImage } from "@/lib/curatedImages";
import { STATIC_ITEMS, tierByIndex, slugify } from "@/lib/staticDetails";
import { itemListLd } from "@/lib/jsonld";

const PASSEIOS_FAQS = [
  { question: "Qual o melhor passeio de barco em Ilha Grande?", answer: "A 'Volta à Ilha' é o passeio mais completo, visitando Aventureiro, Parnaioca, Lagoa Azul e outras praias paradisíacas em um único dia." },
  { question: "Quanto custa um passeio de barco em Ilha Grande?", answer: "Passeios em escuna coletiva custam entre R$ 120 e R$ 250 por pessoa. Lanchas privativas saem a partir de R$ 1.500 por embarcação." },
  { question: "Vale a pena fazer Lagoa Azul?", answer: "Sim — a Lagoa Azul tem águas cristalinas e é parada obrigatória dos passeios de meia volta e volta à ilha." },
];

const categories = ["Todos", "Aventura", "Relax", "Mergulho", "VIP", "Ecoturismo"] as const;

const included = [
  "Transporte marítimo", "Marinheiro experiente", "Coletes salva-vidas",
  "Paradas para banho e mergulho", "Roteiro turístico guiado",
];
const notIncluded = [
  "Alimentação", "Bebidas a bordo", "Taxas ambientais",
  "Equipamentos de mergulho extras", "Fotos profissionais",
];
const bring = [
  { icon: Sun, label: "Protetor solar" },
  { icon: Waves, label: "Roupa leve & maiô" },
  { icon: Compass, label: "Toalha e chinelo" },
  { icon: DollarSign, label: "Dinheiro / cartão" },
  { icon: Camera, label: "Capa impermeável p/ celular" },
  { icon: CloudRain, label: "Corta-vento leve" },
];

const reasons = [
  { icon: Leaf, title: "Biodiversidade", text: "Mata atlântica preservada e vida marinha rica." },
  { icon: Waves, title: "Águas cristalinas", text: "Piscinas naturais com visibilidade de cinema." },
  { icon: Heart, title: "Praias preservadas", text: "Areia branca, coqueiros e cenários selvagens." },
  { icon: Compass, title: "Trilhas ecológicas", text: "Roteiros leves até travessias de dia inteiro." },
  { icon: Sparkles, title: "Cultura caiçara", text: "Vilarejos, gastronomia e hospitalidade local." },
];

const bestExperiences = [
  { title: "Nascer do sol no cais", tag: "Contemplação" },
  { title: "Mergulho na Lagoa Azul", tag: "Snorkel" },
  { title: "Lancha VIP privativa", tag: "Premium" },
  { title: "Praias isoladas do Sul", tag: "Aventura" },
  { title: "Gastronomia caiçara", tag: "Sabor" },
];

const Passeios = () => {
  const [cat, setCat] = useState<(typeof categories)[number]>("Todos");
  const all = STATIC_ITEMS["passeios"];

  const featuredSlugs = new Set(boatTours.filter(t => t.featured).map(t => slugify(t.name)));
  const featured = all
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => featuredSlugs.has(item.slug));

  // Evita exibir o mesmo passeio duas vezes (Top experiências + grid principal)
  const visible = useMemo(() => {
    return all
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) =>
        (cat === "Todos" || item.subcategory === cat) &&
        !featuredSlugs.has(item.slug)
      );
  }, [cat, all, featuredSlugs]);

  return (
    <>
      <SEO
        title="Passeios em Ilha Grande: Volta à Ilha, Lagoa Azul e lancha privativa"
        description="Os melhores passeios de barco em Ilha Grande: Volta à Ilha, meia volta, Lagoa Azul, Lagoa Verde, mergulho e lancha privativa. Compare roteiros e preços."
        path="/passeios"
        keywords="passeios em ilha grande, volta à ilha grande, meia volta ilha grande, lagoa azul, lagoa verde, mergulho ilha grande, lancha em ilha grande, passeio de barco ilha grande"
        breadcrumbs={[{ name: "Passeios em Ilha Grande", path: "/passeios" }]}
        faqs={PASSEIOS_FAQS}
      />
      <Breadcrumbs items={[{ name: "Passeios", path: "/passeios" }]} />

      <section className="relative gradient-ocean text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        <div className="container relative">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-background/15 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Mar & Aventura
          </span>
          <h1 className="font-display font-black text-4xl md:text-6xl mb-4 leading-tight">
            Passeios de barco<br />em Ilha Grande
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl text-lg mb-6">
            Volta à ilha, Lopes Mendes, Lagoa Azul, Aventureiro e roteiros VIP — escolha a experiência que combina com sua viagem.
          </p>
        </div>
      </section>

      <DbListingSection category="passeio" subtitle="Passeios e agências cadastradas" />

      {featured.length > 0 && (
        <section className="container py-12">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Mais procurados</span>
            <h2 className="font-display font-black text-3xl md:text-4xl">Top experiências</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(({ item, originalIndex }) => (
              <TieredCard key={item.slug} item={item} tier={tierByIndex(originalIndex)} />
            ))}
          </div>
        </section>
      )}

      <section className="container py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 mb-6">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-smooth ${
                cat === c
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map(({ item, originalIndex }) => (
            <TieredCard key={item.slug} item={item} tier={tierByIndex(originalIndex)} />
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-14 mt-10">
        <div className="container grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-forest/15 text-forest flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl">Normalmente incluso</h3>
            </div>
            <ul className="space-y-2">
              {included.map(i => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-forest mt-0.5 shrink-0" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-destructive/15 text-destructive flex items-center justify-center">
                <X className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl">Normalmente não incluso</h3>
            </div>
            <ul className="space-y-2">
              {notIncluded.map(i => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl">O que levar</h3>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {bring.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm bg-secondary/60 rounded-xl px-3 py-2">
                  <Icon className="w-4 h-4 text-primary shrink-0" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="rounded-3xl gradient-sunset text-accent-foreground p-8 md:p-12 shadow-card">
          <div className="flex items-start gap-4 max-w-3xl">
            <AlertTriangle className="w-10 h-10 shrink-0" />
            <div>
              <h3 className="font-display font-black text-2xl md:text-3xl mb-2">Condições climáticas</h3>
              <p className="text-accent-foreground/90 leading-relaxed">
                A segurança marítima é prioridade. Roteiros podem ser ajustados conforme o mar e o vento, e
                em dias de mar aberto o balanço pode ser intenso. Confirme sempre a previsão e as paradas
                com a agência antes do embarque.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Por que conhecer</span>
          <h2 className="font-display font-black text-3xl md:text-4xl mt-1">Por que visitar Ilha Grande?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-card rounded-2xl p-5 border border-border shadow-soft hover:shadow-card transition-smooth">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-14">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-accent font-bold">Não pode faltar</span>
            <h2 className="font-display font-black text-3xl md:text-4xl mt-1">Melhores experiências</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bestExperiences.map(e => (
              <div key={e.title} className="relative rounded-2xl overflow-hidden aspect-[3/4] group">
                <img src={curatedTourImage(slugify(e.title), themedImage("activity", e.title))} alt={e.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-smooth" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-[10px] uppercase tracking-wider text-sun font-bold">{e.tag}</span>
                  <h4 className="font-display font-bold text-lg text-primary-foreground leading-tight">{e.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Disclaimer />
    </>
  );
};

export default Passeios;

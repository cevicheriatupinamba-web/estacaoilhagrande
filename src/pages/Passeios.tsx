import { useMemo, useState } from "react";
import {
  Clock, DollarSign, Ship, MapPin, AlertTriangle, Check, X, Sparkles,
  Sun, CloudRain, Compass, Camera, Waves, Heart, Leaf, Trophy,
} from "lucide-react";
import { boatTours, type BoatTour } from "@/data/listings";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";
import DbListingSection from "@/components/DbListingSection";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { themedImage } from "@/lib/images";

const PASSEIOS_FAQS = [
  { question: "Qual o melhor passeio de barco em Ilha Grande?", answer: "A 'Volta à Ilha' é o passeio mais completo, visitando Aventureiro, Parnaioca, Lagoa Azul e outras praias paradisíacas em um único dia." },
  { question: "Quanto custa um passeio de barco em Ilha Grande?", answer: "Passeios em escuna coletiva custam entre R$ 120 e R$ 250 por pessoa. Lanchas privativas saem a partir de R$ 1.500 por embarcação." },
  { question: "Vale a pena fazer Lagoa Azul?", answer: "Sim — a Lagoa Azul tem águas cristalinas e é parada obrigatória dos passeios de meia volta e volta à ilha." },
];


const categories = ["Todos", "Aventura", "Relax", "Mergulho", "VIP", "Ecoturismo"] as const;

const included = [
  "Transporte marítimo",
  "Marinheiro experiente",
  "Coletes salva-vidas",
  "Paradas para banho e mergulho",
  "Roteiro turístico guiado",
];
const notIncluded = [
  "Alimentação",
  "Bebidas a bordo",
  "Taxas ambientais",
  "Equipamentos de mergulho extras",
  "Fotos profissionais",
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

const TourCard = ({ t }: { t: BoatTour }) => (
  <article className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-smooth border border-border/60 flex flex-col">
    <div className="relative aspect-[16/10] overflow-hidden">
      <img src={t.image} alt={t.name} loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
      {t.featured && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sun text-foreground text-[10px] font-bold uppercase tracking-wider shadow-soft">
          <Trophy className="w-3 h-3" /> Mais procurado
        </span>
      )}
      {t.category && (
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/90 text-foreground text-[10px] font-semibold uppercase tracking-wider">
          {t.category}
        </span>
      )}
      <div className="absolute bottom-3 left-4 right-4">
        <h3 className="font-display font-bold text-2xl text-primary-foreground leading-tight">{t.name}</h3>
        {t.difficulty && (
          <span className="text-[11px] text-primary-foreground/80 font-medium">Dificuldade: {t.difficulty}</span>
        )}
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl bg-secondary p-2.5 text-center">
          <Clock className="w-4 h-4 mx-auto text-primary mb-1" />
          <div className="text-[10px] uppercase text-muted-foreground">Duração</div>
          <div className="text-xs font-semibold">{t.duration}</div>
        </div>
        <div className="rounded-xl bg-secondary p-2.5 text-center">
          <DollarSign className="w-4 h-4 mx-auto text-forest mb-1" />
          <div className="text-[10px] uppercase text-muted-foreground">Preço médio</div>
          <div className="text-xs font-semibold leading-tight">{t.avgPrice}</div>
        </div>
        <div className="rounded-xl bg-secondary p-2.5 text-center">
          <Ship className="w-4 h-4 mx-auto text-accent mb-1" />
          <div className="text-[10px] uppercase text-muted-foreground">Embarcação</div>
          <div className="text-xs font-semibold leading-tight">{t.boat}</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{t.highlight}</p>

      <div className="mb-3">
        <div className="flex items-center gap-1 text-xs font-semibold mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" /> Pontos visitados
        </div>
        <div className="flex flex-wrap gap-1">
          {t.stops.map(s => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-sun/15 border border-sun/40 p-3 mb-4">
        <AlertTriangle className="w-4 h-4 text-sun-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-foreground/80">{t.alert}</p>
      </div>

      <Button variant="hero" size="sm" className="w-full mt-auto">Quero esse passeio</Button>
    </div>
  </article>
);

const Passeios = () => {
  const [cat, setCat] = useState<(typeof categories)[number]>("Todos");
  const list = useMemo(
    () => (cat === "Todos" ? boatTours : boatTours.filter(t => t.category === cat)),
    [cat]
  );
  const featured = boatTours.filter(t => t.featured);

  return (
    <>
      {/* HERO */}
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
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-background/15 backdrop-blur">🚤 Escuna & lancha</span>
            <span className="px-3 py-1.5 rounded-full bg-background/15 backdrop-blur">🤿 Mergulho livre</span>
            <span className="px-3 py-1.5 rounded-full bg-background/15 backdrop-blur">🏝️ Praias paradisíacas</span>
          </div>
        </div>
      </section>
      <DbListingSection category="passeio" subtitle="Passeios e agências cadastradas" />


      {/* DESTAQUES */}
      {featured.length > 0 && (
        <section className="container py-12">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Mais procurados</span>
              <h2 className="font-display font-black text-3xl md:text-4xl">Top experiências</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map(t => <TourCard key={t.id} t={t} />)}
          </div>
        </section>
      )}

      {/* FILTRO + LISTA */}
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
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map(t => <TourCard key={t.id} t={t} />)}
        </div>
      </section>

      {/* INCLUSO / NÃO INCLUSO / O QUE LEVAR */}
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

      {/* CONDIÇÕES CLIMÁTICAS */}
      <section className="container py-14">
        <div className="rounded-3xl gradient-sunset text-accent-foreground p-8 md:p-12 shadow-card">
          <div className="flex items-start gap-4 max-w-3xl">
            <CloudRain className="w-10 h-10 shrink-0" />
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

      {/* POR QUE CONHECER */}
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

      {/* MELHORES EXPERIÊNCIAS */}
      <section className="bg-secondary/40 py-14">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-accent font-bold">Não pode faltar</span>
            <h2 className="font-display font-black text-3xl md:text-4xl mt-1">Melhores experiências</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bestExperiences.map((e, i) => (
              <div key={e.title} className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                <img src={themedImage("activity", e.title)} alt={e.title}
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

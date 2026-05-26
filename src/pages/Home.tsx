import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-ilha.jpg";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";

const img = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/900`;

const portalCategories = [
  { label: "Onde se Hospedar", to: "/onde-se-hospedar", img: img("hosp-portal"), tag: "Pousadas & Hotéis" },
  { label: "Restaurantes", to: "/restaurantes", img: img("rest-portal"), tag: "Sabores caiçaras" },
  { label: "O Que Fazer", to: "/o-que-fazer", img: img("fazer-portal"), tag: "Experiências" },
  { label: "Passeios", to: "/passeios", img: img("passeio-portal"), tag: "Barco & lancha" },
  { label: "Praias", to: "/praias", img: img("praia-portal"), tag: "Paraíso natural" },
  { label: "Trilhas", to: "/trilhas", img: img("trilha-portal"), tag: "Aventura" },
  { label: "Vida Noturna", to: "/vida-noturna", img: img("noite-portal"), tag: "Bares & shows" },
  { label: "Transporte", to: "/transporte", img: img("transp-portal"), tag: "Como chegar" },
  { label: "Dicas Importantes", to: "/dicas", img: img("dicas-portal"), tag: "Saiba antes" },
  { label: "Guias Locais", to: "/guias", img: img("guias-portal"), tag: "Caiçaras" },
];

const Home = () => {
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/explorar?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img src={hero} alt="Ilha Grande vista aérea ao pôr do sol" width={1920} height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[float_20s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/40 to-foreground/85" />

        <div className="container relative z-10 py-20 text-primary-foreground animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/15 backdrop-blur border border-background/20 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Guia oficial — Ilha Grande / RJ
          </span>
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.02] max-w-4xl mb-5">
            O portal premium <br /><span className="text-gradient-sunset">da Ilha Grande</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mb-8">
            Pousadas, restaurantes, passeios e experiências curadas em um só lugar. Descubra o paraíso como um local.
          </p>

          <form onSubmit={submit} className="max-w-2xl bg-background rounded-2xl p-2 flex gap-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="Busque praias, pousadas, passeios..."
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground py-3" />
            </div>
            <Button type="submit" variant="hero" size="lg">Buscar</Button>
          </form>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Lopes Mendes", "Pico do Papagaio", "Lagoa Azul", "Aventureiro", "Saco do Céu"].map(t => (
              <button key={t} onClick={() => nav(`/explorar?q=${encodeURIComponent(t)}`)}
                className="px-3 py-1.5 rounded-full text-xs bg-background/15 backdrop-blur border border-background/20 hover:bg-background/25 transition-smooth">
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PORTAL: cinematic category cards */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Portal Ilha Grande</span>
          <h2 className="font-display font-black text-4xl md:text-5xl mt-2 mb-3">Tudo da ilha em um só lugar</h2>
          <p className="text-muted-foreground text-lg">Escolha por onde começar a explorar.</p>
        </div>

        {/* Featured large cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portalCategories.slice(0, 6).map((c, i) => (
            <Link key={c.to} to={c.to}
              className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "lg:col-span-2 lg:row-span-2 min-h-[460px]" : "min-h-[300px]"} shadow-xl hover:shadow-2xl transition-all duration-500`}>
              <img src={c.img} alt={c.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/40 to-transparent" />
              <div className="relative z-10 h-full p-7 flex flex-col justify-end text-primary-foreground">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-sun mb-2">
                  <MapPin className="w-3 h-3" /> {c.tag}
                </span>
                <h3 className={`font-display font-black ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"} mb-3 drop-shadow-lg`}>
                  {c.label}
                </h3>
                <span className="inline-flex items-center gap-2 text-sm font-semibold opacity-90 group-hover:gap-3 transition-all">
                  Saiba Mais <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {portalCategories.slice(6).map(c => (
            <Link key={c.to} to={c.to}
              className="group relative overflow-hidden rounded-2xl min-h-[180px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
              <div className="relative z-10 h-full p-4 flex flex-col justify-end text-primary-foreground">
                <h3 className="font-display font-bold text-lg drop-shadow">{c.label}</h3>
                <span className="text-xs opacity-80 mt-1 inline-flex items-center gap-1">Saiba Mais <ArrowRight className="w-3 h-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA ROTEIROS */}
      <section className="container py-12">
        <div className="relative overflow-hidden rounded-3xl gradient-forest text-forest-foreground p-10 md:p-14">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-background/15 text-xs font-medium mb-4">Roteiros prontos</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">Não sabe por onde começar?</h2>
            <p className="text-forest-foreground/90 mb-6 text-lg">
              Temos roteiros para 1, 2 ou 3 dias, família, casal, aventura e econômico. Escolha o seu e siga sem stress.
            </p>
            <Button asChild variant="sunset" size="lg">
              <Link to="/roteiros">Ver roteiros <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-glow/20 blur-3xl" />
          <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-sun/20 blur-3xl" />
        </div>
      </section>

      {/* CTA ANUNCIE */}
      <section className="container pb-16">
        <div className="rounded-3xl bg-card border border-border p-10 grid md:grid-cols-2 gap-6 items-center shadow-soft">
          <div>
            <h2 className="font-display font-bold text-3xl mb-2">Tem um negócio em Ilha Grande?</h2>
            <p className="text-muted-foreground mb-6">Pousada, restaurante ou agência? Apareça para milhares de turistas todos os meses.</p>
            <Button asChild variant="hero" size="lg">
              <Link to="/anuncie">Quero anunciar</Link>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["+50k", "visitas/mês"], ["+200", "anunciantes"], ["4.9★", "satisfação"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-secondary p-4">
                <div className="font-display font-bold text-2xl text-gradient-ocean">{n}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <Disclaimer />
      </section>
    </>
  );
};

export default Home;

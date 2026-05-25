import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-ilha.jpg";
import { categories, places } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import PlaceCard from "@/components/PlaceCard";

const Home = () => {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const featured = places.slice(0, 4);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/explorar?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <img src={hero} alt="Ilha Grande vista aérea ao pôr do sol" width={1920} height={1080}
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-foreground/80" />

        <div className="container relative z-10 py-20 text-primary-foreground animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/15 backdrop-blur border border-background/20 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Seu guia local em Ilha Grande
          </span>
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.05] max-w-3xl mb-5">
            Explore Ilha Grande <br /><span className="text-gradient-sunset">com o Ilha Go</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mb-8">
            Descubra praias paradisíacas, trilhas inesquecíveis, onde comer, onde se hospedar e os melhores passeios — tudo em um só lugar.
          </p>

          <form onSubmit={submit} className="max-w-2xl bg-background rounded-2xl p-2 flex gap-2 shadow-glow">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="Busque praias, pousadas, passeios..."
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground py-3" />
            </div>
            <Button type="submit" variant="hero" size="lg">Buscar</Button>
          </form>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Lopes Mendes", "Pico do Papagaio", "Lagoa Azul", "Aventureiro"].map(t => (
              <button key={t} onClick={() => nav(`/explorar?q=${encodeURIComponent(t)}`)}
                className="px-3 py-1.5 rounded-full text-xs bg-background/15 backdrop-blur border border-background/20 hover:bg-background/25 transition-smooth">
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Categorias em destaque</h2>
            <p className="text-muted-foreground">O que você quer descobrir hoje?</p>
          </div>
          <Link to="/explorar" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver tudo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.slice(0, 5).map(c => (
            <Link key={c.key} to={`/explorar?cat=${c.key}`}
              className="group bg-card rounded-3xl p-5 border border-border/60 hover:border-primary hover:-translate-y-1 transition-smooth shadow-soft text-center">
              <div className="text-4xl mb-2 group-hover:animate-float">{c.emoji}</div>
              <h3 className="font-semibold text-sm mb-1">{c.label}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {categories.slice(5).map(c => (
            <Link key={c.key} to={`/explorar?cat=${c.key}`}
              className="group bg-secondary rounded-2xl p-4 hover:bg-primary hover:text-primary-foreground transition-smooth flex items-center gap-3">
              <span className="text-2xl">{c.emoji}</span>
              <span className="font-semibold text-sm">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Imperdíveis da Ilha</h2>
            <p className="text-muted-foreground">Curados pela comunidade local</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map(p => <PlaceCard key={p.id} place={p} />)}
        </div>
      </section>

      {/* CTA ROTEIROS */}
      <section className="container py-16">
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
      <section className="container pb-20">
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
      </section>
    </>
  );
};

export default Home;

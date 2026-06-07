import { Link } from "react-router-dom";
import { Bus, Bed, Compass, UtensilsCrossed, CalendarDays, CloudSun, Mountain, Waves, Map, Sparkles } from "lucide-react";

const blocks = [
  { to: "/como-chegar-em-ilha-grande", icon: Bus, title: "Como chegar", desc: "Transfers do Rio, SP, vans, barcos e horários." },
  { to: "/onde-ficar-em-ilha-grande", icon: Bed, title: "Onde ficar", desc: "Pousadas, hostels, hotéis e camping." },
  { to: "/o-que-fazer-em-ilha-grande", icon: Compass, title: "O que fazer", desc: "Passeios, experiências e cultura local." },
  { to: "/onde-comer-em-ilha-grande", icon: UtensilsCrossed, title: "Onde comer", desc: "Restaurantes caiçaras, bares e cafés." },
  { to: "/eventos-ilha-grande", icon: CalendarDays, title: "Eventos da semana", desc: "Festas, festivais e agenda cultural." },
  { to: "/melhor-epoca-para-visitar-ilha-grande", icon: CloudSun, title: "Quando ir", desc: "Clima, temporadas e melhor época." },
  { to: "/trilhas-em-ilha-grande", icon: Mountain, title: "Trilhas", desc: "Pico do Papagaio, T10, Dois Rios e mais." },
  { to: "/praias-de-ilha-grande", icon: Waves, title: "Praias", desc: "Lopes Mendes, Aventureiro, Lagoa Azul." },
  { to: "/explorar", icon: Map, title: "Mapa interativo", desc: "Veja tudo no mapa por categoria." },
  { to: "/experiencias-ilha-grande", icon: Sparkles, title: "Experiências", desc: "Mergulho, stand-up paddle, observação." },
];

const PlanejeViagem = () => (
  <section className="container py-20" aria-labelledby="planeje-viagem">
    <div className="text-center max-w-2xl mx-auto mb-12">
      <span className="text-xs font-bold tracking-widest text-primary uppercase">Planeje sua viagem</span>
      <h2 id="planeje-viagem" className="font-display font-black text-4xl md:text-5xl mt-2 mb-3">
        Seu embarque para o paraíso começa aqui
      </h2>
      <p className="text-muted-foreground text-lg">
        Tudo que você precisa saber para visitar Ilha Grande em um só lugar.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {blocks.map(({ to, icon: Icon, title, desc }) => (
        <Link
          key={to}
          to={to}
          className="group relative rounded-2xl border border-border/60 bg-card p-5 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/40 transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{desc}</p>
        </Link>
      ))}
    </div>
  </section>
);

export default PlanejeViagem;

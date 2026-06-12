import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import lopesMendes from "@/assets/destinos/lopes-mendes.jpg";
import lagoaAzul from "@/assets/destinos/lagoa-azul.jpg";
import aventureiro from "@/assets/destinos/aventureiro.jpg";
import doisRios from "@/assets/destinos/dois-rios.jpg";
import picoPapagaio from "@/assets/destinos/pico-papagaio.jpg";

interface Destino {
  slug: string;
  nome: string;
  categoria: string;
  experiencias: number;
  to: string;
  img: string;
}

const destinos: Destino[] = [
  { slug: "lopes-mendes", nome: "Lopes Mendes", categoria: "Praia paradisíaca", experiencias: 18, to: "/explorar?q=Lopes+Mendes", img: lopesMendes },
  { slug: "lagoa-azul", nome: "Lagoa Azul", categoria: "Passeio de barco", experiencias: 24, to: "/explorar?q=Lagoa+Azul", img: lagoaAzul },
  { slug: "aventureiro", nome: "Praia do Aventureiro", categoria: "Vila caiçara", experiencias: 12, to: "/explorar?q=Aventureiro", img: aventureiro },
  { slug: "dois-rios", nome: "Dois Rios", categoria: "Praia selvagem", experiencias: 9, to: "/explorar?q=Dois+Rios", img: doisRios },
  { slug: "pico-papagaio", nome: "Pico do Papagaio", categoria: "Trilha icônica", experiencias: 7, to: "/trilhas-em-ilha-grande", img: picoPapagaio },
];

const DestinosDestaque = () => (
  <section className="container py-20" aria-labelledby="destinos-destaque">
    <div className="flex items-end justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        <span className="text-xs font-bold tracking-widest text-primary uppercase">Destinos em destaque</span>
        <h2 id="destinos-destaque" className="font-display font-black text-4xl md:text-5xl mt-2 mb-3">
          Os lugares mais desejados da Ilha
        </h2>
        <p className="text-muted-foreground text-lg">
          Curadoria das praias, trilhas e passeios imperdíveis. Toque para explorar.
        </p>
      </div>
      <Link to="/explorar" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
        Ver tudo <ArrowRight className="w-4 h-4" />
      </Link>
    </div>

    <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
      {destinos.map((d) => (
        <Link
          key={d.slug}
          to={d.to}
          className="group relative shrink-0 snap-start w-[78%] sm:w-[55%] md:w-[42%] lg:w-[28%] aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
          <img
            src={d.img}
            alt={`${d.nome} — ${d.categoria} em Ilha Grande`}
            loading="lazy"
            width={1024}
            height={1024}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent" />
          <div className="relative z-10 h-full p-6 flex flex-col justify-end text-primary-foreground">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-sun mb-2">
              <MapPin className="w-3 h-3" /> {d.categoria}
            </span>
            <h3 className="font-display font-black text-2xl md:text-3xl mb-1 drop-shadow-lg">
              {d.nome}
            </h3>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs opacity-90">{d.experiencias} experiências</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-background/15 backdrop-blur px-3 py-1.5 rounded-full border border-background/20 group-hover:bg-background group-hover:text-foreground transition-all">
                Explorar <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default DestinosDestaque;

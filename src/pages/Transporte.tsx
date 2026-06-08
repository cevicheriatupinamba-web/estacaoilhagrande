import { Link } from "react-router-dom";
import { ExternalLink, MessageCircle, Clock, Ship, ArrowRight, MapPin } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import { TRANSPORT_IMAGES } from "@/lib/curatedImages";

const FAQS = [
  { question: "Como chegar em Ilha Grande?", answer: "A travessia é feita por mar saindo de Angra dos Reis, Mangaratiba ou Conceição de Jacareí. Há barcas oficiais (mais baratas, ~1h20) e catamarãs/lanchas rápidas (~30min)." },
  { question: "Qual a forma mais rápida de chegar em Ilha Grande?", answer: "Lanchas rápidas (flexboat/catamarã) saindo de Conceição de Jacareí chegam à Vila do Abraão em cerca de 20 a 30 minutos." },
  { question: "Tem carro em Ilha Grande?", answer: "Não. A ilha não permite carros para turistas — a locomoção é a pé, por trilhas ou táxi-boat entre as praias." },
  { question: "Quanto custa o transfer Rio de Janeiro → Ilha Grande?", answer: "Combos de van + lancha saem em média entre R$ 180 e R$ 280 por pessoa, dependendo do ponto de saída e da temporada." },
];

interface TransportItem {
  name: string;
  route: string;
  duration: string;
  description: string;
  image: string;
  imageAlt: string;
  officialUrl?: string;
  whatsapp?: string;
}

const WA_CENTRAL = "5524999992503";

const ITEMS: TransportItem[] = [
  {
    name: "CCR Barcas (Ferry oficial)",
    route: "Angra dos Reis ⇄ Vila do Abraão",
    duration: "≈ 1h20",
    description: "Travessia oficial mais econômica entre Angra dos Reis e Ilha Grande. Saídas diárias com horários fixos publicados pela concessionária.",
    image: TRANSPORT_IMAGES.ferry,
    imageAlt: "Barca de travessia para Ilha Grande no cais de Angra dos Reis",
    officialUrl: "https://www.grupoccr.com.br/barcas/",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Catamarã / Lancha rápida",
    route: "Angra dos Reis ⇄ Vila do Abraão",
    duration: "≈ 30 min",
    description: "Travessia rápida em catamarã com várias saídas ao longo do dia. Boa opção para quem chega tarde em Angra e quer otimizar tempo.",
    image: TRANSPORT_IMAGES.catamara,
    imageAlt: "Catamarã rápido para travessia até Ilha Grande",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Flexboat (lancha rápida)",
    route: "Conceição de Jacareí ⇄ Vila do Abraão",
    duration: "≈ 20–30 min",
    description: "Saídas frequentes do cais de Conceição de Jacareí — o ponto mais próximo do Rio de Janeiro. Forma mais rápida de chegar à ilha.",
    image: TRANSPORT_IMAGES.flexboat,
    imageAlt: "Flexboat de travessia rápida para Ilha Grande",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Conceição de Jacareí",
    route: "Cais de embarque (BR-101)",
    duration: "≈ 2h30 do Rio de Janeiro",
    description: "Cais alternativo à beira da BR-101, mais próximo do Rio. Tem estacionamento privado e saídas constantes de lanchas para o Abraão.",
    image: TRANSPORT_IMAGES.conceicao,
    imageAlt: "Cais de embarque de Conceição de Jacareí para Ilha Grande",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Angra dos Reis",
    route: "Cais Santa Luzia / Cais da Lapa",
    duration: "≈ 2h40 do Rio · 6h de SP",
    description: "Principal porto de saída, com barcas, catamarãs e escunas. Conta com infraestrutura completa de estacionamento e terminais cobertos.",
    image: TRANSPORT_IMAGES.angra,
    imageAlt: "Porto de Angra dos Reis com embarcações para Ilha Grande",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Mangaratiba",
    route: "Mangaratiba ⇄ Vila do Abraão",
    duration: "≈ 1h30",
    description: "Saída interessante para quem vem do Rio pela BR-101. Barca CCR oficial sai pela manhã e retorna ao final do dia.",
    image: TRANSPORT_IMAGES.mangaratiba,
    imageAlt: "Terminal de barcas de Mangaratiba para Ilha Grande",
    officialUrl: "https://www.grupoccr.com.br/barcas/",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Escuna turística",
    route: "Bate-volta a partir de Angra",
    duration: "6–8 h",
    description: "Escunas tradicionais que combinam travessia e passeio entre as ilhas, com paradas em piscinas naturais. Indicado para day-use.",
    image: TRANSPORT_IMAGES.escuna,
    imageAlt: "Escuna turística navegando entre as ilhas de Ilha Grande",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Táxi-boat na ilha",
    route: "Entre praias de Ilha Grande",
    duration: "Sob demanda",
    description: "Transporte local entre as praias da ilha — única forma de chegar a Lagoa Azul, Saco do Céu e enseadas sem trilha demorada.",
    image: TRANSPORT_IMAGES.taxiboat,
    imageAlt: "Táxi-boat ancorado em praia de Ilha Grande",
    whatsapp: WA_CENTRAL,
  },
  {
    name: "Transfer terrestre (van/carro)",
    route: "Rio · Galeão · Santos Dumont → cais",
    duration: "2h30 a 3h",
    description: "Vans e carros executivos com saída direta de hotéis, aeroportos e rodoviárias do Rio até o cais de embarque. Reserva no WhatsApp.",
    image: TRANSPORT_IMAGES.vanTransfer,
    imageAlt: "Van executiva de transfer turístico para Ilha Grande",
    whatsapp: WA_CENTRAL,
  },
];

const waLink = (num: string, name: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(
    `Olá! Tenho interesse em informações sobre: ${name} (transporte para Ilha Grande).`,
  )}`;

const Transporte = () => (
  <>
    <SEO
      title="Como chegar em Ilha Grande: barcas, lanchas e transfer (2026)"
      description="Como chegar em Ilha Grande RJ: saindo de Angra dos Reis, Mangaratiba, Conceição de Jacareí ou direto do Rio. Horários, preços, contatos e dicas de transfer."
      path="/como-chegar-em-ilha-grande"
      keywords="como chegar em ilha grande, barco para ilha grande, lancha para ilha grande, transfer ilha grande, conceição de jacareí ilha grande, angra dos reis ilha grande, mangaratiba ilha grande"
      breadcrumbs={[{ name: "Como chegar em Ilha Grande", path: "/como-chegar-em-ilha-grande" }]}
      faqs={FAQS}
    />
    <Breadcrumbs items={[{ name: "Como chegar em Ilha Grande", path: "/como-chegar-em-ilha-grande" }]} />

    <section className="relative h-[44vh] min-h-[320px] overflow-hidden">
      <img
        src={TRANSPORT_IMAGES.hero}
        alt="Vista aérea de Ilha Grande com barcos e mar cristalino"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/80" />
      <div className="relative z-10 container h-full flex flex-col justify-end pb-10 text-primary-foreground">
        <span className="text-xs font-bold tracking-widest text-sun uppercase mb-2">Transporte</span>
        <h1 className="font-display font-black text-4xl md:text-6xl drop-shadow-lg">
          Como chegar e se locomover
        </h1>
        <p className="text-primary-foreground/90 mt-3 max-w-2xl">
          A Ilha Grande não tem carros. A travessia é feita por mar a partir de Angra dos Reis,
          Mangaratiba ou Conceição de Jacareí. Compare as opções e fale com a gente para reservar.
        </p>
      </div>
    </section>

    <section className="container py-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITEMS.map((it) => (
          <article
            key={it.name}
            className="group bg-card rounded-3xl overflow-hidden border border-border/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <a
              href={it.officialUrl || (it.whatsapp ? waLink(it.whatsapp, it.name) : "#")}
              target={it.officialUrl ? "_blank" : undefined}
              rel={it.officialUrl ? "noopener noreferrer" : undefined}
              className="relative h-52 overflow-hidden block"
              aria-label={it.imageAlt}
            >
              <img
                src={it.image}
                alt={it.imageAlt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-background/90 backdrop-blur text-foreground inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {it.route}
              </span>
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary text-primary-foreground inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {it.duration}
              </span>
            </a>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-display font-bold text-xl mb-1 inline-flex items-center gap-2">
                <Ship className="w-4 h-4 text-primary" /> {it.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{it.description}</p>

              <div className="mt-auto flex flex-wrap gap-2">
                {it.whatsapp && (
                  <a
                    href={waLink(it.whatsapp, it.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chamar no WhatsApp
                  </a>
                )}
                {it.officialUrl ? (
                  <a
                    href={it.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border text-xs font-semibold hover:border-primary hover:text-primary transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Site oficial
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border text-xs font-semibold text-muted-foreground">
                    Ver informações oficiais
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 text-center">
        <h2 className="font-display font-bold text-2xl mb-2">Precisa de ajuda para chegar?</h2>
        <p className="text-muted-foreground mb-5">
          Organizamos transfer porta a porta + travessia para Ilha Grande. Fale com a Central no WhatsApp.
        </p>
        <a
          href={waLink(WA_CENTRAL, "Transfer Rio → Ilha Grande")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
        </a>
        <div className="mt-4">
          <Link to="/dicas" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
            Ver mais dicas práticas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <Disclaimer />
    </section>
  </>
);

export default Transporte;

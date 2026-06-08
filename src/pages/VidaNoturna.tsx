import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";

const VidaNoturna = () => (
  <PortalListPage
    title="Vida Noturna"
    tagline="Bares, música & festas"
    heroImage={themedImage("nightlife", "hero")}
    intro="A Vila do Abraão ganha vida ao anoitecer — bares à beira-mar, música ao vivo e luaus."
    seo={{
      title: "Vida noturna em Ilha Grande — Bares, música ao vivo e luaus",
      description: "Onde curtir a noite em Ilha Grande: bares à beira-mar, música ao vivo, feirinha noturna, luaus, Carnaval e Réveillon na Vila do Abraão.",
      path: "/vida-noturna",
      keywords: "vida noturna ilha grande, bares ilha grande, música ao vivo ilha grande, luau ilha grande, carnaval ilha grande",
      faqs: [
        { question: "Ilha Grande tem balada?", answer: "Não há grandes baladas. A vida noturna é concentrada em bares com música ao vivo na Rua da Praia, na Vila do Abraão." },
        { question: "Até que horas vai a noite no Abraão?", answer: "Os bares costumam funcionar até 2h ou 3h em alta temporada e finais de semana." },
      ],
    }}
    items={[
      { name: "Música ao vivo na Rua da Praia", meta: "Quase toda noite", image: themedImage("nightlife", "musica"), description: "MPB, samba e reggae nos bares da rua principal da Vila." },
      { name: "Bares à beira-mar", meta: "Tarde e noite", image: themedImage("nightlife", "bares"), description: "Caipirinhas, cervejas geladas e vista para o cais." },
      { name: "Feirinha noturna", meta: "Noite", image: themedImage("nightlife", "feirinha"), description: "Artesanato, comidinhas e souvenirs em barracas iluminadas." },
      { name: "Luaus na praia", meta: "Verão & lua cheia", image: themedImage("nightlife", "luau"), description: "Fogueira, violão e pé na areia em noites especiais." },
      { name: "Carnaval em Ilha Grande", meta: "Fevereiro", image: themedImage("nightlife", "carnaval"), description: "Blocos animados e festas em pousadas durante o feriado." },
      { name: "Reveillon na Vila", meta: "31 de dezembro", image: themedImage("nightlife", "reveillon"), description: "Queima de fogos vista do cais, todos de branco na beira do mar." },
      { name: "Passeio romântico Saco do Céu", meta: "Noite", image: themedImage("nightlife", "sacoceu"), description: "Barco até a baía calma com céu estrelado refletido na água." },
    ]}
    footerCtaTo="/restaurantes"
    footerCtaLabel="Ver restaurantes & bares"
  />
);

export default VidaNoturna;

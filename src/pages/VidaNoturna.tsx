import PortalListPage from "@/components/PortalListPage";

const img = (s: string) => `https://picsum.photos/seed/${encodeURIComponent(s)}/800/600`;

const VidaNoturna = () => (
  <PortalListPage
    title="Vida Noturna"
    tagline="Bares, música & festas"
    heroSeed="noite-hero"
    intro="A Vila do Abraão ganha vida ao anoitecer — bares à beira-mar, música ao vivo e luaus."
    items={[
      { name: "Música ao vivo na Rua da Praia", meta: "Quase toda noite", image: img("n-musica"), description: "MPB, samba e reggae nos bares da rua principal da Vila." },
      { name: "Bares à beira-mar", meta: "Tarde e noite", image: img("n-bares"), description: "Caipirinhas, cervejas geladas e vista para o cais." },
      { name: "Feirinha noturna", meta: "Noite", image: img("n-feirinha"), description: "Artesanato, comidinhas e souvenirs em barracas iluminadas." },
      { name: "Luaus na praia", meta: "Verão & lua cheia", image: img("n-luau"), description: "Fogueira, violão e pé na areia em noites especiais." },
      { name: "Carnaval em Ilha Grande", meta: "Fevereiro", image: img("n-carnaval"), description: "Blocos animados e festas em pousadas durante o feriado." },
      { name: "Reveillon na Vila", meta: "31 de dezembro", image: img("n-reveillon"), description: "Queima de fogos vista do cais, todos de branco na beira do mar." },
      { name: "Passeio romântico Saco do Céu", meta: "Noite", image: img("n-sacoceu"), description: "Barco até a baía calma com céu estrelado refletido na água." },
    ]}
    footerCtaTo="/restaurantes"
    footerCtaLabel="Ver restaurantes & bares"
  />
);

export default VidaNoturna;

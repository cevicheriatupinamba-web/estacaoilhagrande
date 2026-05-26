import PortalListPage from "@/components/PortalListPage";

const img = (s: string) => `https://picsum.photos/seed/${encodeURIComponent(s)}/800/600`;

const OQueFazer = () => (
  <PortalListPage
    title="O Que Fazer em Ilha Grande"
    tagline="Experiências imperdíveis"
    heroSeed="fazer-hero"
    intro="Da aventura à contemplação, da gastronomia ao mergulho — selecionamos o melhor da ilha."
    items={[
      { name: "Passeios de barco", meta: "Escuna & lancha", image: img("f-barco"), description: "Volta à ilha, Lagoa Azul, Aventureiro e roteiros premium privativos.", cta: { label: "Ver passeios", to: "/passeios" } },
      { name: "Trilhas guiadas", meta: "Aventura", image: img("f-trilha"), description: "Pico do Papagaio, Lopes Mendes, Dois Rios, cachoeiras escondidas.", cta: { label: "Ver trilhas", to: "/trilhas" } },
      { name: "Praias paradisíacas", meta: "100+ praias", image: img("f-praias"), description: "Das badaladas às desertas — escolha o seu paraíso.", cta: { label: "Ver praias", to: "/praias" } },
      { name: "Mergulho e snorkel", meta: "Águas cristalinas", image: img("f-mergulho"), description: "Lagoa Azul, Caxadaço, naufrágios e biodiversidade marinha incrível." },
      { name: "Sunset no cais", meta: "Vila do Abraão", image: img("f-sunset"), description: "Pôr do sol espetacular com drink na mão e barcos na baía." },
      { name: "Vida noturna", meta: "Bares & música", image: img("f-noite"), description: "Música ao vivo, feirinha e luaus na praia.", cta: { label: "Ver vida noturna", to: "/vida-noturna" } },
      { name: "Lancha privativa", meta: "VIP", image: img("f-lancha"), description: "Roteiro sob medida com horários flexíveis e praias reservadas." },
      { name: "Gastronomia caiçara", meta: "Sabores locais", image: img("f-gastro"), description: "Moquecas, frutos do mar e cozinha contemporânea.", cta: { label: "Ver restaurantes", to: "/restaurantes" } },
      { name: "SUP e caiaque", meta: "Esporte aquático", image: img("f-sup"), description: "Remar nas baías calmas é um dos melhores jeitos de explorar a ilha." },
    ]}
  />
);

export default OQueFazer;

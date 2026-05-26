import PortalListPage from "@/components/PortalListPage";

const img = (s: string) => `https://picsum.photos/seed/${encodeURIComponent(s)}/800/600`;

const Guias = () => (
  <PortalListPage
    title="Guias Locais"
    tagline="Caiçaras credenciados"
    heroSeed="guias-hero"
    intro="Contrate guias locais para trilhas, passeios de barco e experiências autênticas com quem nasceu na ilha."
    items={[
      { name: "Guia de Trilha — Pico do Papagaio", meta: "Trilhas técnicas", image: img("g-papagaio"), description: "Guia especializado em trilhas longas, com equipamento de segurança e conhecimento da mata." },
      { name: "Guia de Mergulho", meta: "Snorkel & cilindro", image: img("g-mergulho"), description: "Saídas para Lagoa Azul, Caxadaço e naufrágios próximos." },
      { name: "Guia Cultural Caiçara", meta: "História & cultura", image: img("g-cultural"), description: "Conheça a história da colônia penal, o cotidiano caiçara e a culinária local." },
      { name: "Guia de Stand-Up Paddle", meta: "SUP", image: img("g-sup"), description: "Aulas e passeios guiados pelas baías calmas." },
      { name: "Guia de Observação de Aves", meta: "Birdwatching", image: img("g-aves"), description: "A mata atlântica abriga dezenas de espécies endêmicas." },
      { name: "Capitão de Lancha Privativa", meta: "VIP", image: img("g-lancha"), description: "Roteiros sob medida para grupos e famílias." },
    ]}
    footerCtaTo="/anuncie"
    footerCtaLabel="É guia? Cadastre-se"
  />
);

export default Guias;

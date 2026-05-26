import PortalListPage from "@/components/PortalListPage";

const img = (s: string) => `https://picsum.photos/seed/${encodeURIComponent(s)}/800/600`;

const Trilhas = () => (
  <PortalListPage
    title="Trilhas da Ilha Grande"
    tagline="Aventura & natureza"
    heroSeed="trilhas-hero"
    intro="Caminhe por dentro da mata atlântica até praias paradisíacas, mirantes e cachoeiras."
    items={[
      { name: "Pico do Papagaio", meta: "Difícil • 6h", image: img("t-papagaio"), description: "O topo mais famoso da ilha (982m), com vista 360° espetacular ao amanhecer." },
      { name: "Trilha de Lopes Mendes", meta: "Moderada • 2h", image: img("t-lopes"), description: "Saindo do Pouso até a praia mais famosa — passa por trechos de mata densa." },
      { name: "Praia Preta", meta: "Fácil • 30min", image: img("t-preta"), description: "Trilha curta saindo do Abraão, ideal para iniciantes." },
      { name: "Cachoeira da Feiticeira", meta: "Fácil • 1h", image: img("t-feiticeira"), description: "Queda d'água refrescante em meio à mata atlântica." },
      { name: "Dois Rios", meta: "Moderada • 3h", image: img("t-doisrios"), description: "Trilha histórica que leva à praia da antiga colônia penal." },
      { name: "Pico do Mamanguá", meta: "Difícil • 5h", image: img("t-mamangua"), description: "Vista impressionante do saco do Mamanguá." },
      { name: "Saco do Céu (a pé)", meta: "Longa • 7h", image: img("t-sacoceu"), description: "Travessia pela mata até a baía espelhada." },
      { name: "Cachoeira do Maguariqueçaba", meta: "Moderada • 2h", image: img("t-maguari"), description: "Cachoeira escondida no interior da ilha." },
    ]}
    footerCtaTo="/dicas"
    footerCtaLabel="Dicas antes de trilhar"
  />
);

export default Trilhas;

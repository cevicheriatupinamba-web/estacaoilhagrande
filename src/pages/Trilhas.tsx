import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";

const Trilhas = () => (
  <PortalListPage
    title="Trilhas da Ilha Grande"
    tagline="Aventura & natureza"
    heroImage={themedImage("hike", "hero")}
    intro="Caminhe por dentro da mata atlântica até praias paradisíacas, mirantes e cachoeiras."
    items={[
      { name: "Pico do Papagaio", meta: "Difícil • 6h", image: themedImage("hike", "papagaio"), description: "O topo mais famoso da ilha (982m), com vista 360° espetacular ao amanhecer." },
      { name: "Trilha de Lopes Mendes", meta: "Moderada • 2h", image: themedImage("hike", "lopes"), description: "Saindo do Pouso até a praia mais famosa — passa por trechos de mata densa." },
      { name: "Praia Preta", meta: "Fácil • 30min", image: themedImage("hike", "preta"), description: "Trilha curta saindo do Abraão, ideal para iniciantes." },
      { name: "Cachoeira da Feiticeira", meta: "Fácil • 1h", image: themedImage("hike", "feiticeira"), description: "Queda d'água refrescante em meio à mata atlântica." },
      { name: "Dois Rios", meta: "Moderada • 3h", image: themedImage("hike", "doisrios"), description: "Trilha histórica que leva à praia da antiga colônia penal." },
      { name: "Pico do Mamanguá", meta: "Difícil • 5h", image: themedImage("hike", "mamangua"), description: "Vista impressionante do saco do Mamanguá." },
      { name: "Saco do Céu (a pé)", meta: "Longa • 7h", image: themedImage("hike", "sacoceu"), description: "Travessia pela mata até a baía espelhada." },
      { name: "Cachoeira do Maguariqueçaba", meta: "Moderada • 2h", image: themedImage("hike", "maguari"), description: "Cachoeira escondida no interior da ilha." },
    ]}
    footerCtaTo="/dicas"
    footerCtaLabel="Dicas antes de trilhar"
  />
);

export default Trilhas;

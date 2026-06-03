import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const FAQS = [
  { question: "Quais as melhores trilhas em Ilha Grande?", answer: "Pico do Papagaio (982m), Lopes Mendes, Cachoeira da Feiticeira e Dois Rios são as trilhas mais procuradas." },
  { question: "Preciso de guia para fazer trilhas?", answer: "Trilhas longas e técnicas, como Pico do Papagaio e Dois Rios, exigem guia local credenciado — por segurança e respeito à mata atlântica." },
  { question: "Qual a trilha mais fácil em Ilha Grande?", answer: "A trilha da Praia Preta, com cerca de 30 minutos saindo do Abraão, é ideal para iniciantes e famílias." },
];

const Trilhas = () => (
  <>
    <SEO
      title="Trilhas em Ilha Grande: Pico do Papagaio, Lopes Mendes e mais"
      description="Guia das melhores trilhas em Ilha Grande RJ: Pico do Papagaio, Lopes Mendes, Cachoeira da Feiticeira, Dois Rios. Dificuldade, tempo e dicas de segurança."
      path="/trilhas-em-ilha-grande"
      keywords="trilhas em ilha grande, trilha lopes mendes, trilha pico do papagaio, trilha dois rios, trekking ilha grande, ecoturismo ilha grande"
      breadcrumbs={[{ name: "Trilhas em Ilha Grande", path: "/trilhas-em-ilha-grande" }]}
      faqs={FAQS}
    />
    <Breadcrumbs items={[{ name: "Trilhas em Ilha Grande", path: "/trilhas-em-ilha-grande" }]} />
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
  </>
);

export default Trilhas;

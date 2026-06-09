import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { itemListLd } from "@/lib/jsonld";

const FAQS = [
  { question: "Qual a praia mais bonita de Ilha Grande?", answer: "Lopes Mendes é considerada uma das praias mais bonitas do Brasil — areia branca fininha e mar transparente. Acesso por trilha de 2h ou táxi-barco." },
  { question: "Como chegar à praia de Lopes Mendes?", answer: "De barco até Pouso e depois 25 minutos de trilha leve pela mata, ou via táxi-barco saindo do Abraão." },
  { question: "Quais as melhores praias para snorkel?", answer: "Lagoa Azul, Caxadaço e Lagoa Verde têm águas cristalinas e muitos peixes coloridos." },
];

const BEACHES = [
  { name: "Lopes Mendes", meta: "Trilha + barco", image: themedImage("beach", "lopesmendes"), description: "Areia branca fininha e mar transparente. Uma das praias mais bonitas do Brasil.", path: "/praias/lopes-mendes", cta: { label: "Ver guia completo", to: "/praias/lopes-mendes" } },
  { name: "Praia do Aventureiro", meta: "Sul da ilha", image: themedImage("beach", "aventureiro"), description: "O famoso coqueiro inclinado, cartão-postal de Ilha Grande." },
  { name: "Lagoa Azul", meta: "Piscina natural", image: themedImage("beach", "lagoaazul"), description: "Água cristalina e peixes coloridos — perfeita para snorkel." },
  { name: "Praia do Abraãozinho", meta: "20min de caminhada", image: themedImage("beach", "abraaozinho"), description: "Vizinha da Vila, calma e com mar manso." },
  { name: "Praia Preta", meta: "Trilha curta", image: themedImage("beach", "preta"), description: "Areia escura por minerais, ótima para o pôr do sol." },
  { name: "Parnaioca", meta: "Selvagem", image: themedImage("beach", "parnaioca"), description: "Praia isolada com rio de água doce desaguando no mar." },
  { name: "Saco do Céu", meta: "Baía calma", image: themedImage("beach", "sacoceu"), description: "Águas espelhadas cercadas por mata — passeio romântico ao entardecer." },
  { name: "Caxadaço", meta: "Snorkel premium", image: themedImage("beach", "caxadaco"), description: "Piscina natural com peixes coloridos e visibilidade incrível." },
  { name: "Dois Rios", meta: "Trilha longa", image: themedImage("beach", "doisrios"), description: "Praia entre dois rios, com história da antiga colônia penal." },
];

const Praias = () => (
  <>
    <SEO
      title="Praias de Ilha Grande: as 30 mais bonitas (guia completo)"
      description="As melhores praias de Ilha Grande: Lopes Mendes, Aventureiro, Lagoa Azul, Caxadaço, Praia Preta, Dois Rios e mais. Como chegar, fotos e dicas locais."
      path="/praias-de-ilha-grande"
      keywords="praias de ilha grande, melhores praias de ilha grande, praia de lopes mendes, praia do aventureiro, lagoa azul, lagoa verde, dois rios"
      breadcrumbs={[{ name: "Praias de Ilha Grande", path: "/praias-de-ilha-grande" }]}
      faqs={FAQS}
      jsonLd={itemListLd("Praias de Ilha Grande", "/praias-de-ilha-grande", BEACHES, "Lista das praias mais bonitas e procuradas em Ilha Grande, RJ.")}
    />
    <Breadcrumbs items={[{ name: "Praias de Ilha Grande", path: "/praias-de-ilha-grande" }]} />
    <PortalListPage
      title="Praias da Ilha Grande"
      tagline="Paraíso natural"
      heroImage={themedImage("hero", "praias")}
      intro="Mais de 100 praias selvagens — das mais badaladas às mais desertas."
      items={BEACHES}
      footerCtaTo="/passeios-em-ilha-grande"
      footerCtaLabel="Ver passeios de barco"
    />
  </>
);

export default Praias;

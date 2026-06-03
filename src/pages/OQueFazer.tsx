import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const FAQS = [
  { question: "O que fazer em Ilha Grande em 1 dia?", answer: "Em um dia, o passeio Volta à Ilha de escuna é a melhor escolha — visita Lagoa Azul, Aventureiro e outras praias paradisíacas." },
  { question: "O que fazer em Ilha Grande em 3 dias?", answer: "Reserve um dia para Lopes Mendes, um para passeio de barco (Volta à Ilha) e um para trilha (Pico do Papagaio ou Dois Rios)." },
  { question: "Tem o que fazer com chuva em Ilha Grande?", answer: "Aproveite para conhecer restaurantes caiçaras, fazer um circuito gastronômico no Abraão ou visitar o Museu do Cárcere em Dois Rios." },
];

const OQueFazer = () => (
  <>
    <SEO
      title="O que fazer em Ilha Grande: 20 experiências imperdíveis"
      description="O que fazer em Ilha Grande RJ: passeios de barco, trilhas, praias paradisíacas, mergulho, gastronomia caiçara e vida noturna. Roteiros para 1, 3 e 5 dias."
      path="/o-que-fazer-em-ilha-grande"
      keywords="o que fazer em ilha grande, atividades ilha grande, ilha grande roteiro, ilha grande 3 dias, ilha grande 5 dias"
      breadcrumbs={[{ name: "O que fazer em Ilha Grande", path: "/o-que-fazer-em-ilha-grande" }]}
      faqs={FAQS}
    />
    <Breadcrumbs items={[{ name: "O que fazer em Ilha Grande", path: "/o-que-fazer-em-ilha-grande" }]} />
    <PortalListPage
      title="O Que Fazer em Ilha Grande"
      tagline="Experiências imperdíveis"
      heroImage={themedImage("activity", "hero")}
      intro="Da aventura à contemplação, da gastronomia ao mergulho — selecionamos o melhor da ilha."
      items={[
        { name: "Passeios de barco", meta: "Escuna & lancha", image: themedImage("boat", "f-barco"), description: "Volta à ilha, Lagoa Azul, Aventureiro e roteiros premium privativos.", cta: { label: "Ver passeios", to: "/passeios-em-ilha-grande" } },
        { name: "Trilhas guiadas", meta: "Aventura", image: themedImage("hike", "f-trilha"), description: "Pico do Papagaio, Lopes Mendes, Dois Rios, cachoeiras escondidas.", cta: { label: "Ver trilhas", to: "/trilhas-em-ilha-grande" } },
        { name: "Praias paradisíacas", meta: "100+ praias", image: themedImage("beach", "f-praias"), description: "Das badaladas às desertas — escolha o seu paraíso.", cta: { label: "Ver praias", to: "/praias-de-ilha-grande" } },
        { name: "Mergulho e snorkel", meta: "Águas cristalinas", image: themedImage("activity", "f-mergulho"), description: "Lagoa Azul, Caxadaço, naufrágios e biodiversidade marinha incrível." },
        { name: "Sunset no cais", meta: "Vila do Abraão", image: themedImage("activity", "f-sunset"), description: "Pôr do sol espetacular com drink na mão e barcos na baía." },
        { name: "Vida noturna", meta: "Bares & música", image: themedImage("nightlife", "f-noite"), description: "Música ao vivo, feirinha e luaus na praia.", cta: { label: "Ver vida noturna", to: "/vida-noturna" } },
        { name: "Lancha privativa", meta: "VIP", image: themedImage("boat", "f-lancha"), description: "Roteiro sob medida com horários flexíveis e praias reservadas." },
        { name: "Gastronomia caiçara", meta: "Sabores locais", image: themedImage("restaurant", "f-gastro"), description: "Moquecas, frutos do mar e cozinha contemporânea.", cta: { label: "Ver restaurantes", to: "/restaurantes-em-ilha-grande" } },
        { name: "SUP e caiaque", meta: "Esporte aquático", image: themedImage("activity", "f-sup"), description: "Remar nas baías calmas é um dos melhores jeitos de explorar a ilha." },
      ]}
    />
  </>
);

export default OQueFazer;

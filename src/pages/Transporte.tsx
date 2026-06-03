import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const FAQS = [
  { question: "Como chegar em Ilha Grande?", answer: "A travessia é feita por mar saindo de Angra dos Reis, Mangaratiba ou Conceição de Jacareí. Há barcas oficiais (mais baratas, ~1h20) e catamarãs/lanchas rápidas (~30min)." },
  { question: "Qual a forma mais rápida de chegar em Ilha Grande?", answer: "Lanchas rápidas saindo de Conceição de Jacareí chegam à Vila do Abraão em cerca de 20 a 30 minutos." },
  { question: "Tem carro em Ilha Grande?", answer: "Não. A ilha não permite carros para turistas — a locomoção é a pé, por trilhas, táxi-barco ou bicicleta." },
  { question: "Quanto custa o transfer Rio de Janeiro - Ilha Grande?", answer: "Combos de van + lancha saem em média entre R$ 180 e R$ 280 por pessoa, dependendo do ponto de saída." },
];

const Transporte = () => (
  <>
    <SEO
      title="Como chegar em Ilha Grande: barcas, lanchas e transfer (2026)"
      description="Como chegar em Ilha Grande RJ: saindo de Angra dos Reis, Mangaratiba, Conceição de Jacareí ou direto do Rio. Horários, preços e dicas de transfer."
      path="/como-chegar-em-ilha-grande"
      keywords="como chegar em ilha grande, barco para ilha grande, lancha para ilha grande, transfer ilha grande, conceição de jacareí ilha grande, angra dos reis ilha grande"
      breadcrumbs={[{ name: "Como chegar em Ilha Grande", path: "/como-chegar-em-ilha-grande" }]}
      faqs={FAQS}
    />
    <Breadcrumbs items={[{ name: "Como chegar em Ilha Grande", path: "/como-chegar-em-ilha-grande" }]} />
    <PortalListPage
      title="Como chegar e se locomover"
      tagline="Transporte"
      heroImage={themedImage("transport", "hero")}
      intro="A Ilha Grande não tem carros. A travessia é feita por mar a partir de Angra dos Reis, Mangaratiba ou Conceição de Jacareí."
      items={[
        { name: "Barca CCR Barcas", meta: "Angra ⇄ Abraão", image: themedImage("transport", "tp-barca"), description: "Travessia oficial, mais barata. Cerca de 1h20 de duração — leve dramin se for sensível." },
        { name: "Catamarã / Lancha rápida", meta: "Angra ⇄ Abraão", image: themedImage("transport", "tp-catamara"), description: "Travessia em ~30min com várias saídas ao longo do dia." },
        { name: "Conceição de Jacareí", meta: "Saída alternativa", image: themedImage("transport", "tp-conceicao"), description: "Cais mais próximo do Rio. Lanchas rápidas (~20min) até o Abraão." },
        { name: "Mangaratiba ⇄ Abraão", meta: "Barca", image: themedImage("transport", "tp-mangaratiba"), description: "Opção interessante para quem vem do Rio de Janeiro." },
        { name: "Táxi-barco na ilha", meta: "Local", image: themedImage("transport", "tp-taxibarco"), description: "Para chegar a praias sem trilha (Saco do Céu, Lagoa Azul, etc.)." },
        { name: "Estacionamento em terra", meta: "Angra / Conceição", image: themedImage("transport", "tp-estacionamento"), description: "Diárias variam — deixe o carro em estacionamento privado seguro." },
      ]}
      footerCtaTo="/dicas"
      footerCtaLabel="Mais dicas práticas"
    />
  </>
);

export default Transporte;

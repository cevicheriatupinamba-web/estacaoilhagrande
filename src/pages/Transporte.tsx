import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";

const Transporte = () => (
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
);

export default Transporte;

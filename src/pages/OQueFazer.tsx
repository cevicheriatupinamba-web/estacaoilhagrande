import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";

const OQueFazer = () => (
  <PortalListPage
    title="O Que Fazer em Ilha Grande"
    tagline="Experiências imperdíveis"
    heroImage={themedImage("activity", "hero")}
    intro="Da aventura à contemplação, da gastronomia ao mergulho — selecionamos o melhor da ilha."
    items={[
      { name: "Passeios de barco", meta: "Escuna & lancha", image: themedImage("boat", "f-barco"), description: "Volta à ilha, Lagoa Azul, Aventureiro e roteiros premium privativos.", cta: { label: "Ver passeios", to: "/passeios" } },
      { name: "Trilhas guiadas", meta: "Aventura", image: themedImage("hike", "f-trilha"), description: "Pico do Papagaio, Lopes Mendes, Dois Rios, cachoeiras escondidas.", cta: { label: "Ver trilhas", to: "/trilhas" } },
      { name: "Praias paradisíacas", meta: "100+ praias", image: themedImage("beach", "f-praias"), description: "Das badaladas às desertas — escolha o seu paraíso.", cta: { label: "Ver praias", to: "/praias" } },
      { name: "Mergulho e snorkel", meta: "Águas cristalinas", image: themedImage("activity", "f-mergulho"), description: "Lagoa Azul, Caxadaço, naufrágios e biodiversidade marinha incrível." },
      { name: "Sunset no cais", meta: "Vila do Abraão", image: themedImage("activity", "f-sunset"), description: "Pôr do sol espetacular com drink na mão e barcos na baía." },
      { name: "Vida noturna", meta: "Bares & música", image: themedImage("nightlife", "f-noite"), description: "Música ao vivo, feirinha e luaus na praia.", cta: { label: "Ver vida noturna", to: "/vida-noturna" } },
      { name: "Lancha privativa", meta: "VIP", image: themedImage("boat", "f-lancha"), description: "Roteiro sob medida com horários flexíveis e praias reservadas." },
      { name: "Gastronomia caiçara", meta: "Sabores locais", image: themedImage("restaurant", "f-gastro"), description: "Moquecas, frutos do mar e cozinha contemporânea.", cta: { label: "Ver restaurantes", to: "/restaurantes" } },
      { name: "SUP e caiaque", meta: "Esporte aquático", image: themedImage("activity", "f-sup"), description: "Remar nas baías calmas é um dos melhores jeitos de explorar a ilha." },
    ]}
  />
);

export default OQueFazer;

import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";

const Praias = () => (
  <PortalListPage
    title="Praias da Ilha Grande"
    tagline="Paraíso natural"
    heroImage={themedImage("hero", "praias")}
    intro="Mais de 100 praias selvagens — das mais badaladas às mais desertas."
    items={[
      { name: "Lopes Mendes", meta: "Trilha + barco", image: themedImage("beach", "lopesmendes"), description: "Areia branca fininha e mar transparente. Uma das praias mais bonitas do Brasil." },
      { name: "Praia do Aventureiro", meta: "Sul da ilha", image: themedImage("beach", "aventureiro"), description: "O famoso coqueiro inclinado, cartão-postal de Ilha Grande." },
      { name: "Lagoa Azul", meta: "Piscina natural", image: themedImage("beach", "lagoaazul"), description: "Água cristalina e peixes coloridos — perfeita para snorkel." },
      { name: "Praia do Abraãozinho", meta: "20min de caminhada", image: themedImage("beach", "abraaozinho"), description: "Vizinha da Vila, calma e com mar manso." },
      { name: "Praia Preta", meta: "Trilha curta", image: themedImage("beach", "preta"), description: "Areia escura por minerais, ótima para o pôr do sol." },
      { name: "Parnaioca", meta: "Selvagem", image: themedImage("beach", "parnaioca"), description: "Praia isolada com rio de água doce desaguando no mar." },
      { name: "Saco do Céu", meta: "Baía calma", image: themedImage("beach", "sacoceu"), description: "Águas espelhadas cercadas por mata — passeio romântico ao entardecer." },
      { name: "Caxadaço", meta: "Snorkel premium", image: themedImage("beach", "caxadaco"), description: "Piscina natural com peixes coloridos e visibilidade incrível." },
      { name: "Dois Rios", meta: "Trilha longa", image: themedImage("beach", "doisrios"), description: "Praia entre dois rios, com história da antiga colônia penal." },
    ]}
    footerCtaTo="/passeios"
    footerCtaLabel="Ver passeios de barco"
  />
);

export default Praias;

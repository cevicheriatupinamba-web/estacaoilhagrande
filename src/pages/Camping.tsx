import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

const Camping = () => (
  <LongFormStub
    title="Camping em Ilha Grande"
    seoTitle="Camping em Ilha Grande — Estrutura, preços e dicas"
    seoDescription="Onde acampar em Ilha Grande: campings em Abraão, Aventureiro e Provetá. Estrutura, preços, regras ambientais e o que levar."
    keywords="camping em ilha grande, acampar ilha grande, camping aventureiro, camping abraão"
    path="/camping-ilha-grande"
    heroImage={themedImage("nature", "camping-hero")}
    intro="Tudo sobre acampar em Ilha Grande: campings com estrutura, áreas selvagens, preços e dicas indispensáveis."
    sections={[
      { h2: "Onde acampar", paragraphs: ["Os principais campings ficam em Abraão (mais estrutura), no Aventureiro (camping diante de praia paradisíaca, sob controle ambiental) e em Provetá."] },
      { h2: "Regras importantes", paragraphs: ["Ilha Grande é unidade de conservação. Aventureiro tem número limitado de vagas; reserve com semanas de antecedência. Respeite os horários, leve seu lixo e nunca acenda fogueiras fora das áreas permitidas."] },
      { h2: "O que levar", bullets: ["Lanterna e baterias", "Repelente e protetor solar", "Calçado de trilha", "Saco de lixo extra", "Dinheiro vivo — comunidades remotas têm pouca cobertura"], paragraphs: [] },
    ]}
    faqs={[
      { question: "Preciso de autorização para acampar no Aventureiro?", answer: "Sim — o camping é controlado pelo INEA. As reservas são feitas com as famílias caiçaras credenciadas." },
      { question: "Tem chuveiro?", answer: "Os campings estruturados em Abraão e Aventureiro têm chuveiros e banheiros." },
    ]}
    related={[
      { to: "/hostels-ilha-grande", label: "Hostels em Ilha Grande" },
      { to: "/pousadas-em-ilha-grande", label: "Pousadas em Ilha Grande" },
      { to: "/trilhas-em-ilha-grande", label: "Trilhas em Ilha Grande" },
    ]}
    cta={{ label: "Ver opções de hospedagem", to: "/hospedagem" }}
  />
);

export default Camping;

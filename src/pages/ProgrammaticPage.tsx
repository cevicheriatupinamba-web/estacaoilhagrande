import { useParams } from "react-router-dom";
import LongFormStub from "@/components/LongFormStub";
import { themedImage } from "@/lib/images";

// Programmatic SEO catalogue — keyed by URL path
const CATALOG: Record<string, {
  title: string;
  intro: string;
  themeKey: any;
  sections: { h2: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: { question: string; answer: string }[];
  keywords: string;
  ctaTo?: string;
  ctaLabel?: string;
}> = {
  "pousadas-com-cafe-da-manha-ilha-grande": {
    title: "Pousadas com café da manhã em Ilha Grande",
    keywords: "pousadas com café da manhã ilha grande, pousada café ilha grande",
    intro: "Selecionamos as melhores pousadas de Ilha Grande que oferecem café da manhã caprichado incluso na diária.",
    themeKey: "lodging",
    sections: [
      { h2: "O que esperar do café da manhã", paragraphs: ["Frutas tropicais, pães da padaria local, tapioca, bolos caseiros, frios, ovos e sucos naturais — variando conforme o nível da pousada."] },
      { h2: "Vale a pena pagar mais por café incluso?", paragraphs: ["Sim, principalmente em alta temporada. As padarias da vila lotam pela manhã e os preços individuais somam mais que o adicional na diária."] },
    ],
    faqs: [
      { question: "O café da manhã é servido até que horas?", answer: "Em geral das 7h30 às 10h. Confirme com a pousada antes de chegar." },
      { question: "Tem opção vegetariana?", answer: "Sim, a maioria oferece pães, frutas, geleia, suco e ovos." },
    ],
    ctaTo: "/hospedagem", ctaLabel: "Ver pousadas com café",
  },
  "pousadas-pet-friendly-ilha-grande": {
    title: "Pousadas pet friendly em Ilha Grande",
    keywords: "pousadas pet friendly ilha grande, hospedagem com cachorro ilha grande, ilha grande aceita pet",
    intro: "Pousadas que aceitam cães e gatos em Ilha Grande, com áreas externas, regras e dicas para viajar com seu pet.",
    themeKey: "lodging",
    sections: [
      { h2: "Como viajar com pet para Ilha Grande", paragraphs: ["Os barcos da travessia geralmente aceitam pets em caixa de transporte. Confirme com a empresa antes de comprar."] },
      { h2: "O que verificar na hospedagem", bullets: ["Limite de tamanho do animal", "Cobrança de taxa adicional", "Disponibilidade de área externa", "Possibilidade de levar pet à praia"], paragraphs: [] },
    ],
    faqs: [
      { question: "Posso levar cachorro para Lopes Mendes?", answer: "Não é recomendado — a trilha é longa e o calor é intenso. Algumas praias próximas a Abraão aceitam pets." },
    ],
    ctaTo: "/hospedagem", ctaLabel: "Ver pousadas pet friendly",
  },
  "pousadas-baratas-ilha-grande": {
    title: "Pousadas baratas em Ilha Grande",
    keywords: "pousadas baratas ilha grande, hospedagem barata ilha grande, ilha grande econômico",
    intro: "As pousadas mais econômicas de Ilha Grande sem abrir mão da qualidade, com dicas para reservar e economizar.",
    themeKey: "lodging",
    sections: [
      { h2: "Como conseguir os melhores preços", paragraphs: ["Reservar com antecedência, viajar fora de feriado, considerar baixa temporada e flexibilizar o bairro são as principais dicas."] },
    ],
    faqs: [
      { question: "Qual o preço médio de uma pousada barata?", answer: "De R$ 180 a R$ 350 a diária de casal em baixa temporada." },
    ],
    ctaTo: "/hospedagem", ctaLabel: "Ver pousadas econômicas",
  },
  "restaurantes-beira-mar-ilha-grande": {
    title: "Restaurantes beira-mar em Ilha Grande",
    keywords: "restaurantes beira mar ilha grande, restaurante pé na areia ilha grande",
    intro: "Os melhores restaurantes pé na areia e beira-mar de Ilha Grande para almoçar com vista.",
    themeKey: "restaurant",
    sections: [
      { h2: "Vila do Abraão", paragraphs: ["Praia preta e orla do Abraão concentram opções com vista para o mar e a Serra da Bocaina."] },
      { h2: "Em outras praias", paragraphs: ["Quiosques e restaurantes simples em praias como Aventureiro e Provetá oferecem refeições típicas."] },
    ],
    faqs: [{ question: "Precisa reservar?", answer: "Em alta temporada, sim, principalmente para jantares." }],
    ctaTo: "/onde-comer", ctaLabel: "Ver restaurantes",
  },
  "passeios-de-lancha-ilha-grande": {
    title: "Passeios de lancha em Ilha Grande",
    keywords: "passeio de lancha ilha grande, lancha privativa ilha grande",
    intro: "Passeios de lancha privativos e em grupo por Ilha Grande: roteiros, preços e operadores credenciados.",
    themeKey: "boat",
    sections: [
      { h2: "Volta à Ilha de lancha", paragraphs: ["Roteiro mais completo, com paradas em Lagoa Azul, Lagoa Verde, Lopes Mendes, Aventureiro e Saco do Céu."] },
      { h2: "Lancha privativa", paragraphs: ["Personalizada para casais, famílias e grupos. Inclui condutor e roteiro sob medida."] },
    ],
    faqs: [{ question: "Quanto dura um passeio de lancha?", answer: "Em geral de 6 a 8 horas para a volta completa." }],
    ctaTo: "/passeios", ctaLabel: "Ver passeios de lancha",
  },
  "passeios-para-lopes-mendes": {
    title: "Passeios para Lopes Mendes",
    keywords: "passeio lopes mendes, como ir lopes mendes, barco lopes mendes",
    intro: "Como ir a Lopes Mendes — eleita uma das praias mais bonitas do mundo: barco, trilha, valores e dicas.",
    themeKey: "beach",
    sections: [
      { h2: "Barco + trilha (mais comum)", paragraphs: ["Barco até a Praia do Pouso e trilha leve de cerca de 20 minutos até Lopes Mendes."] },
      { h2: "Trilha completa", paragraphs: ["Para os mais aventureiros, é possível chegar por trilha saindo de Abraão (cerca de 3h, dificuldade média)."] },
    ],
    faqs: [{ question: "Tem estrutura na praia?", answer: "Lopes Mendes é praia preservada — leve água, lanche e protetor solar." }],
    ctaTo: "/passeios", ctaLabel: "Ver passeios para Lopes Mendes",
  },
  "onde-comer-frutos-do-mar-em-ilha-grande": {
    title: "Onde comer frutos do mar em Ilha Grande",
    keywords: "frutos do mar ilha grande, restaurante peixe ilha grande, camarão ilha grande",
    intro: "Os melhores restaurantes para comer frutos do mar frescos em Ilha Grande: peixe assado, moqueca, camarão e mariscos.",
    themeKey: "restaurant",
    sections: [
      { h2: "Pratos típicos caiçaras", paragraphs: ["Peixe na folha da bananeira, moqueca caiçara, casquinha de siri e camarão na moranga."] },
    ],
    faqs: [{ question: "É seguro comer frutos do mar lá?", answer: "Sim. A produção local é fresca e tem alta rotatividade." }],
    ctaTo: "/onde-comer", ctaLabel: "Ver restaurantes",
  },
  "transfer-rio-para-ilha-grande": {
    title: "Transfer do Rio de Janeiro para Ilha Grande",
    keywords: "transfer rio para ilha grande, van rio ilha grande, como ir rio ilha grande",
    intro: "Transfer porta a porta do Rio de Janeiro para Ilha Grande: van, ônibus, barco e tempo de viagem.",
    themeKey: "transport",
    sections: [
      { h2: "Vans turísticas", paragraphs: ["Saídas dos hotéis da Zona Sul, Aeroporto Galeão e Santos Dumont. Combo van + barco em torno de R$ 200-280 por pessoa."] },
      { h2: "Ônibus + barco", paragraphs: ["Opção mais econômica: ônibus até Angra dos Reis e barca até Abraão."] },
    ],
    faqs: [{ question: "Quanto tempo demora?", answer: "Cerca de 4h no total, dependendo do trânsito e do horário do barco." }],
    ctaTo: "/transfer-ilha-grande", ctaLabel: "Ver opções de transfer",
  },
  "transfer-conceicao-de-jacarei-para-ilha-grande": {
    title: "Transfer Conceição de Jacareí para Ilha Grande",
    keywords: "conceição de jacareí ilha grande, barco rápido conceição ilha grande",
    intro: "Como sair de Conceição de Jacareí para Ilha Grande: barcos rápidos, escunas e horários.",
    themeKey: "transport",
    sections: [
      { h2: "Por que sair de Conceição de Jacareí", paragraphs: ["É o porto mais próximo da ilha — a travessia de barco rápido leva apenas 25 minutos."] },
    ],
    faqs: [{ question: "Tem estacionamento em Conceição?", answer: "Sim, vários estacionamentos privativos próximos ao cais." }],
    ctaTo: "/transfer-ilha-grande", ctaLabel: "Ver opções de transfer",
  },
};

const ProgrammaticPage = () => {
  const { slug = "" } = useParams();
  const data = CATALOG[slug];

  if (!data) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display font-bold text-3xl mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground">A página procurada não existe.</p>
      </div>
    );
  }

  return (
    <LongFormStub
      title={data.title}
      seoTitle={`${data.title} — Estação Ilha Grande`}
      seoDescription={data.intro}
      keywords={data.keywords}
      path={`/${slug}`}
      heroImage={themedImage(data.themeKey, slug)}
      intro={data.intro}
      sections={data.sections}
      faqs={data.faqs}
      cta={data.ctaTo ? { label: data.ctaLabel || "Ver mais", to: data.ctaTo } : undefined}
    />
  );
};

export { CATALOG as PROGRAMMATIC_CATALOG };
export default ProgrammaticPage;

import PortalListPage from "@/components/PortalListPage";
import { themedImage } from "@/lib/images";

const Guias = () => (
  <PortalListPage
    title="Guias Locais"
    tagline="Caiçaras credenciados"
    heroImage={themedImage("guide", "hero")}
    intro="Contrate guias locais para trilhas, passeios de barco e experiências autênticas com quem nasceu na ilha."
    seo={{
      title: "Guias locais em Ilha Grande — Trilhas, mergulho e passeios",
      description: "Encontre guias caiçaras credenciados em Ilha Grande para trilhas, mergulho, cultura e lancha privativa. Atendimento via WhatsApp.",
      path: "/guias",
      keywords: "guias ilha grande, guia trilha ilha grande, guia mergulho ilha grande, guia cultural caiçara",
      faqs: [
        { question: "Preciso de guia para trilha em Ilha Grande?", answer: "Para o Pico do Papagaio e trilhas longas no sul da ilha, sim — é obrigatório por motivos de segurança e preservação." },
        { question: "Quanto custa um guia em Ilha Grande?", answer: "Trilhas guiadas custam de R$ 120 a R$ 350 por pessoa, conforme a duração e o tamanho do grupo." },
      ],
    }}
    items={[
      { name: "Guia de Trilha — Pico do Papagaio", meta: "Trilhas técnicas", image: themedImage("hike", "g-papagaio"), description: "Guia especializado em trilhas longas, com equipamento de segurança e conhecimento da mata." },
      { name: "Guia de Mergulho", meta: "Snorkel & cilindro", image: themedImage("activity", "g-mergulho"), description: "Saídas para Lagoa Azul, Caxadaço e naufrágios próximos." },
      { name: "Guia Cultural Caiçara", meta: "História & cultura", image: themedImage("guide", "g-cultural"), description: "Conheça a história da colônia penal, o cotidiano caiçara e a culinária local." },
      { name: "Guia de Stand-Up Paddle", meta: "SUP", image: themedImage("activity", "g-sup"), description: "Aulas e passeios guiados pelas baías calmas." },
      { name: "Guia de Observação de Aves", meta: "Birdwatching", image: themedImage("guide", "g-aves"), description: "A mata atlântica abriga dezenas de espécies endêmicas." },
      { name: "Capitão de Lancha Privativa", meta: "VIP", image: themedImage("boat", "g-lancha"), description: "Roteiros sob medida para grupos e famílias." },
    ]}
    footerCtaTo="/anuncie"
    footerCtaLabel="É guia? Cadastre-se"
  />
);

export default Guias;

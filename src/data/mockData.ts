import lopesMendes from "@/assets/praia-lopes-mendes.jpg";
import aventureiro from "@/assets/praia-aventureiro.jpg";
import lagoaAzul from "@/assets/lagoa-azul.jpg";
import trilha from "@/assets/trilha-pico.jpg";
import barco from "@/assets/passeio-barco.jpg";
import restaurante from "@/assets/restaurante.jpg";
import pousada from "@/assets/pousada.jpg";

export type CategoryKey =
  | "praias" | "trilhas" | "passeios" | "restaurantes"
  | "pousadas" | "agencias" | "transporte" | "dicas" | "nao-fazer";

export const categories: { key: CategoryKey; label: string; emoji: string; description: string }[] = [
  { key: "praias", label: "Praias", emoji: "🏖️", description: "As praias mais incríveis da Ilha" },
  { key: "trilhas", label: "Trilhas", emoji: "🥾", description: "Aventuras pela mata atlântica" },
  { key: "passeios", label: "Passeios", emoji: "⛵", description: "Tours de barco e escuna" },
  { key: "restaurantes", label: "Restaurantes", emoji: "🍤", description: "Sabores da ilha" },
  { key: "pousadas", label: "Pousadas", emoji: "🏝️", description: "Onde se hospedar" },
  { key: "agencias", label: "Agências", emoji: "🎒", description: "Receptivos e tours guiados" },
  { key: "transporte", label: "Transporte", emoji: "🚤", description: "Como chegar e se locomover" },
  { key: "dicas", label: "Dicas", emoji: "💡", description: "Tudo que você precisa saber" },
  { key: "nao-fazer", label: "O que não fazer", emoji: "⚠️", description: "Alertas importantes" },
];

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: CategoryKey;
  shortDescription: string;
  fullDescription: string;
  rating: number;
  reviewsCount: number;
  priceRange: "$" | "$$" | "$$$" | "Grátis";
  location: string;
  image: string;
  gallery: string[];
  whatsapp?: string;
  whatsappMessage?: string;
  instagram?: string;
  website?: string;
  email?: string;
  tips: string[];
  premium?: boolean;
  tags?: string[];
}

export const places: Place[] = [
  {
    id: "1", slug: "praia-de-lopes-mendes",
    name: "Praia de Lopes Mendes", category: "praias",
    shortDescription: "Eleita uma das praias mais bonitas do mundo, com areia branca e mar turquesa.",
    fullDescription: "Lopes Mendes é o cartão postal da Ilha Grande. Areia branquíssima, mar verde-esmeralda e quase 3 km de costa preservada. Acesso por trilha (cerca de 1h saindo de Pouso) ou de barco até Pouso + trilha curta. Não há quiosques ou energia na praia — leve água, lanche e protetor solar.",
    rating: 5.0, reviewsCount: 1842, priceRange: "Grátis",
    location: "Costa do Atlântico", image: lopesMendes,
    gallery: [lopesMendes, aventureiro, lagoaAzul],
    tips: ["Leve água e lanche — não há comércio", "Use calçado confortável para a trilha", "Volte com tempo para o último barco", "Sem sinal de celular"],
  },
  {
    id: "2", slug: "praia-do-aventureiro",
    name: "Praia do Aventureiro", category: "praias",
    shortDescription: "A famosa palmeira torta e águas cristalinas em uma vila caiçara preservada.",
    fullDescription: "Pequena praia com mar transparente, areia clara e a icônica palmeira deitada. Acessível apenas por barco (escuna ou lancha). Vila caiçara com cerca de 100 moradores e estrutura simples de pousadas e comidinhas.",
    rating: 4.9, reviewsCount: 1203, priceRange: "Grátis",
    location: "Sul da Ilha", image: aventureiro,
    gallery: [aventureiro, lopesMendes],
    tips: ["Dia inteiro com escuna saindo de Abraão", "Leve dinheiro em espécie", "Respeite a comunidade caiçara"],
  },
  {
    id: "3", slug: "lagoa-azul",
    name: "Lagoa Azul", category: "praias",
    shortDescription: "Piscina natural cristalina perfeita para snorkel e fotos.",
    fullDescription: "Parada obrigatória dos passeios de escuna. Águas calmas e transparentes ideais para mergulho livre. Bastante movimentada em alta temporada.",
    rating: 4.7, reviewsCount: 956, priceRange: "Grátis",
    location: "Norte da Ilha", image: lagoaAzul,
    gallery: [lagoaAzul, barco],
    tips: ["Vá cedo para evitar multidão", "Leve máscara e snorkel próprios", "Cuidado com o sol — refletido na água queima dobrado"],
  },
  {
    id: "4", slug: "trilha-pico-do-papagaio",
    name: "Trilha do Pico do Papagaio", category: "trilhas",
    shortDescription: "Trilha desafiadora até o ponto mais alto com vista 360° da ilha.",
    fullDescription: "Cerca de 6 a 8 horas ida e volta. Nível difícil, com trechos íngremes. A recompensa: vista panorâmica do nascer do sol com a ilha aos seus pés. Recomendado ir com guia local.",
    rating: 4.8, reviewsCount: 412, priceRange: "$$",
    location: "Centro da Ilha", image: trilha,
    gallery: [trilha], whatsapp: "55-21-99999-0000",
    tips: ["Saia de madrugada (3h) para pegar o nascer do sol", "Lanterna de cabeça é essencial", "Vá com guia credenciado", "Leve 3L de água por pessoa"],
  },
  {
    id: "5", slug: "passeio-escuna-volta-ilha",
    name: "Escuna Volta à Ilha", category: "passeios",
    shortDescription: "Tour de dia inteiro pelas melhores praias e piscinas naturais.",
    fullDescription: "Saída às 10h, retorno às 17h. Inclui Lagoa Azul, Lagoa Verde, Freguesia de Santana e Praia do Abraãozinho. Almoço opcional a bordo.",
    rating: 4.6, reviewsCount: 728, priceRange: "$$",
    location: "Saída: Cais de Abraão", image: barco,
    gallery: [barco, lagoaAzul], whatsapp: "55-24-99999-1111", email: "contato@exemplo.com.br",
    tips: ["Reserve no dia anterior", "Leve toalha, protetor e dinheiro", "Almoço extra fica em torno de R$60"],
  },
  {
    id: "6", slug: "restaurante-mar-da-vila",
    name: "Mar da Vila", category: "restaurantes",
    shortDescription: "Frutos do mar fresquíssimos com vista para o cais.",
    fullDescription: "Cozinha caiçara contemporânea. Destaques: moqueca de peixe, camarão na moranga e bobó de camarão. Ambiente aberto com pé na areia.",
    rating: 4.7, reviewsCount: 534, priceRange: "$$$",
    location: "Vila do Abraão", image: restaurante,
    gallery: [restaurante], whatsapp: "55-24-99999-2222",
    tips: ["Reserva recomendada à noite", "Moqueca serve 2 pessoas", "Aceita cartão"],
  },
  {
    id: "7", slug: "pousada-mata-e-mar",
    name: "Pousada Mata & Mar", category: "pousadas",
    shortDescription: "Bangalôs aconchegantes cercados pela mata, a 5 min do cais.",
    fullDescription: "10 bangalôs com varanda e rede, piscina natural, café da manhã caiçara incluso. Ambiente familiar, ideal para casais e famílias.",
    rating: 4.9, reviewsCount: 318, priceRange: "$$",
    location: "Vila do Abraão", image: pousada,
    gallery: [pousada], whatsapp: "55-24-99999-3333", email: "reservas@exemplo.com.br",
    tips: ["Faça reserva com 1 mês de antecedência em alta temporada", "Café da manhã até 10h", "Aceita pets pequenos"],
  },
  {
    id: "8", slug: "salt-experience-tour",
    name: "Salt Experience Tour", category: "agencias",
    shortDescription: "Navegue pelo paraíso a bordo do Barco Mar Azul 2 — passeios náuticos exclusivos pelas praias mais belas de Ilha Grande.",
    fullDescription: "Passeios náuticos exclusivos pelas praias mais belas de Ilha Grande a bordo do Barco Mar Azul 2, com capacidade para até 19 pessoas, conforto premium e atendimento personalizado. Roteiros privativos por Lagoa Azul, Lopes Mendes, Aventureiro e enseadas reservadas, com tripulação experiente e total segurança.",
    rating: 5.0, reviewsCount: 218, priceRange: "$$$",
    location: "Ilha Grande / Angra dos Reis", image: barco,
    gallery: [barco],
    whatsapp: "55-21-99004-4435",
    whatsappMessage: "Olá, estou vindo através do Estação Ilha Grande e gostaria de mais informações.",
    instagram: "https://www.instagram.com/salt.experience",
    website: "https://saltexperiencetour.com.br/salt-boat",
    tips: ["Capacidade para até 19 pessoas", "Roteiros privativos e personalizados", "Reserva via WhatsApp"],
    premium: true,
    tags: ["passeio de barco ilha grande", "passeio de lancha ilha grande", "passeio nautico ilha grande", "barco privativo", "barco mar azul 2", "salt experience tour", "turismo nautico ilha grande"],
  },
];

export const tips = [
  { title: "O que levar", icon: "🎒", content: "Protetor solar reef-safe, repelente, calçado de trilha, lanterna, dinheiro em espécie, garrafa reutilizável e roupa de banho extra." },
  { title: "Melhor época", icon: "☀️", content: "Abril a outubro tem menos chuva. Dezembro a fevereiro é alta temporada — mais cheio e caro. Maio e setembro têm a melhor relação custo-benefício." },
  { title: "Sinal de internet", icon: "📶", content: "Sinal é fraco e instável. Em Abraão funciona razoavelmente; nas praias afastadas, esqueça. Avise família antes de sumir." },
  { title: "Segurança", icon: "🛡️", content: "Ilha é tranquila. Cuide dos pertences nas praias movimentadas e em barcos. Não circule sozinho em trilhas após o pôr do sol." },
  { title: "Transporte", icon: "🚤", content: "Barca de Angra ou Mangaratiba, ou lancha rápida. Na ilha não há carros — locomoção por barco-táxi ou trilha." },
  { title: "Trilhas", icon: "🥾", content: "Sempre informe o trajeto, leve água, lanche e lanterna. Trilhas longas merecem guia local credenciado." },
  { title: "Cuidados ambientais", icon: "🌱", content: "Leve seu lixo de volta, não colete corais ou conchas, use protetor biodegradável e não alimente animais silvestres." },
];

export const naoFazer = [
  { title: "Não faça trilhas à noite sozinho", description: "Sem iluminação e com riscos reais de se perder. Se for ver o nascer do sol, vá com guia." },
  { title: "Não deixe lixo nas praias e trilhas", description: "Tudo que você levou, traga de volta. A ilha é uma reserva ambiental." },
  { title: "Não alimente os animais", description: "Macacos, quatis e aves — alimentação humana adoece e modifica o comportamento deles." },
  { title: "Não contrate serviços sem confirmação", description: "Use agências credenciadas, peça comprovante e desconfie de ofertas muito abaixo do mercado." },
  { title: "Não ignore os horários de barco", description: "Perder o último barco pode significar uma noite extra. Confirme horários antes de sair." },
  { title: "Não use protetor solar comum no mar", description: "Prefira reef-safe / biodegradável para proteger os corais e peixes." },
];

export const roteiros = [
  { id: "1dia", title: "Ilha Grande em 1 dia", subtitle: "Para quem está de passagem", duration: "1 dia", style: "Express",
    steps: ["Chegue cedo em Abraão", "Passeio de escuna pelas piscinas naturais", "Almoço na Vila", "Trilha curta até Praia Preta", "Pôr do sol no cais"] },
  { id: "2dias", title: "Ilha Grande em 2 dias", subtitle: "Os clássicos", duration: "2 dias", style: "Equilibrado",
    steps: ["Dia 1: Escuna Volta à Ilha (Lagoa Azul, Freguesia)", "Jantar de frutos do mar", "Dia 2: Trilha até Lopes Mendes (volta de barco)", "Retorno relax em Abraão"] },
  { id: "3dias", title: "Ilha Grande em 3 dias", subtitle: "Aprofundando", duration: "3 dias", style: "Completo",
    steps: ["Dia 1: Escuna pelas piscinas", "Dia 2: Lopes Mendes o dia todo", "Dia 3: Aventureiro + Parnaioca de escuna"] },
  { id: "familia", title: "Roteiro Família", subtitle: "Com crianças", duration: "3 dias", style: "Tranquilo",
    steps: ["Praia do Abraãozinho (calma e perto)", "Passeio curto de barco-táxi", "Aquário Natural", "Trilha leve até Saco do Céu"] },
  { id: "casal", title: "Roteiro Casal", subtitle: "Romântico", duration: "3 dias", style: "Aconchego",
    steps: ["Pousada com vista", "Escuna privativa ao pôr do sol", "Jantar à luz de velas em Mar da Vila", "Praia deserta no Aventureiro"] },
  { id: "aventura", title: "Roteiro Aventura", subtitle: "Para os ousados", duration: "4 dias", style: "Intenso",
    steps: ["Pico do Papagaio ao nascer do sol", "Trilha Dois Rios", "Mergulho na Caverna do Acaiá", "Stand-up paddle"] },
  { id: "economico", title: "Roteiro Econômico", subtitle: "Curtir gastando pouco", duration: "2 dias", style: "Mochileiro",
    steps: ["Hostel em Abraão", "Praias acessíveis a pé: Preta e Júlia", "Mercado para refeições", "Trilha grátis até Lopes Mendes"] },
];

export const planos = [
  { name: "Básico", price: "R$ 79", period: "/mês", features: ["Listagem no diretório", "1 foto + descrição", "Botão WhatsApp", "Categoria única"], highlight: false },
  { name: "Destaque", price: "R$ 179", period: "/mês", features: ["Tudo do Básico", "Até 8 fotos + galeria", "Aparece em destaque na home", "Selo de verificado", "Estatísticas básicas"], highlight: true },
  { name: "Premium", price: "R$ 349", period: "/mês", features: ["Tudo do Destaque", "Topo da categoria", "Galeria ilimitada + vídeo", "Botão de reserva direta", "Suporte prioritário", "Anúncio em roteiros"], highlight: false },
];

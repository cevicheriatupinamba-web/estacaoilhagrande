// Listagens curadas a partir de guias públicos de turismo sobre Ilha Grande.
// Confirme sempre com o estabelecimento.

const img = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;

export interface Lodging {
  id: string;
  name: string;
  area: string;
  rating: number;
  description: string;
  image: string;
  tags: string[];
}

export const lodgings: Lodging[] = [
  { id: "l1", name: "Pousada Caiçara", area: "Vila do Abraão", rating: 4.7, image: img("caicara"), tags: ["Café da manhã", "Pé na areia"], description: "Pousada tradicional a poucos passos do cais, com varandas e jardim tropical." },
  { id: "l2", name: "Pousada Albatroz", area: "Vila do Abraão", rating: 4.6, image: img("albatroz"), tags: ["Família", "Vista mar"], description: "Acomodações aconchegantes e atendimento familiar, próxima a restaurantes e bares." },
  { id: "l3", name: "Pousada Naturalia", area: "Vila do Abraão", rating: 4.8, image: img("naturalia"), tags: ["Romântico", "Piscina"], description: "Charme rústico-chique com jardim, piscina e café da manhã reforçado." },
  { id: "l4", name: "Pousada Casablanca", area: "Vila do Abraão", rating: 4.5, image: img("casablanca"), tags: ["Econômica"], description: "Boa relação custo-benefício, quartos simples e bem localizados." },
  { id: "l5", name: "Suítes Casa Grande", area: "Vila do Abraão", rating: 4.7, image: img("casagrande"), tags: ["Suíte", "Casal"], description: "Suítes amplas e modernas, ideais para casais." },
  { id: "l6", name: "Bonito Paraíso Ilha Grande", area: "Praia do Abraão", rating: 4.9, image: img("bonitoparaiso"), tags: ["Premium", "Frente mar"], description: "Hotel boutique frente mar, piscina e gastronomia refinada." },
  { id: "l7", name: "Pousada Recreio da Praia", area: "Vila do Abraão", rating: 4.6, image: img("recreio"), tags: ["Família", "Calmo"], description: "Ambiente tranquilo a poucos metros da areia." },
  { id: "l8", name: "Balaio Hostel", area: "Vila do Abraão", rating: 4.5, image: img("balaio"), tags: ["Hostel", "Mochileiro"], description: "Hostel com vibe jovem, áreas comuns e quartos compartilhados ou privativos." },
  { id: "l9", name: "Hospedagem Cantinho da Vitória", area: "Vila do Abraão", rating: 4.4, image: img("cantinho"), tags: ["Econômica"], description: "Pousada simples e acolhedora com ótimo atendimento." },
  { id: "l10", name: "Pousada dos Meros", area: "Vila do Abraão", rating: 4.7, image: img("meros"), tags: ["Charme"], description: "Decoração caiçara e jardim cercado pela mata." },
  { id: "l11", name: "Pousada D'Pillel", area: "Vila do Abraão", rating: 4.6, image: img("dpillel"), tags: ["Familiar"], description: "Atendimento personalizado e café da manhã caprichado." },
  { id: "l12", name: "Hostel Refúgio", area: "Vila do Abraão", rating: 4.5, image: img("refugio"), tags: ["Hostel"], description: "Hostel descolado, ideal para conhecer outros viajantes." },
  { id: "l13", name: "Pousada Mata Nativa", area: "Vila do Abraão", rating: 4.8, image: img("matanativa"), tags: ["Natureza", "Sossego"], description: "Cercada pela mata atlântica, perfeita para quem busca silêncio." },
  { id: "l14", name: "Pousada Pedacinho de Céu", area: "Vila do Abraão", rating: 4.6, image: img("pedacinhoceu"), tags: ["Família"], description: "Pousada simples e acolhedora a poucos metros do mar." },
  { id: "l15", name: "Biergarten Suites", area: "Vila do Abraão", rating: 4.7, image: img("biergarten"), tags: ["Moderna"], description: "Suítes modernas integradas a um bar/restaurante popular da Vila." },
  { id: "l16", name: "Pousada Horizonte dos Borbas", area: "Vila do Abraão", rating: 4.5, image: img("horizonte"), tags: ["Vista", "Calmo"], description: "Localização tranquila com vista para o mar." },
  { id: "l17", name: "Pousada Água Viva", area: "Vila do Abraão", rating: 4.6, image: img("aguaviva"), tags: ["Pé na areia"], description: "Pousada próxima à praia com ambiente descontraído." },
  { id: "l18", name: "Yes Hotel Pousada", area: "Vila do Abraão", rating: 4.5, image: img("yes"), tags: ["Centro"], description: "Boa estrutura no coração da Vila do Abraão." },
  { id: "l19", name: "Asalem", area: "Vila do Abraão", rating: 4.9, image: img("asalem"), tags: ["Boutique", "Vista panorâmica"], description: "Pousada boutique com vista deslumbrante da baía, indicada para casais." },
  { id: "l20", name: "Lonier Praia Inn Flats", area: "Praia do Abraão", rating: 4.7, image: img("lonier"), tags: ["Flat", "Frente mar"], description: "Flats confortáveis de frente para o mar, com piscina." },
];

export interface Restaurant {
  id: string;
  name: string;
  area: string;
  rating: number;
  cuisine: string;
  description: string;
  image: string;
  confirmed: boolean;
}

export const restaurants: Restaurant[] = [
  { id: "r1", name: "Bardjeco", area: "Vila do Abraão", rating: 4.7, cuisine: "Bar & petiscos", image: img("bardjeco"), confirmed: true, description: "Bar tradicional da Vila, conhecido por chopp gelado e petiscos." },
  { id: "r2", name: "Café do Mar", area: "Vila do Abraão", rating: 4.6, cuisine: "Café & frutos do mar", image: img("cafedomar"), confirmed: true, description: "Café com vista pra orla, ótimos cafés da manhã e lanches." },
  { id: "r3", name: "Pé na Areia", area: "Praia do Abraão", rating: 4.5, cuisine: "Caiçara", image: img("penaareia"), confirmed: true, description: "Comida caiçara servida literalmente com pé na areia." },
  { id: "r4", name: "Refúgio das Caravelas", area: "Vila do Abraão", rating: 4.6, cuisine: "Frutos do mar", image: img("caravelas"), confirmed: true, description: "Especialidades em moquecas e peixes frescos." },
  { id: "r5", name: "Rei da Muqueca", area: "Vila do Abraão", rating: 4.8, cuisine: "Moquecas", image: img("reimuqueca"), confirmed: true, description: "Casa famosa pela moqueca que serve fartamente para 2." },
  { id: "r6", name: "Lua e Mar", area: "Vila do Abraão", rating: 4.7, cuisine: "Contemporânea", image: img("luaemar"), confirmed: true, description: "Cozinha contemporânea com ingredientes locais." },
  { id: "r7", name: "Pães e Companhia", area: "Vila do Abraão", rating: 4.5, cuisine: "Padaria & cafeteria", image: img("paesecia"), confirmed: true, description: "Pães artesanais, cafés e doces ideais para começar o dia." },
  { id: "r8", name: "Pizzaria Fornalha", area: "Vila do Abraão", rating: 4.6, cuisine: "Pizzaria", image: img("fornalha"), confirmed: true, description: "Pizzas em forno a lenha com massa fininha." },
  { id: "r9", name: "Cantinho do Caiçara", area: "Vila do Abraão", rating: 4.3, cuisine: "Caiçara", image: img("cantinhocai"), confirmed: false, description: "Comida caseira em ambiente simples e familiar." },
  { id: "r10", name: "Boteco do Cais", area: "Vila do Abraão", rating: 4.2, cuisine: "Boteco", image: img("botecocais"), confirmed: false, description: "Petiscos, cerveja gelada e clima descontraído." },
  { id: "r11", name: "Sabor do Mar", area: "Praia Preta", rating: 4.4, cuisine: "Frutos do mar", image: img("sabordomar"), confirmed: false, description: "Especialidades em peixes e crustáceos." },
  { id: "r12", name: "Tropicália Bistrô", area: "Vila do Abraão", rating: 4.5, cuisine: "Bistrô", image: img("tropicalia"), confirmed: false, description: "Pratos autorais inspirados na culinária tropical." },
  { id: "r13", name: "Coco Verde", area: "Praia do Abraão", rating: 4.3, cuisine: "Lanches & açaí", image: img("cocoverde"), confirmed: false, description: "Açaí, sucos naturais e lanches rápidos." },
  { id: "r14", name: "Sushi Ilha", area: "Vila do Abraão", rating: 4.4, cuisine: "Japonesa", image: img("sushiilha"), confirmed: false, description: "Combinados frescos e rodízio em alta temporada." },
  { id: "r15", name: "Mata Atlântica Vegan", area: "Vila do Abraão", rating: 4.6, cuisine: "Vegana", image: img("vegan"), confirmed: false, description: "Opções veganas e vegetarianas com ingredientes locais." },
  { id: "r16", name: "Empório Caiçara", area: "Vila do Abraão", rating: 4.4, cuisine: "Empório", image: img("emporio"), confirmed: false, description: "Sanduíches, tábuas e vinhos para um lanche tranquilo." },
  { id: "r17", name: "Tropical Burger", area: "Vila do Abraão", rating: 4.3, cuisine: "Hambúrgueres", image: img("burger"), confirmed: false, description: "Hambúrgueres artesanais e batatas rústicas." },
  { id: "r18", name: "Maré Alta Bar", area: "Vila do Abraão", rating: 4.2, cuisine: "Bar", image: img("marealta"), confirmed: false, description: "Drinks autorais e música ao vivo no fim de semana." },
  { id: "r19", name: "Forneria do Porto", area: "Vila do Abraão", rating: 4.4, cuisine: "Pizzaria", image: img("forneria"), confirmed: false, description: "Pizzas artesanais e calzones." },
  { id: "r20", name: "Doce Maré", area: "Vila do Abraão", rating: 4.5, cuisine: "Sobremesas", image: img("docemare"), confirmed: false, description: "Sorvetes artesanais, brigadeiros e sobremesas tropicais." },
];

export interface BoatTour {
  id: string;
  name: string;
  duration: string;
  avgPrice: string;
  boat: string;
  stops: string[];
  highlight: string;
  alert: string;
  image: string;
}

export const boatTours: BoatTour[] = [
  {
    id: "meia-volta", name: "Meia Volta à Ilha", duration: "5–6 h", avgPrice: "R$ 90 – R$ 130",
    boat: "Escuna média", stops: ["Lagoa Azul", "Lagoa Verde", "Freguesia de Santana", "Japariz"],
    highlight: "Versão mais curta e econômica da volta completa.",
    alert: "Em dias de mar agitado a rota pode ser ajustada.", image: img("meiavolta"),
  },
  {
    id: "volta-ilha", name: "Volta à Ilha", duration: "7–8 h", avgPrice: "R$ 150 – R$ 220",
    boat: "Escuna grande", stops: ["Lagoa Azul", "Freguesia de Santana", "Saco do Céu", "Praia do Pouso", "Aventureiro"],
    highlight: "Roteiro clássico que percorre a costa sul da ilha.",
    alert: "Dia inteiro fora — leve protetor e água.", image: img("voltailha"),
  },
  {
    id: "ilhas-angra", name: "Ilhas de Angra", duration: "7–8 h", avgPrice: "R$ 140 – R$ 200",
    boat: "Escuna ou lancha", stops: ["Ilha da Gipóia", "Lagoa Azul de Angra", "Cataguases", "Botinas"],
    highlight: "Sai de Angra dos Reis em direção às ilhas paradisíacas da baía.",
    alert: "Confirme se a saída é de Angra ou de Abraão.", image: img("ilhasangra"),
  },
  {
    id: "ilhas-paradisiacas", name: "Ilhas Paradisíacas", duration: "6–7 h", avgPrice: "R$ 130 – R$ 190",
    boat: "Escuna", stops: ["Cataguases", "Botinhas", "Lagoa Azul"],
    highlight: "Foco em piscinas naturais com águas transparentes.",
    alert: "Praias podem ficar lotadas em alta temporada.", image: img("paradisiacas"),
  },
  {
    id: "super-sul", name: "Super Sul", duration: "8–9 h", avgPrice: "R$ 180 – R$ 260",
    boat: "Escuna grande", stops: ["Aventureiro", "Parnaioca", "Provetá"],
    highlight: "Para quem quer conhecer as praias mais remotas do sul.",
    alert: "Mar pode ser agitado — não recomendado para crianças pequenas.", image: img("supersul"),
  },
  {
    id: "lagoa-azul-tour", name: "Lagoa Azul", duration: "4 h", avgPrice: "R$ 70 – R$ 110",
    boat: "Lancha/barco-táxi", stops: ["Lagoa Azul", "Praia do Abraãozinho"],
    highlight: "Passeio rápido focado na piscina natural mais famosa.",
    alert: "Local muito visitado — vá cedo.", image: img("lagoaazultour"),
  },
  {
    id: "lagoa-verde", name: "Lagoa Verde", duration: "3–4 h", avgPrice: "R$ 70 – R$ 100",
    boat: "Lancha", stops: ["Lagoa Verde", "Praia do Comprido"],
    highlight: "Águas esverdeadas e calmas, perfeitas para snorkel.",
    alert: "Leve máscara própria; aluguel é limitado.", image: img("lagoaverde"),
  },
  {
    id: "gruta-acaia", name: "Gruta do Acaiá", duration: "5–6 h", avgPrice: "R$ 120 – R$ 180",
    boat: "Lancha ou escuna pequena", stops: ["Gruta do Acaiá", "Saco do Céu", "Japariz"],
    highlight: "Mergulho na caverna marinha com águas cristalinas.",
    alert: "Entrada na gruta depende do nível do mar.", image: img("gruta"),
  },
  {
    id: "escuna-classica", name: "Passeio de Escuna", duration: "6–8 h", avgPrice: "R$ 100 – R$ 180",
    boat: "Escuna tradicional", stops: ["Lagoa Azul", "Freguesia de Santana", "Saco do Céu"],
    highlight: "Experiência clássica com música a bordo e paradas para mergulho.",
    alert: "Bar a bordo costuma ser cobrado à parte.", image: img("escuna"),
  },
];

export interface FunSpot {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  when: string;
}

export const funSpots: FunSpot[] = [
  { id: "f1", name: "Aquário Natural", type: "Atração natural", image: img("aquario"), when: "Dia inteiro", description: "Piscina natural rasa, ideal para snorkel em família, com peixinhos coloridos visíveis." },
  { id: "f2", name: "Praia do Ipaum Guaçú", type: "Praia recanto", image: img("ipaum"), when: "Dia", description: "Recanto tranquilo, ótimo para relaxar longe das multidões." },
  { id: "f3", name: "Música ao vivo na Vila do Abraão", type: "Música", image: img("musicavila"), when: "Quase toda noite", description: "Bares da rua principal recebem MPB, samba e reggae ao vivo." },
  { id: "f4", name: "Bares à beira-mar", type: "Bar", image: img("baresmar"), when: "Tarde e noite", description: "Caipirinhas e cervejas geladas com vista para o cais e os barcos." },
  { id: "f5", name: "Feirinha noturna", type: "Feira", image: img("feirinha"), when: "Noite", description: "Artesanato local, comidinhas e souvenirs em barraquinhas iluminadas." },
  { id: "f6", name: "Eventos de verão", type: "Festas", image: img("verao"), when: "Dez–Mar", description: "Festivais, shows e luaus marcam a alta temporada na ilha." },
  { id: "f7", name: "Carnaval em Ilha Grande", type: "Festa popular", image: img("carnaval"), when: "Fevereiro", description: "Blocos animados pela Vila do Abraão e festas em pousadas." },
  { id: "f8", name: "Ano Novo na Vila", type: "Reveillon", image: img("anonovo"), when: "31 de dez", description: "Queima de fogos vista do cais, todos de branco na beira do mar." },
  { id: "f9", name: "Passeio romântico no Saco do Céu", type: "Passeio noturno", image: img("sacoceu"), when: "Noite", description: "Barco até a baía calma do Saco do Céu, com céu estrelado refletido na água." },
];

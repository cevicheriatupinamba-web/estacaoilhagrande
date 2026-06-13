// Taxonomia oficial usada no importador universal e nos filtros do admin.
// Toda nova categoria/subcategoria deve ser registrada aqui.

export type CategoryKey =
  | "Hospedagem" | "Restaurante" | "Bar" | "Passeio" | "Agência"
  | "Guia Local" | "Transporte" | "Praia" | "Atrativo Turístico"
  | "Comércio Local" | "Evento" | "Serviço";

export const CATEGORIES: CategoryKey[] = [
  "Hospedagem", "Restaurante", "Bar", "Passeio", "Agência",
  "Guia Local", "Transporte", "Praia", "Atrativo Turístico",
  "Comércio Local", "Evento", "Serviço",
];

export const SUBCATEGORIES: Record<CategoryKey, string[]> = {
  "Hospedagem": ["Pousada", "Hotel", "Hostel", "Camping", "Casa de Temporada", "Resort", "Guest House", "Suíte"],
  "Restaurante": ["Frutos do Mar", "Japonês", "Italiano", "Pizzaria", "Hamburgueria", "Cafeteria", "Bistrô", "Brasileira", "Vegetariano"],
  "Bar": ["Bar de Praia", "Pub", "Lounge", "Boteco", "Cervejaria"],
  "Passeio": ["Volta à Ilha", "Meia Volta", "Lagoa Azul", "Lagoa Verde", "Mergulho", "Trilhas", "Lancha Privativa", "Caipirinha Tour", "Pesca"],
  "Agência": ["Receptivo", "Pacotes", "Eventos", "Casamentos"],
  "Guia Local": ["Trilhas", "Mergulho", "Histórico", "Bilíngue"],
  "Transporte": ["CCR Barcas", "Flexboat", "Catamarã", "Transfer", "Táxi Boat", "Van"],
  "Praia": ["Selvagem", "Estruturada", "Família", "Surf"],
  "Atrativo Turístico": ["Mirante", "Trilha", "Histórico", "Cachoeira", "Ruína"],
  "Comércio Local": ["Mercado", "Loja", "Souvenir", "Aluguel"],
  "Evento": ["Festival", "Show", "Esportivo", "Cultural"],
  "Serviço": ["Lavanderia", "Saúde", "Beleza", "Manutenção", "Outros"],
};

/** Mapeia categoria escolhida ao slug de rota pública */
export const CATEGORY_ROUTE: Record<CategoryKey, (slug: string) => string> = {
  "Hospedagem": (s) => `/pousadas/${s}`,
  "Restaurante": (s) => `/onde-comer/${s}`,
  "Bar": (s) => `/onde-comer/${s}`,
  "Passeio": (s) => `/passeios/${s}`,
  "Agência": (s) => `/servicos/${s}`,
  "Guia Local": (s) => `/servicos/${s}`,
  "Transporte": (s) => `/servicos/${s}`,
  "Praia": (s) => `/praias/${s}`,
  "Atrativo Turístico": (s) => `/lugar/${s}`,
  "Comércio Local": (s) => `/servicos/${s}`,
  "Evento": (s) => `/eventos`,
  "Serviço": (s) => `/servicos/${s}`,
};

/** Sugere categoria/subcategoria a partir do nome do estabelecimento */
export function suggestClassification(name: string): { category?: CategoryKey; subcategory?: string } {
  const n = (name || "").toLowerCase();
  if (!n) return {};
  const rules: Array<[RegExp, CategoryKey, string?]> = [
    [/\bhostel\b/, "Hospedagem", "Hostel"],
    [/\bcamping\b/, "Hospedagem", "Camping"],
    [/\bresort\b/, "Hospedagem", "Resort"],
    [/\bguest\s?house\b/, "Hospedagem", "Guest House"],
    [/\bsuíte|suite\b/, "Hospedagem", "Suíte"],
    [/\bpousada\b/, "Hospedagem", "Pousada"],
    [/\bhotel|hotelaria\b/, "Hospedagem", "Hotel"],
    [/\bpizzaria|pizza\b/, "Restaurante", "Pizzaria"],
    [/\bburger|hamburg/, "Restaurante", "Hamburgueria"],
    [/\bcaf[eé]\b|cafeteria/, "Restaurante", "Cafeteria"],
    [/\bsushi|japon[eê]s\b/, "Restaurante", "Japonês"],
    [/\bbistr[oô]\b/, "Restaurante", "Bistrô"],
    [/\brestaurant/, "Restaurante", "Brasileira"],
    [/\bbar\b|boteco|pub|cervejaria/, "Bar", "Bar de Praia"],
    [/\bbarc(as|a)\b|ccr/, "Transporte", "CCR Barcas"],
    [/\bflexboat\b/, "Transporte", "Flexboat"],
    [/\bcatamar[aã]\b/, "Transporte", "Catamarã"],
    [/\btransfer\b/, "Transporte", "Transfer"],
    [/\bag[eê]ncia\b/, "Agência", "Receptivo"],
    [/\bguia\b/, "Guia Local", "Trilhas"],
    [/\bpasseio|tour|volta\s?à?\s?ilha|lagoa/, "Passeio", "Volta à Ilha"],
    [/\bpraia\b/, "Praia", "Estruturada"],
    [/\bmirante|trilha|cachoeira|ru[ií]na/, "Atrativo Turístico", "Mirante"],
    [/\bevento|festival|show/, "Evento", "Festival"],
  ];
  for (const [re, cat, sub] of rules) if (re.test(n)) return { category: cat, subcategory: sub };
  return {};
}

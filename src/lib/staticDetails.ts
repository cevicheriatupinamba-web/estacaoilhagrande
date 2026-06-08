// Catálogo unificado dos itens estáticos do portal (hospedagem, restaurantes,
// passeios, roteiros, dicas e serviços) para alimentar cartões e páginas de
// detalhe individuais com URL amigável.

import { lodgings, restaurants, boatTours } from "@/data/listings";
import { roteiros as roteirosMock, tips as tipsMock } from "@/data/mockData";
import { themedImage } from "@/lib/images";
import {
  Truck, Anchor, Camera, ShoppingBag, Sparkles, Store, Wrench, LucideIcon,
} from "lucide-react";

export type StaticCategoryKey =
  | "onde-comer"
  | "onde-se-hospedar"
  | "passeios"
  | "roteiros"
  | "dicas"
  | "servicos";

export type Tier = "basico" | "destaque" | "premium";

export const tierByIndex = (i: number): Tier =>
  i < 4 ? "basico" : i < 8 ? "destaque" : "premium";

export const TIER_LABEL: Record<Tier, string> = {
  basico: "Plano Básico",
  destaque: "Empresa Recomendada",
  premium: "Premium",
};

export const TIER_MAX_PHOTOS: Record<Tier, number> = {
  basico: 10,
  destaque: 20,
  premium: 40,
};

export const CATEGORY_BASE_PATH: Record<StaticCategoryKey, string> = {
  "onde-comer": "/onde-comer",
  "onde-se-hospedar": "/onde-se-hospedar",
  "passeios": "/passeios",
  "roteiros": "/roteiros",
  "dicas": "/dicas",
  "servicos": "/servicos",
};

export const CATEGORY_LABEL: Record<StaticCategoryKey, string> = {
  "onde-comer": "Onde comer",
  "onde-se-hospedar": "Onde se hospedar",
  "passeios": "Passeios",
  "roteiros": "Roteiros",
  "dicas": "Dicas",
  "servicos": "Serviços",
};

export interface StaticItem {
  slug: string;
  name: string;
  categoryKey: StaticCategoryKey;
  subcategory?: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  fullDescription: string;
  bullets?: string[];
  location?: string;
  whatsapp?: string;
  instagram?: string;
  icon?: LucideIcon;
  meta?: { label: string; value: string }[];
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const defaultWa = "5524999992503";

// ---------- Builders ----------
const lodgingsAsItems: StaticItem[] = lodgings.map(l => ({
  slug: slugify(l.name),
  name: l.name,
  categoryKey: "onde-se-hospedar",
  subcategory: l.tags[0],
  image: l.image,
  gallery: [l.image, themedImage("lodging", l.id + "-2"), themedImage("lodging", l.id + "-3")],
  shortDescription: l.description,
  fullDescription:
    `${l.description} Localizada em ${l.area}, esta hospedagem é uma das opções mais procuradas por quem visita Ilha Grande, com avaliação ${l.rating}/5 e ambiente cuidado para receber bem viajantes em busca de conforto, praticidade e atendimento próximo.`,
  bullets: l.tags,
  location: l.area,
  whatsapp: defaultWa,
  meta: [
    { label: "Avaliação", value: `${l.rating} / 5` },
    { label: "Bairro", value: l.area },
  ],
}));

const restaurantsAsItems: StaticItem[] = restaurants.map(r => ({
  slug: slugify(r.name),
  name: r.name,
  categoryKey: "onde-comer",
  subcategory: r.cuisine,
  image: r.image,
  gallery: [r.image, themedImage("restaurant", r.id + "-2"), themedImage("restaurant", r.id + "-3")],
  shortDescription: r.description,
  fullDescription:
    `${r.description} ${r.name} fica em ${r.area}, e é uma das casas mais recomendadas em Ilha Grande para a categoria ${r.cuisine}. Avaliação ${r.rating}/5 com base nos guias e visitantes do portal.`,
  bullets: [r.cuisine, r.area, r.confirmed ? "Estabelecimento confirmado" : "Dados a confirmar"],
  location: r.area,
  whatsapp: defaultWa,
  meta: [
    { label: "Cozinha", value: r.cuisine },
    { label: "Avaliação", value: `${r.rating} / 5` },
    { label: "Bairro", value: r.area },
  ],
}));

const boatToursAsItems: StaticItem[] = boatTours.map(t => ({
  slug: slugify(t.name),
  name: t.name,
  categoryKey: "passeios",
  subcategory: t.category,
  image: t.image,
  gallery: [t.image, themedImage("boat", t.id + "-2"), themedImage("boat", t.id + "-3")],
  shortDescription: t.highlight,
  fullDescription:
    `${t.highlight}\n\nRoteiro: ${t.stops.join(" · ")}.\n\nDuração estimada de ${t.duration} a bordo de ${t.boat}. Preço médio na temporada: ${t.avgPrice}. Atenção: ${t.alert}`,
  bullets: t.stops,
  location: "Saída do cais de Abraão",
  whatsapp: defaultWa,
  meta: [
    { label: "Duração", value: t.duration },
    { label: "Preço médio", value: t.avgPrice },
    { label: "Embarcação", value: t.boat },
    ...(t.difficulty ? [{ label: "Dificuldade", value: t.difficulty }] : []),
  ],
}));

const roteirosAsItems: StaticItem[] = roteirosMock.map(r => ({
  slug: slugify(r.title),
  name: r.title,
  categoryKey: "roteiros",
  subcategory: r.style,
  image: themedImage("activity", r.id),
  gallery: [themedImage("activity", r.id), themedImage("boat", r.id), themedImage("beach", r.id)],
  shortDescription: r.subtitle,
  fullDescription:
    `${r.subtitle}. Este roteiro foi montado pela equipe da Estação Ilha Grande para quem busca uma experiência ${r.style.toLowerCase()} com duração de ${r.duration}.\n\nPasso a passo sugerido:\n• ${r.steps.join("\n• ")}\n\nPodemos personalizar este roteiro com guias locais, transfer e reservas confirmadas — fale com a gente no WhatsApp.`,
  bullets: r.steps,
  whatsapp: defaultWa,
  meta: [
    { label: "Duração", value: r.duration },
    { label: "Estilo", value: r.style },
  ],
}));

const dicasAsItems: StaticItem[] = tipsMock.map((t, i) => ({
  slug: slugify(t.title),
  name: t.title,
  categoryKey: "dicas",
  image: themedImage("activity", "dica-" + i),
  gallery: [themedImage("activity", "dica-" + i), themedImage("beach", "dica-" + i)],
  shortDescription: t.content.slice(0, 140),
  fullDescription:
    `${t.content}\n\nEsta é uma das dicas essenciais reunidas pela equipe da Estação Ilha Grande para tornar a sua viagem mais segura, organizada e tranquila. Em caso de dúvidas específicas, fale com a gente no WhatsApp e tire suas perguntas direto com um guia local.`,
  bullets: [t.icon + " " + t.title],
  whatsapp: defaultWa,
  meta: [{ label: "Categoria", value: "Planejamento" }],
}));

const SERVICOS_RAW: {
  name: string;
  icon: LucideIcon;
  desc: string;
  full: string;
}[] = [
  { name: "Transfer e Taxi Boat", icon: Anchor, desc: "Translado Rio/Angra ↔ Ilha Grande, taxi boat e lanchas privativas.", full: "Translado terrestre + marítimo entre Rio de Janeiro, Angra dos Reis, Conceição de Jacareí e Ilha Grande. Também organizamos taxi boat entre praias e lanchas privativas para roteiros sob medida." },
  { name: "Transporte na Ilha", icon: Truck, desc: "Como chegar e se locomover dentro da ilha.", full: "Orientação completa sobre barcas, escunas e traslados internos. Como em Ilha Grande não circulam carros, o transporte é feito a pé ou por barco — explicamos a melhor forma para cada destino." },
  { name: "Fotografia Turística", icon: Camera, desc: "Fotógrafos locais para ensaios, casamentos e cobertura de passeios.", full: "Fotógrafos parceiros para ensaios em praias paradisíacas, registros de casamento, elopement, eventos e cobertura de passeios de barco com entrega digital em alta resolução." },
  { name: "Comércio Local", icon: ShoppingBag, desc: "Mercados, lojas de artesanato, lojas de praia, tabacarias e bancas.", full: "Guia do comércio local da Vila do Abraão: supermercados, lojas de artesanato caiçara, lojas de praia, tabacarias, farmácias e serviços do dia a dia para quem está hospedado na ilha." },
  { name: "Aluguel de Equipamentos", icon: Store, desc: "Snorkel, prancha, SUP, caiaque e equipamentos de trilha.", full: "Aluguel de máscara e snorkel, prancha de surf, stand-up paddle, caiaque, mochila cargueira, lanterna de cabeça e demais equipamentos para aproveitar a ilha com segurança." },
  { name: "Beleza, Estética e Bem-estar", icon: Sparkles, desc: "Massagem, terapias, salão de beleza e estética na vila.", full: "Profissionais parceiros oferecendo massagem relaxante, terapias integrativas, salão de beleza, manicure, design de sobrancelhas e estética — perfeitos para combinar com dias de descanso." },
  { name: "Serviços Gerais", icon: Wrench, desc: "Manutenção, lavanderia, eventos e prestadores locais.", full: "Lavanderia expressa, manutenção, eventos, decoração, segurança e prestadores diversos para anunciantes, pousadas e visitantes de Ilha Grande." },
];

const servicosAsItems: StaticItem[] = SERVICOS_RAW.map((s, i) => ({
  slug: slugify(s.name),
  name: s.name,
  categoryKey: "servicos",
  image: themedImage("activity", "serv-" + i),
  gallery: [themedImage("activity", "serv-" + i), themedImage("activity", "serv-b-" + i)],
  shortDescription: s.desc,
  fullDescription: s.full,
  bullets: [s.desc],
  icon: s.icon,
  whatsapp: defaultWa,
  meta: [{ label: "Categoria", value: "Serviços em Ilha Grande" }],
}));

export const STATIC_ITEMS: Record<StaticCategoryKey, StaticItem[]> = {
  "onde-comer": restaurantsAsItems,
  "onde-se-hospedar": lodgingsAsItems,
  "passeios": boatToursAsItems,
  "roteiros": roteirosAsItems,
  "dicas": dicasAsItems,
  "servicos": servicosAsItems,
};

export const getStaticItem = (category: StaticCategoryKey, slug: string) =>
  STATIC_ITEMS[category]?.find(i => i.slug === slug);

export const itemUrl = (item: { categoryKey: StaticCategoryKey; slug: string }) =>
  `${CATEGORY_BASE_PATH[item.categoryKey]}/${item.slug}`;

// Helpers para gerar JSON-LD (schema.org) reutilizável nas páginas.
const SITE = "https://estacaoilhagrande.com.br";

export interface CollectionItem {
  name: string;
  path?: string;
  description?: string;
  image?: string;
}

/** ItemList schema para páginas de coleção (praias, restaurantes, pousadas, passeios). */
export const itemListLd = (name: string, path: string, items: CollectionItem[], description?: string) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  description,
  url: `${SITE}${path}`,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    url: it.path ? `${SITE}${it.path}` : undefined,
    image: it.image,
    description: it.description,
  })),
});

/** CollectionPage schema (para páginas editoriais com lista de cards). */
export const collectionPageLd = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: `${SITE}${path}`,
  inLanguage: "pt-BR",
  isPartOf: { "@type": "WebSite", name: "Estação Ilha Grande", url: SITE },
});

/** Article schema para guias editoriais. */
export const articleLd = (params: {
  headline: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: params.headline,
  description: params.description,
  image: params.image,
  url: `${SITE}${params.path}`,
  mainEntityOfPage: `${SITE}${params.path}`,
  datePublished: params.datePublished || "2026-06-09",
  dateModified: params.dateModified || "2026-06-09",
  inLanguage: "pt-BR",
  author: { "@type": "Organization", name: params.author || "Estação Ilha Grande" },
  publisher: {
    "@type": "Organization",
    name: "Estação Ilha Grande",
    logo: { "@type": "ImageObject", url: `${SITE}/favicon.ico` },
  },
});

/** TouristAttraction schema (praias, trilhas, mirantes). */
export const touristAttractionLd = (params: {
  name: string;
  description: string;
  path: string;
  image?: string;
  lat?: number;
  lng?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: params.name,
  description: params.description,
  image: params.image,
  url: `${SITE}${params.path}`,
  ...(typeof params.lat === "number" && typeof params.lng === "number"
    ? { geo: { "@type": "GeoCoordinates", latitude: params.lat, longitude: params.lng } }
    : {}),
  containedInPlace: {
    "@type": "TouristDestination",
    name: "Ilha Grande, Angra dos Reis, RJ, Brasil",
  },
});

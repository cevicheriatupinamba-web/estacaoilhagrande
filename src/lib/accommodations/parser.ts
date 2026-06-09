export type AccommodationPhoto = { url: string; alt?: string; is_cover?: boolean };
export type AccommodationRoom = { name: string; description?: string; capacity?: string; amenities?: string[]; photos?: string[] };
export type AccommodationHouseRules = {
  checkin?: string; checkout?: string; pets?: string;
  children?: string; payment?: string; cancellation?: string;
};

export type AccommodationDraft = {
  name: string;
  slug?: string;
  category?: string;
  source_url?: string;
  source_platform?: string;
  location?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  short_description?: string;
  full_description?: string;
  rating?: number | null;
  review_count?: number | null;
  amenities: string[];
  photos: AccommodationPhoto[];
  rooms: AccommodationRoom[];
  house_rules: AccommodationHouseRules;
  checkin_time?: string;
  checkout_time?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  status?: "draft" | "published" | "inactive";
  is_featured?: boolean;
};

export function slugify(text: string): string {
  return (text || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseAccommodationJSON(raw: string): { ok: true; data: AccommodationDraft } | { ok: false; error: string } {
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch (e: any) {
    return { ok: false, error: "JSON inválido. Verifique chaves, vírgulas e aspas." };
  }
  if (!json || typeof json !== "object") return { ok: false, error: "JSON precisa ser um objeto." };

  const photos: AccommodationPhoto[] = Array.isArray(json.photos)
    ? json.photos
        .map((p: any) =>
          typeof p === "string"
            ? { url: p, alt: json.name ?? "", is_cover: false }
            : { url: String(p.url ?? ""), alt: String(p.alt ?? ""), is_cover: Boolean(p.is_cover) }
        )
        .filter((p: AccommodationPhoto) => p.url)
    : [];
  if (photos.length && !photos.some((p) => p.is_cover)) photos[0].is_cover = true;

  const amenities: string[] = Array.isArray(json.amenities)
    ? json.amenities.map((a: any) => String(a)).filter(Boolean)
    : [];

  const rooms: AccommodationRoom[] = Array.isArray(json.rooms)
    ? json.rooms.map((r: any) => ({
        name: String(r.name ?? ""),
        description: r.description ? String(r.description) : "",
        capacity: r.capacity ? String(r.capacity) : "",
        amenities: Array.isArray(r.amenities) ? r.amenities.map(String) : [],
        photos: Array.isArray(r.photos) ? r.photos.map(String) : [],
      }))
    : [];

  const house_rules: AccommodationHouseRules = typeof json.house_rules === "object" && json.house_rules
    ? {
        checkin: json.house_rules.checkin ?? "",
        checkout: json.house_rules.checkout ?? "",
        pets: json.house_rules.pets ?? "",
        children: json.house_rules.children ?? "",
        payment: json.house_rules.payment ?? "",
        cancellation: json.house_rules.cancellation ?? "",
      }
    : {};

  const name = String(json.name ?? "").trim();
  const data: AccommodationDraft = {
    name,
    slug: json.slug ? slugify(String(json.slug)) : name ? slugify(name) : "",
    category: json.category ?? "Pousada",
    source_url: json.source_url ?? "",
    source_platform: json.source_platform ?? (json.source_url?.includes("booking.com") ? "Booking.com" : ""),
    location: json.location ?? "",
    address: json.address ?? "",
    neighborhood: json.neighborhood ?? "",
    city: json.city ?? "Ilha Grande",
    state: json.state ?? "Rio de Janeiro",
    country: json.country ?? "Brasil",
    latitude: json.latitude ? Number(json.latitude) : null,
    longitude: json.longitude ? Number(json.longitude) : null,
    short_description: json.short_description ?? "",
    full_description: json.full_description ?? "",
    rating: json.rating === "" || json.rating == null ? null : Number(json.rating),
    review_count: json.review_count === "" || json.review_count == null ? null : Number(json.review_count),
    amenities,
    photos,
    rooms,
    house_rules,
    checkin_time: json.checkin_time ?? "",
    checkout_time: json.checkout_time ?? "",
    whatsapp: json.whatsapp ?? "",
    instagram: json.instagram ?? "",
    website: json.website ?? "",
    seo_title: json.seo_title ?? "",
    seo_description: json.seo_description ?? "",
    seo_keywords: json.seo_keywords ?? "",
    status: (json.status as any) ?? "draft",
    is_featured: Boolean(json.is_featured),
  };

  return { ok: true, data };
}

export function buildTemplateFromBookingUrl(url: string): AccommodationDraft {
  // Booking URL pattern: /hotel/br/<slug>.pt-br.html
  let name = "Nova pousada";
  let slug = "";
  try {
    const u = new URL(url);
    const match = u.pathname.match(/hotel\/[a-z]{2}\/([^.]+)/i);
    if (match) {
      slug = match[1].toLowerCase();
      name = match[1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  } catch {}
  return {
    name,
    slug,
    category: "Pousada",
    source_url: url,
    source_platform: "Booking.com",
    location: "Vila do Abraão, Ilha Grande",
    city: "Ilha Grande",
    state: "Rio de Janeiro",
    country: "Brasil",
    short_description: "",
    full_description: "",
    rating: null,
    review_count: null,
    amenities: [],
    photos: [],
    rooms: [],
    house_rules: { checkin: "", checkout: "", pets: "", children: "", payment: "", cancellation: "" },
    status: "draft",
    is_featured: false,
  };
}

export function validateForPublish(d: AccommodationDraft): { ok: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!d.name?.trim()) errors.push("Nome da pousada é obrigatório.");
  if (!d.slug?.trim()) errors.push("Slug é obrigatório.");
  const cover = d.photos.find((p) => p.is_cover) ?? d.photos[0];
  if (!cover) warnings.push("Nenhuma foto principal definida.");
  if (!d.short_description && !d.full_description) warnings.push("Nenhuma descrição preenchida.");
  return { ok: errors.length === 0, errors, warnings };
}

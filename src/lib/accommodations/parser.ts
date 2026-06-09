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

/** Normalize a raw Apify dataset item (Booking/Google scrapers) into AccommodationDraft */
export type ApifyImportResult =
  | { ok: true; data: AccommodationDraft; warnings: string[] }
  | { ok: false; errors: string[] };

export function normalizeApifyJSON(raw: string): ApifyImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw || !raw.trim()) {
    return { ok: false, errors: ["Cole o JSON exportado pelo Apify antes de importar."] };
  }

  let json: any;
  try {
    json = JSON.parse(raw);
  } catch (e: any) {
    return { ok: false, errors: [`JSON inválido: ${e?.message ?? "verifique chaves, vírgulas e aspas."}`] };
  }
  if (Array.isArray(json)) {
    if (json.length === 0) return { ok: false, errors: ["O array do Apify está vazio — nenhum item para importar."] };
    if (json.length > 1) warnings.push(`O JSON contém ${json.length} itens. Apenas o primeiro foi importado.`);
    json = json[0];
  }
  if (!json || typeof json !== "object") {
    return { ok: false, errors: ["O JSON precisa ser um objeto ou um array de objetos."] };
  }

  const name = String(json.name ?? json.title ?? json.hotelName ?? "").trim();
  if (!name) errors.push("Campo obrigatório ausente: 'name' (nome da pousada).");
  if (name.length > 200) errors.push("Campo 'name' excede 200 caracteres.");

  // Validate types of common fields
  if (json.rating != null && json.rating !== "" && isNaN(Number(json.rating))) {
    errors.push("Campo 'rating' precisa ser numérico (ex.: 8.7).");
  }
  if (json.images != null && !Array.isArray(json.images) && !Array.isArray(json.photos) && !Array.isArray(json.gallery)) {
    errors.push("Campo 'images' precisa ser um array de URLs ou objetos.");
  }
  if (json.amenities != null && !Array.isArray(json.amenities) && !Array.isArray(json.facilities)) {
    errors.push("Campo 'amenities' precisa ser um array.");
  }
  if (json.rooms != null && !Array.isArray(json.rooms) && !Array.isArray(json.roomTypes)) {
    errors.push("Campo 'rooms' precisa ser um array.");
  }

  if (errors.length) return { ok: false, errors };



  const rawImages: any[] = Array.isArray(json.images)
    ? json.images
    : Array.isArray(json.photos) ? json.photos
    : Array.isArray(json.gallery) ? json.gallery : [];
  const photos: AccommodationPhoto[] = rawImages
    .map((p: any) => {
      if (!p) return null;
      if (typeof p === "string") return { url: p, alt: name, is_cover: false };
      const url = p.url ?? p.image ?? p.src ?? p.imageUrl ?? p.thumbnail ?? "";
      return url ? { url: String(url), alt: String(p.alt ?? p.caption ?? name), is_cover: false } : null;
    })
    .filter(Boolean) as AccommodationPhoto[];
  if (photos.length) photos[0].is_cover = true;

  let address = "", city = "", state = "", country = "", neighborhood = "";
  if (typeof json.address === "string") {
    address = json.address;
  } else if (json.address && typeof json.address === "object") {
    address = json.address.full ?? json.address.street ?? json.address.addressLine ?? "";
    city = json.address.city ?? "";
    state = json.address.region ?? json.address.state ?? "";
    country = json.address.country ?? "";
    neighborhood = json.address.neighborhood ?? json.address.district ?? "";
  }
  city = city || json.city || "Ilha Grande";
  state = state || json.region || json.state || "Rio de Janeiro";
  country = country || json.country || "Brasil";
  neighborhood = neighborhood || json.neighborhood || "";
  const location = [neighborhood, city].filter(Boolean).join(", ") || city;

  const full_description = String(json.description ?? json.fullDescription ?? json.about ?? json.summary ?? "").trim();
  const short_description = String(json.shortDescription ?? json.tagline ?? full_description.split(/\n|\. /)[0] ?? "").slice(0, 240);

  const ratingRaw = json.rating ?? json.score ?? json.stars ?? null;
  const rating = ratingRaw != null && ratingRaw !== "" ? Number(ratingRaw) : null;
  const reviewsRaw = json.reviews ?? json.reviewsCount ?? json.reviewCount ?? json.numberOfReviews ?? null;
  const review_count = typeof reviewsRaw === "number" ? reviewsRaw
    : typeof reviewsRaw === "string" && reviewsRaw ? (Number(String(reviewsRaw).replace(/\D/g, "")) || null)
    : Array.isArray(reviewsRaw) ? reviewsRaw.length : null;

  const rawAmenities: any[] = Array.isArray(json.amenities) ? json.amenities
    : Array.isArray(json.facilities) ? json.facilities : [];
  const amenities: string[] = rawAmenities
    .flatMap((a: any) => {
      if (!a) return [];
      if (typeof a === "string") return [a];
      if (Array.isArray(a.items)) return a.items.map((i: any) => (typeof i === "string" ? i : i?.name)).filter(Boolean);
      return [a.name ?? a.title ?? a.label].filter(Boolean);
    })
    .map(String);

  const rawRooms: any[] = Array.isArray(json.rooms) ? json.rooms : Array.isArray(json.roomTypes) ? json.roomTypes : [];
  const rooms: AccommodationRoom[] = rawRooms.map((r: any) => ({
    name: String(r.name ?? r.title ?? r.type ?? "Quarto"),
    description: String(r.description ?? ""),
    capacity: r.capacity ? String(r.capacity) : r.persons ? String(r.persons) : "",
    amenities: Array.isArray(r.amenities) ? r.amenities.map(String) : [],
    photos: Array.isArray(r.photos) ? r.photos.map((p: any) => (typeof p === "string" ? p : p?.url ?? "")).filter(Boolean) : [],
  }));

  const checkin = String(json.checkIn ?? json.checkin ?? json.check_in ?? json.checkInTime ?? "");
  const checkout = String(json.checkOut ?? json.checkout ?? json.check_out ?? json.checkOutTime ?? "");
  const house_rules: AccommodationHouseRules = {
    checkin, checkout,
    pets: String(json.pets ?? json.petsPolicy ?? ""),
    children: String(json.children ?? json.childrenPolicy ?? ""),
    payment: String(json.payment ?? json.paymentMethods ?? ""),
    cancellation: String(json.cancellation ?? json.cancellationPolicy ?? ""),
  };

  const slug = slugify(name);
  const seo_title = `${name} — Pousada em ${city} | Estação Ilha Grande`.slice(0, 70);
  const seo_description = (short_description || `Conheça ${name} em ${location}. Reserve sua estadia na Ilha Grande.`).slice(0, 160);

  const data: AccommodationDraft = {
    name, slug, category: "Pousada",
    source_url: String(json.url ?? json.source_url ?? ""),
    source_platform: json.source_platform ?? (String(json.url ?? "").includes("booking.com") ? "Booking.com" : "Apify"),
    location, address, neighborhood, city, state, country,
    latitude: json.latitude ?? json.lat ?? json.location?.lat ?? null,
    longitude: json.longitude ?? json.lng ?? json.location?.lng ?? null,
    short_description, full_description,
    rating, review_count,
    amenities, photos, rooms, house_rules,
    checkin_time: checkin, checkout_time: checkout,
    whatsapp: String(json.whatsapp ?? json.phone ?? ""),
    instagram: String(json.instagram ?? ""),
    website: String(json.website ?? json.url ?? ""),
    seo_title, seo_description,
    seo_keywords: [name, "pousada", city, "Ilha Grande"].join(", "),
    status: "draft",
    is_featured: false,
  };

  if (!photos.length) warnings.push("Nenhuma foto válida encontrada no JSON.");
  if (!full_description) warnings.push("Descrição vazia — pousada será publicada sem texto descritivo.");
  if (rating == null) warnings.push("Avaliação ('rating') não informada.");
  if (!address) warnings.push("Endereço não informado.");

  return { ok: true, data, warnings };
}


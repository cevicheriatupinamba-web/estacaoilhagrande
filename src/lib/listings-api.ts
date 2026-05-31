import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];
export type ListingCategory = Database["public"]["Enums"]["listing_category"];
export type ListingStatus = Database["public"]["Enums"]["listing_status"];
export type ListingPlan = Database["public"]["Enums"]["listing_plan"];

export const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export const PLAN_LABEL: Record<ListingPlan, string> = {
  gratuito: "Gratuito",
  destaque: "Destaque",
  premium: "Premium",
};

export const STATUS_LABEL: Record<ListingStatus, string> = {
  pending: "Aguardando aprovação",
  approved: "Publicado",
  rejected: "Recusado",
};

export const CATEGORY_LABEL: Record<ListingCategory, string> = {
  hospedagem: "Hospedagem",
  restaurante: "Restaurante",
  passeio: "Passeio",
  experiencia: "Experiência",
};

export const SUBCATEGORIES: Record<ListingCategory, string[]> = {
  hospedagem: ["Pousada", "Hotel", "Hostel", "Casa de temporada", "Suíte", "Camping", "Premium", "Econômico"],
  restaurante: ["Restaurante", "Bar", "Bistrô", "Café", "Delivery", "Brasileira", "Frutos do mar", "Pizza", "Hambúrguer", "Alta gastronomia"],
  passeio: ["Passeio de barco", "Meia volta à ilha", "Volta à ilha", "Lopes Mendes", "Mergulho", "Trilha", "Lancha privativa"],
  experiencia: ["Premium", "Aventura", "Romântico", "Família", "Ecoturismo"],
};

export async function fetchApprovedByCategory(category: ListingCategory) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("category", category)
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("plan", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ListingRow[];
}

export async function fetchListingBySlug(slug: string) {
  const { data, error } = await supabase
    .from("listings").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as ListingRow | null;
}

export async function fetchMyListings(ownerId: string) {
  const { data, error } = await supabase
    .from("listings").select("*").eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ListingRow[];
}

export async function fetchAllListingsAdmin() {
  const { data, error } = await supabase
    .from("listings").select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ListingRow[];
}

export async function uploadListingPhoto(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("listing-photos").upload(path, file, {
    cacheControl: "3600", upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
  return data.publicUrl;
}

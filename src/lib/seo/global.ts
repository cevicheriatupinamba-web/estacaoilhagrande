// Loader and types for the SEO Global Premium settings stored in
// platform_settings. Reads once and caches in-memory.
import { supabase } from "@/integrations/supabase/client";

export type SeoMeta = { title: string; description: string; keywords: string; canonical: string };
export type SeoOG = { title: string; description: string; image: string };
export type SeoTwitter = SeoOG;
export type SeoVerifications = {
  google: string; bing: string; ga4: string; gsc: string; gtm: string; meta_pixel: string;
};
export type SeoAdvanced = {
  robots: string; favicon: string; apple_touch_icon: string; manifest: string;
  theme_color: string; primary_color: string;
};
export type SeoLocal = {
  city: string; state: string; country: string; latitude: string; longitude: string;
  region: string; phone: string; whatsapp: string; email: string;
};
export type SeoCategoryEntry = { title: string; description: string; keywords: string };
export type SeoCategories = Record<string, SeoCategoryEntry>;

export interface GlobalSEO {
  meta: SeoMeta;
  og: SeoOG;
  twitter: SeoTwitter;
  verifications: SeoVerifications;
  advanced: SeoAdvanced;
  local: SeoLocal;
  categories: SeoCategories;
  institutional: { name: string; whatsapp: string; email: string; instagram: string; facebook: string };
}

const KEY_MAP = {
  seo_meta: "meta",
  seo_og: "og",
  seo_twitter: "twitter",
  seo_verifications: "verifications",
  seo_advanced: "advanced",
  seo_local: "local",
  seo_categories: "categories",
  institutional: "institutional",
} as const;

export async function fetchGlobalSEO(): Promise<Partial<GlobalSEO>> {
  const { data } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", Object.keys(KEY_MAP));
  const out: any = {};
  (data ?? []).forEach((r: any) => {
    const dest = (KEY_MAP as any)[r.key];
    if (dest) out[dest] = r.value ?? {};
  });
  return out;
}

export function getCategorySEO(categories: SeoCategories | undefined, slug: string): SeoCategoryEntry | null {
  return categories?.[slug] ?? null;
}

import { supabase } from "@/integrations/supabase/client";

export const AGENCY_WHATSAPP_DEFAULT = "5521996704427";
export const AGENCY_MESSAGE_DEFAULT =
  "Olá! Vim pela Estação Ilha Grande e quero falar com a Agência Oficial.";

export function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook|Silk|Kindle/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(ua)) return "mobile";
  return "desktop";
}

export function sanitizeWhatsappNumber(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;
  // Assume Brazil if missing country code
  return digits.length <= 11 ? `55${digits}` : digits;
}

export function buildWhatsappUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

let agencyCache: { number: string; message: string } | null = null;

export async function getAgencyWhatsapp(): Promise<{ number: string; message: string }> {
  if (agencyCache) return agencyCache;
  try {
    const { data } = await supabase
      .from("platform_settings")
      .select("key,value")
      .in("key", ["agency_whatsapp", "agency_message"]);
    const map = new Map((data || []).map((r: any) => [r.key, r.value]));
    const number =
      (typeof map.get("agency_whatsapp") === "string"
        ? (map.get("agency_whatsapp") as string)
        : null) || AGENCY_WHATSAPP_DEFAULT;
    const message =
      (typeof map.get("agency_message") === "string"
        ? (map.get("agency_message") as string)
        : null) || AGENCY_MESSAGE_DEFAULT;
    agencyCache = { number, message };
  } catch {
    agencyCache = { number: AGENCY_WHATSAPP_DEFAULT, message: AGENCY_MESSAGE_DEFAULT };
  }
  return agencyCache;
}

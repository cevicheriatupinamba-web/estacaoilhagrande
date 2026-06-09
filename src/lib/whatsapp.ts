// Central WhatsApp helpers — single source of truth.
import { supabase } from "@/integrations/supabase/client";

export const AGENCY_WHATSAPP_DEFAULT = "5521996704427";
export const AGENCY_MESSAGE_DEFAULT =
  "Olá! Vim pela Estação Ilha Grande e gostaria de ajuda para planejar minha viagem.";

// Back-compat alias
export const AGENCIA_WHATSAPP = AGENCY_WHATSAPP_DEFAULT;

export function sanitizeWhatsappNumber(raw: string | null | undefined): string {
  if (!raw) return "";
  let digits = String(raw).replace(/\D/g, "");
  if (!digits) return "";
  // Add Brazil country code when missing
  if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
  return digits;
}

export function buildWhatsappUrl(phone: string, message: string): string {
  const clean = sanitizeWhatsappNumber(phone);
  const msg = encodeURIComponent(message || "");
  return `https://wa.me/${clean}?text=${msg}`;
}

export function whatsappLink(message: string, phone: string = AGENCY_WHATSAPP_DEFAULT) {
  return buildWhatsappUrl(phone, message);
}

export function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent || "";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

export function buildLeadMessage(opts: {
  listingName?: string;
  category?: string;
  userName?: string;
  customMessage?: string;
}) {
  const parts = [
    `Olá! Vim pela Estação Ilha Grande.`,
    opts.listingName ? `Tenho interesse no anúncio: ${opts.listingName}.` : "",
    opts.category ? `Categoria: ${opts.category}.` : "",
    opts.userName ? `Meu nome: ${opts.userName}.` : "",
    opts.customMessage ? opts.customMessage : "",
  ].filter(Boolean);
  return parts.join("\n");
}

// Loads agency contact data from platform_settings, falling back to defaults.
export async function getAgencyWhatsapp(): Promise<{ number: string; message: string }> {
  try {
    const { data } = await supabase
      .from("platform_settings")
      .select("key,value")
      .in("key", ["agency_whatsapp", "agency_whatsapp_message"]);
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: any) => {
      const v = typeof r.value === "string" ? r.value : (r.value?.value ?? "");
      map[r.key] = v;
    });
    return {
      number: sanitizeWhatsappNumber(map.agency_whatsapp) || AGENCY_WHATSAPP_DEFAULT,
      message: map.agency_whatsapp_message || AGENCY_MESSAGE_DEFAULT,
    };
  } catch {
    return { number: AGENCY_WHATSAPP_DEFAULT, message: AGENCY_MESSAGE_DEFAULT };
  }
}

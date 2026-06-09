// Central WhatsApp helpers — single source of truth for the official agency number.
export const AGENCIA_WHATSAPP = "5521996704427";

export function whatsappLink(message: string, phone: string = AGENCIA_WHATSAPP) {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
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

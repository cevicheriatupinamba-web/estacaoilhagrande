import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import whatsappBtn from "@/assets/whatsapp-button-transparent.png";
import { getAgencyWhatsapp, buildWhatsappUrl, AGENCY_WHATSAPP_DEFAULT, AGENCY_MESSAGE_DEFAULT } from "@/lib/whatsapp";

// Backwards-compatible exports (still used by older code paths)
export const WHATSAPP_NUMBER = AGENCY_WHATSAPP_DEFAULT;
export const WHATSAPP_MSG = AGENCY_MESSAGE_DEFAULT;
export const WHATSAPP_URL = buildWhatsappUrl(AGENCY_WHATSAPP_DEFAULT, AGENCY_MESSAGE_DEFAULT);

// Hide FAB on internal apps / forms where it would overlap UI
const HIDDEN_PREFIXES = ["/admin", "/dashboard", "/minha-empresa", "/minha-assinatura", "/minha-conta", "/painel-anunciante"];

const WhatsAppFAB = () => {
  const loc = useLocation();
  const [url, setUrl] = useState(WHATSAPP_URL);

  useEffect(() => {
    getAgencyWhatsapp().then(({ number, message }) => {
      const isListing = loc.pathname.startsWith("/listagem/") || loc.pathname.startsWith("/empresa/");
      const contextMsg = isListing
        ? `${message} (vim pelo anúncio em ${window.location.href})`
        : message;
      setUrl(buildWhatsappUrl(number, contextMsg));
    });
  }, [loc.pathname]);

  if (HIDDEN_PREFIXES.some(p => loc.pathname.startsWith(p))) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Agência Oficial no WhatsApp"
      className="fixed bottom-3 right-3 z-50 hover:scale-105 active:scale-95 transition-transform duration-200"
    >
      <img
        src={whatsappBtn}
        alt="WhatsApp Agência Oficial"
        className="h-12 sm:h-14 w-auto drop-shadow-lg"
      />
    </a>
  );
};

export default WhatsAppFAB;

import whatsappBtn from "@/assets/whatsapp-button-transparent.png";

export const WHATSAPP_NUMBER = "5524999992503";
export const WHATSAPP_MSG = "Olá! Vim pela Estação Ilha Grande.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const WhatsAppFAB = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco no WhatsApp"
    className="fixed bottom-3 right-3 z-50 hover:scale-105 active:scale-95 transition-transform duration-200"
  >
    <img
      src={whatsappBtn}
      alt="WhatsApp"
      className="h-12 sm:h-14 w-auto drop-shadow-lg"
    />
  </a>
);

export default WhatsAppFAB;

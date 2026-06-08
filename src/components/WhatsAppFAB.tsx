import whatsappBtn from "@/assets/whatsapp-button.png.asset.json";

export const WHATSAPP_NUMBER = "5547997579939";
export const WHATSAPP_MSG = "Olá! Vim pela Estação Ilha Grande.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const WhatsAppFAB = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco no WhatsApp"
    className="fixed bottom-5 right-5 z-50 hover:scale-105 active:scale-95 transition-transform duration-200"
  >
    <img
      src={whatsappBtn.url}
      alt="WhatsApp"
      className="h-16 sm:h-20 w-auto"
    />
  </a>
);

export default WhatsAppFAB;

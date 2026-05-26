import { MessageCircle } from "lucide-react";

export const WHATSAPP_NUMBER = "5524993009938";
export const WHATSAPP_MSG = "Olá! Vim pelo Guia Ilha Grande Oficial.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const WhatsAppFAB = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco no WhatsApp"
    className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-[#25D366] text-white font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
  >
    <MessageCircle className="w-5 h-5" />
    <span className="hidden sm:inline text-sm">WhatsApp</span>
    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white/90 animate-ping" />
  </a>
);

export default WhatsAppFAB;

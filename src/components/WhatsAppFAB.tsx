const WhatsAppLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-9.403h-.004c-3.95 0-7.164 3.17-7.164 7.083 0 1.37.39 2.705 1.13 3.858l-1.19 4.34 4.447-1.166c1.04.568 2.213.868 3.408.868h.003c3.949 0 7.163-3.17 7.163-7.083 0-3.913-3.214-7.083-7.163-7.083M12.037 21h-.004c-1.17-.006-2.31-.333-3.29-.954l-.236-.14-2.444.641.653-2.384-.154-.257c-.66-1.156-1.01-2.478-1.01-3.828 0-3.895 3.181-7.067 7.09-7.067 3.908 0 7.088 3.172 7.088 7.067 0 3.895-3.18 7.067-7.088 7.067z"/>
  </svg>
);

export const WHATSAPP_NUMBER = "5547997579939";
export const WHATSAPP_MSG = "Olá! Vim pela Estação Ilha Grande.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const WhatsAppFAB = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco no WhatsApp"
    className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-[#25D366] text-white font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
  >
    <WhatsAppLogo className="w-5 h-5" />
    <span className="hidden sm:inline text-sm">WhatsApp</span>
    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white/90 animate-ping" />
  </a>
);

export default WhatsAppFAB;

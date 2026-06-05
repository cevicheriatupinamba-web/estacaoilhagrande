import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "pt" | "en" | "es";

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  pt: {
    "nav.explore": "Explorar",
    "nav.lodging": "Onde se hospedar",
    "nav.eat": "Onde comer",
    "nav.tours": "Passeios",
    "nav.fun": "Diversão",
    "nav.itineraries": "Roteiros",
    "nav.tips": "Dicas",
    "nav.advertise": "Anuncie",
    "nav.favorites": "Favoritos",
    "nav.myAds": "Meus anúncios",
    "nav.admin": "Admin",
    "nav.login": "Entrar",
    "nav.signup": "Criar conta",
    "nav.logout": "Sair",
    "home.badge": "Plataforma oficial — Ilha Grande / RJ",
    "home.title1": "Estação Ilha Grande",
    "home.title2": "planeje sua viagem",
    "home.subtitle": "A plataforma oficial de conexão entre viajantes e a Ilha Grande. Como chegar, onde ficar, o que fazer, onde comer, eventos, trilhas, praias e mapa interativo — tudo num só lugar.",
    "home.searchPlaceholder": "Busque hospedagens, passeios, restaurantes, eventos...",
    "home.search": "Buscar",
    "home.portalKicker": "Portal Ilha Grande",
    "home.portalTitle": "Tudo da ilha em um só lugar",
    "home.portalSubtitle": "Escolha por onde começar a explorar.",
    "home.learnMore": "Saiba Mais",
    "home.itinerariesKicker": "Roteiros prontos",
    "home.itinerariesTitle": "Não sabe por onde começar?",
    "home.itinerariesText": "Temos roteiros para 1, 2 ou 3 dias, família, casal, aventura e econômico. Escolha o seu e siga sem stress.",
    "home.itinerariesCta": "Ver roteiros",
    "home.adsTitle": "Tem um negócio em Ilha Grande?",
    "home.adsText": "Pousada, restaurante ou agência? Apareça para milhares de turistas todos os meses.",
    "home.adsCta": "Quero anunciar",
    "footer.explore": "Explorar",
    "footer.info": "Informações",
    "footer.contact": "Contato",
    "footer.tagline": "Seu guia completo para descobrir Ilha Grande.",
  },
  en: {
    "nav.explore": "Explore",
    "nav.lodging": "Where to stay",
    "nav.eat": "Where to eat",
    "nav.tours": "Tours",
    "nav.fun": "Entertainment",
    "nav.itineraries": "Itineraries",
    "nav.tips": "Tips",
    "nav.advertise": "Advertise",
    "nav.favorites": "Favorites",
    "nav.myAds": "My listings",
    "nav.admin": "Admin",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.logout": "Log out",
    "home.badge": "Official platform — Ilha Grande / RJ",
    "home.title1": "Estação Ilha Grande",
    "home.title2": "plan your trip",
    "home.subtitle": "The official platform connecting travelers and Ilha Grande. How to get there, where to stay, what to do, where to eat, events, trails, beaches and an interactive map — all in one place.",
    "home.searchPlaceholder": "Search stays, tours, restaurants, events...",
    "home.search": "Search",
    "home.portalKicker": "Ilha Grande Portal",
    "home.portalTitle": "Everything on the island in one place",
    "home.portalSubtitle": "Choose where to start exploring.",
    "home.learnMore": "Learn more",
    "home.itinerariesKicker": "Ready-made itineraries",
    "home.itinerariesTitle": "Not sure where to start?",
    "home.itinerariesText": "We have itineraries for 1, 2 or 3 days, family, couple, adventure and budget. Pick yours and go stress-free.",
    "home.itinerariesCta": "See itineraries",
    "home.adsTitle": "Own a business in Ilha Grande?",
    "home.adsText": "Inn, restaurant or agency? Get seen by thousands of tourists every month.",
    "home.adsCta": "I want to advertise",
    "footer.explore": "Explore",
    "footer.info": "Information",
    "footer.contact": "Contact",
    "footer.tagline": "Your complete guide to discover Ilha Grande.",
  },
  es: {
    "nav.explore": "Explorar",
    "nav.lodging": "Dónde hospedarse",
    "nav.eat": "Dónde comer",
    "nav.tours": "Paseos",
    "nav.fun": "Diversión",
    "nav.itineraries": "Itinerarios",
    "nav.tips": "Consejos",
    "nav.advertise": "Anuncie",
    "nav.favorites": "Favoritos",
    "nav.myAds": "Mis anuncios",
    "nav.admin": "Admin",
    "nav.login": "Entrar",
    "nav.signup": "Crear cuenta",
    "nav.logout": "Salir",
    "home.badge": "Plataforma oficial — Ilha Grande / RJ",
    "home.title1": "Estação Ilha Grande",
    "home.title2": "planifica tu viaje",
    "home.subtitle": "La plataforma oficial de conexión entre viajeros e Ilha Grande. Cómo llegar, dónde hospedarse, qué hacer, dónde comer, eventos, senderos, playas y mapa interactivo — todo en un solo lugar.",
    "home.searchPlaceholder": "Busca hospedajes, paseos, restaurantes, eventos...",
    "home.search": "Buscar",
    "home.portalKicker": "Portal Ilha Grande",
    "home.portalTitle": "Toda la isla en un solo lugar",
    "home.portalSubtitle": "Elija por dónde empezar a explorar.",
    "home.learnMore": "Saber más",
    "home.itinerariesKicker": "Itinerarios listos",
    "home.itinerariesTitle": "¿No sabes por dónde empezar?",
    "home.itinerariesText": "Tenemos itinerarios para 1, 2 o 3 días, familia, pareja, aventura y económico. Elige el tuyo y disfruta sin estrés.",
    "home.itinerariesCta": "Ver itinerarios",
    "home.adsTitle": "¿Tienes un negocio en Ilha Grande?",
    "home.adsText": "¿Posada, restaurante o agencia? Aparece para miles de turistas cada mes.",
    "home.adsCta": "Quiero anunciar",
    "footer.explore": "Explorar",
    "footer.info": "Información",
    "footer.contact": "Contacto",
    "footer.tagline": "Tu guía completa para descubrir Ilha Grande.",
  },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    return saved && ["pt", "en", "es"].includes(saved) ? saved : "pt";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => dictionaries[lang][key] ?? dictionaries.pt[key] ?? key;

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

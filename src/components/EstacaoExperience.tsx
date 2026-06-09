import { Link } from "react-router-dom";
import { MessageCircle, Ship, Sun, Waves, BadgeCheck, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsappUrl } from "@/lib/whatsapp";

const AGENCY_NUMBER = "5521996704427";
const WA_MESSAGE =
  "Olá! 👋 Vi a seção Estação Ilha Grande Experience no portal e gostaria de informações sobre os passeios disponíveis.";

const TOURS = [
  "Volta à Ilha",
  "Meia Volta",
  "Lagoa Azul",
  "Ilhas Paradisíacas",
  "Caipirinha Tour",
];

const HIGHLIGHTS = [
  { icon: BadgeCheck, label: "Passeios Oficiais" },
  { icon: Ship, label: "Saídas Diárias" },
  { icon: Waves, label: "Águas Cristalinas" },
  { icon: Sparkles, label: "Experiências Exclusivas" },
  { icon: MessageCircle, label: "Atendimento WhatsApp" },
];

export default function EstacaoExperience() {
  const waUrl = buildWhatsappUrl(AGENCY_NUMBER, WA_MESSAGE);

  return (
    <section
      aria-label="Estação Ilha Grande Experience — Agência Oficial de Passeios"
      className="container py-12 md:py-16"
    >
      <div className="relative overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-white/10">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1920&q=80"
          alt="Passeio de lancha em Ilha Grande com águas cristalinas"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay: ocean → turquoise → emerald */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#062c43]/95 via-[#0891b2]/80 to-[#047857]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(245,200,80,0.25),transparent_55%)]" />

        <div className="relative z-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 p-6 sm:p-8 md:p-10 lg:p-12 text-white">
          {/* Left: content */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-amber-300/15 text-amber-200 border border-amber-300/30 backdrop-blur">
              <BadgeCheck className="w-3.5 h-3.5" /> Agência Oficial · Passeios em Ilha Grande
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl leading-[1.05] mt-4 drop-shadow-lg">
              ESTAÇÃO ILHA GRANDE <span className="text-amber-300">EXPERIENCE</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-white/90 max-w-xl">
              Passeios oficiais e experiências inesquecíveis em Ilha Grande.
            </p>

            <p className="mt-5 text-sm sm:text-base text-white/85 leading-relaxed">
              Olá! 👋 Seja bem-vindo(a) à Estação Ilha Grande! 🌴<br />
              Você está prestes a viver experiências incríveis com a gente! 🚤☀️
            </p>

            {/* Tours chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {TOURS.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/12 backdrop-blur border border-white/20"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Schedule */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300" /> Saída 10h · Retorno 17h
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-amber-300" /> Saídas diárias · sujeitas ao clima
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold shadow-xl"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" /> Reservar Agora
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur"
              >
                <Link to="/passeios">
                  Ver todos os passeios <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: highlights card */}
          <aside className="relative">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-amber-300" />
                <h3 className="font-display font-bold text-lg">Por que reservar com a gente</h3>
              </div>
              <ul className="space-y-2.5">
                {HIGHLIGHTS.map((h) => (
                  <li key={h.label} className="flex items-center gap-3 text-sm sm:text-base">
                    <span className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 grid place-items-center shrink-0">
                      <h.icon className="w-4 h-4 text-amber-300" />
                    </span>
                    <span className="text-white/95">{h.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-white/15 text-xs text-white/75">
                Agência oficial · WhatsApp +55 21 99670-4427
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

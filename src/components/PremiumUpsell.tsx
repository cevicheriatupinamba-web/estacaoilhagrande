import { Crown, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { WHATSAPP_NUMBER } from "@/components/WhatsAppFAB";

interface Props {
  variant?: "full" | "compact";
  category?: string;
}

const buildWa = (category?: string) => {
  const msg = `Olá! Quero tornar meu negócio${category ? ` de ${category}` : ""} PREMIUM na Estação Ilha Grande e aparecer nas primeiras posições.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

const BENEFITS = [
  "Aparece em primeiro lugar nas pesquisas",
  "Antes dos anúncios gratuitos",
  "Destaque visual exclusivo (selo Premium)",
  "Maior exposição da marca",
  "Mais cliques e contatos no WhatsApp",
  "Página personalizada com galeria ampliada",
  "Melhor posicionamento dentro do portal",
];

const PremiumUpsell = ({ variant = "full", category }: Props) => {
  const wa = buildWa(category);

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-50 via-background to-amber-50 dark:from-amber-500/10 dark:via-background dark:to-amber-500/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-soft">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 text-foreground shrink-0">
          <Crown className="w-6 h-6" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-base sm:text-lg leading-snug">
            Quer aparecer nas primeiras posições?
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Anunciantes Premium têm prioridade de exibição e maior visibilidade para milhares de visitantes todo mês.
          </p>
        </div>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground font-bold text-sm hover:opacity-90 transition shadow-soft"
        >
          <MessageCircle className="w-4 h-4" /> Tornar meu negócio Premium
        </a>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-400/50 bg-gradient-to-br from-amber-500/10 via-background to-yellow-400/10 p-6 md:p-10 shadow-soft">
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground text-[11px] font-bold uppercase tracking-wider mb-3 shadow-soft">
            <Crown className="w-3.5 h-3.5" /> Planos para Anunciantes
          </span>
          <h3 className="font-display font-black text-2xl md:text-3xl mb-2 leading-tight">
            Quer aparecer nas primeiras posições?
          </h3>
          <p className="text-muted-foreground text-sm md:text-base mb-5">
            Os anunciantes <strong className="text-foreground">Premium</strong> recebem prioridade de exibição
            e maior visibilidade para milhares de visitantes todos os meses no portal Estação Ilha Grande.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground font-bold hover:opacity-90 transition shadow-soft"
            >
              <MessageCircle className="w-4 h-4" /> Tornar meu negócio Premium
            </a>
            <Link
              to="/anuncie"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-amber-500/60 text-foreground font-semibold hover:bg-amber-500/10 transition"
            >
              Ver planos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <ul className="space-y-2.5">
          {BENEFITS.map(b => (
            <li key={b} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 text-foreground shrink-0">
                <Crown className="w-3 h-3" />
              </span>
              <span className="text-foreground/90">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PremiumUpsell;

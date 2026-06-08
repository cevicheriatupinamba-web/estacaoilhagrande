import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Crown, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { itemUrl, TIER_LABEL, type StaticItem, type Tier } from "@/lib/staticDetails";

interface Props {
  item: StaticItem;
  tier: Tier;
}

const onlyDigits = (s?: string) => (s || "").replace(/\D/g, "");

const TieredCard = ({ item, tier }: Props) => {
  const wa = onlyDigits(item.whatsapp);
  const waLink = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(
        `Olá! Vim pela Estação Ilha Grande e quero saber mais sobre ${item.name}.`
      )}`
    : null;

  const href = itemUrl(item);
  const Icon = item.icon;

  const ring =
    tier === "premium"
      ? "border-amber-400/70 ring-2 ring-amber-400/40 shadow-[0_8px_30px_-12px_rgba(245,158,11,0.45)]"
      : tier === "destaque"
        ? "border-emerald-500/60 ring-1 ring-emerald-500/30"
        : "border-border/60";

  return (
    <article
      className={`group bg-card rounded-3xl overflow-hidden border ${ring} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col`}
    >
      {/* Plan badge */}
      <span
        className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-soft ${
          tier === "premium"
            ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground"
            : tier === "destaque"
              ? "bg-emerald-500 text-white"
              : "bg-background/95 text-foreground border border-border"
        }`}
      >
        {tier === "premium" && <Crown className="w-3 h-3" />}
        {tier === "destaque" && <Sparkles className="w-3 h-3" />}
        {tier === "basico" && <BadgeCheck className="w-3 h-3" />}
        {TIER_LABEL[tier]}
      </span>

      <Link to={href} className="relative aspect-[4/3] overflow-hidden block bg-secondary">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : Icon ? (
          <div className="w-full h-full grid place-items-center bg-primary/10 text-primary">
            <Icon className="w-14 h-14" />
          </div>
        ) : null}
        {item.subcategory && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold">
            {item.subcategory}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={href} className="block">
          <h3 className="font-display font-bold text-lg leading-tight mb-1.5">{item.name}</h3>
          {item.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3.5 h-3.5" /> {item.location}
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">{item.shortDescription}</p>
        </Link>

        <div className="mt-4 flex gap-2">
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1ebe5b] transition"
              aria-label={`Falar com ${item.name} no WhatsApp`}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          )}
          <Link
            to={href}
            className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              tier === "premium"
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground hover:opacity-90"
                : tier === "destaque"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "border border-border hover:border-primary hover:text-primary"
            }`}
          >
            Ver Detalhes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TieredCard;

import { Link } from "react-router-dom";
import { MapPin, BadgeCheck, Crown, Sparkles } from "lucide-react";
import type { ListingRow } from "@/lib/listings-api";
import { themedImage } from "@/lib/images";

const planMap = {
  hospedagem: "lodging",
  restaurante: "restaurant",
  passeio: "boat",
  experiencia: "activity",
} as const;

const DbListingCard = ({ l }: { l: ListingRow }) => {
  const cover = l.photos?.[0] || themedImage(planMap[l.category] as never, l.id);
  const isPremium = l.plan === "premium";
  const isDestaque = l.plan === "destaque";
  return (
    <Link
      to={`/listagem/${l.slug}`}
      className="group block bg-card rounded-3xl overflow-hidden border border-border/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
    >
      {isPremium && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground text-[10px] font-bold uppercase tracking-wider shadow-soft">
          <Crown className="w-3 h-3" /> Premium
        </span>
      )}
      {isDestaque && !isPremium && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> Destaque
        </span>
      )}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={cover} alt={l.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {l.subcategory && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold">
            {l.subcategory}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <h3 className="font-display font-bold text-lg leading-tight">{l.name}</h3>
          <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
        </div>
        {(l.neighborhood || l.address) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5" /> {l.neighborhood || l.address}
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">{l.short_description}</p>
        {l.price_range && (
          <div className="mt-3 text-xs font-semibold text-forest">{l.price_range}</div>
        )}
      </div>
    </Link>
  );
};

export default DbListingCard;

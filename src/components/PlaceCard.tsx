import { Link } from "react-router-dom";
import { Heart, MapPin, Star, MessageCircle, Crown } from "lucide-react";
import { Place, categories } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PlaceCard = ({ place }: { place: Place }) => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const cat = categories.find(c => c.key === place.category);
  const fav = isFavorite(place.id);
  const waHref = place.whatsapp
    ? `https://wa.me/${place.whatsapp.replace(/\D/g, "")}${place.whatsappMessage ? `?text=${encodeURIComponent(place.whatsappMessage)}` : ""}`
    : null;

  return (
    <article className={cn(
      "group bg-card rounded-3xl overflow-hidden transition-smooth flex flex-col",
      place.premium
        ? "border-2 border-amber-400/70 shadow-[0_8px_30px_-8px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_40px_-8px_rgba(245,158,11,0.55)] ring-1 ring-amber-200/50"
        : "border border-border/60 shadow-soft hover:shadow-card",
    )}>
      <Link to={`/lugar/${place.slug}`} className="relative aspect-[4/3] overflow-hidden block">
        <img src={place.image} alt={place.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium">
          {cat?.emoji} {cat?.label}
        </div>
        {place.premium && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[11px] font-bold shadow-lg">
            <Crown className="w-3 h-3" /> ANUNCIANTE PREMIUM
          </div>
        )}
        {user && (
          <button onClick={(e) => { e.preventDefault(); toggleFavorite(place.id); }}
            className={cn("absolute top-3 right-3 p-2 rounded-full backdrop-blur transition-smooth",
              fav ? "bg-accent text-accent-foreground" : "bg-background/90 hover:bg-accent hover:text-accent-foreground")}
            aria-label="Favoritar">
            <Heart className={cn("w-4 h-4", fav && "fill-current")} />
          </button>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-lg leading-tight flex items-center gap-1.5">
            {place.name}
            {place.premium && <Crown className="w-4 h-4 text-amber-500 shrink-0" aria-label="Premium" />}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-forest">{place.priceRange}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1 text-sun-foreground"><Star className="w-3.5 h-3.5 fill-sun text-sun" /> <strong className="text-foreground">{place.rating}</strong> ({place.reviewsCount})</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{place.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{place.shortDescription}</p>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/lugar/${place.slug}`}>Ver detalhes</Link>
          </Button>
          {waHref && (
            <Button asChild variant="sunset" size="sm">
              <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;

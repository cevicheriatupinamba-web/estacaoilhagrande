import { Link } from "react-router-dom";
import { Heart, MapPin, Star, MessageCircle } from "lucide-react";
import { Place, categories } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PlaceCard = ({ place }: { place: Place }) => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const cat = categories.find(c => c.key === place.category);
  const fav = isFavorite(place.id);

  return (
    <article className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-smooth border border-border/60 flex flex-col">
      <Link to={`/lugar/${place.slug}`} className="relative aspect-[4/3] overflow-hidden block">
        <img src={place.image} alt={place.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium">
          {cat?.emoji} {cat?.label}
        </div>
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
          <h3 className="font-display font-bold text-lg leading-tight">{place.name}</h3>
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
          {place.whatsapp && (
            <Button asChild variant="sunset" size="sm">
              <a href={`https://wa.me/${place.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
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

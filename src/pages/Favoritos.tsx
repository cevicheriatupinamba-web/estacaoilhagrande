import { useAuth } from "@/context/AuthContext";
import { places } from "@/data/mockData";
import PlaceCard from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import SEO from "@/components/SEO";

const FavSEO = () => <SEO title="Favoritos" description="Seus lugares salvos." path="/favoritos" noIndex />;

const Favoritos = () => {
  const { user, favorites } = useAuth();

  if (!user) {
    return (
      <><FavSEO />
      <div className="container py-20 text-center">
        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display font-bold text-3xl mb-2">Entre para ver favoritos</h1>
        <p className="text-muted-foreground mb-6">Salve praias, pousadas e passeios para acessar depois.</p>
        <Button asChild variant="hero"><Link to="/login">Entrar</Link></Button>
      </div></>
    );
  }

  const favs = places.filter(p => favorites.includes(p.id));

  return (
    <div className="container py-10">
      <h1 className="font-display font-bold text-4xl mb-2">Seus favoritos</h1>
      <p className="text-muted-foreground mb-8">{favs.length} salvos</p>
      {favs.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border">
          <p className="text-muted-foreground mb-4">Você ainda não salvou nada.</p>
          <Button asChild variant="hero"><Link to="/explorar">Explorar agora</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favs.map(p => <PlaceCard key={p.id} place={p} />)}
        </div>
      )}
    </div>
  );
};

export default Favoritos;

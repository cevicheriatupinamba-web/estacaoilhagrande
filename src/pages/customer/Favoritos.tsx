import { useAuth } from "@/context/AuthContext";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CustomerFavoritos() {
  const { favorites, toggleFavorite } = useAuth();

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-xl">Favoritos</h2>
          <p className="text-sm text-muted-foreground">Tudo que você salvou para visitar.</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-muted font-semibold">{favorites.length}</span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">Você ainda não favoritou nenhum lugar.</p>
          <Button asChild variant="hero"><Link to="/explorar">Explorar a ilha</Link></Button>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {favorites.map(id => (
            <li key={id} className="py-3 flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <Link to={`/listagem/${id}`} className="flex-1 text-sm font-medium hover:underline truncate">{id}</Link>
              <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toggleFavorite(id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

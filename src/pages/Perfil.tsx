import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, User as UserIcon } from "lucide-react";

const Perfil = () => {
  const { user, logout, favorites } = useAuth();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <Button asChild variant="hero"><Link to="/login">Entrar</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-2xl">
      <div className="bg-card rounded-3xl border border-border p-8 shadow-soft">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-ocean grid place-items-center text-primary-foreground text-2xl font-bold">
            {user.name[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.isAdmin && <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold inline-block mt-1">Admin</span>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Button variant="outline" asChild className="justify-start">
            <Link to="/favoritos"><Heart className="w-4 h-4" /> Favoritos ({favorites.length})</Link>
          </Button>
          {user.isAdmin && (
            <Button variant="outline" asChild className="justify-start">
              <Link to="/admin"><UserIcon className="w-4 h-4" /> Painel admin</Link>
            </Button>
          )}
          <Button variant="ghost" onClick={() => { logout(); nav("/"); }} className="justify-start text-destructive sm:col-span-2">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

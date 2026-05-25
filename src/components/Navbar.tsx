import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/ilhago-logo.png";

const navItems = [
  { to: "/explorar", label: "Explorar" },
  { to: "/hospedagem", label: "Onde se hospedar" },
  { to: "/onde-comer", label: "Onde comer" },
  { to: "/passeios", label: "Passeios" },
  { to: "/diversao", label: "Diversão" },
  { to: "/roteiros", label: "Roteiros" },
  { to: "/dicas", label: "Dicas" },
  { to: "/anuncie", label: "Anuncie" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Ilha Go" className="h-10 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(i => (
            <NavLink key={i.to} to={i.to}
              className={({ isActive }) =>
                `px-2.5 py-2 rounded-lg text-sm font-medium transition-smooth ${isActive ? "text-primary bg-primary/10" : "text-foreground/80 hover:text-primary hover:bg-muted"}`}>
              {i.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/favoritos")}>
                <Heart className="w-4 h-4 mr-1" /> Favoritos
              </Button>
              {user.isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => nav("/admin")}>Admin</Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => nav("/perfil")}>
                <User className="w-4 h-4 mr-1" /> {user.name}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { logout(); nav("/"); }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/login")}>Entrar</Button>
              <Button variant="hero" size="sm" onClick={() => nav("/cadastro")}>Criar conta</Button>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-white animate-fade-up">
          <nav className="container py-4 flex flex-col gap-1">
            {navItems.map(i => (
              <NavLink key={i.to} to={i.to} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg text-sm font-medium ${isActive ? "text-primary bg-primary/10" : "hover:bg-muted"}`}>
                {i.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-border mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="outline" onClick={() => { nav("/favoritos"); setOpen(false); }}>
                    <Heart className="w-4 h-4 mr-2" /> Favoritos
                  </Button>
                  {user.isAdmin && <Button variant="outline" onClick={() => { nav("/admin"); setOpen(false); }}>Admin</Button>}
                  <Button variant="ghost" onClick={() => { logout(); setOpen(false); nav("/"); }}>Sair</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { nav("/login"); setOpen(false); }}>Entrar</Button>
                  <Button variant="hero" onClick={() => { nav("/cadastro"); setOpen(false); }}>Criar conta</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

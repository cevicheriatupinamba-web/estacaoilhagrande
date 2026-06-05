import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";



const useNavItems = () => {
  const { t } = useLanguage();
  return [
    { to: "/explorar", label: t("nav.explore") },
    { to: "/hospedagem", label: t("nav.lodging") },
    { to: "/onde-comer", label: t("nav.eat") },
    { to: "/passeios", label: t("nav.tours") },
    { to: "/diversao", label: t("nav.fun") },
    { to: "/roteiros", label: t("nav.itineraries") },
    { to: "/dicas", label: t("nav.tips") },
    { to: "/cadastro-empresa", label: t("nav.advertise") },
  ];
};

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const navItems = useNavItems();
  const displayName = (user?.user_metadata?.name as string) || user?.email?.split("@")[0] || "";
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="font-display font-extrabold text-xl md:text-2xl text-gradient-ocean tracking-tight leading-none">Estação Ilha Grande</span>
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
          <LanguageSwitcher />
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/favoritos")}>
                <Heart className="w-4 h-4 mr-1" /> {t("nav.favorites")}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => nav("/painel-anunciante")}>{t("nav.myAds")}</Button>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => nav("/admin")}>{t("nav.admin")}</Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => nav("/perfil")}>
                <User className="w-4 h-4 mr-1" /> {displayName}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { logout(); nav("/"); }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/login")}>{t("nav.login")}</Button>
              <Button variant="hero" size="sm" onClick={() => nav("/cadastro")}>{t("nav.signup")}</Button>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button className="p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
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
                    <Heart className="w-4 h-4 mr-2" /> {t("nav.favorites")}
                  </Button>
                  {isAdmin && <Button variant="outline" onClick={() => { nav("/admin"); setOpen(false); }}>{t("nav.admin")}</Button>}
                  <Button variant="ghost" onClick={() => { logout(); setOpen(false); nav("/"); }}>{t("nav.logout")}</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { nav("/login"); setOpen(false); }}>{t("nav.login")}</Button>
                  <Button variant="hero" onClick={() => { nav("/cadastro"); setOpen(false); }}>{t("nav.signup")}</Button>
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

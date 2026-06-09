import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User, Heart, Clock, LogOut, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";

const NAV = [
  { to: "/minha-conta",            label: "Meu perfil",  icon: User,  end: true },
  { to: "/minha-conta/favoritos",  label: "Favoritos",   icon: Heart },
  { to: "/minha-conta/historico",  label: "Histórico",   icon: Clock },
];

export default function CustomerLayout() {
  const { user, loading, logout } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to={`/login?next=${loc.pathname}`} replace />;

  const name = (user.user_metadata?.name as string) || user.email?.split("@")[0] || "Você";

  return (
    <div className="min-h-screen bg-muted/30 pb-24 md:pb-12">
      <SEO title="Minha conta · Estação Ilha Grande" description="Sua conta pessoal." path={loc.pathname} noIndex />

      <div className="container max-w-5xl py-6">
        <NavLink to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar ao site
        </NavLink>

        <header className="rounded-2xl bg-card border border-border p-5 mb-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gradient-ocean grid place-items-center text-primary-foreground text-xl font-bold">
            {name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display font-bold text-lg truncate">{name}</h1>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="hidden md:inline-flex">
            <LogOut className="w-4 h-4 mr-1" /> Sair
          </Button>
        </header>

        {/* Desktop tabs */}
        <nav className="hidden md:flex gap-1 mb-5 bg-card border border-border rounded-xl p-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )}>
              <Icon className="w-4 h-4" /> {label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>

      {/* Mobile bottom-nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
        <div className="grid grid-cols-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
              <Icon className="w-5 h-5" /> {label}
            </NavLink>
          ))}
          <button onClick={logout} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] text-muted-foreground">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </nav>
    </div>
  );
}

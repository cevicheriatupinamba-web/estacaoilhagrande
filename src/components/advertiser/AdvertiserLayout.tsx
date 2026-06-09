import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Building2, BarChart3, CreditCard, Star, CalendarRange,
  Ticket, Image as ImageIcon, Settings, Menu, X, LogOut, Home, Shield, Megaphone,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";
import SubscriptionBanner from "@/components/advertiser/SubscriptionBanner";

interface NavItem { to: string; label: string; icon: any }

// Only modules with real backend functionality are exposed. Future phases:
// /minhas-metricas, /minhas-avaliacoes, /minhas-reservas, /promocoes,
// /cupons, /fotos, /configuracoes — hidden until the data layer ships.
const NAV: NavItem[] = [
  { to: "/dashboard",         label: "Visão geral",       icon: LayoutDashboard },
  { to: "/minha-empresa",     label: "Minha empresa",     icon: Building2 },
  { to: "/financeiro",        label: "Financeiro",        icon: CreditCard },
];

export default function AdvertiserLayout() {
  const { user, isAdvertiser, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/login?next=/dashboard" replace state={{ from: loc }} />;
  if (!isAdvertiser) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 px-5">
        <SEO title="Acesso restrito · Extranet" description="Área exclusiva para anunciantes." path={loc.pathname} noIndex />
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <Shield className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta extranet é exclusiva para anunciantes da Estação Ilha Grande.
            Se você é anunciante e não tem acesso, fale com a equipe.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild variant="outline">
              <NavLink to="/">Voltar ao site</NavLink>
            </Button>
            <Button asChild variant="hero">
              <NavLink to="/anuncie">Quero anunciar</NavLink>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentLabel = NAV.find(n => n.to === loc.pathname)?.label ?? "Extranet";

  return (
    <div className="min-h-screen flex bg-muted/30">
      <SEO title={`${currentLabel} · Extranet Estação Ilha Grande`} description="Painel do anunciante." path={loc.pathname} noIndex />

      <aside className={cn(
        "fixed lg:sticky top-0 z-40 h-screen w-64 bg-slate-950 text-slate-100 border-r border-slate-800 flex flex-col transition-transform",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="px-5 h-16 flex items-center justify-between border-b border-slate-800">
          <NavLink to="/dashboard" className="font-display font-bold text-lg tracking-tight">
            Estação<span className="text-amber-400">·</span>Extranet
          </NavLink>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate flex-1">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 grid place-items-center text-sm font-bold">
              {(user.email ?? "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs truncate font-medium">{user.email}</div>
              <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide bg-amber-500 text-white">
                Anunciante
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <NavLink to="/"><Home className="w-3.5 h-3.5 mr-1" /> Site</NavLink>
            </Button>
            <Button size="sm" variant="ghost" onClick={logout} className="text-slate-300 hover:text-white hover:bg-slate-800">
              <LogOut className="w-3.5 h-3.5 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur border-b border-border flex items-center px-4 lg:px-8 gap-3">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="w-5 h-5" /></button>
          <div className="text-sm font-semibold text-foreground/70">{currentLabel}</div>
          <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <SubscriptionBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

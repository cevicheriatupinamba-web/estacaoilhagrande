import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { canAccess, Module, ROLE_LABEL, ROLE_COLOR, AppRole } from "@/lib/admin/permissions";
import {
  LayoutDashboard, Users, CreditCard, DollarSign, MessageSquare,
  FileText, Shield, Activity, Menu, X, LogOut, Home, Settings, Mail, Package,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";

interface NavItem { to: string; label: string; icon: any; module: Module }

const NAV: NavItem[] = [
  { to: "/admin/dashboard",      label: "Dashboard",      icon: LayoutDashboard, module: "dashboard" },
  { to: "/admin/anunciantes",    label: "Anunciantes",    icon: Users,           module: "crm" },
  { to: "/admin/assinaturas",    label: "Assinaturas",    icon: CreditCard,      module: "subscriptions" },
  { to: "/admin/financeiro",     label: "Financeiro",     icon: DollarSign,      module: "financial" },
  { to: "/admin/solicitacoes",   label: "Solicitações",   icon: MessageSquare,   module: "leads" },
  { to: "/admin/conteudo",       label: "Conteúdo",       icon: FileText,        module: "content" },
  { to: "/admin/convites",       label: "Convites",       icon: Mail,            module: "invites" },
  { to: "/admin/permissoes",     label: "Permissões",     icon: Shield,          module: "roles" },
  { to: "/admin/planos",         label: "Planos",         icon: Package,         module: "plans" },
  { to: "/admin/configuracoes",  label: "Configurações",  icon: Settings,        module: "settings" },
  { to: "/admin/auditoria",      label: "Auditoria",      icon: Activity,        module: "activity" },
];

export default function AdminLayout() {
  const { user, isAdmin, roles, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 px-5">
        <SEO title="Acesso restrito · Estação Ilha Grande" description="Área administrativa restrita." path={loc.pathname} noIndex />
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <Shield className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">Esta área é exclusiva para Super Admins e Admins.</p>
          <Button asChild className="mt-6" variant="outline">
            <NavLink to="/">Voltar ao site</NavLink>
          </Button>
        </div>
      </div>
    );
  }

  const items = NAV.filter(n => canAccess(roles as AppRole[], n.module));
  const primaryRole = (roles[0] ?? "user") as AppRole;

  return (
    <div className="min-h-screen flex bg-muted/30">
      <SEO title="Centro de comando · Estação Ilha Grande" description="Painel administrativo." path={loc.pathname} noIndex />

      <aside className={cn(
        "fixed lg:sticky top-0 z-40 h-screen w-64 bg-slate-950 text-slate-100 border-r border-slate-800 flex flex-col transition-transform",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="px-5 h-16 flex items-center justify-between border-b border-slate-800">
          <NavLink to="/admin" className="font-display font-bold text-lg tracking-tight">
            Estação<span className="text-amber-400">·</span>Admin
          </NavLink>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/admin"} onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
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
              <span className={cn("inline-block text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide", ROLE_COLOR[primaryRole])}>
                {ROLE_LABEL[primaryRole]}
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
          <div className="text-sm font-semibold text-foreground/70">
            {items.find(i => i.to === loc.pathname)?.label ?? "Centro de comando"}
          </div>
          <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

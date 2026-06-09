import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { Session, User as SupaUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, STAFF_ROLES } from "@/lib/admin/permissions";

interface AuthCtx {
  user: SupaUser | null;
  session: Session | null;
  isAdmin: boolean;
  isStaff: boolean;
  roles: AppRole[];
  hasRole: (r: AppRole) => boolean;
  loading: boolean;
  favorites: string[];
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const f = localStorage.getItem("ilhago_favs");
    if (f) setFavorites(JSON.parse(f));
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => loadRoles(newSession.user.id), 0);
      } else {
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadRoles(data.session.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles").select("role").eq("user_id", userId);
    if (!error && data) setRoles(data.map(r => r.role as AppRole));
  };

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const isStaff = roles.some(r => STAFF_ROLES.includes(r));
  const hasRole = (r: AppRole) => roles.includes(r);

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { name } },
    });
    return { error: error?.message ?? null };
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const persistFavs = (f: string[]) => {
    setFavorites(f);
    localStorage.setItem("ilhago_favs", JSON.stringify(f));
  };
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    persistFavs(next);
  };
  const isFavorite = (id: string) => favorites.includes(id);

  const value = useMemo(() => ({
    user, session, isAdmin, isStaff, roles, hasRole, loading,
    favorites, login, signup, logout, toggleFavorite, isFavorite,
  }), [user, session, roles, loading, favorites]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
};

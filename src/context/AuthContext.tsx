import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { Session, User as SupaUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, STAFF_ROLES } from "@/lib/admin/permissions";

interface AuthCtx {
  user: SupaUser | null;
  session: Session | null;
  isAdmin: boolean;
  isStaff: boolean;
  isAdvertiser: boolean;
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
    if (f) {
      try { setFavorites(JSON.parse(f)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setLoading(true);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(async () => {
          await loadRoles(newSession.user.id);
          await loadFavorites(newSession.user.id);
          setLoading(false);
        }, 0);
      } else {
        setRoles([]);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await loadRoles(data.session.user.id);
        await loadFavorites(data.session.user.id);
      } else setRoles([]);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles").select("role").eq("user_id", userId);
    if (!error && data) setRoles(data.map(r => r.role as AppRole));
    else setRoles([]);
  };

  const loadFavorites = async (userId: string) => {
    const local = JSON.parse(localStorage.getItem("ilhago_favs") || "[]") as string[];
    const { data } = await supabase.from("favorites").select("listing_id").eq("user_id", userId);
    const remote = (data ?? []).map(r => r.listing_id);
    const toUpload = local.filter(id => !remote.includes(id));
    if (toUpload.length > 0) {
      await supabase.from("favorites").insert(toUpload.map(listing_id => ({ user_id: userId, listing_id })));
    }
    const merged = Array.from(new Set([...remote, ...local]));
    setFavorites(merged);
    localStorage.setItem("ilhago_favs", JSON.stringify(merged));
  };

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const isStaff = roles.some(r => STAFF_ROLES.includes(r));
  const isAdvertiser = roles.includes("advertiser") || isAdmin;
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
    const isFav = favorites.includes(id);
    const next = isFav ? favorites.filter(f => f !== id) : [...favorites, id];
    persistFavs(next);
    if (user) {
      if (isFav) {
        supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", id).then(() => {});
      } else {
        supabase.from("favorites").insert({ user_id: user.id, listing_id: id }).then(() => {});
      }
    }
  };
  const isFavorite = (id: string) => favorites.includes(id);

  const value = useMemo(() => ({
    user, session, isAdmin, isStaff, isAdvertiser, roles, hasRole, loading,
    favorites, login, signup, logout, toggleFavorite, isFavorite,
  }), [user, session, roles, loading, favorites]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
};

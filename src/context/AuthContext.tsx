import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User { name: string; email: string; isAdmin?: boolean }
interface AuthCtx {
  user: User | null;
  favorites: string[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("ilhago_user");
    const f = localStorage.getItem("ilhago_favs");
    if (u) setUser(JSON.parse(u));
    if (f) setFavorites(JSON.parse(f));
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("ilhago_user", JSON.stringify(u));
    else localStorage.removeItem("ilhago_user");
  };

  const persistFavs = (f: string[]) => {
    setFavorites(f);
    localStorage.setItem("ilhago_favs", JSON.stringify(f));
  };

  const signup = (name: string, email: string, _password: string) => {
    const isAdmin = email.toLowerCase() === "admin@ilhago.com";
    persistUser({ name, email, isAdmin });
    return true;
  };

  const login = (email: string, _password: string) => {
    const isAdmin = email.toLowerCase() === "admin@ilhago.com";
    const name = email.split("@")[0];
    persistUser({ name, email, isAdmin });
    return true;
  };

  const logout = () => persistUser(null);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    persistFavs(next);
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return <Ctx.Provider value={{ user, favorites, login, signup, logout, toggleFavorite, isFavorite }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
};

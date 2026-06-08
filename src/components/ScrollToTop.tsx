import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Garante que toda navegação interna inicie no topo da página.
 * Respeita âncoras (#hash) — nesses casos o navegador rola até o elemento.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // mantém comportamento padrão de âncoras
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

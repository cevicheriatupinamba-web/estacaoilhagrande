import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

const Footer = () => (
  <footer className="mt-20 border-t border-border bg-secondary/40">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div>
        <p className="font-display font-bold text-lg mb-1">Estação Ilha Grande</p>
        <p className="text-sm text-muted-foreground">A plataforma oficial de conexão entre viajantes e a Ilha Grande.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Explorar</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/explorar?cat=praias" className="hover:text-primary">Praias</Link></li>
          <li><Link to="/explorar?cat=trilhas" className="hover:text-primary">Trilhas</Link></li>
          <li><Link to="/explorar?cat=pousadas" className="hover:text-primary">Pousadas</Link></li>
          <li><Link to="/roteiros" className="hover:text-primary">Roteiros</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Informações</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/dicas" className="hover:text-primary">Dicas</Link></li>
          <li><Link to="/nao-fazer" className="hover:text-primary">O que não fazer</Link></li>
          <li><Link to="/anuncie" className="hover:text-primary">Anuncie aqui</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Contato</h4>
        <div className="flex gap-3">
          <a href="https://www.instagram.com/estacaoilhagranderj/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @estacaoilhagranderj" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-smooth"><Instagram className="w-4 h-4" /></a>
          <a href="mailto:contato@estacaoilhagrande.com.br" aria-label="Email" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-smooth"><Mail className="w-4 h-4" /></a>
        </div>
        <p className="text-xs text-muted-foreground mt-3">@estacaoilhagranderj</p>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Estação Ilha Grande — Feito com 🌊 para Ilha Grande
    </div>
  </footer>
);

export default Footer;

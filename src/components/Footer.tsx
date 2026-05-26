import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import logo from "@/assets/ilhago-logo.png";

const Footer = () => (
  <footer className="mt-20 border-t border-border bg-secondary/40">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div>
        <img src={logo} alt="Ilha Grande Oficial" className="h-32 w-32 md:h-40 md:w-40 rounded-full object-contain mb-4 shadow-soft bg-white p-2" />
        <p className="text-sm text-muted-foreground">Seu guia completo para descobrir Ilha Grande.</p>
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
          <a href="https://www.instagram.com/ilhagrande.oficial" target="_blank" rel="noopener noreferrer" aria-label="Instagram @ilhagrande.oficial" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-smooth"><Instagram className="w-4 h-4" /></a>
          <a href="mailto:contato@ilhago.com.br" aria-label="Email" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-smooth"><Mail className="w-4 h-4" /></a>
        </div>
        <p className="text-xs text-muted-foreground mt-3">@ilhagrande.oficial</p>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Ilha Go — Feito com 🌊 para Ilha Grande
    </div>
  </footer>
);

export default Footer;

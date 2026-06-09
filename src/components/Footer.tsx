import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import logo from "@/assets/logo-estacao-ilha-grande.png.asset.json";

const OFFICIAL_LINKS = [
  { label: "CCR Barcas (horários oficiais)", href: "https://www.grupoccr.com.br/barcas/" },
  { label: "INEA — Parque Estadual da Ilha Grande", href: "https://www.inea.rj.gov.br/biodiversidade-territorio/conheca-as-unidades-de-conservacao/parque-estadual-da-ilha-grande/" },
  { label: "Climatempo — Previsão de Ilha Grande", href: "https://www.climatempo.com.br/previsao-do-tempo/cidade/4172/ilhagrande-rj" },
  { label: "Prefeitura de Angra dos Reis", href: "https://www.angra.rj.gov.br/" },
  { label: "Booking — Hospedagem em Ilha Grande", href: "https://www.booking.com/region/br/ilhagrande.pt-br.html" },
];

const Footer = () => (
  <footer className="mt-20 border-t border-border bg-secondary/40">
    <div className="container py-12 grid gap-8 md:grid-cols-5">
      <div className="md:col-span-2">
        <img src={logo.url} alt="Estação Ilha Grande" className="h-24 w-auto mb-3" />
        <p className="text-sm text-muted-foreground">A plataforma oficial de conexão entre viajantes e a Ilha Grande.</p>
        <div className="flex gap-3 mt-4">
          <a href="https://www.instagram.com/estacaoilhagranderj/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @estacaoilhagranderj" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-smooth"><Instagram className="w-4 h-4" /></a>
          <a href="mailto:contato@estacaoilhagrande.com.br" aria-label="Email" className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-smooth"><Mail className="w-4 h-4" /></a>
        </div>
        <p className="text-xs text-muted-foreground mt-3">@estacaoilhagranderj</p>
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
          <li><Link to="/transporte" className="hover:text-primary">Como chegar</Link></li>
          <li><Link to="/anuncie" className="hover:text-primary">Anuncie aqui</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Fontes oficiais</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {OFFICIAL_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener nofollow noreferrer" className="hover:text-primary">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground space-y-1">
      <div>© {new Date().getFullYear()} Estação Ilha Grande — Feito com 🌊 para Ilha Grande</div>
      <div>
        <a href="https://voeegoogle.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-smooth">
          Voee Certificada Google
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;

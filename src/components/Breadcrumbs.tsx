import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb { name: string; path: string; }

interface Props {
  items: Crumb[];
}

/** Visual breadcrumb. JSON-LD is emitted by the SEO component. */
const Breadcrumbs = ({ items }: Props) => (
  <nav aria-label="Breadcrumb" className="container pt-4 text-xs text-muted-foreground">
    <ol className="flex flex-wrap items-center gap-1">
      <li>
        <Link to="/" className="inline-flex items-center gap-1 hover:text-primary">
          <Home className="w-3 h-3" /> Início
        </Link>
      </li>
      {items.map((c, i) => (
        <li key={c.path} className="inline-flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          {i === items.length - 1 ? (
            <span className="text-foreground font-medium" aria-current="page">{c.name}</span>
          ) : (
            <Link to={c.path} className="hover:text-primary">{c.name}</Link>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;

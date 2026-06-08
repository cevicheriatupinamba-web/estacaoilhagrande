import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import SEO, { FAQItem } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

interface SimpleItem {
  name: string;
  description: string;
  meta?: string;
  image: string;
  cta?: { label: string; to: string };
}

interface Props {
  title: string;
  tagline: string;
  heroImage: string;
  intro: string;
  items: SimpleItem[];
  footerCtaTo?: string;
  footerCtaLabel?: string;
  /** SEO opcional — quando informado, injeta <SEO> + breadcrumbs */
  seo?: {
    title: string;
    description: string;
    path: string;
    keywords?: string;
    faqs?: FAQItem[];
  };
}

const PortalListPage = ({ title, tagline, heroImage, intro, items, footerCtaTo, footerCtaLabel, seo }: Props) => {
  const hero = heroImage;
  const crumbs = seo ? [{ name: title, path: seo.path }] : null;
  return (
    <>
      {seo && (
        <SEO
          title={seo.title}
          description={seo.description}
          path={seo.path}
          keywords={seo.keywords}
          breadcrumbs={crumbs!}
          faqs={seo.faqs}
        />
      )}
      {crumbs && <Breadcrumbs items={crumbs} />}
      <section className="relative h-[44vh] min-h-[320px] overflow-hidden">
        <img src={hero} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/80" />
        <div className="relative z-10 container h-full flex flex-col justify-end pb-10 text-primary-foreground">
          <span className="text-xs font-bold tracking-widest text-sun uppercase mb-2">{tagline}</span>
          <h1 className="font-display font-black text-4xl md:text-6xl drop-shadow-lg">{title}</h1>
          <p className="text-primary-foreground/90 mt-3 max-w-2xl">{intro}</p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(it => (
            <article key={it.name} className="group bg-card rounded-3xl overflow-hidden border border-border/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-52 overflow-hidden">
                <img src={it.image} alt={it.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {it.meta && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur text-foreground">
                    <MapPin className="w-3 h-3 inline mr-1" /> {it.meta}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-xl mb-2">{it.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{it.description}</p>
                {it.cta && (
                  <Link to={it.cta.to} className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary hover:gap-2 transition-all">
                    {it.cta.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {footerCtaTo && footerCtaLabel && (
          <div className="mt-10 text-center">
            <Link to={footerCtaTo} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
              {footerCtaLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <Disclaimer />
      </section>
    </>
  );
};

export default PortalListPage;

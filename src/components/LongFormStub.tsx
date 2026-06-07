import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SEO, { FAQItem, BreadcrumbItem } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";

interface Section {
  h2: string;
  paragraphs: string[];
  bullets?: string[];
}

interface RelatedLink {
  to: string;
  label: string;
}

interface Props {
  title: string;          // H1
  seoTitle: string;
  seoDescription: string;
  keywords?: string;
  path: string;
  heroImage: string;
  intro: string;          // lead paragraph
  sections: Section[];    // H2 sections
  faqs: FAQItem[];
  related?: RelatedLink[];
  cta?: { label: string; to: string };
  jsonLd?: Record<string, any>[];
}

const LongFormStub = ({
  title, seoTitle, seoDescription, keywords,
  path, heroImage, intro, sections, faqs, related, cta, jsonLd,
}: Props) => {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Início", path: "/" },
    { name: title, path },
  ];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={path}
        keywords={keywords}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="relative h-[52vh] min-h-[360px] overflow-hidden">
        <img src={heroImage} alt={title} loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/85" />
        <div className="relative z-10 container h-full flex flex-col justify-end pb-12 text-primary-foreground">
          <nav aria-label="breadcrumb" className="text-xs text-primary-foreground/80 mb-3">
            <Link to="/" className="hover:underline">Início</Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>
          <h1 className="font-display font-black text-4xl md:text-6xl drop-shadow-lg max-w-4xl">{title}</h1>
          <p className="text-primary-foreground/90 mt-3 max-w-3xl text-lg">{intro}</p>
        </div>
      </section>

      {/* BODY */}
      <article className="container py-12 grid lg:grid-cols-[1fr_280px] gap-10">
        <div className="max-w-3xl">
          {sections.map((s) => (
            <section key={s.h2} className="mb-10">
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-4 text-foreground">{s.h2}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-foreground/85 leading-relaxed mb-4">{p}</p>
              ))}
              {s.bullets && (
                <ul className="space-y-2 mt-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-foreground/85">
                      <Check className="w-4 h-4 mt-1 text-primary shrink-0" /> <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* FAQ */}
          {faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">Perguntas frequentes</h2>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <details key={f.question} className="group rounded-2xl border border-border bg-card p-5">
                    <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                      <span>{f.question}</span>
                      <span className="ml-3 text-primary group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 text-foreground/80 leading-relaxed">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {cta && (
            <div className="mt-12 rounded-3xl gradient-forest text-forest-foreground p-8">
              <h3 className="font-display font-bold text-2xl mb-2">Pronto para começar?</h3>
              <p className="opacity-90 mb-5">Encontre as melhores opções verificadas pela Estação Ilha Grande.</p>
              <Button asChild variant="sunset" size="lg">
                <Link to={cta.to}>{cta.label} <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          )}
        </div>

        {/* SIDEBAR — related links */}
        {related && related.length > 0 && (
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-bold text-base mb-3 text-foreground">Veja também</h3>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.to}>
                    <Link to={r.to} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </article>

      <div className="container">
        <Disclaimer />
      </div>
    </>
  );
};

export default LongFormStub;

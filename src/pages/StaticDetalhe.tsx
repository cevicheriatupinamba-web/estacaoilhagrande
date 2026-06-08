import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, BadgeCheck, Crown, MapPin, MessageCircle, Sparkles, Instagram, CheckCircle2,
} from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  CATEGORY_BASE_PATH, CATEGORY_LABEL, STATIC_ITEMS, TIER_LABEL, TIER_MAX_PHOTOS,
  getStaticItem, tierByIndex, type StaticCategoryKey,
} from "@/lib/staticDetails";

const onlyDigits = (s?: string) => (s || "").replace(/\D/g, "");

interface Props {
  categoryKey: StaticCategoryKey;
}

const StaticDetalhe = ({ categoryKey }: Props) => {
  const { slug = "" } = useParams();
  const item = getStaticItem(categoryKey, slug);

  const tier = useMemo(() => {
    const idx = STATIC_ITEMS[categoryKey].findIndex(i => i.slug === slug);
    return tierByIndex(Math.max(0, idx));
  }, [categoryKey, slug]);

  const [active, setActive] = useState(0);

  if (!item) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display font-bold text-3xl mb-3">Página não encontrada</h1>
        <Link to={CATEGORY_BASE_PATH[categoryKey]} className="text-primary font-semibold underline">
          Voltar para {CATEGORY_LABEL[categoryKey]}
        </Link>
      </div>
    );
  }

  const gallery = (item.gallery?.length ? item.gallery : [item.image])
    .slice(0, TIER_MAX_PHOTOS[tier]);
  const cover = gallery[active] || gallery[0];

  const wa = onlyDigits(item.whatsapp);
  const waLink = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(
        `Olá! Vim pela Estação Ilha Grande e quero saber mais sobre ${item.name}.`
      )}`
    : null;
  const igLink = item.instagram
    ? `https://instagram.com/${item.instagram.replace(/^@/, "")}`
    : null;

  const breadcrumbs = [
    { name: CATEGORY_LABEL[categoryKey], path: CATEGORY_BASE_PATH[categoryKey] },
    { name: item.name, path: `${CATEGORY_BASE_PATH[categoryKey]}/${item.slug}` },
  ];

  const tierRing =
    tier === "premium" ? "ring-2 ring-amber-400/60" :
    tier === "destaque" ? "ring-2 ring-emerald-400/50" : "";

  // Schema.org type per category for rich snippets
  const schemaType =
    categoryKey === "onde-se-hospedar" ? "LodgingBusiness" :
    categoryKey === "onde-comer" ? "Restaurant" :
    categoryKey === "passeios" ? "TouristAttraction" :
    "Thing";

  const itemJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: item.name,
    description: item.shortDescription,
    image: gallery,
    url: `https://estacaoilhagrande.com.br${CATEGORY_BASE_PATH[categoryKey]}/${item.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: item.location || "Ilha Grande",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
  };

  return (
    <>
      <SEO
        title={`${item.name} — ${CATEGORY_LABEL[categoryKey]} em Ilha Grande`}
        description={item.shortDescription}
        path={`${CATEGORY_BASE_PATH[categoryKey]}/${item.slug}`}
        image={cover}
        breadcrumbs={breadcrumbs}
        jsonLd={itemJsonLd}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="container pt-2">
        <Link to={CATEGORY_BASE_PATH[categoryKey]} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar para {CATEGORY_LABEL[categoryKey]}
        </Link>
      </div>

      <section className="container">
        <div className={`relative aspect-[16/9] rounded-3xl overflow-hidden bg-secondary ${tierRing}`}>
          {cover && <img src={cover} alt={item.name} className="w-full h-full object-cover" />}
          <span
            className={`absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-soft ${
              tier === "premium" ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground"
              : tier === "destaque" ? "bg-emerald-500 text-white"
              : "bg-background/95 text-foreground"
            }`}
          >
            {tier === "premium" && <Crown className="w-3.5 h-3.5" />}
            {tier === "destaque" && <Sparkles className="w-3.5 h-3.5" />}
            {tier === "basico" && <BadgeCheck className="w-3.5 h-3.5" />}
            {TIER_LABEL[tier]}
          </span>
        </div>

        {gallery.length > 1 && (
          <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-3">
            {gallery.map((p, i) => (
              <button
                key={p + i}
                onClick={() => setActive(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 ${i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="container py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            {CATEGORY_LABEL[categoryKey]}{item.subcategory ? ` · ${item.subcategory}` : ""}
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl mt-1 mb-2">{item.name}</h1>
          {item.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" /> {item.location}
            </div>
          )}

          <p className="text-lg font-medium text-foreground/90 mb-4">{item.shortDescription}</p>
          <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-line">{item.fullDescription}</p>

          {item.bullets && item.bullets.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display font-bold text-xl mb-3">Diferenciais</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {item.bullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                {TIER_LABEL[tier]}
              </span>
            </div>

            {item.meta?.map(m => (
              <div key={m.label}>
                <div className="text-xs text-muted-foreground uppercase">{m.label}</div>
                <div className="font-semibold">{m.value}</div>
              </div>
            ))}

            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#1ebe5b] transition"
              >
                <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
              </a>
            )}
            {igLink && (
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border font-semibold hover:border-primary transition"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            )}
            <Link
              to={CATEGORY_BASE_PATH[categoryKey]}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border font-semibold hover:border-primary transition"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para a categoria
            </Link>
          </div>

          <div className="bg-secondary/60 border border-border rounded-2xl p-4 text-xs text-muted-foreground text-center">
            Quer aparecer aqui também? <Link to="/anuncie" className="font-semibold text-primary hover:underline">Anuncie seu negócio</Link>.
          </div>
        </aside>
      </section>
    </>
  );
};

export default StaticDetalhe;

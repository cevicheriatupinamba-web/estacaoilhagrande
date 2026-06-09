import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin, Phone, Mail, Globe, Instagram, Clock, BadgeCheck, Crown,
  MessageCircle, Share2, ArrowLeft, Star, Sparkles, CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchListingBySlug, CATEGORY_LABEL, PLAN_LABEL,
  type ListingRow,
} from "@/lib/listings-api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import DbListingCard from "@/components/DbListingCard";
import { trackListingEvent } from "@/lib/advertiser/tracking";

const CATEGORY_PATH: Record<string, string> = {
  hospedagem: "/hospedagem",
  restaurante: "/onde-comer",
  passeio: "/passeios",
  experiencia: "/experiencias",
};

const ListagemDetalhe = () => {
  const { slug = "" } = useParams();
  const { toast } = useToast();
  const [l, setL] = useState<ListingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [related, setRelated] = useState<ListingRow[]>([]);

  useEffect(() => {
    setLoading(true);
    setActive(0);
    fetchListingBySlug(slug).then(setL).finally(() => setLoading(false));
  }, [slug]);

  // Track view once listing is loaded
  useEffect(() => { if (l?.id) trackListingEvent(l.id, "view"); }, [l?.id]);

  // related (same category, excluding current), ranked by plan
  useEffect(() => {
    if (!l) return;
    supabase
      .from("listings")
      .select("*")
      .eq("category", l.category)
      .eq("status", "approved")
      .neq("id", l.id)
      .limit(8)
      .then(({ data }) => {
        const rows = (data as ListingRow[]) || [];
        const rank: Record<string, number> = { premium: 3, destaque: 2, gratuito: 1 };
        rows.sort((a, b) => (rank[b.plan] ?? 0) - (rank[a.plan] ?? 0));
        setRelated(rows.slice(0, 3));
      });
  }, [l]);

  // Gallery limits per plan
  const galleryPhotos = useMemo(() => {
    if (!l) return [];
    if (l.plan === "premium") return l.photos;
    if (l.plan === "destaque") return l.photos.slice(0, 5);
    return l.photos.slice(0, 1);
  }, [l]);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  if (!l || l.status !== "approved") return (
    <div className="container py-20 text-center">
      <h1 className="font-display font-bold text-3xl mb-3">Listagem não encontrada</h1>
      <Button asChild variant="outline"><Link to="/">Voltar para Home</Link></Button>
    </div>
  );

  const cover = galleryPhotos[active] || galleryPhotos[0];
  const waMsg = `Olá! Vim pela Estação Ilha Grande e gostaria de mais informações sobre ${l.name}.`;
  const waLink = l.whatsapp ? `https://wa.me/${l.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(waMsg)}` : null;
  const igLink = l.instagram ? `https://instagram.com/${l.instagram.replace(/^@/, "")}` : null;
  const hasCoords = typeof l.latitude === "number" && typeof l.longitude === "number";
  const mapsLink = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${l.latitude},${l.longitude}`
    : l.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address + " Ilha Grande RJ")}`
      : null;
  const directionsLink = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${l.latitude},${l.longitude}`
    : l.address
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.address + " Ilha Grande RJ")}`
      : null;
  const embedMap = hasCoords
    ? `https://maps.google.com/maps?q=${l.latitude},${l.longitude}&t=k&z=15&hl=pt-BR&output=embed`
    : l.address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(l.address + " Ilha Grande RJ")}&t=k&z=15&hl=pt-BR&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(l.name + " Ilha Grande RJ")}&t=k&z=15&hl=pt-BR&output=embed`;

  const share = async () => {
    const url = window.location.href;
    trackListingEvent(l.id, "share");
    if (navigator.share) {
      try { await navigator.share({ title: l.name, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: "Link copiado!" });
    }
  };

  const schemaType = l.category === "hospedagem" ? "LodgingBusiness"
    : l.category === "restaurante" ? "Restaurant"
    : "TouristAttraction";

  const categoryPath = CATEGORY_PATH[l.category] || "/explorar";
  const breadcrumbs = [
    { name: CATEGORY_LABEL[l.category], path: categoryPath },
    { name: l.name, path: `/listagem/${l.slug}` },
  ];

  const planBorder =
    l.plan === "premium" ? "ring-2 ring-amber-400/60" :
    l.plan === "destaque" ? "ring-2 ring-emerald-400/50" : "";

  return (
    <>
      <SEO
        title={`${l.name} — ${CATEGORY_LABEL[l.category]} em Ilha Grande`}
        description={l.short_description || `${l.name} em Ilha Grande. Confira fotos, contato e localização.`}
        path={`/listagem/${l.slug}`}
        image={cover}
        breadcrumbs={breadcrumbs}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": schemaType,
          name: l.name,
          description: l.description,
          image: l.photos,
          address: l.address,
          telephone: l.phone,
          priceRange: l.price_range,
          ...(hasCoords ? { geo: { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude } } : {}),
        }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="container pt-2">
        <Link to={categoryPath} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar para {CATEGORY_LABEL[l.category]}
        </Link>
      </div>

      {/* GALERIA */}
      {cover && (
        <section className="container">
          <div className={`relative aspect-[16/9] rounded-3xl overflow-hidden bg-secondary ${planBorder}`}>
            <img src={cover} alt={`${l.name} — foto ${active + 1}`} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex gap-2">
              {l.plan === "premium" && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground text-xs font-bold uppercase shadow-soft">
                  <Crown className="w-3.5 h-3.5" /> Premium
                </span>
              )}
              {l.plan === "destaque" && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase shadow-soft">
                  <Star className="w-3.5 h-3.5" /> Destaque
                </span>
              )}
              {l.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase shadow-soft">
                  <Sparkles className="w-3.5 h-3.5" /> Recomendado
                </span>
              )}
            </div>
            {l.logo_url && (
              <div className="absolute left-4 bottom-4 bg-background/95 backdrop-blur rounded-2xl p-2 shadow-soft">
                <img src={l.logo_url} alt={`Logo ${l.name}`} className="h-12 w-12 object-contain" />
              </div>
            )}
          </div>
          {galleryPhotos.length > 1 && (
            <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-3">
              {galleryPhotos.map((p, i) => (
                <button key={p + i} onClick={() => setActive(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 ${i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {l.plan !== "premium" && l.photos.length > galleryPhotos.length && (
            <p className="mt-2 text-xs text-muted-foreground text-center">
              Galeria completa disponível apenas para anunciantes Premium.
            </p>
          )}
        </section>
      )}

      <section className="container py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            {CATEGORY_LABEL[l.category]}{l.subcategory ? ` · ${l.subcategory}` : ""}
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl mt-1 mb-2 flex items-start gap-2 flex-wrap">
            {l.name}
            {(l.plan === "premium" || l.plan === "destaque") && (
              <BadgeCheck className="w-7 h-7 text-primary mt-2 shrink-0" />
            )}
            {l.plan === "premium" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 mt-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground text-[11px] font-bold uppercase tracking-wider shadow-soft">
                <Crown className="w-3.5 h-3.5" /> Anunciante Premium
              </span>
            )}
          </h1>
          {l.plan === "premium" && (
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-3">
              ⭐ Este estabelecimento possui destaque Premium no portal Estação Ilha Grande.
            </p>
          )}
          {(l.neighborhood || l.address) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" /> {l.neighborhood}{l.neighborhood && l.address ? " · " : ""}{l.address}
            </div>
          )}

          {l.short_description && (
            <p className="text-lg font-medium text-foreground/90 mb-4">{l.short_description}</p>
          )}
          {l.description && (
            <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-line">{l.description}</p>
          )}

          {l.services?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display font-bold text-xl mb-3">Serviços</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {l.services.map(s => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {l.amenities?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display font-bold text-xl mb-3">Comodidades</h2>
              <div className="flex flex-wrap gap-2">
                {l.amenities.map(a => (
                  <span key={a} className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium">{a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display font-bold text-xl mb-3">Localização</h2>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border shadow-card">
              <iframe
                src={embedMap}
                loading="lazy"
                title={`Mapa de ${l.name}`}
                className="w-full h-full"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Plano {PLAN_LABEL[l.plan]}
              </span>
              {(l.plan === "premium" || l.plan === "destaque") && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-primary">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verificado
                </span>
              )}
            </div>

            {l.price_range && (
              <div>
                <div className="text-xs text-muted-foreground uppercase">Faixa de preço</div>
                <div className="font-display font-bold text-xl text-forest">{l.price_range}</div>
              </div>
            )}
            {l.opening_hours && (
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {l.opening_hours}
              </div>
            )}
            {waLink && (
              <Button asChild variant="hero" className="w-full">
                <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => trackListingEvent(l.id, "whatsapp")}>
                  <MessageCircle className="w-4 h-4 mr-2" /> Falar no WhatsApp
                </a>
              </Button>
            )}
            {l.phone && (
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:${l.phone}`} onClick={() => trackListingEvent(l.id, "phone")}><Phone className="w-4 h-4 mr-2" /> {l.phone}</a>
              </Button>
            )}
            {igLink && (
              <Button asChild variant="outline" className="w-full">
                <a href={igLink} target="_blank" rel="noopener noreferrer" onClick={() => trackListingEvent(l.id, "instagram")}>
                  <Instagram className="w-4 h-4 mr-2" /> Instagram
                </a>
              </Button>
            )}
            {l.website && (
              <Button asChild variant="outline" className="w-full">
                <a href={l.website} target="_blank" rel="noopener noreferrer" onClick={() => trackListingEvent(l.id, "website")}>
                  <Globe className="w-4 h-4 mr-2" /> Site oficial
                </a>
              </Button>
            )}
            {l.email && (
              <Button asChild variant="outline" className="w-full">
                <a href={`mailto:${l.email}`} onClick={() => trackListingEvent(l.id, "email")}><Mail className="w-4 h-4 mr-2" /> E-mail</a>
              </Button>
            )}
            {mapsLink && (
              <Button asChild variant="outline" className="w-full">
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" onClick={() => trackListingEvent(l.id, "map")}>
                  <MapPin className="w-4 h-4 mr-2" /> Ver no Google Maps
                </a>
              </Button>
            )}
            {directionsLink && (
              <Button asChild variant="outline" className="w-full">
                <a href={directionsLink} target="_blank" rel="noopener noreferrer" onClick={() => trackListingEvent(l.id, "directions")}>
                  <MapPin className="w-4 h-4 mr-2" /> Como chegar
                </a>
              </Button>
            )}
            <Button onClick={share} variant="ghost" className="w-full">
              <Share2 className="w-4 h-4 mr-2" /> Compartilhar
            </Button>
          </div>

          <div className="bg-secondary/60 border border-border rounded-2xl p-4 text-xs text-muted-foreground text-center">
            Este é o anunciante. A reserva, preço e disponibilidade são tratados diretamente com ele.
          </div>
        </aside>
      </section>

      {/* RELACIONADOS */}
      {related.length > 0 && (
        <section className="container py-10 border-t border-border">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">
            Outras opções em {CATEGORY_LABEL[l.category]}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map(r => <DbListingCard key={r.id} l={r} />)}
          </div>
        </section>
      )}

      {/* CTA COMERCIAL */}
      <section className="container py-12">
        <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-amber-400/10 to-emerald-400/10 border border-border p-8 md:p-10 text-center">
          <h2 className="font-display font-black text-2xl md:text-3xl mb-2">
            Tem um negócio em Ilha Grande?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-5">
            Apareça aqui também. Cadastre sua empresa na Estação Ilha Grande e seja encontrado por quem está planejando a viagem agora.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/anuncie">Quero anunciar minha empresa</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default ListagemDetalhe;

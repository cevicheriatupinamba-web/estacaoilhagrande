import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MapPin, Phone, Mail, Globe, Instagram, Clock, BadgeCheck, Crown,
  MessageCircle, Share2, ArrowLeft,
} from "lucide-react";
import { fetchListingBySlug, CATEGORY_LABEL, type ListingRow } from "@/lib/listings-api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ListagemDetalhe = () => {
  const { slug = "" } = useParams();
  const { toast } = useToast();
  const [l, setL] = useState<ListingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetchListingBySlug(slug).then(setL).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  if (!l || l.status !== "approved") return (
    <div className="container py-20 text-center">
      <h1 className="font-display font-bold text-3xl mb-3">Listagem não encontrada</h1>
      <Button asChild variant="outline"><Link to="/">Voltar para Home</Link></Button>
    </div>
  );

  const cover = l.photos?.[active] || l.photos?.[0];
  const waLink = l.whatsapp ? `https://wa.me/${l.whatsapp.replace(/\D/g, "")}` : null;
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

  const share = async () => {
    const url = window.location.href;
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

  return (
    <>
      <Helmet>
        <title>{l.name} — {CATEGORY_LABEL[l.category]} em Ilha Grande</title>
        <meta name="description" content={l.short_description || ""} />
        <link rel="canonical" href={`/listagem/${l.slug}`} />
        <meta property="og:title" content={l.name} />
        <meta property="og:description" content={l.short_description || ""} />
        {cover && <meta property="og:image" content={cover} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": schemaType,
          name: l.name,
          description: l.description,
          image: l.photos,
          address: l.address,
          telephone: l.phone,
          priceRange: l.price_range,
          url: typeof window !== "undefined" ? window.location.href : undefined,
          ...(hasCoords ? { geo: { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude } } : {}),
        })}</script>
      </Helmet>

      <div className="container py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>

      {/* GALERIA */}
      {cover && (
        <section className="container">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-secondary">
            <img src={cover} alt={l.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex gap-2">
              {l.plan === "premium" && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-foreground text-xs font-bold uppercase shadow-soft">
                  <Crown className="w-3.5 h-3.5" /> Premium
                </span>
              )}
            </div>
          </div>
          {l.photos.length > 1 && (
            <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-3">
              {l.photos.map((p, i) => (
                <button key={p} onClick={() => setActive(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 ${i === active ? "border-primary" : "border-transparent opacity-70"}`}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="container py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            {CATEGORY_LABEL[l.category]}{l.subcategory ? ` · ${l.subcategory}` : ""}
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl mt-1 mb-2 flex items-start gap-2">
            {l.name}
            <BadgeCheck className="w-7 h-7 text-primary mt-2 shrink-0" />
          </h1>
          {(l.neighborhood || l.address) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" /> {l.neighborhood}{l.neighborhood && l.address ? " · " : ""}{l.address}
            </div>
          )}
          <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-line">{l.description}</p>

          {l.amenities?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-bold text-xl mb-3">Comodidades</h3>
              <div className="flex flex-wrap gap-2">
                {l.amenities.map(a => (
                  <span key={a} className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-3">
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
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Falar no WhatsApp
                </a>
              </Button>
            )}
            {l.phone && (
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:${l.phone}`}><Phone className="w-4 h-4 mr-2" /> {l.phone}</a>
              </Button>
            )}
            {igLink && (
              <Button asChild variant="outline" className="w-full">
                <a href={igLink} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4 mr-2" /> Instagram
                </a>
              </Button>
            )}
            {l.website && (
              <Button asChild variant="outline" className="w-full">
                <a href={l.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" /> Site oficial
                </a>
              </Button>
            )}
            {l.email && (
              <Button asChild variant="outline" className="w-full">
                <a href={`mailto:${l.email}`}><Mail className="w-4 h-4 mr-2" /> E-mail</a>
              </Button>
            )}
            {mapsLink && (
              <Button asChild variant="outline" className="w-full">
                <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-2" /> Ver no Google Maps
                </a>
              </Button>
            )}
            {directionsLink && (
              <Button asChild variant="outline" className="w-full">
                <a href={directionsLink} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-2" /> Como chegar
                </a>
              </Button>
            )}
            <Button onClick={share} variant="ghost" className="w-full">
              <Share2 className="w-4 h-4 mr-2" /> Compartilhar
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
};

export default ListagemDetalhe;

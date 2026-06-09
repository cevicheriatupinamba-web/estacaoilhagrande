import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Star, MessageCircle, CalendarCheck, Wifi, Coffee, Snowflake, Waves, Dog, Baby, CreditCard, ShieldCheck, ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import LocationMap from "@/components/LocationMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AGENCY_WHATSAPP_DEFAULT, buildWhatsappUrl, sanitizeWhatsappNumber } from "@/lib/whatsapp";

function iconForAmenity(name: string) {
  const n = name.toLowerCase();
  if (n.includes("wi")) return Wifi;
  if (n.includes("café") || n.includes("cafe")) return Coffee;
  if (n.includes("ar")) return Snowflake;
  if (n.includes("piscina") || n.includes("praia") || n.includes("mar")) return Waves;
  if (n.includes("pet") || n.includes("animal")) return Dog;
  if (n.includes("criança") || n.includes("crianca") || n.includes("infantil")) return Baby;
  if (n.includes("cartão") || n.includes("cartao") || n.includes("pix")) return CreditCard;
  return ShieldCheck;
}

export default function PousadaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [p, setP] = useState<any | null>(null);
  const [others, setOthers] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("accommodations")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (cancelled) return;
      setP(data);
      if (data) {
        const { data: list } = await supabase
          .from("accommodations")
          .select("name,slug,location,photos,rating,review_count")
          .eq("status", "published")
          .neq("id", data.id)
          .limit(6);
        if (!cancelled) setOthers(list || []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const photos = useMemo<{ url: string; alt?: string; is_cover?: boolean }[]>(() => {
    const arr = Array.isArray(p?.photos) ? p.photos : [];
    if (arr.length && !arr.some((x: any) => x.is_cover)) arr[0].is_cover = true;
    return arr;
  }, [p]);
  const cover = photos.find((x) => x.is_cover) || photos[0];

  const whatsappNumber = sanitizeWhatsappNumber(p?.whatsapp) || AGENCY_WHATSAPP_DEFAULT;
  const waMsg = `Olá! Tenho interesse na ${p?.name ?? "pousada"} (Estação Ilha Grande).`;
  const waUrl = buildWhatsappUrl(whatsappNumber, waMsg);

  if (loading) {
    return <div className="min-h-[60vh] grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!p) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Pousada não encontrada</h1>
        <p className="text-muted-foreground mt-2">Veja outras opções em nossa página de hospedagens.</p>
        <Button asChild className="mt-6"><Link to="/hospedagem">Ver pousadas</Link></Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <SEO
        title={p.seo_title || `${p.name} — Pousada em ${p.location || "Ilha Grande"}`}
        description={p.seo_description || p.short_description || `Reserve ${p.name} em Ilha Grande pela Estação Ilha Grande.`}
        path={`/pousadas/${p.slug}`}
        image={cover?.url}
        keywords={p.seo_keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Hospedagem", path: "/hospedagem" },
          { name: p.name, path: `/pousadas/${p.slug}` },
        ]}
      />

      {/* HERO */}
      <section className="relative">
        {cover ? (
          <div className="grid md:grid-cols-4 gap-1 md:gap-2 max-w-7xl mx-auto px-2 md:px-4 pt-4">
            <img src={cover.url} alt={cover.alt || p.name} className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto md:h-[420px] w-full object-cover rounded-l-2xl" />
            {photos.filter((x) => x.url !== cover.url).slice(0, 4).map((x, i) => (
              <img key={i} src={x.url} alt={x.alt || p.name} className="hidden md:block h-[206px] w-full object-cover" />
            ))}
          </div>
        ) : (
          <div className="aspect-[16/7] bg-muted grid place-items-center text-muted-foreground"><ImageIcon className="w-10 h-10" /></div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-5 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <Badge className="mb-2">{p.category || "Pousada"}</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{p.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {p.location || `${p.city}, ${p.state}`}</span>
              {p.rating && (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <b className="text-foreground">{Number(p.rating).toFixed(1)}</b>
                  {p.review_count ? <span>({p.review_count} avaliações)</span> : null}
                </span>
              )}
            </div>
          </div>

          {/* Descriptions */}
          {(p.short_description || p.full_description) && (
            <div className="prose prose-sm max-w-none">
              {p.short_description && <p className="text-lg text-foreground/80">{p.short_description}</p>}
              {p.full_description && <p className="whitespace-pre-line">{p.full_description}</p>}
            </div>
          )}

          {/* Amenities */}
          {Array.isArray(p.amenities) && p.amenities.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold mb-3">Comodidades</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {p.amenities.map((a: string, i: number) => {
                  const Icon = iconForAmenity(a);
                  return (
                    <div key={i} className="flex items-center gap-2 rounded-lg border p-3 bg-card">
                      <Icon className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm">{a}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Rooms */}
          {Array.isArray(p.rooms) && p.rooms.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold mb-3">Quartos disponíveis</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {p.rooms.map((r: any, i: number) => (
                  <Card key={i} className="p-4">
                    <div className="font-semibold">{r.name}</div>
                    {r.capacity && <div className="text-xs text-muted-foreground">Capacidade: {r.capacity}</div>}
                    {r.description && <p className="text-sm mt-2">{r.description}</p>}
                    {Array.isArray(r.amenities) && r.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.amenities.map((x: string, j: number) => <Badge key={j} variant="secondary" className="text-[10px]">{x}</Badge>)}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* House rules */}
          {p.house_rules && Object.values(p.house_rules).some(Boolean) && (
            <section>
              <h2 className="font-display text-xl font-bold mb-3">Regras da hospedagem</h2>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(p.house_rules).map(([k, v]) =>
                  v ? (
                    <div key={k} className="rounded-lg border p-3 bg-card">
                      <div className="text-[11px] font-bold uppercase text-muted-foreground">{k}</div>
                      <div>{String(v)}</div>
                    </div>
                  ) : null
                )}
              </div>
            </section>
          )}

          {/* Map */}
          <section>
            <h2 className="font-display text-xl font-bold mb-3">Localização</h2>
            <LocationMap name={p.name} location={p.location || "Ilha Grande"} lat={p.latitude ?? undefined} lng={p.longitude ?? undefined} showTitle={false} />
          </section>
        </div>

        {/* CTA sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-3">
          <Card className="p-5 space-y-3 shadow-lg border-emerald-100">
            <div className="font-display text-lg font-bold">Reserve com a agência oficial</div>
            <p className="text-sm text-muted-foreground">
              Atendimento humano, sem taxas escondidas. Resposta rápida no WhatsApp.
            </p>
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <a href={waUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> Falar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href={waUrl} target="_blank" rel="noreferrer">
                <CalendarCheck className="w-4 h-4 mr-2" /> Solicitar reserva
              </a>
            </Button>
          </Card>
        </aside>
      </div>

      {/* Others */}
      {others.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 pb-16">
          <h2 className="font-display text-2xl font-bold mb-4">Outras pousadas em Ilha Grande</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((o) => {
              const c = Array.isArray(o.photos) ? (o.photos.find((x: any) => x.is_cover) || o.photos[0]) : null;
              return (
                <Link key={o.slug} to={`/pousadas/${o.slug}`} className="group rounded-xl overflow-hidden border bg-card hover:shadow-lg transition">
                  {c?.url ? (
                    <img src={c.url} alt={o.name} className="aspect-[4/3] object-cover w-full group-hover:scale-105 transition" />
                  ) : (
                    <div className="aspect-[4/3] bg-muted" />
                  )}
                  <div className="p-3">
                    <div className="font-semibold">{o.name}</div>
                    <div className="text-xs text-muted-foreground">{o.location}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Fixed WhatsApp CTA on mobile */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-30">
        <Button asChild className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 shadow-xl">
          <a href={waUrl} target="_blank" rel="noreferrer">
            <MessageCircle className="w-5 h-5 mr-2" /> Reservar no WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}

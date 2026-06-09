import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, MessageCircle, Mail, Heart, Lightbulb, Crown, Home } from "lucide-react";
import SEO from "@/components/SEO";
import { places, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

const LugarDetalhe = () => {
  const { slug } = useParams();
  const nav = useNavigate();
  const place = places.find(p => p.slug === slug);
  const { user, isFavorite, toggleFavorite } = useAuth();
  const [active, setActive] = useState(0);

  if (!place) {
    return (
      <div className="container py-20 text-center">
        <p className="mb-4">Lugar não encontrado.</p>
        <Button onClick={() => nav("/explorar")}>Voltar para explorar</Button>
      </div>
    );
  }

  const cat = categories.find(c => c.key === place.category);
  const fav = isFavorite(place.id);

  return (
    <div className="container py-8">
      <SEO
        title={`${place.name} — ${cat?.label ?? "Ilha Grande"} | Estação Ilha Grande`}
        description={place.shortDescription}
        path={`/lugar/${place.slug}`}
        keywords={(place.tags ?? []).join(", ")}
      />
      <div className="flex items-center justify-between mb-6 gap-3">
        <button onClick={() => nav(-1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <Home className="w-4 h-4" /> Início
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Galeria */}
          <div className="rounded-3xl overflow-hidden bg-card shadow-card">
            <div className="aspect-[16/10]">
              <img src={place.gallery[active]} alt={place.name} className="w-full h-full object-cover" />
            </div>
            {place.gallery.length > 1 && (
              <div className="p-3 flex gap-2">
                {place.gallery.map((g, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={cn("w-20 h-16 rounded-lg overflow-hidden border-2 transition-smooth",
                      i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}>
                    <img src={g} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">{cat?.emoji} {cat?.label}</span>
              <span className="text-sm font-semibold text-forest">{place.priceRange}</span>
              {place.premium && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold shadow">
                  <Crown className="w-3.5 h-3.5" /> ANUNCIANTE PREMIUM
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-3 flex items-center gap-2 flex-wrap">
              {place.name}
              {place.premium && <Crown className="w-7 h-7 text-amber-500" aria-label="Premium" />}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-sun text-sun" /><strong className="text-foreground">{place.rating}</strong> ({place.reviewsCount} avaliações)</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {place.location}</span>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed">{place.fullDescription}</p>
          </div>

          {place.tips.length > 0 && (
            <div className="rounded-3xl bg-secondary/60 p-6">
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-sun" /> Dicas
              </h2>
              <ul className="space-y-2">
                {place.tips.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm"><span className="text-primary">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Mapa placeholder */}
          <div className="rounded-3xl bg-card border border-border overflow-hidden">
            <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-forest/20 grid place-items-center text-center p-6">
              <div>
                <MapPin className="w-10 h-10 mx-auto text-primary mb-2" />
                <p className="font-semibold">{place.location}</p>
                <p className="text-sm text-muted-foreground">Mapa interativo em breve</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar contato */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-card">
            <h3 className="font-display font-bold text-lg mb-4">Entre em contato</h3>
            <div className="space-y-2">
              {place.whatsapp && (
                <Button asChild variant="sunset" className="w-full justify-start">
                  <a
                    href={`https://wa.me/${place.whatsapp.replace(/\D/g, '')}${place.whatsappMessage ? `?text=${encodeURIComponent(place.whatsappMessage)}` : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </Button>
              )}
              {place.instagram && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href={place.instagram} target="_blank" rel="noopener noreferrer">📸 Instagram</a>
                </Button>
              )}
              {place.website && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href={place.website} target="_blank" rel="noopener noreferrer">🌐 Site oficial</a>
                </Button>
              )}
              {place.email && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href={`mailto:${place.email}`}><Mail className="w-4 h-4" /> Email</a>
                </Button>
              )}
              <Button onClick={() => {
                if (!user) { nav("/login"); return; }
                toggleFavorite(place.id);
              }} variant={fav ? "default" : "outline"} className="w-full justify-start">
                <Heart className={cn("w-4 h-4", fav && "fill-current")} /> {fav ? "Salvo" : "Salvar"}
              </Button>
            </div>
            {!place.whatsapp && !place.email && (
              <p className="text-xs text-muted-foreground">Sem contato direto — acesso livre / via agência.</p>
            )}
          </div>

          <div className="rounded-3xl bg-secondary p-6">
            <h3 className="font-semibold text-sm mb-2">Categoria</h3>
            <Link to={`/explorar?cat=${place.category}`} className="text-sm text-primary hover:underline">
              Ver mais em {cat?.label} →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LugarDetalhe;

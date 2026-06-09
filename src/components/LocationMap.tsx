import { MapPin, Navigation } from "lucide-react";

interface LocationMapProps {
  name: string;
  /** Free-text address or location hint (used as fallback for query) */
  location?: string;
  /** Latitude (preferred) */
  lat?: number;
  /** Longitude (preferred) */
  lng?: number;
  /** Show heading */
  showTitle?: boolean;
  /** Aspect ratio classname (default 16/9) */
  aspectClassName?: string;
}

/**
 * Reusable interactive map.
 * Uses Google Maps legacy embed (no API key) with satellite layer (t=k).
 * Falls back to address-based query if no coords provided.
 */
const LocationMap = ({
  name,
  location,
  lat,
  lng,
  showTitle = true,
  aspectClassName = "aspect-[16/9]",
}: LocationMapProps) => {
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  const query = hasCoords
    ? `${lat},${lng}`
    : encodeURIComponent(`${name}${location ? `, ${location}` : ""}, Ilha Grande, Angra dos Reis, RJ, Brasil`);

  // t=k → satellite (hybrid). z=15 zoom level. output=embed allows iframe without API key.
  const embedSrc = `https://maps.google.com/maps?q=${query}&t=k&z=15&hl=pt-BR&output=embed`;

  const openLink = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;

  const dirLink = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <section className="space-y-3">
      {showTitle && (
        <h2 className="font-display font-bold text-xl flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> Localização
        </h2>
      )}
      <div className={`${aspectClassName} rounded-2xl overflow-hidden border border-border shadow-card bg-secondary`}>
        <iframe
          src={embedSrc}
          loading="lazy"
          title={`Mapa de ${name}`}
          className="w-full h-full"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={openLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:border-primary transition"
        >
          <MapPin className="w-4 h-4" /> Abrir no Google Maps
        </a>
        <a
          href={dirLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:border-primary transition"
        >
          <Navigation className="w-4 h-4" /> Como chegar
        </a>
      </div>
    </section>
  );
};

export default LocationMap;

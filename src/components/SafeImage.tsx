import { useState, ImgHTMLAttributes } from "react";

// Fallbacks premium garantidos (Unsplash IDs verificados, formato longo).
const FALLBACK_POOL: Record<string, string> = {
  ferry:
    "https://images.unsplash.com/photo-1599582909646-2d2a3c8eedda?auto=format&fit=crop&w=1400&q=80",
  catamara:
    "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=1400&q=80",
  flexboat:
    "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=80",
  taxiboat:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
  escuna:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  van:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
  pier:
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=80",
  ilha:
    "https://images.unsplash.com/photo-1502160462350-7b66a4fcc0a8?auto=format&fit=crop&w=1400&q=80",
  boat:
    "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1400&q=80",
  default:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
};

export type SafeImageFallback = keyof typeof FALLBACK_POOL;

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
  fallback?: SafeImageFallback | string;
}

export const SafeImage = ({
  src,
  alt,
  fallback = "default",
  className,
  loading = "lazy",
  ...rest
}: SafeImageProps) => {
  const fallbackUrl =
    (fallback && FALLBACK_POOL[fallback as SafeImageFallback]) ||
    (typeof fallback === "string" ? fallback : FALLBACK_POOL.default);

  const [current, setCurrent] = useState<string>(src && src.trim() ? src : fallbackUrl);
  const [errored, setErrored] = useState(false);

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      title={rest.title || alt}
      loading={loading}
      decoding="async"
      onError={() => {
        if (!errored && current !== fallbackUrl) {
          setErrored(true);
          setCurrent(fallbackUrl);
        }
      }}
      className={className}
      style={{ objectFit: "cover", ...rest.style }}
    />
  );
};

export default SafeImage;

// Injects SEO Global Premium settings (verifications, analytics, theme,
// favicon, OG defaults, organization schema) into the live document.
// Reads from platform_settings on mount.
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { fetchGlobalSEO, type GlobalSEO } from "@/lib/seo/global";

export default function GlobalSEOInjector() {
  const [seo, setSeo] = useState<Partial<GlobalSEO> | null>(null);

  useEffect(() => {
    fetchGlobalSEO().then(setSeo).catch(() => setSeo({}));
  }, []);

  if (!seo) return null;
  const { meta, og, twitter, verifications, advanced, local, institutional } = seo;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: institutional?.name || "Estação Ilha Grande",
    url: meta?.canonical || "https://estacaoilhagrande.com.br",
    email: institutional?.email || local?.email,
    telephone: local?.phone,
    sameAs: [institutional?.instagram, institutional?.facebook].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: local?.city,
      addressRegion: local?.state,
      addressCountry: local?.country,
    },
  };

  const touristDestLd = local?.latitude && local?.longitude ? {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Ilha Grande",
    url: meta?.canonical || "https://estacaoilhagrande.com.br",
    geo: { "@type": "GeoCoordinates", latitude: Number(local.latitude), longitude: Number(local.longitude) },
    containedInPlace: { "@type": "AdministrativeArea", name: `${local.city}, ${local.state}, ${local.country}` },
  } : null;

  return (
    <Helmet>
      {advanced?.theme_color && <meta name="theme-color" content={advanced.theme_color} />}
      {advanced?.favicon && <link rel="icon" href={advanced.favicon} />}
      {advanced?.apple_touch_icon && <link rel="apple-touch-icon" href={advanced.apple_touch_icon} />}
      {advanced?.manifest && <link rel="manifest" href={advanced.manifest} />}

      {verifications?.google && <meta name="google-site-verification" content={verifications.google} />}
      {verifications?.bing && <meta name="msvalidate.01" content={verifications.bing} />}

      {meta?.keywords && <meta name="keywords" content={meta.keywords} />}

      {og?.image && <meta property="og:image" content={og.image} />}
      {twitter?.image && <meta name="twitter:image" content={twitter.image} />}

      <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
      {touristDestLd && <script type="application/ld+json">{JSON.stringify(touristDestLd)}</script>}

      {/* Google Analytics 4 */}
      {verifications?.ga4 && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${verifications.ga4}`}></script>
      )}
      {verifications?.ga4 && (
        <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${verifications.ga4}');`}</script>
      )}

      {/* Google Tag Manager */}
      {verifications?.gtm && (
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${verifications.gtm}');`}</script>
      )}

      {/* Meta Pixel */}
      {verifications?.meta_pixel && (
        <script>{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${verifications.meta_pixel}');fbq('track','PageView');`}</script>
      )}
    </Helmet>
  );
}

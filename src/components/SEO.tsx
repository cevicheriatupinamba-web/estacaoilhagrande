import { Helmet } from "react-helmet-async";

const SITE_URL = "https://guiasalt.lovable.app";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  jsonLd?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

export const SEO = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  keywords,
  breadcrumbs,
  faqs,
  jsonLd,
  noIndex,
}: Props) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes("Ilha Grande") ? title : `${title} | Ilha Grande RJ — Guia Salt`;

  const breadcrumbLd = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `${SITE_URL}${b.path}`,
    })),
  } : null;

  const faqLd = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  const extra = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Guia Salt — Ilha Grande" />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {breadcrumbLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      )}
      {faqLd && (
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      )}
      {extra.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;

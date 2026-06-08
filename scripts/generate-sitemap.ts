// Generates public/sitemap.xml before dev/build. Includes static SEO routes
// and (when reachable) every approved listing slug from Supabase.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://estacaoilhagrande.com.br";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://vplwcsdtcbgpcjgdgtob.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_URtJWX29mqbmJNrZHouLhQ_RXvM0FkJ";

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
interface Entry { path: string; lastmod?: string; changefreq?: Freq; priority?: string; }

const today = new Date().toISOString().slice(0, 10);

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/explorar", changefreq: "daily", priority: "0.9" },

  // Hospedagem
  { path: "/onde-ficar-em-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/pousadas-em-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/hoteis-em-ilha-grande", changefreq: "weekly", priority: "0.8" },
  { path: "/hostels-em-ilha-grande", changefreq: "weekly", priority: "0.8" },

  // Gastronomia
  { path: "/restaurantes-em-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/onde-comer-em-ilha-grande", changefreq: "weekly", priority: "0.8" },

  // Experiências
  { path: "/o-que-fazer-em-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/passeios-em-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/praias-de-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/trilhas-em-ilha-grande", changefreq: "weekly", priority: "0.8" },
  { path: "/vida-noturna", changefreq: "monthly", priority: "0.6" },

  // Logística
  { path: "/como-chegar-em-ilha-grande", changefreq: "monthly", priority: "0.8" },
  { path: "/guias", changefreq: "monthly", priority: "0.6" },
  { path: "/roteiros", changefreq: "weekly", priority: "0.8" },
  { path: "/dicas", changefreq: "monthly", priority: "0.7" },
  { path: "/nao-fazer", changefreq: "monthly", priority: "0.6" },
  { path: "/anuncie", changefreq: "monthly", priority: "0.5" },

  // Novas páginas long-form
  { path: "/hospedagens-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/hostels-ilha-grande", changefreq: "weekly", priority: "0.8" },
  { path: "/camping-ilha-grande", changefreq: "weekly", priority: "0.8" },
  { path: "/restaurantes-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/passeios-ilha-grande", changefreq: "weekly", priority: "0.9" },
  { path: "/transfer-ilha-grande", changefreq: "weekly", priority: "0.8" },
  { path: "/eventos-ilha-grande", changefreq: "weekly", priority: "0.7" },
  { path: "/experiencias-ilha-grande", changefreq: "weekly", priority: "0.8" },
  { path: "/comercio-local-ilha-grande", changefreq: "monthly", priority: "0.6" },
  { path: "/melhor-epoca-para-visitar-ilha-grande", changefreq: "monthly", priority: "0.8" },

  // Páginas programáticas (long-tail SEO)
  { path: "/pousadas-com-cafe-da-manha-ilha-grande", changefreq: "monthly", priority: "0.7" },
  { path: "/pousadas-pet-friendly-ilha-grande", changefreq: "monthly", priority: "0.7" },
  { path: "/pousadas-baratas-ilha-grande", changefreq: "monthly", priority: "0.7" },
  { path: "/restaurantes-beira-mar-ilha-grande", changefreq: "monthly", priority: "0.7" },
  { path: "/passeios-de-lancha-ilha-grande", changefreq: "monthly", priority: "0.7" },
  { path: "/passeios-para-lopes-mendes", changefreq: "monthly", priority: "0.8" },
  { path: "/onde-comer-frutos-do-mar-em-ilha-grande", changefreq: "monthly", priority: "0.7" },
  { path: "/transfer-rio-para-ilha-grande", changefreq: "monthly", priority: "0.8" },
  { path: "/transfer-conceicao-de-jacarei-para-ilha-grande", changefreq: "monthly", priority: "0.7" },

  // Blog
  { path: "/blog", changefreq: "daily", priority: "0.9" },
];

async function fetchListingSlugs(): Promise<Entry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?select=slug,updated_at&status=eq.approved`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );
    if (!res.ok) {
      console.warn(`[sitemap] listings fetch failed: ${res.status}`);
      return [];
    }
    const rows = (await res.json()) as Array<{ slug: string; updated_at: string }>;
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/listagem/${r.slug}`,
        lastmod: r.updated_at?.slice(0, 10) || today,
        changefreq: "weekly" as Freq,
        priority: "0.7",
      }));
  } catch (err) {
    console.warn(`[sitemap] could not fetch listings:`, err);
    return [];
  }
}

async function fetchBlogSlugs(): Promise<Entry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug: string; updated_at: string }>;
    return rows.filter(r => r.slug).map(r => ({
      path: `/blog/${r.slug}`,
      lastmod: r.updated_at?.slice(0, 10) || today,
      changefreq: "monthly" as Freq,
      priority: "0.7",
    }));
  } catch { return []; }
}


function generate(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}</loc>`,
        `    <lastmod>${e.lastmod || today}</lastmod>`,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  const [listings, blogs] = await Promise.all([fetchListingSlugs(), fetchBlogSlugs()]);
  const all = [...staticEntries, ...listings, ...blogs];
  writeFileSync(resolve("public/sitemap.xml"), generate(all));
  console.log(`sitemap.xml written (${all.length} entries — ${listings.length} listings, ${blogs.length} blog)`);
}

main();

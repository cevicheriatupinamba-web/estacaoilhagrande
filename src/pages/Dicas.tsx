import Disclaimer from "@/components/Disclaimer";
import TieredCard from "@/components/TieredCard";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { STATIC_ITEMS, tierByIndex } from "@/lib/staticDetails";
import { collectionPageLd, itemListLd } from "@/lib/jsonld";

const Dicas = () => {
  const items = STATIC_ITEMS["dicas"];
  return (
    <>
      <SEO
        title="Dicas essenciais para Ilha Grande: o que levar, segurança e mais"
        description="Dicas essenciais para visitar Ilha Grande: o que levar, melhor época, internet, transporte, trilhas, segurança e meio ambiente."
        path="/dicas"
        breadcrumbs={[{ name: "Dicas", path: "/dicas" }]}
        jsonLd={[
          collectionPageLd(
            "Dicas para visitar Ilha Grande",
            "Coleção de dicas práticas para quem vai visitar Ilha Grande: o que levar, segurança, internet, trilhas e cuidados ambientais.",
            "/dicas",
          ),
          itemListLd(
            "Dicas para Ilha Grande",
            "/dicas",
            items.map(it => ({
              name: it.name,
              description: it.bullets?.[0],
              image: it.image,
              path: `/dicas/${it.slug}`,
            })),
          ),
        ]}
      />
      <Breadcrumbs items={[{ name: "Dicas", path: "/dicas" }]} />

      <div className="container py-10">
        <header className="mb-10 max-w-2xl">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Dicas essenciais</h1>
          <p className="text-muted-foreground text-lg">
            Tudo o que você precisa saber antes de viajar para Ilha Grande.
          </p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <TieredCard key={item.slug} item={item} tier={tierByIndex(i)} />
          ))}
        </div>
      </div>
      <Disclaimer />
    </>
  );
};

export default Dicas;

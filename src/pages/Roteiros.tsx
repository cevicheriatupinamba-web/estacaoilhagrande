import Disclaimer from "@/components/Disclaimer";
import TieredCard from "@/components/TieredCard";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { STATIC_ITEMS, tierByIndex } from "@/lib/staticDetails";

const Roteiros = () => {
  const items = STATIC_ITEMS["roteiros"];
  return (
    <>
      <SEO
        title="Roteiros em Ilha Grande: 1, 2, 3 dias e mais"
        description="Roteiros prontos para Ilha Grande: clássicos, romântico, família, aventura e econômico. Escolha o seu e personalize com guias locais."
        path="/roteiros"
        breadcrumbs={[{ name: "Roteiros", path: "/roteiros" }]}
      />
      <Breadcrumbs items={[{ name: "Roteiros", path: "/roteiros" }]} />

      <div className="container py-10">
        <header className="mb-10 max-w-2xl animate-fade-up">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Roteiros prontos</h1>
          <p className="text-muted-foreground text-lg">
            Escolha o roteiro que combina com você, veja os detalhes e personalize com a gente.
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

export default Roteiros;

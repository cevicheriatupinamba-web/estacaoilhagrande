import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import DbListingSection from "@/components/DbListingSection";
import TieredCard from "@/components/TieredCard";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { STATIC_ITEMS, tierByIndex } from "@/lib/staticDetails";
import { itemListLd } from "@/lib/jsonld";

const FAQS = [
  { question: "Quais os melhores restaurantes em Ilha Grande?", answer: "Os melhores restaurantes ficam concentrados na Rua da Praia, na Vila do Abraão, com destaque para frutos do mar, moqueca caiçara e pizza em forno a lenha." },
  { question: "Onde comer peixe fresco em Ilha Grande?", answer: "Restaurantes caiçaras na orla servem peixe do dia, lula, polvo e moqueca capixaba. Pergunte sempre pela 'sugestão do chef'." },
  { question: "Quanto custa comer em Ilha Grande?", answer: "Um prato individual custa em média R$ 50 a R$ 90. Praças de alimentação e lanchonetes oferecem opções mais econômicas." },
];

const OndeComer = () => {
  const [q, setQ] = useState("");
  const all = STATIC_ITEMS["onde-comer"];
  const visible = useMemo(() => {
    const term = q.toLowerCase();
    return all
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) =>
        (item.name + " " + (item.location || "") + " " + (item.subcategory || ""))
          .toLowerCase()
          .includes(term)
      );
  }, [q, all]);

  return (
    <>
      <SEO
        title="Restaurantes em Ilha Grande: onde comer bem na Vila do Abraão"
        description="Os melhores restaurantes de Ilha Grande RJ: frutos do mar, peixe fresco, moqueca, pizza, hambúrguer e bares. Guia atualizado com fotos, preços e WhatsApp."
        path="/onde-comer"
        keywords="restaurantes em ilha grande, onde comer em ilha grande, melhores restaurantes ilha grande, frutos do mar ilha grande, peixe fresco ilha grande"
        breadcrumbs={[{ name: "Onde comer em Ilha Grande", path: "/onde-comer" }]}
        faqs={FAQS}
      />
      <Breadcrumbs items={[{ name: "Onde comer", path: "/onde-comer" }]} />

      <section className="bg-gradient-to-br from-accent/10 via-background to-secondary py-12">
        <div className="container">
          <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Onde comer</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Dos clássicos caiçaras à pizzaria de forno a lenha — opções para todos os gostos.
          </p>
          <div className="max-w-xl bg-card rounded-2xl p-2 flex gap-2 shadow-soft border border-border">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="Buscar restaurante ou cozinha..."
                className="w-full bg-transparent outline-none py-2.5 text-sm" />
            </div>
          </div>
        </div>
      </section>

      <DbListingSection category="restaurante" subtitle="Restaurantes e bares cadastrados" />

      <section className="container py-10">
        <h2 className="font-display font-black text-2xl md:text-3xl mb-6">Restaurantes recomendados</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map(({ item, originalIndex }) => (
            <TieredCard key={item.slug} item={item} tier={tierByIndex(originalIndex)} />
          ))}
        </div>
      </section>
      <Disclaimer />
    </>
  );
};

export default OndeComer;

import { useMemo, useState } from "react";
import { Search, MapPin, Star, AlertCircle } from "lucide-react";
import { restaurants } from "@/data/listings";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";
import DbListingSection from "@/components/DbListingSection";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const FAQS = [
  { question: "Quais os melhores restaurantes em Ilha Grande?", answer: "Os melhores restaurantes ficam concentrados na Rua da Praia, na Vila do Abraão, com destaque para frutos do mar, moqueca caiçara e pizza em forno a lenha." },
  { question: "Onde comer peixe fresco em Ilha Grande?", answer: "Restaurantes caiçaras na orla servem peixe do dia, lula, polvo e moqueca capixaba. Pergunte sempre pela 'sugestão do chef'." },
  { question: "Quanto custa comer em Ilha Grande?", answer: "Um prato individual custa em média R$ 50 a R$ 90. Praças de alimentação e lanchonetes oferecem opções mais econômicas." },
];

const OndeComer = () => {
  const [q, setQ] = useState("");
  const list = useMemo(
    () => restaurants.filter(r => (r.name + " " + r.cuisine + " " + r.area).toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <>
      <SEO
        title="Restaurantes em Ilha Grande: onde comer bem na Vila do Abraão"
        description="Os melhores restaurantes de Ilha Grande RJ: frutos do mar, peixe fresco, moqueca, pizza, hambúrguer e bares. Guia atualizado com fotos, preços e WhatsApp."
        path="/restaurantes-em-ilha-grande"
        keywords="restaurantes em ilha grande, onde comer em ilha grande, melhores restaurantes ilha grande, frutos do mar ilha grande, peixe fresco ilha grande"
        breadcrumbs={[{ name: "Restaurantes em Ilha Grande", path: "/restaurantes-em-ilha-grande" }]}
        faqs={FAQS}
      />
      <Breadcrumbs items={[{ name: "Restaurantes em Ilha Grande", path: "/restaurantes-em-ilha-grande" }]} />

      <section className="bg-gradient-to-br from-accent/10 via-background to-secondary py-12">
        <div className="container">
          <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Onde comer</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Dos clássicos caiçaras à pizzaria de forno a lenha, 20 opções para todos os gostos.
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
        <h2 className="font-display font-black text-2xl md:text-3xl mb-6">Outras opções na ilha</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map(r => (
            <article key={r.id} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-smooth border border-border/60 flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={r.image} alt={r.name} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                {!r.confirmed && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sun/95 text-sun-foreground text-[10px] font-semibold">
                    <AlertCircle className="w-3 h-3" /> Dados a confirmar
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-background/90 text-[11px] font-medium">{r.cuisine}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-lg leading-tight mb-1">{r.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-sun text-sun" /> <strong className="text-foreground">{r.rating}</strong></span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{r.area}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{r.description}</p>
                <Button variant="outline" size="sm" className="w-full">Ver detalhes</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Disclaimer />
    </>
  );
};

export default OndeComer;

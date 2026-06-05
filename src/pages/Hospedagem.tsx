import { useMemo, useState } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { lodgings } from "@/data/listings";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";
import DbListingSection from "@/components/DbListingSection";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const FAQS = [
  { question: "Quais as melhores pousadas em Ilha Grande?", answer: "As melhores pousadas ficam na Vila do Abraão (mais movimentada), Araçatiba e Provetá. A Estação Ilha Grande lista pousadas, hotéis e hostels verificados com fotos, contato e localização." },
  { question: "Onde ficar em Ilha Grande pela primeira vez?", answer: "Para a primeira viagem, hospede-se na Vila do Abraão: concentra restaurantes, agências de passeios e o cais de chegada das barcas." },
  { question: "Tem hotel barato em Ilha Grande?", answer: "Sim — há hostels e pousadas econômicas a partir de cerca de R$ 80 por pessoa, principalmente fora da alta temporada." },
  { question: "É possível pagar pousada em Ilha Grande no PIX?", answer: "A maioria das pousadas aceita PIX, cartão e dinheiro. Confirme sempre direto com o anunciante via WhatsApp." },
];

const Hospedagem = () => {
  const [q, setQ] = useState("");
  const list = useMemo(
    () => lodgings.filter(l => (l.name + " " + l.area + " " + l.tags.join(" ")).toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <>
      <SEO
        title="Onde ficar em Ilha Grande: pousadas, hotéis e hostels"
        description="Guia completo de hospedagem em Ilha Grande RJ: pousadas no Abraão, Araçatiba, Provetá, hotéis frente mar, hostels econômicos e camping. Compare e reserve direto."
        path="/pousadas-em-ilha-grande"
        keywords="pousadas em ilha grande, hospedagem em ilha grande, onde ficar em ilha grande, hotel em ilha grande, hostel em ilha grande, pousada em abraão"
        breadcrumbs={[{ name: "Onde ficar em Ilha Grande", path: "/pousadas-em-ilha-grande" }]}
        faqs={FAQS}
      />
      <Breadcrumbs items={[{ name: "Onde ficar em Ilha Grande", path: "/pousadas-em-ilha-grande" }]} />

      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary py-12">
        <div className="container">
          <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Onde se hospedar</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            20 opções de pousadas, hostels e flats em Ilha Grande — de econômicos a boutique.
          </p>
          <div className="max-w-xl bg-card rounded-2xl p-2 flex gap-2 shadow-soft border border-border">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="Buscar por nome, bairro ou estilo..."
                className="w-full bg-transparent outline-none py-2.5 text-sm" />
            </div>
          </div>
        </div>
      </section>

      <DbListingSection category="hospedagem" subtitle="Pousadas, hotéis e hostels cadastrados" />

      <section className="container py-10">
        <h2 className="font-display font-black text-2xl md:text-3xl mb-6">Outras opções na ilha</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map(l => (
            <article key={l.id} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-smooth border border-border/60 flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={l.image} alt={l.name} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-lg leading-tight mb-1">{l.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-sun text-sun" /> <strong className="text-foreground">{l.rating}</strong></span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{l.area}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">{l.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {l.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">{t}</span>
                  ))}
                </div>
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

export default Hospedagem;

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
  { question: "Quais as melhores pousadas em Ilha Grande?", answer: "As melhores pousadas ficam na Vila do Abraão (mais movimentada), Araçatiba e Provetá. A Estação Ilha Grande lista pousadas, hotéis e hostels verificados com fotos, contato e localização." },
  { question: "Onde ficar em Ilha Grande pela primeira vez?", answer: "Para a primeira viagem, hospede-se na Vila do Abraão: concentra restaurantes, agências de passeios e o cais de chegada das barcas." },
  { question: "Tem hotel barato em Ilha Grande?", answer: "Sim — há hostels e pousadas econômicas a partir de cerca de R$ 80 por pessoa, principalmente fora da alta temporada." },
  { question: "É possível pagar pousada em Ilha Grande no PIX?", answer: "A maioria das pousadas aceita PIX, cartão e dinheiro. Confirme sempre direto com o anunciante via WhatsApp." },
];

const Hospedagem = () => {
  const [q, setQ] = useState("");
  const all = STATIC_ITEMS["onde-se-hospedar"];
  const visible = useMemo(() => {
    const term = q.toLowerCase();
    return all
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) =>
        (item.name + " " + (item.location || "") + " " + (item.bullets || []).join(" "))
          .toLowerCase()
          .includes(term)
      );
  }, [q, all]);

  return (
    <>
      <SEO
        title="Onde ficar em Ilha Grande: pousadas, hotéis e hostels"
        description="Guia completo de hospedagem em Ilha Grande RJ: pousadas no Abraão, Araçatiba, Provetá, hotéis frente mar, hostels econômicos e camping. Compare e reserve direto."
        path="/onde-se-hospedar"
        keywords="pousadas em ilha grande, hospedagem em ilha grande, onde ficar em ilha grande, hotel em ilha grande, hostel em ilha grande, pousada em abraão"
        breadcrumbs={[{ name: "Onde se hospedar em Ilha Grande", path: "/onde-se-hospedar" }]}
        faqs={FAQS}
      />
      <Breadcrumbs items={[{ name: "Onde se hospedar", path: "/onde-se-hospedar" }]} />

      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary py-12">
        <div className="container">
          <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Onde se hospedar</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Pousadas, hostels e flats em Ilha Grande — do econômico ao boutique.
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
        <h2 className="font-display font-black text-2xl md:text-3xl mb-6">Hospedagens recomendadas</h2>
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

export default Hospedagem;

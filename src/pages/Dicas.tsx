import { tips } from "@/data/mockData";
import Disclaimer from "@/components/Disclaimer";

const Dicas = () => (
  <>
    <div className="container py-10">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Dicas essenciais</h1>
        <p className="text-muted-foreground text-lg">Tudo que você precisa saber antes da viagem.</p>
      </header>
      <div className="grid md:grid-cols-2 gap-5">
        {tips.map(t => (
          <article key={t.title} className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-card transition-smooth">
            <div className="text-4xl mb-3">{t.icon}</div>
            <h2 className="font-display font-bold text-2xl mb-2">{t.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.content}</p>
          </article>
        ))}
      </div>
    </div>
    <Disclaimer />
  </>
);

export default Dicas;

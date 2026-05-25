import { roteiros } from "@/data/mockData";
import { Clock, Sparkles } from "lucide-react";

const Roteiros = () => (
  <div className="container py-10">
    <header className="mb-10 max-w-2xl animate-fade-up">
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Roteiros prontos</h1>
      <p className="text-muted-foreground text-lg">Escolha o roteiro que combina com você e aproveite sem dor de cabeça.</p>
    </header>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {roteiros.map((r, i) => (
        <article key={r.id}
          className="group rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs font-medium">
              <Clock className="w-3 h-3" /> {r.duration}
            </span>
            <span className="text-xs font-medium text-primary">{r.style}</span>
          </div>
          <h2 className="font-display font-bold text-2xl mb-1">{r.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{r.subtitle}</p>
          <ol className="space-y-2 flex-1">
            {r.steps.map((s, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-bold ${i % 3 === 0 ? "gradient-ocean text-primary-foreground" : i % 3 === 1 ? "gradient-sunset text-accent-foreground" : "gradient-forest text-forest-foreground"}`}>
                  {idx + 1}
                </span>
                <span className="text-foreground/85">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-4 border-t border-border flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-sun" /> Personalize com um guia local
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default Roteiros;

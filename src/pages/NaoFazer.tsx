import { naoFazer } from "@/data/mockData";
import { AlertTriangle, X } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

const NaoFazer = () => (
  <>
  <div className="container py-10">
    <header className="mb-10 max-w-2xl">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold mb-4">
        <AlertTriangle className="w-3.5 h-3.5" /> Alertas importantes
      </div>
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">O que <span className="text-destructive">não</span> fazer</h1>
      <p className="text-muted-foreground text-lg">Para curtir Ilha Grande sem perrengue e preservar o paraíso.</p>
    </header>
    <div className="grid md:grid-cols-2 gap-4">
      {naoFazer.map(n => (
        <article key={n.title} className="rounded-3xl bg-card border-l-4 border-destructive border-y border-r border-border p-6 shadow-soft">
          <div className="flex gap-3 items-start">
            <span className="shrink-0 w-9 h-9 rounded-full bg-destructive/10 grid place-items-center text-destructive">
              <X className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-bold text-xl mb-1">{n.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{n.description}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
  <Disclaimer />
  </>
);

export default NaoFazer;

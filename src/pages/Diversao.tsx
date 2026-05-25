import { Sparkles, Clock } from "lucide-react";
import { funSpots } from "@/data/listings";
import Disclaimer from "@/components/Disclaimer";

const Diversao = () => (
  <>
    <section className="gradient-sunset text-accent-foreground py-14">
      <div className="container">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-background/20 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Noite & entretenimento
        </span>
        <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Diversão em Ilha Grande</h1>
        <p className="text-accent-foreground/90 max-w-2xl">
          Onde curtir a noite, programas românticos, eventos sazonais e os melhores momentos da Vila.
        </p>
      </div>
    </section>

    <section className="container py-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {funSpots.map(f => (
          <article key={f.id} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-smooth border border-border/60 flex flex-col">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={f.image} alt={f.name} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{f.type}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="w-3 h-3" /> {f.when}</span>
              </div>
              <h3 className="font-display font-bold text-xl leading-tight mb-2">{f.name}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
    <Disclaimer />
  </>
);

export default Diversao;

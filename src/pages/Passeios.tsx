import { Clock, DollarSign, Ship, MapPin, AlertTriangle } from "lucide-react";
import { boatTours } from "@/data/listings";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";

const Passeios = () => (
  <>
    <section className="gradient-ocean text-primary-foreground py-14">
      <div className="container">
        <span className="inline-block px-3 py-1 rounded-full bg-background/15 text-xs font-medium mb-3">Mar & Aventura</span>
        <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Passeios de barco</h1>
        <p className="text-primary-foreground/90 max-w-2xl">
          As principais opções de escuna e lancha para explorar a costa de Ilha Grande e a baía de Angra.
        </p>
      </div>
    </section>

    <section className="container py-10">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {boatTours.map(t => (
          <article key={t.id} className="bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-smooth border border-border/60 flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={t.image} alt={t.name} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent" />
              <h3 className="absolute bottom-3 left-4 right-4 font-display font-bold text-2xl text-primary-foreground">{t.name}</h3>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="rounded-xl bg-secondary p-2.5 text-center">
                  <Clock className="w-4 h-4 mx-auto text-primary mb-1" />
                  <div className="text-[10px] uppercase text-muted-foreground">Duração</div>
                  <div className="text-xs font-semibold">{t.duration}</div>
                </div>
                <div className="rounded-xl bg-secondary p-2.5 text-center">
                  <DollarSign className="w-4 h-4 mx-auto text-forest mb-1" />
                  <div className="text-[10px] uppercase text-muted-foreground">Preço médio</div>
                  <div className="text-xs font-semibold leading-tight">{t.avgPrice}</div>
                </div>
                <div className="rounded-xl bg-secondary p-2.5 text-center">
                  <Ship className="w-4 h-4 mx-auto text-accent mb-1" />
                  <div className="text-[10px] uppercase text-muted-foreground">Embarcação</div>
                  <div className="text-xs font-semibold leading-tight">{t.boat}</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{t.highlight}</p>

              <div className="mb-3">
                <div className="flex items-center gap-1 text-xs font-semibold mb-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> Pontos visitados</div>
                <div className="flex flex-wrap gap-1">
                  {t.stops.map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-sun/15 border border-sun/40 p-3 mb-4">
                <AlertTriangle className="w-4 h-4 text-sun-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-foreground/80">{t.alert}</p>
              </div>

              <Button variant="hero" size="sm" className="w-full mt-auto">Quero esse passeio</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
    <Disclaimer />
  </>
);

export default Passeios;

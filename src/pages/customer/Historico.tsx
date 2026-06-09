import { Clock } from "lucide-react";

export default function CustomerHistorico() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-xl">Histórico</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Em breve você verá aqui os lugares que visitou recentemente, suas avaliações e interações.
      </p>
    </div>
  );
}

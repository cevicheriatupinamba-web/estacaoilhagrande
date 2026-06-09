import PageHeader from "@/components/admin/PageHeader";
import { LucideIcon } from "lucide-react";

export default function ComingSoon({ title, subtitle, icon: Icon, items }: { title: string; subtitle: string; icon: LucideIcon; items: string[] }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-amber-500/5 border border-border p-8 md:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border grid place-items-center mx-auto mb-4 shadow-sm">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">Em construção</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
          Este módulo faz parte das próximas fases do roadmap do centro de comando.
        </p>
        <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-4 text-left">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Próximas entregas</div>
          <ul className="text-sm space-y-1.5">
            {items.map(i => <li key={i} className="flex gap-2"><span className="text-primary">→</span>{i}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

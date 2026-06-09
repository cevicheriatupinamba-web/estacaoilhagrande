import { LucideIcon, Sparkles } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  items?: string[];
}

export default function AdvertiserComingSoon({ title, subtitle, icon: Icon, items = [] }: Props) {
  return (
    <div className="max-w-3xl">
      <div className="rounded-3xl border border-border bg-card p-10 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 grid place-items-center text-white">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3 h-3" /> Em breve
        </div>
        {items.length > 0 && (
          <ul className="space-y-2 text-sm text-foreground/80">
            {items.map(i => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

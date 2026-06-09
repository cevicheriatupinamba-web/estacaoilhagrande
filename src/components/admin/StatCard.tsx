import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  trend?: number;
  accent?: "primary" | "emerald" | "amber" | "rose" | "sky" | "violet";
}

const ACCENT = {
  primary: "from-primary/15 to-primary/5 text-primary",
  emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
  amber:   "from-amber-500/15 to-amber-500/5 text-amber-600",
  rose:    "from-rose-500/15 to-rose-500/5 text-rose-600",
  sky:     "from-sky-500/15 to-sky-500/5 text-sky-600",
  violet:  "from-violet-500/15 to-violet-500/5 text-violet-600",
};

export default function StatCard({ label, value, hint, icon: Icon, trend, accent = "primary" }: Props) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
          <div className="font-display font-bold text-3xl mt-1.5">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        {Icon && (
          <div className={cn("w-11 h-11 rounded-xl grid place-items-center bg-gradient-to-br", ACCENT[accent])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {typeof trend === "number" && (
        <div className={cn("mt-3 text-xs font-semibold", trend >= 0 ? "text-emerald-600" : "text-rose-600")}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          <span className="text-muted-foreground font-normal"> vs período anterior</span>
        </div>
      )}
    </div>
  );
}

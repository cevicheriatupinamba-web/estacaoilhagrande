import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENCY_WHATSAPP_DEFAULT } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function SubscriptionBanner() {
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.rpc("get_advertiser_financials" as any);
      const subs = (data as any)?.subscriptions ?? [];
      // Pick the most urgent (lowest days_remaining or expired)
      const sorted = [...subs].sort((a, b) => (a.days_remaining ?? 9999) - (b.days_remaining ?? 9999));
      setData(sorted[0] ?? null);
    })();
  }, [user]);

  if (!user || dismissed || !data) return null;

  const days = Number(data.days_remaining ?? 0);
  const status = data.status as string;
  // Only show when <= 7 days, expired or pending
  const expired = days <= 0 && status !== "cancelled";
  const warning = days > 0 && days <= 7;
  const pending = status === "pending";
  if (!expired && !warning && !pending) return null;

  const tone = expired ? "rose" : warning ? "amber" : "sky";
  const title = expired
    ? "Sua assinatura venceu"
    : warning
      ? `Sua assinatura vence em ${days} dia${days === 1 ? "" : "s"}`
      : "Pagamento pendente";

  const subtitle = expired
    ? `Seu anúncio "${data.listing_name ?? ""}" foi pausado. Renove para voltar a aparecer.`
    : warning
      ? `Garanta a renovação para continuar com o plano ${String(data.plan ?? "").toUpperCase()} ativo.`
      : `Confirme o pagamento da assinatura para evitar interrupções.`;

  const msg = encodeURIComponent(
    `Olá! Sou ${user.email} e quero ${expired ? "renovar" : "confirmar o pagamento da"} minha assinatura ${
      data.listing_name ? `do anúncio "${data.listing_name}"` : ""
    } na Estação Ilha Grande.`,
  );
  const waUrl = `https://wa.me/${AGENCY_WHATSAPP_DEFAULT}?text=${msg}`;

  const toneCls: Record<string, string> = {
    rose:  "bg-rose-50 border-rose-300 text-rose-900",
    amber: "bg-amber-50 border-amber-300 text-amber-900",
    sky:   "bg-sky-50 border-sky-300 text-sky-900",
  };
  const iconCls: Record<string, string> = {
    rose: "text-rose-600",
    amber: "text-amber-600",
    sky: "text-sky-600",
  };

  return (
    <div className={cn("rounded-2xl border px-4 py-3 mb-4 flex items-start gap-3 shadow-sm", toneCls[tone])}>
      <AlertTriangle className={cn("w-5 h-5 mt-0.5 shrink-0", iconCls[tone])} />
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm">{title}</div>
        <div className="text-xs opacity-90 mt-0.5">{subtitle}</div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <Button asChild size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs">
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link to="/financeiro">Ver detalhes</Link>
        </Button>
        <button onClick={() => setDismissed(true)} aria-label="Fechar"
          className="h-8 w-8 grid place-items-center rounded-md hover:bg-black/5">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

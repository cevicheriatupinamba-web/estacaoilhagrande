import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { trackListingEvent } from "@/lib/advertiser/tracking";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100),
  contact: z.string().trim().min(8, "Telefone inválido").max(30),
  when: z.string().trim().max(60).optional().or(z.literal("")),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  number: string;
  message: string;
  /** When set, click is tracked as a WhatsApp conversion for the listing */
  listingId?: string | null;
  /** Used to identify the lead in lead_requests */
  context: { kind: "listing" | "agency"; label: string; category?: string | null };
}

export default function WhatsAppLeadModal({
  open, onOpenChange, number, message, listingId, context,
}: Props) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [when, setWhen] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!open) { setName(""); setContact(""); setWhen(""); } }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, contact, when });
    if (!parsed.success) {
      toast({
        title: "Verifique os campos",
        description: parsed.error.errors[0]?.message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const fullMessage = `${message}\n\nNome: ${name}\nContato: ${contact}${when ? `\nQuando: ${when}` : ""}`;
      const url = buildWhatsappUrl(number, fullMessage);

      // Save lead (non-blocking on errors)
      try {
        await supabase.from("lead_requests").insert({
          name,
          phone: contact,
          message: when ? `Quando: ${when}` : null,
          category: context.category ?? (context.kind === "agency" ? "agencia" : null),
          listing_id: listingId ?? null,
          source: context.kind === "agency" ? "whatsapp_agency" : "whatsapp_listing",
        } as any);
      } catch { /* ignore */ }

      if (listingId) trackListingEvent(listingId, "whatsapp");

      window.open(url, "_blank", "noopener,noreferrer");
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            Falar no WhatsApp
          </DialogTitle>
          <DialogDescription>
            Antes de abrir o WhatsApp, deixe seu contato — assim a{" "}
            {context.kind === "agency" ? "Agência Oficial" : context.label} consegue te responder mais rápido.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="lead-name">Seu nome *</Label>
            <Input id="lead-name" required value={name} onChange={e => setName(e.target.value)} maxLength={100} />
          </div>
          <div>
            <Label htmlFor="lead-contact">Telefone / WhatsApp *</Label>
            <Input id="lead-contact" required value={contact} onChange={e => setContact(e.target.value)}
              placeholder="(21) 99999-9999" maxLength={30} />
          </div>
          <div>
            <Label htmlFor="lead-when">Quando pretende ir? <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Input id="lead-when" value={when} onChange={e => setWhen(e.target.value)} placeholder="Ex.: 12 a 16 de janeiro" maxLength={60} />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MessageCircle className="w-4 h-4 mr-2" />}
            Abrir conversa no WhatsApp
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Seus dados são usados apenas para esta solicitação.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

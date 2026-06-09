import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ROLE_LABEL, ROLE_COLOR, AppRole } from "@/lib/admin/permissions";
import { Copy, Trash2, Plus, MessageCircle, Link2 } from "lucide-react";

interface Invite {
  id: string;
  token: string;
  email: string;
  role: AppRole;
  status: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

const ASSIGNABLE: AppRole[] = ["admin", "financial_manager", "content_manager", "support_agent", "advertiser"];

export default function Invites() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("advertiser");
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("invites").select("*").order("created_at", { ascending: false }).limit(200);
    setRows((data as Invite[]) ?? []);
    setLoading(false);
  }

  function inviteUrl(token: string) {
    return `${window.location.origin}/invite/${token}`;
  }

  async function create() {
    if (!email.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("create_invite", {
      _email: email.trim().toLowerCase(),
      _role: role,
      _days: days,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    const inv = (data as any[])?.[0];
    if (inv?.token) {
      await navigator.clipboard.writeText(inviteUrl(inv.token));
      toast({ title: "Convite criado", description: "Link copiado para a área de transferência" });
    }
    setEmail("");
    load();
  }

  async function cancel(id: string) {
    if (!confirm("Cancelar este convite?")) return;
    const { error } = await supabase.from("invites").update({ status: "cancelled" }).eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Convite cancelado" }); load(); }
  }

  async function copy(token: string) {
    await navigator.clipboard.writeText(inviteUrl(token));
    toast({ title: "Link copiado" });
  }

  function whatsapp(invite: Invite) {
    const msg = `Olá! Você foi convidado(a) para acessar a Estação Ilha Grande como ${ROLE_LABEL[invite.role]}.\n\nAceite seu convite: ${inviteUrl(invite.token)}\n\nEste link expira em ${new Date(invite.expires_at).toLocaleDateString("pt-BR")}.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      accepted: "bg-emerald-100 text-emerald-800",
      expired: "bg-slate-200 text-slate-700",
      cancelled: "bg-rose-100 text-rose-800",
    };
    const label: Record<string, string> = {
      pending: "Pendente", accepted: "Aceito", expired: "Expirado", cancelled: "Cancelado",
    };
    return <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${map[s] ?? "bg-muted"}`}>{label[s] ?? s}</span>;
  };

  return (
    <div>
      <PageHeader title="Convites" subtitle="Envie convites para novos membros entrarem na plataforma com o papel correto" />

      <div className="rounded-2xl bg-card border border-border p-5 mb-6">
        <div className="grid sm:grid-cols-[1fr_180px_180px_auto] gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">E-mail do convidado</label>
            <Input type="email" placeholder="email@dominio.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Cargo / Papel</label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={role} onChange={e => setRole(e.target.value as AppRole)}>
              {ASSIGNABLE.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5" title="Defina por quantos dias o convite permanecerá válido.">
              Dias para expiração ⓘ
            </label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={days} onChange={e => setDays(parseInt(e.target.value) || 7)}>
              <option value={1}>1 dia</option>
              <option value={3}>3 dias</option>
              <option value={7}>7 dias (padrão)</option>
              <option value={15}>15 dias</option>
              <option value={30}>30 dias</option>
              <option value={60}>60 dias</option>
            </select>
          </div>
          <Button onClick={create} disabled={busy} className="h-10"><Plus className="w-4 h-4 mr-1" />Criar convite</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          O convidado não precisa estar cadastrado. Ele recebe um link único, cria a conta e o papel é aplicado automaticamente. O convite expirará após o período definido.
        </p>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 bg-muted/40 text-xs uppercase tracking-wide font-semibold text-muted-foreground grid grid-cols-12 gap-2">
          <div className="col-span-4">E-mail</div>
          <div className="col-span-2">Papel</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Expira</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>
        <div className="divide-y divide-border">
          {loading && <div className="p-8 text-center text-muted-foreground text-sm">Carregando…</div>}
          {!loading && rows.map(r => (
            <div key={r.id} className="px-5 py-3 grid grid-cols-12 gap-2 items-center text-sm">
              <div className="col-span-4 truncate font-medium">{r.email}</div>
              <div className="col-span-2">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${ROLE_COLOR[r.role]}`}>{ROLE_LABEL[r.role]}</span>
              </div>
              <div className="col-span-2">{statusBadge(r.status)}</div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {new Date(r.expires_at).toLocaleDateString("pt-BR")}
              </div>
              <div className="col-span-2 flex justify-end gap-1">
                {r.status === "pending" && (
                  <>
                    <Button size="sm" variant="ghost" title="Copiar link" onClick={() => copy(r.token)}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" title="WhatsApp" onClick={() => whatsapp(r)}>
                      <MessageCircle className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Abrir" onClick={() => window.open(inviteUrl(r.token), "_blank")}>
                      <Link2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-rose-600" title="Cancelar" onClick={() => cancel(r.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!loading && rows.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-sm">Nenhum convite criado ainda.</div>
          )}
        </div>
      </div>
    </div>
  );
}

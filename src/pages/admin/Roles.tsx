import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ROLE_LABEL, ROLE_COLOR, AppRole, STAFF_ROLES } from "@/lib/admin/permissions";
import { Trash2, Plus, ShieldCheck } from "lucide-react";
import { logActivity } from "@/lib/admin/activity";
import { useAuth } from "@/context/AuthContext";

interface Row {
  role_id: string;
  user_id: string;
  email: string;
  name: string;
  role: AppRole;
  created_at: string;
}

const ASSIGNABLE: AppRole[] = ["admin", "financial_manager", "content_manager", "support_agent", "advertiser"];

export default function Roles() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("advertiser");
  const [busy, setBusy] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_users_with_roles");
    if (error) toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  async function add() {
    if (!email.trim()) return;
    setBusy(true);
    try {
      const { data: uid, error: e1 } = await supabase.rpc("find_user_id_by_email", { _email: email.trim().toLowerCase() });
      if (e1) throw e1;
      if (!uid) {
        toast({ title: "Usuário não encontrado", description: "Peça que ele faça login uma vez antes de receber permissão.", variant: "destructive" });
        return;
      }
      if (role === "super_admin" && !hasRole("super_admin")) {
        toast({ title: "Apenas Super Admins podem atribuir Super Admin", variant: "destructive" });
        return;
      }
      const { error: e2 } = await supabase.from("user_roles").insert({ user_id: uid as string, role });
      if (e2) {
        if (e2.code === "23505") toast({ title: "Esse usuário já possui esse papel" });
        else throw e2;
      } else {
        await logActivity({ action: "role.add", resource_id: uid as string });
        toast({ title: "Permissão concedida" });
        setEmail("");
        load();
      }
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, userRole: AppRole, userName: string) {
    if (userRole === "super_admin" && !hasRole("super_admin")) {
      toast({ title: "Sem permissão", variant: "destructive" });
      return;
    }
    if (!confirm(`Remover o papel ${ROLE_LABEL[userRole]} de ${userName}?`)) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      await logActivity({ action: "role.remove", resource_id: id });
      toast({ title: "Permissão removida" });
      load();
    }
  }

  return (
    <div>
      <PageHeader title="Permissões" subtitle="Controle de papéis da equipe e dos anunciantes" />

      {/* Atribuir */}
      <div className="rounded-2xl bg-card border border-border p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Atribuir permissão</h3>
        </div>
        <div className="grid sm:grid-cols-[1fr_220px_auto] gap-2">
          <Input type="email" placeholder="email@dominio.com" value={email} onChange={e => setEmail(e.target.value)} />
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={role} onChange={e => setRole(e.target.value as AppRole)}>
            {ASSIGNABLE.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            {hasRole("super_admin") && <option value="super_admin">{ROLE_LABEL.super_admin}</option>}
          </select>
          <Button onClick={add} disabled={busy}><Plus className="w-4 h-4 mr-1" />Conceder</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          O usuário precisa ter feito login pelo menos uma vez para aparecer na busca.
        </p>
      </div>

      {/* Lista */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 bg-muted/40 text-xs uppercase tracking-wide font-semibold text-muted-foreground grid grid-cols-12 gap-2">
          <div className="col-span-4">Usuário</div>
          <div className="col-span-3">Cargo</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Desde</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>
        <div className="divide-y divide-border">
          {loading && <div className="p-8 text-center text-muted-foreground text-sm">Carregando…</div>}
          {!loading && rows.map(r => (
            <div key={r.role_id} className="px-5 py-3 grid grid-cols-12 gap-2 items-center text-sm">
              <div className="col-span-4 min-w-0">
                <div className="font-semibold truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">{r.email}</div>
              </div>
              <div className="col-span-3">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${ROLE_COLOR[r.role]}`}>{ROLE_LABEL[r.role]}</span>
              </div>
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ativo
                </span>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</div>
              <div className="col-span-1 text-right">
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => remove(r.role_id, r.role, r.name)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {!loading && rows.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">Nenhum papel atribuído ainda.</div>}
        </div>
      </div>
    </div>
  );
}

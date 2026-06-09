import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ROLE_LABEL, ROLE_COLOR, AppRole, STAFF_ROLES } from "@/lib/admin/permissions";
import { Trash2, Plus } from "lucide-react";
import { logActivity } from "@/lib/admin/activity";
import { useAuth } from "@/context/AuthContext";

interface Row { id: string; user_id: string; role: AppRole; created_at: string }

const ASSIGNABLE: AppRole[] = ["admin", "financial_manager", "content_manager", "support_agent"];

export default function Roles() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("admin");

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  }

  async function add() {
    if (!email) return;
    // Look up user by calling auth metadata view via RPC isn't available — we rely on user_id being submitted directly.
    toast({ title: "Atribuição por e-mail", description: "Edição direta da tabela user_roles requer o user_id. Use o painel do banco ou peça ao usuário para fazer login primeiro." });
  }

  async function remove(id: string, userRole: AppRole) {
    if (userRole === "super_admin" && !hasRole("super_admin")) {
      toast({ title: "Sem permissão", variant: "destructive" }); return;
    }
    if (!confirm("Remover este papel?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { await logActivity({ action: "role.remove", resource_id: id }); load(); }
  }

  return (
    <div>
      <PageHeader title="Permissões" subtitle="Controle de papéis da equipe" />

      <div className="rounded-2xl bg-card border border-border p-5 mb-6">
        <h3 className="font-semibold mb-3">Papéis disponíveis</h3>
        <div className="flex flex-wrap gap-2">
          {STAFF_ROLES.map(r => (
            <span key={r} className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase ${ROLE_COLOR[r]}`}>{ROLE_LABEL[r]}</span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Para promover um usuário, peça que ele faça login pelo menos uma vez. Em seguida, contate o Super Admin que pode atribuir o papel diretamente no banco de dados (tabela <code>user_roles</code>).
        </p>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 bg-muted/40 text-xs uppercase tracking-wide font-semibold text-muted-foreground grid grid-cols-12 gap-2">
          <div className="col-span-6">Usuário (ID)</div>
          <div className="col-span-3">Papel</div>
          <div className="col-span-2">Desde</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>
        <div className="divide-y divide-border">
          {rows.map(r => (
            <div key={r.id} className="px-5 py-3 grid grid-cols-12 gap-2 items-center text-sm">
              <div className="col-span-6 font-mono text-xs truncate">{r.user_id}</div>
              <div className="col-span-3">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${ROLE_COLOR[r.role]}`}>{ROLE_LABEL[r.role]}</span>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</div>
              <div className="col-span-1 text-right">
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => remove(r.id, r.role)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">Nenhum papel atribuído.</div>}
        </div>
      </div>
    </div>
  );
}

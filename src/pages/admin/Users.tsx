import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { ROLE_LABEL, ROLE_COLOR, AppRole } from "@/lib/admin/permissions";
import { useAuth } from "@/context/AuthContext";
import { UserPlus, Trash2 } from "lucide-react";

interface Row {
  role_id: string;
  user_id: string;
  email: string;
  name: string;
  role: AppRole;
  created_at: string;
}

const ASSIGNABLE: AppRole[] = ["admin", "financial_manager", "content_manager", "support_agent", "advertiser", "user"];

export default function Users() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [role, setRole] = useState<AppRole>("advertiser");
  const [busy, setBusy] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.rpc("get_users_with_roles");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast({ title: "Senha mínima de 6 caracteres", variant: "destructive" });
    if (pw !== pw2) return toast({ title: "As senhas não coincidem", variant: "destructive" });
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { name, email: email.trim().toLowerCase(), password: pw, role },
    });
    setBusy(false);
    if (error || (data as any)?.error) {
      toast({ title: "Erro", description: (data as any)?.error ?? error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Usuário criado com sucesso" });
    setName(""); setEmail(""); setPw(""); setPw2(""); setRole("advertiser");
    load();
  }

  async function remove(id: string, who: string, r: AppRole) {
    if (r === "super_admin" && !hasRole("super_admin")) {
      return toast({ title: "Sem permissão", variant: "destructive" });
    }
    if (!confirm(`Remover papel ${ROLE_LABEL[r]} de ${who}?`)) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Papel removido" }); load(); }
  }

  return (
    <div>
      <PageHeader title="Usuários" subtitle="Crie usuários manualmente e gerencie os existentes" />

      <form onSubmit={create} className="rounded-2xl bg-card border border-border p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Criar usuário manualmente</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="u-name">Nome completo</Label>
            <Input id="u-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="u-email">E-mail</Label>
            <Input id="u-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="u-pw">Senha</Label>
            <PasswordInput id="u-pw" value={pw} onChange={e => setPw(e.target.value)} required minLength={6} />
          </div>
          <div>
            <Label htmlFor="u-pw2">Confirmar senha</Label>
            <PasswordInput id="u-pw2" value={pw2} onChange={e => setPw2(e.target.value)} required minLength={6} />
          </div>
          <div>
            <Label htmlFor="u-role">Papel</Label>
            <select id="u-role" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={role} onChange={e => setRole(e.target.value as AppRole)}>
              {ASSIGNABLE.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              {hasRole("super_admin") && <option value="super_admin">{ROLE_LABEL.super_admin}</option>}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={busy} className="w-full"><UserPlus className="w-4 h-4 mr-1" /> Criar usuário</Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          O usuário será criado com e-mail confirmado e poderá entrar imediatamente.
        </p>
      </form>

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
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => remove(r.role_id, r.name, r.role)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {!loading && rows.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">Nenhum usuário com papel atribuído.</div>}
        </div>
      </div>
    </div>
  );
}

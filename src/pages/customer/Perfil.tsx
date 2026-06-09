import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface Profile {
  name: string | null;
  whatsapp: string | null;
  city: string | null;
  country: string | null;
  language: string | null;
}

const EMPTY: Profile = { name: "", whatsapp: "", city: "", country: "BR", language: "pt-BR" };

export default function CustomerPerfil() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [p, setP] = useState<Profile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("name, whatsapp, city, country, language").eq("user_id", user!.id).maybeSingle();
    setP(data ?? { ...EMPTY, name: (user!.user_metadata?.name as string) ?? "" });
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ user_id: user!.id, ...p }, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    else toast({ title: "Perfil atualizado" });
  }

  if (loading) return <div className="text-muted-foreground text-sm">Carregando…</div>;

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
      <h2 className="font-display font-bold text-xl mb-1">Dados pessoais</h2>
      <p className="text-sm text-muted-foreground mb-5">Usamos seus dados para personalizar a experiência. Nada disso é exibido publicamente.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Nome</Label>
          <Input value={p.name ?? ""} onChange={e => setP({ ...p, name: e.target.value })} placeholder="Seu nome" />
        </div>
        <div>
          <Label>E-mail</Label>
          <Input value={user?.email ?? ""} disabled />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input value={p.whatsapp ?? ""} onChange={e => setP({ ...p, whatsapp: e.target.value })} placeholder="+55 24 9 9999-9999" />
        </div>
        <div>
          <Label>Cidade</Label>
          <Input value={p.city ?? ""} onChange={e => setP({ ...p, city: e.target.value })} placeholder="Sua cidade" />
        </div>
        <div>
          <Label>País</Label>
          <Input value={p.country ?? ""} onChange={e => setP({ ...p, country: e.target.value })} placeholder="BR" />
        </div>
        <div>
          <Label>Idioma</Label>
          <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={p.language ?? "pt-BR"} onChange={e => setP({ ...p, language: e.target.value })}>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} variant="hero">
          <Save className="w-4 h-4 mr-1" /> {saving ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}

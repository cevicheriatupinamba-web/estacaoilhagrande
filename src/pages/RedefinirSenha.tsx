import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import logoAsset from "@/assets/logo-estacao-ilha-grande.png.asset.json";

export default function RedefinirSenha() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase places a recovery session via URL hash; onAuthStateChange picks it up
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setReady(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast({ title: "Senha muito curta (mínimo 6 caracteres)", variant: "destructive" });
    if (pw !== pw2) return toast({ title: "As senhas não coincidem", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Senha redefinida com sucesso" });
    nav("/", { replace: true });
  }

  return (
    <>
      <SEO title="Redefinir senha — Estação Ilha Grande" description="Defina uma nova senha." path="/redefinir-senha" noIndex />
      <div className="min-h-[80vh] grid place-items-center px-5 py-10">
        <div className="w-full max-w-md bg-card rounded-3xl border border-border p-8 shadow-card animate-fade-up">
          <div className="text-center mb-6">
            <img src={logoAsset.url} alt="" className="w-16 h-16 object-contain mx-auto mb-3" />
            <h1 className="font-display font-bold text-3xl">Nova senha</h1>
            <p className="text-muted-foreground text-sm mt-1">Defina sua nova senha de acesso.</p>
          </div>

          {!ready ? (
            <p className="text-sm text-muted-foreground text-center">
              Validando link de recuperação… Se você abriu este link diretamente, solicite um novo em "Esqueci minha senha".
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="pw">Nova senha</Label>
                <PasswordInput id="pw" required minLength={6} value={pw} onChange={e => setPw(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pw2">Confirmar senha</Label>
                <PasswordInput id="pw2" required minLength={6} value={pw2} onChange={e => setPw2(e.target.value)} />
              </div>
              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={busy}>
                {busy ? "Salvando…" : "Salvar nova senha"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

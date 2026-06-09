import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import logoAsset from "@/assets/logo-estacao-ilha-grande.png.asset.json";
import { Home, MailCheck } from "lucide-react";

export default function EsqueciSenha() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Não foi possível enviar", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
  }

  return (
    <>
      <SEO title="Esqueci minha senha — Estação Ilha Grande" description="Recupere o acesso à sua conta." path="/esqueci-senha" noIndex />
      <div className="min-h-[80vh] grid place-items-center px-5 py-10">
        <div className="w-full max-w-md bg-card rounded-3xl border border-border p-8 shadow-card animate-fade-up">
          <div className="text-center mb-6">
            <img src={logoAsset.url} alt="Estação Ilha Grande" className="w-16 h-16 object-contain mx-auto mb-3" />
            <h1 className="font-display font-bold text-3xl">Esqueci minha senha</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enviaremos um link para redefinir sua senha.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 grid place-items-center">
                <MailCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-sm">
                Enviamos um e-mail para <strong>{email}</strong> com instruções para redefinir sua senha.
              </p>
              <p className="text-xs text-muted-foreground">Verifique também sua caixa de spam.</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Voltar para o login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail da sua conta</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" />
              </div>
              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={busy}>
                {busy ? "Enviando…" : "Enviar link de redefinição"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Lembrou a senha? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
              </p>
            </form>
          )}

          <div className="text-center mt-4">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
              <Home className="w-3.5 h-3.5" /> Voltar para a Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

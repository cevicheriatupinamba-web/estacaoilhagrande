import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props { mode: "login" | "signup" }

const AuthForm = ({ mode }: Props) => {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = mode === "login"
      ? await login(form.email, form.password)
      : await signup(form.name, form.email, form.password);
    setSubmitting(false);
    if (error) {
      toast({ title: "Não foi possível continuar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: mode === "login" ? "Bem-vindo!" : "Conta criada!" });
    nav("/");
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-5 py-10">
      <div className="w-full max-w-md bg-card rounded-3xl border border-border p-8 shadow-card animate-fade-up">
        <div className="text-center mb-6">
          <div className="inline-grid place-items-center w-12 h-12 rounded-2xl gradient-ocean text-primary-foreground mb-3 shadow-glow">
            <Waves className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-3xl">{mode === "login" ? "Bem-vindo de volta" : "Criar conta"}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" ? "Entre para salvar seus favoritos" : "Comece a explorar a ilha"}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="pw">Senha</Label>
            <Input id="pw" type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center mt-5">
          {mode === "login" ? (
            <>Não tem conta? <Link to="/cadastro" className="text-primary font-medium hover:underline">Cadastre-se</Link></>
          ) : (
            <>Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

import { useState } from "react";
import { z } from "zod";
import { planos, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Loader2, MessageCircle, ShieldCheck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER } from "@/components/WhatsAppFAB";
import SEO from "@/components/SEO";

const schema = z.object({
  name: z.string().trim().min(2, "Informe o nome do seu negócio").max(120),
  category: z.string().min(1, "Selecione uma categoria"),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20)
    .regex(/[\d]{10,}/, "Informe apenas números com DDD"),
  email: z.string().trim().email("E-mail inválido").max(255),
  description: z.string().trim().min(10, "Conte um pouco mais (mín. 10 caracteres)").max(1000),
});

type FormShape = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormShape, string>>;

const initial: FormShape = { name: "", category: "", whatsapp: "", email: "", description: "" };

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const buildWhatsAppFallback = (f: FormShape) => {
  const msg = `Olá! Quero anunciar na Estação Ilha Grande.%0A%0A*Negócio:* ${f.name}%0A*Categoria:* ${f.category}%0A*E-mail:* ${f.email}%0A*Descrição:* ${f.description}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
};

const Anuncie = () => {
  const [form, setForm] = useState<FormShape>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = <K extends keyof FormShape>(k: K, v: FormShape[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      const newErr: Errors = {};
      (Object.keys(fe) as (keyof FormShape)[]).forEach(k => {
        if (fe[k]?.[0]) newErr[k] = fe[k]![0];
      });
      setErrors(newErr);
      toast.error("Confira os campos destacados e tente novamente.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("lead_requests").insert({
        name: parsed.data.name,
        category: parsed.data.category,
        whatsapp: parsed.data.whatsapp,
        email: parsed.data.email,
        description: parsed.data.description,
        source: "anuncie",
      });
      if (error) throw error;

      setSent(true);
      setForm(initial);
      toast.success("Solicitação enviada com sucesso! Em breve entraremos em contato pelo WhatsApp.");
    } catch (err: any) {
      console.error("[Anuncie] submit error", err);
      toast.error("Não conseguimos enviar sua solicitação. Tente novamente ou fale pelo WhatsApp.", {
        action: {
          label: "Abrir WhatsApp",
          onClick: () => window.open(buildWhatsAppFallback(form), "_blank"),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Anuncie em Ilha Grande — Estação Ilha Grande"
        description="Cadastre sua pousada, restaurante, passeio ou serviço no maior portal de turismo de Ilha Grande. Atendimento local, resposta rápida."
        path="/anuncie"
        keywords="anunciar em ilha grande, divulgar pousada ilha grande, marketing turismo ilha grande"
      />
      <div className="container py-10">
        <header className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sun/20 text-sun-foreground text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Para anunciantes locais
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">
            Apareça para quem está indo para Ilha Grande
          </h1>
          <p className="text-muted-foreground text-lg">
            Pousada, restaurante, passeio ou serviço? Coloque seu negócio na frente de milhares de turistas todo mês.
          </p>
          <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> Atendimento local em Ilha Grande</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Resposta em até 24h pelo WhatsApp</span>
          </div>
        </header>

        {/* Planos */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {planos.map(p => (
            <article key={p.name}
              className={cn("rounded-3xl p-7 border-2 transition-smooth relative",
                p.highlight ? "border-primary bg-card shadow-glow scale-105" : "border-border bg-card hover:border-primary/50")}>
              {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-sunset text-accent-foreground text-xs font-bold">MAIS POPULAR</span>}
              <h3 className="font-display font-bold text-2xl mb-1">{p.name}</h3>
              <div className="mb-5">
                <span className="font-display font-bold text-4xl">{p.price}</span>
                <span className="text-muted-foreground text-sm">{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.highlight ? "hero" : "outline"} className="w-full" asChild>
                <a href="#formulario">Quero esse plano</a>
              </Button>
            </article>
          ))}
        </div>

        {/* CTA + Formulário */}
        <section id="formulario" className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-soft max-w-3xl scroll-mt-24">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-3">
              Solicite agora
            </span>
            <h2 className="font-display font-bold text-3xl mb-2">Cadastre seu negócio em 1 minuto</h2>
            <p className="text-muted-foreground">
              Preencha os campos abaixo. Nossa equipe local entra em contato pelo WhatsApp com o plano ideal,
              fotos profissionais e dicas para vender mais nesta temporada.
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 text-primary">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-2xl">Solicitação enviada!</h3>
              <p className="text-muted-foreground">
                Recebemos seus dados. Em breve falamos com você pelo WhatsApp para combinar tudo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setSent(false)}>Enviar outra solicitação</Button>
                <Button asChild variant="hero">
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> Falar agora no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome do negócio *</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="organization"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  disabled={loading}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="cat">Categoria *</Label>
                <select
                  id="cat"
                  name="category"
                  value={form.category}
                  onChange={e => update("category", e.target.value)}
                  disabled={loading}
                  aria-invalid={!!errors.category}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Selecione...</option>
                  {categories.filter(c => !["dicas", "nao-fazer"].includes(c.key)).map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="wa">WhatsApp *</Label>
                <Input
                  id="wa"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(24) 99999-0000"
                  value={form.whatsapp}
                  onChange={e => update("whatsapp", maskPhone(e.target.value))}
                  aria-invalid={!!errors.whatsapp}
                  disabled={loading}
                />
                {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="em">E-mail *</Label>
                <Input
                  id="em"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  disabled={loading}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="desc">Conte sobre seu negócio *</Label>
                <Textarea
                  id="desc"
                  name="description"
                  rows={4}
                  placeholder="Ex: Pousada em Abraão com 8 quartos, café da manhã e vista para o mar."
                  value={form.description}
                  onChange={e => update("description", e.target.value)}
                  aria-invalid={!!errors.description}
                  disabled={loading}
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={loading}>
                  {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>) : "Enviar solicitação"}
                </Button>
                <Button type="button" variant="outline" size="lg" asChild>
                  <a href={buildWhatsAppFallback(form)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                  </a>
                </Button>
              </div>
              <p className="sm:col-span-2 text-xs text-muted-foreground text-center">
                Ao enviar, você concorda em ser contatado pela equipe da Estação Ilha Grande.
              </p>
            </form>
          )}
        </section>
      </div>
    </>
  );
};

export default Anuncie;

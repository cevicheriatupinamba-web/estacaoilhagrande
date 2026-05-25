import { useState } from "react";
import { planos, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Anuncie = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", category: "", whatsapp: "", email: "", description: "", photos: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const reqs = JSON.parse(localStorage.getItem("ilhago_ad_requests") || "[]");
    reqs.push({ ...form, id: Date.now(), status: "pendente", createdAt: new Date().toISOString() });
    localStorage.setItem("ilhago_ad_requests", JSON.stringify(reqs));
    toast({ title: "Solicitação enviada!", description: "Nossa equipe entrará em contato em breve." });
    setForm({ name: "", category: "", whatsapp: "", email: "", description: "", photos: "" });
  };

  return (
    <div className="container py-10">
      <header className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sun/20 text-sun-foreground text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Para anunciantes locais
        </span>
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Anuncie no Ilha Go</h1>
        <p className="text-muted-foreground text-lg">Apareça para milhares de turistas que planejam a viagem todo mês.</p>
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
            <Button variant={p.highlight ? "hero" : "outline"} className="w-full">Quero esse</Button>
          </article>
        ))}
      </div>

      {/* Formulário */}
      <div className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-soft max-w-3xl">
        <h2 className="font-display font-bold text-3xl mb-2">Solicitar anúncio</h2>
        <p className="text-muted-foreground mb-6">Preencha e nossa equipe entrará em contato.</p>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome do negócio</Label>
            <Input id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="cat">Categoria</Label>
            <select id="cat" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {categories.filter(c => !["dicas", "nao-fazer"].includes(c.key)).map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="wa">WhatsApp</Label>
            <Input id="wa" required placeholder="(24) 99999-0000" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="em">Email</Label>
            <Input id="em" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea id="desc" required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ph">Links de fotos (opcional)</Label>
            <Textarea id="ph" rows={2} placeholder="Cole links separados por vírgula" value={form.photos} onChange={e => setForm({ ...form, photos: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="hero" size="lg" className="w-full">Enviar solicitação</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Anuncie;

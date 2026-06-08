import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Sparkles, Loader2, MessageCircle, ShieldCheck, MapPin, Star, Crown, Award } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER } from "@/components/WhatsAppFAB";
import SEO from "@/components/SEO";

/* -------------------- Planos -------------------- */
type PlanKey = "basico" | "destaque" | "premium";

const PLANOS: {
  key: PlanKey;
  name: string;
  price: string;
  period: string;
  tagline: string;
  highlight?: boolean;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  fotosAviso: string;
}[] = [
  {
    key: "basico",
    name: "Básico",
    price: "R$ 97",
    period: "/mês",
    tagline: "Para começar a aparecer no portal",
    icon: Award,
    features: [
      "Perfil completo no portal",
      "Até 10 fotos",
      "WhatsApp direto",
      "Localização no mapa",
      "Descrição otimizada para SEO",
      "Link para Instagram",
      "Inclusão nas buscas do portal",
      "Avaliações de clientes",
    ],
    fotosAviso: "Este plano permite até 10 fotos.",
  },
  {
    key: "destaque",
    name: "Destaque",
    price: "R$ 197",
    period: "/mês",
    tagline: "Mais visibilidade e selo de confiança",
    highlight: true,
    badge: "MAIS POPULAR",
    icon: Star,
    features: [
      "Tudo do Plano Básico",
      "Até 20 fotos + 1 vídeo institucional",
      "Selo Empresa Recomendada",
      "Destaque acima dos anúncios gratuitos",
      "Galeria de imagens ampliada",
      "Destaque na categoria correspondente",
      "Botão de contato prioritário",
      "Compartilhamento mensal nas redes da Estação Ilha Grande",
      "Página com identidade visual personalizada",
      "Estatísticas básicas de visualizações",
    ],
    fotosAviso: "Este plano permite até 20 fotos, 1 vídeo, selo recomendado e destaque na categoria.",
  },
  {
    key: "premium",
    name: "Premium",
    price: "R$ 297",
    period: "/mês",
    tagline: "Prioridade máxima e presença total",
    badge: "TOP",
    icon: Crown,
    features: [
      "Tudo do Plano Destaque",
      "Até 40 fotos + 3 vídeos",
      "Destaque na página inicial",
      "Banner rotativo no portal",
      "Artigo exclusivo otimizado para Google",
      "Publicação quinzenal nas redes sociais",
      "Selo Premium Exclusivo",
      "Prioridade máxima nas pesquisas",
      "Captura de leads exclusiva",
      "Inclusão em campanhas promocionais",
      "Relatório mensal de desempenho",
      "Link para site próprio + atendimento prioritário",
    ],
    fotosAviso: "Este plano permite até 40 fotos, 3 vídeos, banner, prioridade máxima, artigo SEO e destaque na página inicial.",
  },
];

/* -------------------- Categorias -------------------- */
const CATEGORIAS: { grupo: string; itens: string[] }[] = [
  { grupo: "Hospedagem", itens: ["Hostel", "Pousada", "Hotel", "Suíte", "Casa de temporada", "Camping", "Airbnb", "Chalé"] },
  { grupo: "Gastronomia", itens: ["Restaurante", "Bar", "Hamburgueria", "Pizzaria", "Cafeteria", "Padaria", "Sorveteria", "Quiosque", "Comida artesanal", "Charcutaria", "Doceria"] },
  { grupo: "Passeios e Turismo", itens: ["Agência de turismo", "Passeio de barco", "Lancha", "Escuna", "Taxi boat", "Transfer", "Guia turístico", "Trilha guiada", "Mergulho", "Aula de surf", "Fotografia turística", "Experiências premium"] },
  { grupo: "Comércio Local", itens: ["Mercado", "Loja de roupas", "Loja de artesanato", "Tabacaria", "Banca", "Farmácia", "Conveniência", "Loja de praia", "Aluguel de equipamentos", "Serviços gerais"] },
  { grupo: "Serviços", itens: ["Fotógrafo", "Designer", "Manutenção", "Lavanderia", "Transporte", "Eventos", "Beleza e estética", "Massagem", "Outros"] },
];

/* -------------------- Schema -------------------- */
const schema = z.object({
  plano: z.enum(["basico", "destaque", "premium"], { required_error: "Escolha um plano" }),
  responsavel: z.string().trim().min(2, "Informe o nome do responsável").max(120),
  whatsappResp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  nomeNegocio: z.string().trim().min(2, "Informe o nome do negócio").max(150),
  instagram: z.string().trim().max(120).optional().or(z.literal("")),
  site: z.string().trim().max(200).optional().or(z.literal("")),
  categoria: z.string().min(1, "Selecione uma categoria"),
  descCurta: z.string().trim().min(10, "Descrição curta muito curta").max(180),
  descCompleta: z.string().trim().min(20, "Descrição completa muito curta").max(1500),
  diferenciais: z.string().trim().max(600).optional().or(z.literal("")),
  endereco: z.string().trim().max(200).optional().or(z.literal("")),
  regiao: z.string().trim().max(120).optional().or(z.literal("")),
  mapsLink: z.string().trim().max(300).optional().or(z.literal("")),
  horario: z.string().trim().max(200).optional().or(z.literal("")),
  whatsappCliente: z.string().trim().max(30).optional().or(z.literal("")),
  reservaLink: z.string().trim().max(300).optional().or(z.literal("")),
  faixaPreco: z.string().trim().max(60).optional().or(z.literal("")),
  servicos: z.string().trim().max(600).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "É preciso autorizar" }) }),
});

type Form = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Form, string>>;

const initial: Form = {
  plano: "destaque" as PlanKey,
  responsavel: "", whatsappResp: "", email: "",
  nomeNegocio: "", instagram: "", site: "",
  categoria: "",
  descCurta: "", descCompleta: "", diferenciais: "",
  endereco: "", regiao: "", mapsLink: "",
  horario: "", whatsappCliente: "", reservaLink: "",
  faixaPreco: "", servicos: "",
  consent: false as unknown as true,
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const planoLabel = (k: PlanKey) => {
  const p = PLANOS.find(x => x.key === k)!;
  return `${p.name} — ${p.price}${p.period}`;
};

const buildMessage = (f: Form) => `Olá, quero anunciar meu negócio na Estação Ilha Grande.

*PLANO ESCOLHIDO:* ${planoLabel(f.plano)}

*DADOS DO RESPONSÁVEL*
Nome: ${f.responsavel}
WhatsApp: ${f.whatsappResp}
E-mail: ${f.email}

*DADOS DO NEGÓCIO*
Nome do negócio: ${f.nomeNegocio}
Categoria: ${f.categoria}
Instagram: ${f.instagram || "-"}
Site: ${f.site || "-"}
WhatsApp para clientes: ${f.whatsappCliente || "-"}

*LOCALIZAÇÃO*
Endereço: ${f.endereco || "-"}
Região: ${f.regiao || "-"}
Google Maps: ${f.mapsLink || "-"}

*INFORMAÇÕES DO ANÚNCIO*
Descrição curta: ${f.descCurta}
Descrição completa: ${f.descCompleta}
Diferenciais: ${f.diferenciais || "-"}
Horário de funcionamento: ${f.horario || "-"}
Faixa de preço: ${f.faixaPreco || "-"}
Serviços/produtos oferecidos: ${f.servicos || "-"}
Link de reserva: ${f.reservaLink || "-"}

*MÍDIAS*
Estou ciente de que enviarei fotos e vídeos pelo WhatsApp após este cadastro.

*AUTORIZAÇÃO*
Confirmo que autorizo a criação do anúncio no portal Estação Ilha Grande.`;

const waLink = (f: Form) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(f))}`;

/* -------------------- Componente -------------------- */
const Anuncie = () => {
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const escolherPlano = (k: PlanKey) => {
    update("plano", k);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const planoSelecionado = PLANOS.find(p => p.key === form.plano)!;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      const ne: Errors = {};
      (Object.keys(fe) as (keyof Form)[]).forEach(k => { if (fe[k]?.[0]) ne[k] = fe[k]![0] as string; });
      setErrors(ne);
      toast.error("Confira os campos destacados.");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setLoading(true);
    try {
      // Persiste no banco
      const fullDesc = buildMessage(parsed.data);
      const { error } = await supabase.from("lead_requests").insert({
        name: `${parsed.data.nomeNegocio} (${parsed.data.responsavel})`,
        category: parsed.data.categoria,
        whatsapp: parsed.data.whatsappResp,
        email: parsed.data.email,
        description: fullDesc,
        source: `anuncie:${parsed.data.plano}`,
      });
      if (error) throw error;
      // Abre WhatsApp
      window.open(waLink(parsed.data), "_blank", "noopener,noreferrer");
      setSent(true);
      toast.success("Cadastro enviado! Finalize a conversa pelo WhatsApp.");
    } catch (err: any) {
      console.error("[Anuncie] submit error", err);
      // Mesmo com falha no banco, abre WhatsApp para não perder o lead
      window.open(waLink(parsed.data), "_blank", "noopener,noreferrer");
      toast.message("Enviamos seus dados direto pelo WhatsApp.");
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (sent) window.scrollTo({ top: 0, behavior: "smooth" }); }, [sent]);

  return (
    <>
      <SEO
        title="Anuncie seu negócio na Estação Ilha Grande — Portal Turístico e Comercial"
        description="Coloque sua pousada, restaurante, passeio ou serviço no maior portal de Ilha Grande. Planos a partir de R$ 97/mês. Cadastro direto pelo WhatsApp."
        path="/anuncie"
        keywords="anunciar em ilha grande, divulgar pousada ilha grande, guia comercial ilha grande, marketing turismo ilha grande"
      />

      {sent ? (
        <div className="container py-16">
          <div className="max-w-2xl mx-auto rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 text-primary">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl">Cadastro enviado com sucesso!</h1>
            <p className="text-muted-foreground text-lg">
              Agora nossa equipe vai receber suas informações pelo WhatsApp e entrar em contato
              para finalizar seu anúncio na Estação Ilha Grande.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild variant="hero" size="lg">
                <a href={waLink(form)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Falar novamente no WhatsApp
                </a>
              </Button>
              <Button variant="outline" size="lg" onClick={() => { setSent(false); setForm(initial); }}>
                Enviar outro cadastro
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container py-10 md:py-14">
          {/* HERO */}
          <header className="mb-12 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sun/20 text-sun-foreground text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Portal Oficial Estação Ilha Grande
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              Anuncie seu negócio na <span className="text-primary">Estação Ilha Grande</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-6">
              Apareça para turistas que estão procurando onde se hospedar, onde comer,
              o que fazer e quais serviços contratar em Ilha Grande.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="hero" asChild>
                <a href="#formulario">Quero anunciar meu negócio</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero saber mais sobre como anunciar na Estação Ilha Grande.")}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" /> Tirar dúvidas no WhatsApp
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> Atendimento local em Ilha Grande</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Resposta em até 24h pelo WhatsApp</span>
            </div>
          </header>

          {/* PLANOS */}
          <section className="mb-16" aria-label="Planos">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Escolha seu plano</h2>
              <p className="text-muted-foreground">Cancele quando quiser. Sem fidelidade.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANOS.map(p => {
                const Icon = p.icon;
                const ativo = form.plano === p.key;
                return (
                  <article
                    key={p.key}
                    className={cn(
                      "rounded-3xl p-7 border-2 transition-smooth relative bg-card flex flex-col",
                      p.highlight ? "border-primary shadow-glow md:scale-105" : "border-border hover:border-primary/50",
                      ativo && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                  >
                    {p.badge && (
                      <span className={cn(
                        "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold",
                        p.highlight ? "gradient-sunset text-accent-foreground" : "bg-foreground text-background"
                      )}>{p.badge}</span>
                    )}
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Icon className="w-5 h-5" />
                      <h3 className="font-display font-bold text-2xl">{p.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{p.tagline}</p>
                    <div className="mb-5">
                      <span className="font-display font-bold text-4xl">{p.price}</span>
                      <span className="text-muted-foreground text-sm">{p.period}</span>
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {p.features.map(f => (
                        <li key={f} className="flex gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={p.highlight ? "hero" : "outline"}
                      className="w-full"
                      onClick={() => escolherPlano(p.key)}
                    >
                      {ativo ? "Plano selecionado ✓" : "Escolher plano"}
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* FORMULÁRIO */}
          <section
            id="formulario"
            ref={formRef}
            className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-soft max-w-4xl mx-auto scroll-mt-24"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-3">
                Cadastro
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">
                Cadastre seu negócio na Estação Ilha Grande
              </h2>
              <p className="text-muted-foreground">
                Preencha os dados abaixo. Ao enviar, abriremos o WhatsApp com o resumo do seu cadastro
                para nossa equipe finalizar o anúncio com você.
              </p>
            </div>

            {/* Aviso do plano */}
            <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Plano selecionado: {planoSelecionado.name} — {planoSelecionado.price}{planoSelecionado.period}</p>
                <p className="text-muted-foreground mt-1">{planoSelecionado.fotosAviso}</p>
              </div>
            </div>

            <form onSubmit={submit} noValidate className="space-y-8">
              {/* Plano */}
              <fieldset className="space-y-3">
                <legend className="font-display font-bold text-lg mb-2">1. Plano escolhido *</legend>
                <div className="grid sm:grid-cols-3 gap-3">
                  {PLANOS.map(p => (
                    <label key={p.key}
                      className={cn(
                        "rounded-xl border-2 p-3 cursor-pointer text-sm transition-smooth",
                        form.plano === p.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      )}>
                      <input
                        type="radio" name="plano" value={p.key}
                        className="sr-only"
                        checked={form.plano === p.key}
                        onChange={() => update("plano", p.key)}
                      />
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-muted-foreground">{p.price}{p.period}</div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Responsável */}
              <fieldset className="grid sm:grid-cols-2 gap-4">
                <legend className="font-display font-bold text-lg mb-2 sm:col-span-2">2. Dados do responsável</legend>
                <div className="sm:col-span-2">
                  <Label htmlFor="responsavel">Nome do responsável *</Label>
                  <Input id="responsavel" value={form.responsavel} onChange={e => update("responsavel", e.target.value)} disabled={loading} aria-invalid={!!errors.responsavel} />
                  {errors.responsavel && <p className="text-xs text-destructive mt-1">{errors.responsavel}</p>}
                </div>
                <div>
                  <Label htmlFor="whatsappResp">WhatsApp do responsável *</Label>
                  <Input id="whatsappResp" type="tel" inputMode="tel" placeholder="(24) 99999-0000"
                    value={form.whatsappResp} onChange={e => update("whatsappResp", maskPhone(e.target.value))}
                    disabled={loading} aria-invalid={!!errors.whatsappResp} />
                  {errors.whatsappResp && <p className="text-xs text-destructive mt-1">{errors.whatsappResp}</p>}
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" placeholder="voce@email.com"
                    value={form.email} onChange={e => update("email", e.target.value)}
                    disabled={loading} aria-invalid={!!errors.email} />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </fieldset>

              {/* Negócio */}
              <fieldset className="grid sm:grid-cols-2 gap-4">
                <legend className="font-display font-bold text-lg mb-2 sm:col-span-2">3. Dados do negócio</legend>
                <div className="sm:col-span-2">
                  <Label htmlFor="nomeNegocio">Nome do negócio *</Label>
                  <Input id="nomeNegocio" value={form.nomeNegocio} onChange={e => update("nomeNegocio", e.target.value)} disabled={loading} aria-invalid={!!errors.nomeNegocio} />
                  {errors.nomeNegocio && <p className="text-xs text-destructive mt-1">{errors.nomeNegocio}</p>}
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="@seuperfil" value={form.instagram} onChange={e => update("instagram", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="site">Site (se tiver)</Label>
                  <Input id="site" placeholder="https://" value={form.site} onChange={e => update("site", e.target.value)} disabled={loading} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="categoria">Categoria do negócio *</Label>
                  <select
                    id="categoria"
                    value={form.categoria}
                    onChange={e => update("categoria", e.target.value)}
                    disabled={loading}
                    aria-invalid={!!errors.categoria}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIAS.map(g => (
                      <optgroup key={g.grupo} label={g.grupo}>
                        {g.itens.map(i => <option key={i} value={`${g.grupo} • ${i}`}>{i}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  {errors.categoria && <p className="text-xs text-destructive mt-1">{errors.categoria}</p>}
                </div>
              </fieldset>

              {/* Informações do anúncio */}
              <fieldset className="grid sm:grid-cols-2 gap-4">
                <legend className="font-display font-bold text-lg mb-2 sm:col-span-2">4. Informações do anúncio</legend>
                <div className="sm:col-span-2">
                  <Label htmlFor="descCurta">Descrição curta * <span className="text-xs text-muted-foreground">(até 180 caracteres)</span></Label>
                  <Input id="descCurta" maxLength={180} value={form.descCurta} onChange={e => update("descCurta", e.target.value)} disabled={loading} aria-invalid={!!errors.descCurta} />
                  {errors.descCurta && <p className="text-xs text-destructive mt-1">{errors.descCurta}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="descCompleta">Descrição completa *</Label>
                  <Textarea id="descCompleta" rows={4} value={form.descCompleta} onChange={e => update("descCompleta", e.target.value)} disabled={loading} aria-invalid={!!errors.descCompleta} />
                  {errors.descCompleta && <p className="text-xs text-destructive mt-1">{errors.descCompleta}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="diferenciais">Diferenciais do negócio</Label>
                  <Textarea id="diferenciais" rows={3} placeholder="Ex: vista para o mar, café da manhã regional, pet friendly..." value={form.diferenciais} onChange={e => update("diferenciais", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="horario">Horário de funcionamento</Label>
                  <Input id="horario" placeholder="Ex: Seg–Dom, 9h às 22h" value={form.horario} onChange={e => update("horario", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="faixaPreco">Faixa de preço</Label>
                  <Input id="faixaPreco" placeholder="Ex: R$ 80–150 por pessoa" value={form.faixaPreco} onChange={e => update("faixaPreco", e.target.value)} disabled={loading} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="servicos">Serviços / produtos oferecidos</Label>
                  <Textarea id="servicos" rows={3} placeholder="Liste os principais itens do seu cardápio, passeios, quartos, serviços..." value={form.servicos} onChange={e => update("servicos", e.target.value)} disabled={loading} />
                </div>
              </fieldset>

              {/* Localização e contato */}
              <fieldset className="grid sm:grid-cols-2 gap-4">
                <legend className="font-display font-bold text-lg mb-2 sm:col-span-2">5. Localização e contato</legend>
                <div>
                  <Label htmlFor="endereco">Endereço ou localização aproximada</Label>
                  <Input id="endereco" value={form.endereco} onChange={e => update("endereco", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="regiao">Bairro ou região</Label>
                  <Input id="regiao" placeholder="Ex: Vila do Abraão" value={form.regiao} onChange={e => update("regiao", e.target.value)} disabled={loading} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="mapsLink">Link do Google Maps</Label>
                  <Input id="mapsLink" placeholder="https://maps.google.com/..." value={form.mapsLink} onChange={e => update("mapsLink", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="whatsappCliente">WhatsApp para clientes</Label>
                  <Input id="whatsappCliente" type="tel" placeholder="(24) 99999-0000" value={form.whatsappCliente} onChange={e => update("whatsappCliente", maskPhone(e.target.value))} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="reservaLink">Link de reserva (se tiver)</Label>
                  <Input id="reservaLink" placeholder="https://" value={form.reservaLink} onChange={e => update("reservaLink", e.target.value)} disabled={loading} />
                </div>
              </fieldset>

              {/* Mídias */}
              <div className="rounded-2xl bg-muted/40 border border-border p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Fotos e vídeos:</strong> após o envio do formulário,
                nossa equipe entrará em contato pelo WhatsApp para receber suas mídias e finalizar o anúncio.
              </div>

              {/* Consentimento */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={form.consent as unknown as boolean}
                  onCheckedChange={(v) => update("consent", (v === true) as unknown as Form["consent"])}
                />
                <Label htmlFor="consent" className="text-sm font-normal leading-relaxed cursor-pointer">
                  Confirmo que as informações enviadas são verdadeiras e autorizo a Estação Ilha Grande
                  a utilizar esses dados para criar meu anúncio no portal. *
                </Label>
              </div>
              {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={loading}>
                  {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>) : (<><MessageCircle className="w-5 h-5" /> Enviar cadastro pelo WhatsApp</>)}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Ao enviar, abriremos o WhatsApp (+55 24 99999-2503) com o resumo do seu cadastro.
              </p>
            </form>
          </section>

          {/* CTA final */}
          <section className="mt-16 text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
              Seu negócio ainda não está no maior guia de Ilha Grande?
            </h2>
            <p className="text-muted-foreground mb-5">
              Cadastre-se agora e comece a aparecer para milhares de turistas todo mês.
            </p>
            <Button size="lg" variant="hero" asChild>
              <a href="#formulario">Quero anunciar agora</a>
            </Button>
          </section>
        </div>
      )}
    </>
  );
};

export default Anuncie;

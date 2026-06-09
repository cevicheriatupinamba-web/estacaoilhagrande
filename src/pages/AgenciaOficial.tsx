import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import WhatsAppLeadModal from "@/components/WhatsAppLeadModal";
import { getAgencyWhatsapp, AGENCY_WHATSAPP_DEFAULT, AGENCY_MESSAGE_DEFAULT } from "@/lib/whatsapp";
import {
  BadgeCheck, MessageCircle, Compass, Hotel, Ship, Map, Clock, ShieldCheck, Star, Crown,
} from "lucide-react";

const SERVICES = [
  { icon: Hotel,   title: "Reserva de pousadas",    desc: "Curadoria de pousadas verificadas em Abraão, Provetá e Aventureiro. Negociamos a melhor tarifa." },
  { icon: Ship,    title: "Passeios de barco",      desc: "Volta à ilha, Lopes Mendes, lagoa azul. Saídas diárias com guias credenciados." },
  { icon: Compass, title: "Roteiros personalizados",desc: "Romântico, família, aventura, lua-de-mel. Montamos a viagem do seu jeito." },
  { icon: Map,     title: "Transfer e logística",   desc: "Rio · Conceição · Mangaratiba · Angra. Lancha rápida ou escuna até o Abraão." },
];

const REASONS = [
  { icon: BadgeCheck, title: "Operador oficial",    desc: "Empresa cadastrada com CNPJ e parceria com pousadas, lanchas e guias locais." },
  { icon: ShieldCheck,title: "Reserva sem risco",   desc: "Confirmação por escrito, comprovante e suporte 24/7 durante toda sua viagem." },
  { icon: Star,       title: "Avaliação 5 estrelas",desc: "Centenas de viajantes atendidos com nota máxima no Tripadvisor e Google." },
  { icon: Crown,      title: "Acesso premium",      desc: "Tarifas e janelas exclusivas em pousadas e lanchas que não aparecem em buscadores." },
];

export default function AgenciaOficial() {
  const [agency, setAgency] = useState({ number: AGENCY_WHATSAPP_DEFAULT, message: AGENCY_MESSAGE_DEFAULT });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { getAgencyWhatsapp().then(setAgency); }, []);

  return (
    <>
      <SEO
        title="Agência Oficial Estação Ilha Grande — Reservas com curadoria"
        description="Pousadas, passeios e transfer em Ilha Grande organizados pela Agência Oficial Estação Ilha Grande. Atendimento humano via WhatsApp, sem taxas escondidas."
        path="/agencia-oficial"
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.4),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.35),transparent_55%)]" />
        <div className="container relative py-16 md:py-24">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 mb-5">
            <BadgeCheck className="w-3.5 h-3.5" /> Agência oficial da plataforma
          </span>
          <h1 className="font-display font-black text-4xl md:text-6xl leading-tight max-w-3xl">
            Sua viagem para <span className="text-amber-300">Ilha Grande</span><br />resolvida em uma conversa.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-200 max-w-2xl">
            Pousada, passeio de barco, transfer e roteiro — montamos tudo para você no WhatsApp, com curadoria local e tarifas reais.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" variant="hero" onClick={() => setModalOpen(true)}>
              <MessageCircle className="w-5 h-5 mr-2" /> Falar com a Agência
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10">
              <Link to="/explorar">Ver opções no portal</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Resposta em até 10 min · 7h às 23h</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Reserva confirmada por escrito</span>
            <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-300" /> Nota 5/5 no Tripadvisor</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container py-14 md:py-20">
        <header className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Tudo no mesmo lugar</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">O que a Agência Oficial faz por você</h2>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map(s => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white grid place-items-center mb-3">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="bg-muted/30 py-14 md:py-20">
        <div className="container">
          <header className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Por que reservar com a gente</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">Curadoria local, segurança real.</h2>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REASONS.map(r => (
              <div key={r.title} className="rounded-2xl border border-border bg-background p-5">
                <r.icon className="w-6 h-6 text-amber-500 mb-3" />
                <h3 className="font-display font-bold text-base mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-700 text-white p-8 md:p-12 text-center shadow-soft">
          <h2 className="font-display font-black text-3xl md:text-4xl mb-3">
            Conte sua viagem para a Agência Oficial
          </h2>
          <p className="text-emerald-50 max-w-2xl mx-auto mb-6">
            Quantas pessoas, quais datas e o estilo da viagem. Em minutos te enviamos um roteiro com pousada, passeios e transfer.
          </p>
          <Button size="lg" variant="hero" onClick={() => setModalOpen(true)}>
            <MessageCircle className="w-5 h-5 mr-2" /> Iniciar conversa no WhatsApp
          </Button>
        </div>
      </section>

      <WhatsAppLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        number={agency.number}
        message={agency.message}
        context={{ kind: "agency", label: "Agência Oficial" }}
      />
    </>
  );
}

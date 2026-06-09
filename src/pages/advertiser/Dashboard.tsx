import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMyListingsWithSubscriptions, fetchEventsForListings,
  summarizeEvents, bucketByDay, periodToRange, pctDelta,
  PERIOD_LABEL, PLAN_PRICE, type PeriodKey,
} from "@/lib/advertiser/api";
import { PLAN_LABEL, CATEGORY_LABEL } from "@/lib/listings-api";
import { Button } from "@/components/ui/button";
import {
  Eye, Users, MessageCircle, Phone, MapPin, Heart, Share2, ArrowUpRight,
  ArrowDownRight, TrendingUp, ExternalLink, Calendar, Crown, Sparkles, AlertCircle,
  Trophy, Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, Legend,
} from "recharts";

const PERIODS: PeriodKey[] = ["today", "7d", "30d", "90d", "12m"];

function fmt(n: number) { return n.toLocaleString("pt-BR"); }
function fmtDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function fmtBRL(n: number) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function daysUntil(iso: string | null | undefined) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

interface KpiCard {
  label: string; value: number; previous: number; icon: any; accent: string;
}

export default function AdvertiserDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [previousEvents, setPreviousEvents] = useState<any[]>([]);
  const [waStats, setWaStats] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchMyListingsWithSubscriptions(user.id).then(({ listings, subscriptions }) => {
      setListings(listings);
      setSubs(subscriptions);
    }).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!listings.length) { setEvents([]); setPreviousEvents([]); setWaStats(null); return; }
    const { start, end, previous } = periodToRange(period);
    const ids = listings.map(l => l.id);
    const daysMap: Record<PeriodKey, number> = { today: 1, "7d": 7, "30d": 30, "90d": 90, "12m": 365 };
    Promise.all([
      fetchEventsForListings(ids, start, end),
      fetchEventsForListings(ids, previous.start, previous.end),
    ]).then(([cur, prev]) => { setEvents(cur); setPreviousEvents(prev); });
    // WhatsApp ranking is computed on the primary listing
    const primary = listings[0]?.id;
    if (primary) {
      supabase.rpc("get_listing_whatsapp_stats" as any, { _listing_id: primary, _days: daysMap[period] })
        .then(({ data }) => setWaStats(data ?? null));
    }
  }, [listings, period]);

  const range = useMemo(() => periodToRange(period), [period]);
  const totals = useMemo(() => summarizeEvents(events), [events]);
  const prevTotals = useMemo(() => summarizeEvents(previousEvents), [previousEvents]);
  const series = useMemo(() => bucketByDay(events, range.start, range.end), [events, range]);

  const cards: KpiCard[] = [
    { label: "Visualizações",      value: totals.view,             previous: prevTotals.view,             icon: Eye,           accent: "from-sky-400 to-blue-600" },
    { label: "Visitantes únicos",  value: totals.unique_visitors,  previous: prevTotals.unique_visitors,  icon: Users,         accent: "from-indigo-400 to-violet-600" },
    { label: "Cliques WhatsApp",   value: totals.whatsapp,         previous: prevTotals.whatsapp,         icon: MessageCircle, accent: "from-emerald-400 to-green-600" },
    { label: "Cliques no telefone",value: totals.phone,            previous: prevTotals.phone,            icon: Phone,         accent: "from-teal-400 to-cyan-600" },
    { label: "Pedidos de rota",    value: totals.directions + totals.map, previous: prevTotals.directions + prevTotals.map, icon: MapPin, accent: "from-orange-400 to-rose-600" },
    { label: "Favoritados",        value: totals.favorite,         previous: prevTotals.favorite,         icon: Heart,         accent: "from-rose-400 to-pink-600" },
    { label: "Compartilhamentos",  value: totals.share,            previous: prevTotals.share,            icon: Share2,        accent: "from-fuchsia-400 to-purple-600" },
    { label: "Site / Instagram",   value: totals.website + totals.instagram, previous: prevTotals.website + prevTotals.instagram, icon: ExternalLink, accent: "from-amber-400 to-yellow-600" },
  ];

  // primary subscription = first active or any
  const sub = useMemo(() => {
    if (!subs.length) return null;
    return subs.find(s => s.status === "active") ?? subs[0];
  }, [subs]);
  const subListing = sub ? listings.find(l => l.id === sub.listing_id) : null;
  const renewalDays = sub ? daysUntil(sub.current_period_end) : null;

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Carregando seu painel…</div>;
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-2xl rounded-3xl border border-dashed border-border bg-card p-10 text-center">
        <Sparkles className="w-10 h-10 mx-auto text-amber-500 mb-3" />
        <h2 className="font-display font-bold text-2xl mb-2">Bem-vindo à Extranet</h2>
        <p className="text-muted-foreground mb-6">
          Você ainda não tem um anúncio vinculado a esta conta. Fale com a equipe da Estação Ilha Grande para liberar seu cadastro.
        </p>
        <Button asChild variant="hero"><Link to="/anuncie">Quero anunciar</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 md:p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-amber-300/80 font-bold mb-1">Bem-vindo de volta</p>
            <h1 className="font-display font-bold text-2xl md:text-3xl truncate">
              {subListing?.name ?? listings[0]?.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              {sub
                ? <>Plano <span className="font-semibold text-amber-300">{PLAN_LABEL[sub.plan as keyof typeof PLAN_LABEL]}</span> · status <span className="font-semibold uppercase">{sub.status}</span></>
                : "Sua assinatura ainda não foi configurada pelo administrador."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {sub?.current_period_end && (
              <div className="text-right">
                <div className="text-[11px] uppercase text-amber-300/70 tracking-wider font-bold">Próxima renovação</div>
                <div className={cn(
                  "text-xl font-bold",
                  renewalDays !== null && renewalDays <= 7 ? "text-rose-300" :
                  renewalDays !== null && renewalDays <= 15 ? "text-amber-300" : "text-white"
                )}>
                  {renewalDays !== null && renewalDays >= 0 ? `${renewalDays} dia${renewalDays === 1 ? "" : "s"}` : "vencida"}
                </div>
                <div className="text-[11px] text-slate-400">{new Date(sub.current_period_end).toLocaleDateString("pt-BR")}</div>
              </div>
            )}
            <Button asChild variant="outline" className="border-amber-300/40 text-amber-100 bg-amber-300/10 hover:bg-amber-300/20 hover:text-white">
              <Link to="/minha-assinatura"><Crown className="w-4 h-4 mr-1" /> Assinatura</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        {PERIODS.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={cn(
              "text-xs font-semibold px-3 py-1.5 rounded-full border transition",
              period === p
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-card text-foreground/70 border-border hover:border-slate-900"
            )}>
            {PERIOD_LABEL[p]}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          {fmtDate(range.start)} – {fmtDate(range.end)}
        </span>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {cards.map(c => {
          const delta = pctDelta(c.value, c.previous);
          const up = delta !== null && delta >= 0;
          return (
            <div key={c.label} className="rounded-2xl bg-card border border-border p-4 shadow-soft">
              <div className="flex items-start justify-between mb-2">
                <div className={cn("w-9 h-9 rounded-xl grid place-items-center text-white bg-gradient-to-br", c.accent)}>
                  <c.icon className="w-4 h-4" />
                </div>
                {delta !== null && (
                  <span className={cn(
                    "text-[10px] font-bold uppercase inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                    up ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(delta).toFixed(0)}%
                  </span>
                )}
              </div>
              <div className="text-2xl font-display font-bold tabular-nums">{fmt(c.value)}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp conversion card */}
      {waStats && (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-card to-amber-50 dark:from-emerald-950/30 dark:via-card dark:to-amber-950/20 border border-emerald-200/60 dark:border-emerald-900/40 p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white grid place-items-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold">Conversão WhatsApp</h3>
                <p className="text-xs text-muted-foreground">Seu principal indicador de ROI</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-full">
              {PERIOD_LABEL[period]}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <div className="text-[11px] text-muted-foreground uppercase">Cliques WhatsApp</div>
              <div className="text-2xl font-display font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                {fmt(waStats.whatsapp_clicks ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase">Visualizações</div>
              <div className="text-2xl font-display font-bold tabular-nums">{fmt(waStats.views ?? 0)}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase flex items-center gap-1">
                <Target className="w-3 h-3" /> Taxa de conversão
              </div>
              <div className="text-2xl font-display font-bold tabular-nums text-amber-700 dark:text-amber-300">
                {Number(waStats.conversion_rate ?? 0).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Ranking na categoria
              </div>
              <div className="text-2xl font-display font-bold tabular-nums">
                {waStats.category_rank ? `${waStats.category_rank}º` : "—"}
                <span className="text-sm font-normal text-muted-foreground">
                  {waStats.category_size ? ` de ${waStats.category_size}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Tráfego do anúncio</h3>
            <span className="text-xs text-muted-foreground">Visualizações × contatos</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="gView" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gContact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="date" tickFormatter={d => fmtDate(d)} fontSize={11} />
                <YAxis allowDecimals={false} fontSize={11} />
                <Tooltip labelFormatter={d => fmtDate(d as string)} />
                <Legend />
                <Area type="monotone" dataKey="views" name="Visualizações" stroke="hsl(199 89% 48%)" fill="url(#gView)" strokeWidth={2} />
                <Area type="monotone" dataKey="contacts" name="Contatos" stroke="hsl(160 84% 39%)" fill="url(#gContact)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Tipos de contato</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "WhatsApp", v: totals.whatsapp },
                { name: "Telefone", v: totals.phone },
                { name: "Site", v: totals.website },
                { name: "Instagram", v: totals.instagram },
                { name: "Rota", v: totals.directions + totals.map },
                { name: "Email", v: totals.email },
              ]} margin={{ left: -20, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis allowDecimals={false} fontSize={11} />
                <Tooltip />
                <Bar dataKey="v" fill="hsl(35 92% 50%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-3 gap-3">
        {generateInsights(totals, prevTotals).map((ins, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/90">{ins}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Listings list */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold">Meus anúncios</h3>
          <Button asChild size="sm" variant="outline">
            <Link to="/minha-empresa">Gerenciar</Link>
          </Button>
        </div>
        <div className="grid gap-3">
          {listings.map(l => (
            <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                {l.photos?.[0] && <img src={l.photos[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{l.name}</div>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2">
                  <span>{CATEGORY_LABEL[l.category as keyof typeof CATEGORY_LABEL]}</span>
                  <span>·</span>
                  <span>Plano {PLAN_LABEL[l.plan as keyof typeof PLAN_LABEL]}</span>
                  <span>·</span>
                  <span className="uppercase font-semibold">{l.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {l.status === "approved" && (
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/listagem/${l.slug}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="outline">
                  <Link to={`/painel-anunciante/editar/${l.id}`}>Editar</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sub && sub.status !== "active" && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3 text-amber-900">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-0.5">Atenção: sua assinatura está com status “{sub.status}”.</p>
            <p>Para reativar o destaque do seu anúncio, fale com a equipe da Estação Ilha Grande.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function generateInsights(curr: ReturnType<typeof summarizeEvents>, prev: ReturnType<typeof summarizeEvents>): string[] {
  const out: string[] = [];
  const dv = pctDelta(curr.view, prev.view);
  if (dv !== null && curr.view > 0) {
    if (dv >= 10) out.push(`Suas visualizações cresceram ${dv.toFixed(0)}% em relação ao período anterior. Aproveite o momento.`);
    else if (dv <= -10) out.push(`As visualizações caíram ${Math.abs(dv).toFixed(0)}%. Considere atualizar fotos e descrição.`);
    else out.push(`Visualizações estáveis (${dv >= 0 ? "+" : ""}${dv.toFixed(0)}%) — bom momento para uma promoção.`);
  } else if (curr.view === 0) {
    out.push("Ainda sem visualizações no período. Compartilhe seu link nas redes para acelerar.");
  }
  const dw = pctDelta(curr.whatsapp, prev.whatsapp);
  if (dw !== null && curr.whatsapp > 0) {
    if (dw >= 10) out.push(`Cliques no WhatsApp subiram ${dw.toFixed(0)}%. Mantenha o número e mensagem padrão sempre atualizados.`);
    else if (dw < 0) out.push(`Cliques no WhatsApp recuaram ${Math.abs(dw).toFixed(0)}%. Reveja a chamada de ação principal.`);
  }
  const convRate = curr.view > 0 ? (curr.whatsapp + curr.phone) / curr.view * 100 : 0;
  if (curr.view > 0) {
    out.push(`Taxa de contato atual: ${convRate.toFixed(1)}% das visualizações viram WhatsApp ou ligação.`);
  }
  return out.slice(0, 3);
}

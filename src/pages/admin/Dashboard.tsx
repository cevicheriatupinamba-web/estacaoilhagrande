import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/admin/StatCard";
import PageHeader from "@/components/admin/PageHeader";
import {
  Users, Crown, Sparkles, MessageSquare, FileText, Star, Eye, DollarSign,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";

const PERIODS = [
  { id: "1d",  label: "Hoje",     days: 1 },
  { id: "7d",  label: "7 dias",   days: 7 },
  { id: "30d", label: "30 dias",  days: 30 },
  { id: "90d", label: "90 dias",  days: 90 },
  { id: "ytd", label: "Ano",      days: 365 },
] as const;

const PRICES = { gratuito: 0, destaque: 197, premium: 397 };
const COLORS = ["hsl(var(--primary))", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#0ea5e9"];

export default function Dashboard() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>(PERIODS[2]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [period.id]);

  async function load() {
    setLoading(true);
    const since = new Date(Date.now() - period.days * 86400000).toISOString();

    const [listings, leads, blog, pousadas] = await Promise.all([
      supabase.from("listings").select("id, plan, status, featured, category, created_at"),
      supabase.from("lead_requests").select("id, status, category, created_at"),
      supabase.from("blog_posts").select("id, published, created_at"),
      supabase.from("pousadas").select("id, status, created_at"),
    ]);

    const L = listings.data ?? [];
    const Ld = leads.data ?? [];
    const B = blog.data ?? [];
    const P = pousadas.data ?? [];

    const advertisersAll = L.length + P.length;
    const active = L.filter(l => l.status === "approved").length + P.filter(p => p.status === "approved").length;
    const premium = L.filter(l => l.plan === "premium").length;
    const featured = L.filter(l => l.plan === "destaque").length;
    const free = L.filter(l => l.plan === "gratuito").length;
    const newAdvertisers = [...L, ...P].filter(x => new Date(x.created_at) >= new Date(since)).length;
    const totalLeads = Ld.length;
    const leadsInRange = Ld.filter(l => new Date(l.created_at) >= new Date(since)).length;
    const posts = B.length;
    const monthlyRevenue =
      L.filter(l => l.status === "approved").reduce((s, l) => s + (PRICES[l.plan as keyof typeof PRICES] ?? 0), 0);

    // Time series for the period (group by day)
    const buckets: Record<string, { date: string; advertisers: number; leads: number }> = {};
    const days = Math.min(period.days, 90);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      buckets[key] = { date: key.slice(5), advertisers: 0, leads: 0 };
    }
    L.forEach(l => {
      const k = l.created_at.slice(0, 10);
      if (buckets[k]) buckets[k].advertisers++;
    });
    Ld.forEach(l => {
      const k = l.created_at.slice(0, 10);
      if (buckets[k]) buckets[k].leads++;
    });
    const series = Object.values(buckets);

    const byCategory = ["hospedagem", "restaurante", "passeio", "experiencia"].map(c => ({
      category: c,
      count: L.filter(l => l.category === c).length,
    }));

    const planMix = [
      { name: "Premium",  value: premium },
      { name: "Destaque", value: featured },
      { name: "Gratuito", value: free },
    ];

    setData({
      advertisersAll, active, premium, featured, free, newAdvertisers,
      totalLeads, leadsInRange, posts, monthlyRevenue,
      series, byCategory, planMix,
    });
    setLoading(false);
  }

  return (
    <div>
      <PageHeader title="Dashboard executivo" subtitle="Visão em tempo real do ecossistema Estação Ilha Grande"
        actions={
          <div className="flex flex-wrap gap-1.5 bg-card border border-border rounded-xl p-1">
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  period.id === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}>{p.label}</button>
            ))}
          </div>
        } />

      {loading || !data ? (
        <div className="text-muted-foreground">Carregando métricas…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <StatCard label="Anunciantes" value={data.advertisersAll} icon={Users}
              hint={`${data.active} ativos`} accent="primary" />
            <StatCard label="Premium" value={data.premium} icon={Crown} accent="amber" />
            <StatCard label="Destaque" value={data.featured} icon={Sparkles} accent="rose" />
            <StatCard label="Novos no período" value={data.newAdvertisers} icon={Users} accent="emerald" />
            <StatCard label="Leads totais" value={data.totalLeads} icon={MessageSquare} accent="violet"
              hint={`${data.leadsInRange} no período`} />
            <StatCard label="Conteúdos" value={data.posts} icon={FileText} accent="sky" />
            <StatCard label="MRR estimado" value={`R$ ${data.monthlyRevenue.toLocaleString("pt-BR")}`}
              icon={DollarSign} accent="emerald" hint="Soma dos planos ativos" />
            <StatCard label="Avaliações" value={0} icon={Star} accent="amber" hint="Em breve" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
              <h3 className="font-display font-bold text-lg mb-4">Crescimento</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <AreaChart data={data.series} margin={{ left: -20, right: 8 }}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="advertisers" name="Anunciantes" stroke="hsl(var(--primary))" fill="url(#g1)" />
                    <Area type="monotone" dataKey="leads" name="Leads" stroke="#f59e0b" fill="url(#g2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="font-display font-bold text-lg mb-4">Mix de planos</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={data.planMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                      {data.planMix.map((_: any, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="font-display font-bold text-lg mb-4">Anunciantes por categoria</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={data.byCategory} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="category" fontSize={12} />
                  <YAxis fontSize={11} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

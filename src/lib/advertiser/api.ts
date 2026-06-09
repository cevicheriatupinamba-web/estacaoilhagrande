import { supabase } from "@/integrations/supabase/client";
import type { ListingEventType } from "./tracking";

export type PeriodKey = "today" | "7d" | "30d" | "90d" | "12m";

export const PERIOD_LABEL: Record<PeriodKey, string> = {
  today: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
  "12m": "Últimos 12 meses",
};

export function periodToRange(p: PeriodKey): { start: Date; end: Date; previous: { start: Date; end: Date } } {
  const end = new Date();
  const start = new Date();
  if (p === "today") start.setHours(0, 0, 0, 0);
  else if (p === "7d") start.setDate(start.getDate() - 7);
  else if (p === "30d") start.setDate(start.getDate() - 30);
  else if (p === "90d") start.setDate(start.getDate() - 90);
  else start.setMonth(start.getMonth() - 12);

  const durMs = end.getTime() - start.getTime();
  const previous = {
    start: new Date(start.getTime() - durMs),
    end: new Date(start.getTime()),
  };
  return { start, end, previous };
}

export interface ListingEventRow {
  id: number;
  listing_id: string;
  event_type: ListingEventType;
  session_id: string | null;
  created_at: string;
}

export async function fetchMyListingsWithSubscriptions(ownerId: string) {
  const [listings, subs] = await Promise.all([
    supabase
      .from("listings")
      .select("id,name,slug,category,plan,status,photos,whatsapp,phone,short_description,created_at")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false }),
  ]);
  return {
    listings: listings.data || [],
    subscriptions: subs.data || [],
  };
}

export async function fetchEventsForListings(
  listingIds: string[],
  start: Date,
  end: Date,
): Promise<ListingEventRow[]> {
  if (!listingIds.length) return [];
  const { data, error } = await supabase
    .from("listing_events")
    .select("id,listing_id,event_type,session_id,created_at")
    .in("listing_id", listingIds)
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString())
    .order("created_at", { ascending: true })
    .limit(10000);
  if (error) return [];
  return (data as ListingEventRow[]) || [];
}

export interface EventTotals {
  view: number;
  unique_visitors: number;
  whatsapp: number;
  phone: number;
  website: number;
  instagram: number;
  email: number;
  map: number;
  directions: number;
  share: number;
  favorite: number;
}

export function summarizeEvents(rows: ListingEventRow[]): EventTotals {
  const out: EventTotals = {
    view: 0, unique_visitors: 0, whatsapp: 0, phone: 0, website: 0,
    instagram: 0, email: 0, map: 0, directions: 0, share: 0, favorite: 0,
  };
  const sessions = new Set<string>();
  for (const r of rows) {
    if (r.event_type in out) (out as any)[r.event_type] += 1;
    if (r.event_type === "view" && r.session_id) sessions.add(r.session_id);
  }
  out.unique_visitors = sessions.size;
  return out;
}

export function bucketByDay(rows: ListingEventRow[], start: Date, end: Date) {
  const map = new Map<string, { views: number; contacts: number }>();
  const cur = new Date(start); cur.setHours(0, 0, 0, 0);
  const stop = new Date(end); stop.setHours(0, 0, 0, 0);
  const order: string[] = [];
  while (cur <= stop) {
    const key = cur.toISOString().slice(0, 10);
    map.set(key, { views: 0, contacts: 0 });
    order.push(key);
    cur.setDate(cur.getDate() + 1);
  }
  for (const r of rows) {
    const key = r.created_at.slice(0, 10);
    const b = map.get(key);
    if (!b) continue;
    if (r.event_type === "view") b.views += 1;
    if (["whatsapp", "phone", "email", "website", "instagram"].includes(r.event_type)) b.contacts += 1;
  }
  return order.map(d => ({ date: d, ...(map.get(d) as { views: number; contacts: number }) }));
}

export function pctDelta(curr: number, prev: number): number | null {
  if (prev === 0) return curr === 0 ? 0 : null;
  return ((curr - prev) / prev) * 100;
}

export const PLAN_PRICE: Record<string, { monthly: number; annual: number }> = {
  gratuito: { monthly: 0, annual: 0 },
  destaque: { monthly: 197, annual: 1891 },
  premium: { monthly: 397, annual: 3811 },
};

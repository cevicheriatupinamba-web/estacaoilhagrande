import { supabase } from "@/integrations/supabase/client";

export type ListingEventType =
  | "view"
  | "whatsapp"
  | "phone"
  | "website"
  | "instagram"
  | "email"
  | "map"
  | "directions"
  | "share"
  | "favorite";

const SESSION_KEY = "eilha_session_id";
const DEDUPE_PREFIX = "eilha_view_";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto as any)?.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/**
 * Track an event on a listing. Errors are swallowed so tracking never blocks UX.
 * 'view' events are deduplicated per session+listing per 30 min to avoid inflation.
 */
export async function trackListingEvent(
  listingId: string | null | undefined,
  eventType: ListingEventType,
): Promise<void> {
  if (!listingId) return;

  if (eventType === "view") {
    try {
      const key = DEDUPE_PREFIX + listingId;
      const last = Number(sessionStorage.getItem(key) || 0);
      if (Date.now() - last < 30 * 60 * 1000) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch { /* ignore */ }
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from("listing_events").insert({
      listing_id: listingId,
      event_type: eventType,
      session_id: getSessionId(),
      user_id: userData?.user?.id ?? null,
      referrer: typeof document !== "undefined" ? (document.referrer.slice(0, 500) || null) : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : null,
    });
  } catch { /* never block UI on tracking */ }
}

import { supabase } from "@/integrations/supabase/client";

export async function logActivity(params: {
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("activity_logs").insert({
    actor_id: user.id,
    actor_email: user.email ?? null,
    action: params.action,
    resource_type: params.resource_type ?? null,
    resource_id: params.resource_id ?? null,
    metadata: (params.metadata ?? {}) as never,
  });
}

// Edge function: admin-create-user
// Creates a new auth user (with email+password already confirmed) and assigns a role.
// Caller MUST be authenticated as a Super Admin or Admin (verified via JWT + has_role).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Role =
  | "super_admin" | "admin" | "financial_manager" | "content_manager"
  | "support_agent" | "advertiser" | "user";

interface Payload {
  email: string;
  password: string;
  name?: string;
  role: Role;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Não autenticado" }, 401);
    }

    // Verify caller identity & admin role using their JWT
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Sessão inválida" }, 401);

    const { data: isAdmin, error: roleErr } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleErr) return json({ error: roleErr.message }, 500);
    if (!isAdmin) return json({ error: "Apenas administradores" }, 403);

    const body = (await req.json()) as Payload;
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const role = body.role;
    const name = body.name?.trim() ?? "";

    if (!email || !password || password.length < 6) {
      return json({ error: "E-mail e senha (mín. 6 caracteres) obrigatórios" }, 400);
    }
    const validRoles: Role[] = [
      "super_admin", "admin", "financial_manager", "content_manager",
      "support_agent", "advertiser", "user",
    ];
    if (!validRoles.includes(role)) return json({ error: "Papel inválido" }, 400);

    // Only super_admin can create super_admin
    if (role === "super_admin") {
      const { data: isSuper } = await userClient.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "super_admin",
      });
      if (!isSuper) return json({ error: "Apenas Super Admin pode criar Super Admin" }, 403);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: name ? { name } : undefined,
    });
    if (createErr || !created.user) return json({ error: createErr?.message ?? "Falha ao criar usuário" }, 400);

    const newUserId = created.user.id;

    // Ensure profile (in case no trigger)
    await admin.from("profiles").upsert({
      user_id: newUserId,
      name: name || email.split("@")[0],
      email,
    }, { onConflict: "user_id" });

    if (role !== "user") {
      const { error: rErr } = await admin.from("user_roles").insert({ user_id: newUserId, role });
      if (rErr && rErr.code !== "23505") {
        return json({ error: `Usuário criado, mas falhou ao atribuir papel: ${rErr.message}` }, 500);
      }
    }

    return json({ ok: true, user_id: newUserId });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

import { userIsStaffRole } from "@/lib/auth/app-role";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type Ok = { ok: true; userId: string };
type Err = { ok: false; error: string };

/**
 * Garante sessão e bloqueia contas com app_role staff (ações de organizador).
 */
export async function organizerActionGate(): Promise<Ok | Err> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return { ok: false, error: "Faça login para continuar." };
  }
  if (userIsStaffRole(user)) {
    return {
      ok: false,
      error: "Esta ação é só para organizadores. Use o painel da equipe em /staff/events.",
    };
  }
  return { ok: true, userId: user.id };
}

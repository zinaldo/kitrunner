import { redirect } from "next/navigation";
import { userIsStaffRole } from "@/lib/auth/app-role";
import {
  adminEventsPath,
  loginPath,
  staffEventsPath,
} from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/**
 * Raiz: nunca hub MVP — convidados vão ao login (middleware + segurança aqui);
 * com sessão, encaminha para o painel adequado.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(loginPath());
  }

  if (userIsStaffRole(user)) {
    redirect(staffEventsPath());
  }

  redirect(adminEventsPath());
}

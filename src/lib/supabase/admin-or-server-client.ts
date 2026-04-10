import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { createSupabaseAdminServerClient } from "@/lib/supabase/admin-server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type AdminOrServerSupabase = {
  supabase: SupabaseClient<Database>;
  /** Cliente service role quando configurado (pode ser `null`). */
  admin: ReturnType<typeof createSupabaseAdminServerClient>;
};

/**
 * Prefer service role no servidor quando existir; senão cliente com cookies.
 * Unifica o tipo para `SupabaseClient<Database>` — `createClient` e `createServerClient`
 * divergem nos genéricos e quebram o build se misturados sem cast.
 */
export async function getSupabaseAdminOrServer(): Promise<AdminOrServerSupabase> {
  const admin = createSupabaseAdminServerClient();
  const supabase = (admin ??
    (await createSupabaseServerClient())) as unknown as SupabaseClient<Database>;
  return { supabase, admin };
}

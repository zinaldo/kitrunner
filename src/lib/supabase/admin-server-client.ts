import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Server-only client that bypasses RLS. Use for trusted admin/server reads when
 * `SUPABASE_SERVICE_ROLE_KEY` is set (Dashboard → Settings → API → service_role).
 * Never expose this key to the browser.
 */
export function createSupabaseAdminServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    return null;
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

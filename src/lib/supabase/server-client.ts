import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Server Supabase client (Server Components, Route Handlers, Server Actions).
 * Uses the anon key + cookie jar; add RLS policies for your MVP rules.
 *
 * Return type is asserted: `createServerClient` from @supabase/ssr uses schema
 * generics that differ from `SupabaseClient<Database>` and break strict builds
 * when passed to query helpers typed against @supabase/supabase-js.
 */
export async function createSupabaseServerClient(): Promise<
  SupabaseClient<Database>
> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server Component — cookie mutation not always allowed */
        }
      },
    },
  }) as SupabaseClient<Database>;
}

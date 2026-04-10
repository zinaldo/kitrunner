import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Server Supabase client (Server Components, Route Handlers, Server Actions).
 * Uses the anon key + cookie jar; add RLS policies for your MVP rules.
 *
 * `createServerClient` is still typed as `SupabaseClient<Database, …, Schema>`
 * while `supabase-js` 2.49+ uses extra generics; a single `as` is rejected, so
 * we bridge via `unknown` (see supabase/ssr#106).
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
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server Component — cookie mutation not always allowed */
        }
      },
    },
  }) as unknown as SupabaseClient<Database>;
}

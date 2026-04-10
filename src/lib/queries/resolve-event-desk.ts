import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function looksLikeUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

export type ResolvedEventRow = {
  id: string;
  name: string;
  event_date: string | null;
};

export async function resolveEventRow(
  supabase: SupabaseClient<Database>,
  eventParam: string,
): Promise<ResolvedEventRow | null> {
  const key = eventParam.trim();
  if (!key) return null;

  if (looksLikeUuid(key)) {
    const { data, error } = await supabase
      .from("events")
      .select("id, name, event_date")
      .eq("id", key)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }

  const { data, error } = await supabase
    .from("events")
    .select("id, name, event_date")
    .eq("slug", key)
    .maybeSingle();
  if (error) throw error;
  if (data) return data;

  const { data: bySlugCi, error: ciError } = await supabase
    .from("events")
    .select("id, name, event_date")
    .ilike("slug", key)
    .maybeSingle();
  if (ciError) throw ciError;
  return bySlugCi ?? null;
}

export async function resolveDeskRow(
  supabase: SupabaseClient<Database>,
  eventId: string,
  deskParam: string,
): Promise<{ id: string; label: string } | null> {
  const key = deskParam.trim();
  if (!key) return null;

  if (looksLikeUuid(key)) {
    const { data, error } = await supabase
      .from("desks")
      .select("id, label")
      .eq("event_id", eventId)
      .eq("id", key)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }

  const { data, error } = await supabase
    .from("desks")
    .select("id, label")
    .eq("event_id", eventId)
    .eq("external_key", key)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

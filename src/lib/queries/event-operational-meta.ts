import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type EventOperationalMeta = {
  starts_at: string | null;
  event_date: string | null;
  status: Database["public"]["Tables"]["events"]["Row"]["status"];
};

export async function fetchEventOperationalMeta(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<EventOperationalMeta | null> {
  const { data, error } = await supabase
    .from("events")
    .select("starts_at, event_date, status")
    .eq("id", eventId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

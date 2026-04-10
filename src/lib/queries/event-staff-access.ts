import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export async function userIsEventStaff(
  supabase: SupabaseClient<Database>,
  userId: string,
  eventId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("event_staff")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data != null;
}

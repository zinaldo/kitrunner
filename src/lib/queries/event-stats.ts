import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type EventStatsCounts = {
  delivered: number;
  pending: number;
  atDesk: number;
  /** All registration rows for the event (roster size). */
  totalRegistrations: number;
};

export async function fetchEventStats(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<EventStatsCounts> {
  const [deliveredRes, pendingRes, atDeskRes, totalRes] = await Promise.all([
    supabase
      .from("deliveries")
      .select("registration_id, registrations!inner(event_id)", {
        count: "exact",
        head: true,
      })
      .eq("registrations.event_id", eventId),
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("kit_status", "pending"),
    supabase
      .from("desk_display_state")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .not("registration_id", "is", null),
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId),
  ]);

  if (deliveredRes.error) throw deliveredRes.error;
  if (pendingRes.error) throw pendingRes.error;
  if (atDeskRes.error) throw atDeskRes.error;
  if (totalRes.error) throw totalRes.error;

  return {
    delivered: deliveredRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    atDesk: atDeskRes.count ?? 0,
    totalRegistrations: totalRes.count ?? 0,
  };
}

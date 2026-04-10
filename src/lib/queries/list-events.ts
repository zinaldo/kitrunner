import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type StaffPickerDeskRow = Pick<
  Database["public"]["Tables"]["desks"]["Row"],
  "id" | "event_id" | "label" | "external_key" | "sort_order" | "is_active"
>;

export type AdminEventListRow = {
  id: string;
  name: string;
  slug: string | null;
  status: Database["public"]["Tables"]["events"]["Row"]["status"];
  registrationCount: number | null;
};

function mapRegistrationCount(
  registrations: unknown,
): number | null {
  if (!Array.isArray(registrations) || registrations.length === 0) {
    return null;
  }
  const first = registrations[0] as { count?: number };
  return typeof first.count === "number" ? first.count : null;
}

/**
 * Lists events for admin UI. Tries to include registration counts via embed;
 * falls back to events-only if the count embed fails (e.g. RLS on registrations).
 */
export async function fetchAdminEventsList(
  supabase: SupabaseClient<Database>,
): Promise<AdminEventListRow[]> {
  const withCounts = await supabase
    .from("events")
    .select("id, name, slug, status, registrations(count)")
    .order("name", { ascending: true });

  if (!withCounts.error && withCounts.data) {
    return withCounts.data.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      status: row.status,
      registrationCount: mapRegistrationCount(row.registrations),
    }));
  }

  const basic = await supabase
    .from("events")
    .select("id, name, slug, status")
    .order("name", { ascending: true });

  if (basic.error) throw basic.error;

  return (basic.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    registrationCount: null,
  }));
}

export type StaffEventDeskLink = {
  /** Pass to `staffDeskPath` as desk segment (external_key or desk UUID). */
  routeKey: string;
  label: string;
};

export type StaffEventCardRow = {
  id: string;
  name: string;
  slug: string | null;
  desks: StaffEventDeskLink[];
};

/**
 * Events with active desks for staff workstation picker (links use slug when set).
 * Only events where `staffUserId` appears in `event_staff`.
 */
export async function fetchStaffEventsWithDesksForUser(
  supabase: SupabaseClient<Database>,
  staffUserId: string,
): Promise<StaffEventCardRow[]> {
  const staffRes = await supabase
    .from("event_staff")
    .select("event_id")
    .eq("user_id", staffUserId);

  if (staffRes.error) throw staffRes.error;

  const eventIds = [
    ...new Set((staffRes.data ?? []).map((r) => r.event_id)),
  ];
  if (eventIds.length === 0) return [];

  const [eventsRes, desksRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, slug")
      .in("id", eventIds)
      .order("name", { ascending: true }),
    supabase
      .from("desks")
      .select("id, event_id, label, external_key, sort_order, is_active")
      .in("event_id", eventIds)
      .order("sort_order", { ascending: true }),
  ]);

  if (eventsRes.error) throw eventsRes.error;
  if (desksRes.error) throw desksRes.error;

  const desksByEvent = new Map<string, StaffPickerDeskRow[]>();
  for (const d of desksRes.data ?? []) {
    if (!d.is_active) continue;
    const list = desksByEvent.get(d.event_id) ?? [];
    list.push(d);
    desksByEvent.set(d.event_id, list);
  }

  return (eventsRes.data ?? []).map((e) => {
    const desks = desksByEvent.get(e.id) ?? [];
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      desks: desks.map((d) => ({
        routeKey: d.external_key?.trim() || d.id,
        label: d.label,
      })),
    };
  });
}

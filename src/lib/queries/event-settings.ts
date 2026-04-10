import type { SupabaseClient } from "@supabase/supabase-js";
import { isMissingSchemaEntityError } from "@/lib/supabase/column-error";
import type { Database } from "@/lib/supabase/types";

export type EventSettingsRow = Pick<
  Database["public"]["Tables"]["events"]["Row"],
  "id" | "name" | "slug" | "event_date" | "starts_at" | "ends_at" | "status"
>;

export type RaceSettingsRow = Pick<
  Database["public"]["Tables"]["races"]["Row"],
  "id" | "name" | "distance_km" | "wave" | "sort_order"
>;

export type DeskSettingsRow = Pick<
  Database["public"]["Tables"]["desks"]["Row"],
  "id" | "label" | "sort_order" | "is_active" | "external_key"
>;

export type KitTypeSettingsRow = Pick<
  Database["public"]["Tables"]["kit_types"]["Row"],
  "id" | "name"
>;

export type KitItemSettingsRow = Pick<
  Database["public"]["Tables"]["kit_items"]["Row"],
  "id" | "kit_type_id" | "label"
>;

export type EventStaffSettingsRow = Pick<
  Database["public"]["Tables"]["event_staff"]["Row"],
  "id" | "user_id" | "role"
> & {
  /** Filled when loading with service_role + Admin API. */
  email?: string | null;
};

const EVENT_SETTINGS_SELECT =
  "id, name, slug, event_date, starts_at, ends_at, status";

export async function fetchEventSettingsRow(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<EventSettingsRow | null> {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SETTINGS_SELECT)
    .eq("id", eventId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchRacesForEventSettings(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<RaceSettingsRow[]> {
  const { data, error } = await supabase
    .from("races")
    .select("id, name, distance_km, wave, sort_order")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchDesksForEventSettings(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<DeskSettingsRow[]> {
  const { data, error } = await supabase
    .from("desks")
    .select("id, label, sort_order, is_active, external_key")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchKitTypesForEventSettings(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<KitTypeSettingsRow[]> {
  const { data, error } = await supabase
    .from("kit_types")
    .select("id, name")
    .eq("event_id", eventId)
    .order("name", { ascending: true });
  if (error) {
    if (isMissingSchemaEntityError(error.message, "kit_types")) {
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export async function fetchKitItemsForEventSettings(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<KitItemSettingsRow[]> {
  const types = await fetchKitTypesForEventSettings(supabase, eventId);
  if (types.length === 0) return [];

  const ids = types.map((t) => t.id);
  const { data, error } = await supabase
    .from("kit_items")
    .select("id, kit_type_id, label")
    .in("kit_type_id", ids)
    .order("label", { ascending: true });

  if (error) {
    if (isMissingSchemaEntityError(error.message, "kit_items")) {
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export async function fetchEventStaffForSettings(
  supabase: SupabaseClient<Database>,
  eventId: string,
  options?: {
    /** When set, loads e-mail per user via `auth.admin.getUserById` (service_role). */
    enrichEmailsWithAdmin?: SupabaseClient<Database> | null;
  },
): Promise<EventStaffSettingsRow[]> {
  const { data, error } = await supabase
    .from("event_staff")
    .select("id, user_id, role")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });
  if (error) {
    if (isMissingSchemaEntityError(error.message, "event_staff")) {
      return [];
    }
    throw error;
  }

  const rows = data ?? [];
  const admin = options?.enrichEmailsWithAdmin;
  if (!admin) {
    return rows;
  }

  return Promise.all(
    rows.map(async (row) => {
      const { data: u, error: userErr } = await admin.auth.admin.getUserById(
        row.user_id,
      );
      if (userErr || !u?.user) {
        return { ...row, email: null as string | null };
      }
      return { ...row, email: u.user.email ?? null };
    }),
  );
}

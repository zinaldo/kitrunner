import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { TvDeskTileRow } from "@/lib/display/map-tv-tiles";

export async function fetchTvWallTiles(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<TvDeskTileRow[]> {
  const { data, error } = await supabase
    .from("tv_desk_tiles")
    .select("*")
    .eq("event_id", eventId)
    .order("desk_sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as TvDeskTileRow[];
}

/** Uma linha da view para TV de guichê único (`/display/events/.../desk/...`). */
export async function fetchTvDeskTileForDesk(
  supabase: SupabaseClient<Database>,
  eventId: string,
  deskId: string,
): Promise<TvDeskTileRow | null> {
  const { data, error } = await supabase
    .from("tv_desk_tiles")
    .select("*")
    .eq("event_id", eventId)
    .eq("desk_id", deskId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as TvDeskTileRow | null;
}

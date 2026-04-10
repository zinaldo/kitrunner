import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const SEARCH_REGISTRATION_SELECT =
  "id, full_name, bib_number, document_id, registration_proof_code, kit_status, metadata, sex, team, birth_date, shirt_size, race_id, kit_type_id, races ( name, wave ), kit_types ( name )";

export type SearchRegistrationRow = {
  id: string;
  full_name: string;
  bib_number: string;
  document_id: string | null;
  registration_proof_code: string | null;
  kit_status: Database["public"]["Tables"]["registrations"]["Row"]["kit_status"];
  metadata: Database["public"]["Tables"]["registrations"]["Row"]["metadata"];
  sex: string | null;
  team: string | null;
  birth_date: string | null;
  shirt_size: string | null;
  race_id: string | null;
  kit_type_id: string | null;
  races: { name: string; wave: string | null } | null;
  kit_types: { name: string } | null;
};

/** Strip ILIKE wildcards from user input to avoid pattern injection. */
export function sanitizeSearchToken(raw: string): string {
  return raw.replace(/[%_]/g, " ").trim();
}

export async function searchRegistrations(
  supabase: SupabaseClient<Database>,
  eventId: string,
  query: string,
  limit = 20,
): Promise<SearchRegistrationRow[]> {
  const token = sanitizeSearchToken(query);
  if (!token) return [];

  const pattern = `%${token}%`;

  const { data, error } = await supabase
    .from("registrations")
    .select(SEARCH_REGISTRATION_SELECT)
    .eq("event_id", eventId)
    .ilike("search_text", pattern)
    .order("bib_number", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as SearchRegistrationRow[];
}

export async function fetchSearchRegistrationById(
  supabase: SupabaseClient<Database>,
  eventId: string,
  registrationId: string,
): Promise<SearchRegistrationRow | null> {
  const { data, error } = await supabase
    .from("registrations")
    .select(SEARCH_REGISTRATION_SELECT)
    .eq("event_id", eventId)
    .eq("id", registrationId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as SearchRegistrationRow | null;
}

"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type ProjectToTvInput = {
  eventId: string;
  deskId: string;
  registrationId: string;
  /** Omit until auth; column allows null. */
  updatedByUserId?: string | null;
};

export async function projectToTvAction(
  input: ProjectToTvInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("desk_display_state")
      .update({
        registration_id: input.registrationId,
        event_id: input.eventId,
        updated_by_user_id: input.updatedByUserId ?? null,
        display_variant: "processing",
      })
      .eq("desk_id", input.deskId);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Falha ao projetar na TV";
    return { ok: false, error: message };
  }
}

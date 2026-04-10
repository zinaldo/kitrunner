"use server";

import { userIsEventStaff } from "@/lib/queries/event-staff-access";
import {
  searchRegistrations,
  type SearchRegistrationRow,
} from "@/lib/queries/search-registrations";
import { looksLikeUuid } from "@/lib/queries/resolve-event-desk";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function searchRegistrationsAction(
  eventId: string,
  query: string,
): Promise<{ ok: true; rows: SearchRegistrationRow[] } | { ok: false; error: string }> {
  try {
    if (!looksLikeUuid(eventId)) {
      return { ok: false, error: "Evento inválido." };
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return {
        ok: false,
        error: "Sessão inválida ou expirada. Faça login como equipe.",
      };
    }

    const staffOk = await userIsEventStaff(supabase, user.id, eventId);
    if (!staffOk) {
      return { ok: false, error: "Sem permissão para buscar nesta prova." };
    }

    const rows = await searchRegistrations(supabase, eventId, query);
    return { ok: true, rows };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha na busca";
    return { ok: false, error: message };
  }
}

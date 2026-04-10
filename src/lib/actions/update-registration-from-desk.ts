"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseBirthDateCell } from "@/lib/import/parse-birth-date";
import { userIsEventStaff } from "@/lib/queries/event-staff-access";
import { looksLikeUuid } from "@/lib/queries/resolve-event-desk";
import {
  fetchSearchRegistrationById,
  type SearchRegistrationRow,
} from "@/lib/queries/search-registrations";
import { buildRegistrationSearchText } from "@/lib/registrations/search-text";
import { createSupabaseAdminServerClient } from "@/lib/supabase/admin-server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { Database, Json } from "@/lib/supabase/types";

export type UpdateRegistrationFromDeskInput = {
  eventId: string;
  registrationId: string;
  full_name: string;
  bib_number: string;
  sex: string;
  team: string;
  document_id: string;
  registration_proof_code: string;
  birth_date: string;
  shirt_size: string;
  age_group: string;
  /** Vazio = sem modalidade */
  race_id: string;
  /** Vazio = sem tipo de kit */
  kit_type_id: string;
};

function mergeMetadataAgeGroup(
  existing: Json | null,
  ageGroupRaw: string,
): Json | null {
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};
  const t = ageGroupRaw.trim();
  if (t) base.age_group = t;
  else delete base.age_group;
  const keys = Object.keys(base);
  if (keys.length === 0) return null;
  return base as Json;
}

export async function updateRegistrationFromDeskAction(
  input: UpdateRegistrationFromDeskInput,
): Promise<
  | { ok: true; row: SearchRegistrationRow }
  | { ok: false; error: string }
> {
  try {
    if (!looksLikeUuid(input.eventId) || !looksLikeUuid(input.registrationId)) {
      return { ok: false, error: "Identificadores inválidos." };
    }

    const full_name = input.full_name.trim();
    const bib_number = input.bib_number.replace(/\s/g, "");
    if (!full_name) {
      return { ok: false, error: "Nome completo é obrigatório." };
    }
    if (!bib_number) {
      return { ok: false, error: "Número de peito é obrigatório." };
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

    const staffOk = await userIsEventStaff(supabase, user.id, input.eventId);
    if (!staffOk) {
      return { ok: false, error: "Sem permissão para editar esta prova." };
    }

    const admin = createSupabaseAdminServerClient();
    const writeClient = (admin ?? supabase) as unknown as SupabaseClient<Database>;

    const existing = await fetchSearchRegistrationById(
      writeClient,
      input.eventId,
      input.registrationId,
    );
    if (!existing) {
      return { ok: false, error: "Inscrição não encontrada nesta prova." };
    }

    let race_id: string | null = null;
    const raceRaw = input.race_id.trim();
    if (raceRaw) {
      if (!looksLikeUuid(raceRaw)) {
        return { ok: false, error: "Modalidade inválida." };
      }
      const { data: raceRow, error: raceErr } = await writeClient
        .from("races")
        .select("id")
        .eq("id", raceRaw)
        .eq("event_id", input.eventId)
        .maybeSingle();
      if (raceErr) return { ok: false, error: raceErr.message };
      if (!raceRow) {
        return { ok: false, error: "Modalidade não pertence a esta prova." };
      }
      race_id = raceRow.id;
    }

    let kit_type_id: string | null = null;
    const kitRaw = input.kit_type_id.trim();
    if (kitRaw) {
      if (!looksLikeUuid(kitRaw)) {
        return { ok: false, error: "Tipo de kit inválido." };
      }
      const { data: kitRow, error: kitErr } = await writeClient
        .from("kit_types")
        .select("id")
        .eq("id", kitRaw)
        .eq("event_id", input.eventId)
        .maybeSingle();
      if (kitErr) return { ok: false, error: kitErr.message };
      if (!kitRow) {
        return { ok: false, error: "Tipo de kit não pertence a esta prova." };
      }
      kit_type_id = kitRow.id;
    }

    const birth_date = input.birth_date.trim()
      ? parseBirthDateCell(input.birth_date.trim())
      : null;
    if (input.birth_date.trim() && !birth_date) {
      return { ok: false, error: "Data de nascimento inválida." };
    }

    const sex = input.sex.trim() || null;
    const team = input.team.trim() || null;
    const document_id = input.document_id.trim() || null;
    const registration_proof_code =
      input.registration_proof_code.trim() || null;
    const shirt_size = input.shirt_size.trim() || null;

    const metadata = mergeMetadataAgeGroup(existing.metadata, input.age_group);

    const search_text = buildRegistrationSearchText({
      full_name,
      bib_number,
      document_id,
      registration_proof_code,
      shirt_size,
    });

    const { error: updateError } = await writeClient
      .from("registrations")
      .update({
        full_name,
        bib_number,
        sex,
        team,
        document_id,
        registration_proof_code,
        birth_date,
        shirt_size,
        race_id,
        kit_type_id,
        metadata,
        search_text,
      })
      .eq("id", input.registrationId)
      .eq("event_id", input.eventId);

    if (updateError) {
      if (updateError.code === "23505") {
        return {
          ok: false,
          error:
            "Já existe outra inscrição com este número de peito nesta prova.",
        };
      }
      return { ok: false, error: updateError.message };
    }

    const row = await fetchSearchRegistrationById(
      writeClient,
      input.eventId,
      input.registrationId,
    );
    if (!row) {
      return {
        ok: false,
        error: "Dados salvos, mas não foi possível recarregar a inscrição.",
      };
    }

    return { ok: true, row };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Falha ao atualizar inscrição";
    return { ok: false, error: message };
  }
}

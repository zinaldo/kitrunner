import type { SupabaseClient } from "@supabase/supabase-js";
import {
  defaultImportRulesState,
  type EventImportRulesState,
  IMPORT_FIELD_KEYS,
  type ImportFieldKey,
} from "@/lib/event-import-rules";
import { isMissingSchemaEntityError } from "@/lib/supabase/column-error";
import type { Database } from "@/lib/supabase/types";

export type EventRequiredFieldRow = Pick<
  Database["public"]["Tables"]["event_required_fields"]["Row"],
  | "field_key"
  | "label"
  | "is_enabled"
  | "is_required"
  | "sort_order"
>;

/** Rótulos padrão (admin pode sobrescrever em event_required_fields). */
export const IMPORT_FIELD_DEFAULT_LABELS: Record<ImportFieldKey, string> = {
  bib_number: "Peito (bib_number)",
  full_name: "Nome completo",
  sex: "Sexo",
  race_id: "Modalidade (nome da prova em races)",
  document_id: "Documento",
  team: "Equipe",
  birth_date: "Data de nascimento",
  age_group: "Faixa etária (metadata.age_group)",
  registration_proof_code: "Comprovante / código de inscrição",
  kit_type: "Kit (nome em kit_types)",
  shirt_size: "Tamanho da camisa",
};

export function isImportFieldKey(k: string): k is ImportFieldKey {
  return (IMPORT_FIELD_KEYS as readonly string[]).includes(k);
}

/** Build UI/import state from DB rows (merge with defaults for missing keys). */
export function importRulesFromFieldRows(
  rows: EventRequiredFieldRow[],
): EventImportRulesState {
  const base = defaultImportRulesState();
  const byKey = new Map<string, EventRequiredFieldRow>();
  for (const r of rows) {
    if (isImportFieldKey(r.field_key)) {
      byKey.set(r.field_key, r);
    }
  }
  for (const key of IMPORT_FIELD_KEYS) {
    const row = byKey.get(key);
    if (!row) continue;
    if (!row.is_enabled) base[key] = "off";
    else if (row.is_required) base[key] = "required";
    else base[key] = "optional";
  }
  base.bib_number = "required";
  base.full_name = "required";
  base.sex = "required";
  base.race_id = "required";
  return base;
}

function rowsForInsert(
  eventId: string,
  rules: EventImportRulesState,
): Database["public"]["Tables"]["event_required_fields"]["Insert"][] {
  return IMPORT_FIELD_KEYS.map((key, i) => ({
    event_id: eventId,
    field_key: key,
    label: IMPORT_FIELD_DEFAULT_LABELS[key],
    is_enabled: rules[key] !== "off",
    is_required: rules[key] === "required",
    sort_order: i,
  }));
}

/** Linhas de `event_required_fields` para UI (guichê, import, etc.). */
export async function fetchEventRequiredFieldRows(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<EventRequiredFieldRow[]> {
  const { data, error } = await supabase
    .from("event_required_fields")
    .select("field_key, label, is_enabled, is_required, sort_order")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true });

  if (error) {
    if (isMissingSchemaEntityError(error.message, "event_required_fields")) {
      return [];
    }
    throw error;
  }

  return (data ?? []) as EventRequiredFieldRow[];
}

/**
 * Loads import/column rules from `event_required_fields`.
 * If the table is missing or has no rows for this event, returns app defaults.
 */
export async function resolveImportRulesForEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<EventImportRulesState> {
  const rows = await fetchEventRequiredFieldRows(supabase, eventId);
  if (rows.length === 0) {
    return defaultImportRulesState();
  }

  return importRulesFromFieldRows(rows);
}

/** Replaces all configured fields for the event (one row per known `field_key`). */
export async function replaceEventRequiredFields(
  supabase: SupabaseClient<Database>,
  eventId: string,
  rules: EventImportRulesState,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const finalRules = {
    ...rules,
    bib_number: "required" as const,
    full_name: "required" as const,
    sex: "required" as const,
    race_id: "required" as const,
  };

  const { error: delErr } = await supabase
    .from("event_required_fields")
    .delete()
    .eq("event_id", eventId);

  if (delErr) {
    if (isMissingSchemaEntityError(delErr.message, "event_required_fields")) {
      return {
        ok: false,
        error:
          "Tabela event_required_fields não encontrada. Crie-a na migration do projeto (CREATE TABLE public.event_required_fields …).",
      };
    }
    return { ok: false, error: delErr.message };
  }

  const inserts = rowsForInsert(eventId, finalRules);
  const { error: insErr } = await supabase.from("event_required_fields").insert(inserts);
  if (insErr) {
    return { ok: false, error: insErr.message };
  }
  return { ok: true };
}

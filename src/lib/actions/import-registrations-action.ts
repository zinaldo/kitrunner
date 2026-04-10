"use server";

import { revalidatePath } from "next/cache";
import { organizerActionGate } from "@/lib/auth/require-organizer";
import { parseDelimitedText } from "@/lib/csv/parse-delimited-text";
import {
  prepareRegistrationImport,
  type PreparedImportRow,
} from "@/lib/import/prepare-registration-import";
import { resolveImportRulesForEvent } from "@/lib/queries/event-import-rules-resolve";
import {
  fetchEventSettingsRow,
  fetchKitTypesForEventSettings,
  fetchRacesForEventSettings,
} from "@/lib/queries/event-settings";
import { resolveEventRow } from "@/lib/queries/resolve-event-desk";
import { adminEventStatsPath } from "@/lib/routes";
import { getSupabaseAdminOrServer } from "@/lib/supabase/admin-or-server-client";

const MAX_FILE_BYTES = 6 * 1024 * 1024;
const MAX_ROWS = 10_000;
/** Inserções em lote; em falha (ex.: peito duplicado no lote), volta linha a linha só naquele lote. */
const INSERT_BATCH_SIZE = 500;

export type ImportRegistrationsResult =
  | {
      ok: true;
      inserted: number;
      skipped: number;
      rowErrors: { line: number; message: string }[];
      warnings: { line: number; message: string }[];
    }
  | { ok: false; error: string; errors?: { line: number; message: string }[] };

async function getServerSupabase() {
  const { supabase } = await getSupabaseAdminOrServer();
  return supabase;
}

export async function importRegistrationsAction(
  formData: FormData,
): Promise<ImportRegistrationsResult> {
  const eventParam = String(formData.get("eventParam") ?? "").trim();
  const file = formData.get("file");

  if (!eventParam) {
    return { ok: false, error: "Evento não informado." };
  }
  if (!(file instanceof File)) {
    return { ok: false, error: "Selecione um arquivo CSV." };
  }
  if (file.size === 0) {
    return { ok: false, error: "Arquivo vazio." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      error: `Arquivo muito grande (máx. ${Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB).`,
    };
  }

  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: "Não foi possível ler o arquivo." };
  }

  const { rows: parsed } = parseDelimitedText(text);
  if (parsed.length > MAX_ROWS + 1) {
    return {
      ok: false,
      error: `Muitas linhas (máx. ${MAX_ROWS} dados + cabeçalho).`,
    };
  }

  try {
    const gate = await organizerActionGate();
    if (!gate.ok) {
      return { ok: false, error: gate.error };
    }
    const supabase = await getServerSupabase();
    const event = await resolveEventRow(supabase, eventParam);
    if (!event) {
      return { ok: false, error: "Evento não encontrado." };
    }

    const [settings, raceRows, kitTypeRows, rules] = await Promise.all([
      fetchEventSettingsRow(supabase, event.id),
      fetchRacesForEventSettings(supabase, event.id),
      fetchKitTypesForEventSettings(supabase, event.id),
      resolveImportRulesForEvent(supabase, event.id),
    ]);

    if (!settings) {
      return { ok: false, error: "Evento não encontrado." };
    }
    const races = raceRows.map((r) => ({ id: r.id, name: r.name }));
    const kitTypes = kitTypeRows.map((k) => ({ id: k.id, name: k.name }));

    const prepared = prepareRegistrationImport({
      rows: parsed,
      rules,
      races,
      kitTypes,
      eventId: event.id,
    });

    if (!prepared.ok) {
      return { ok: false, error: "Validação do arquivo falhou.", errors: prepared.errors };
    }

    const rowErrors: { line: number; message: string }[] = [];
    let inserted = 0;
    let skipped = 0;

    async function insertOne(line: number, row: PreparedImportRow) {
      const { error } = await supabase.from("registrations").insert(row);
      if (error) {
        if (error.code === "23505") {
          rowErrors.push({
            line,
            message: `Peito ${row.bib_number}: já existe neste evento (duplicado no banco).`,
          });
          skipped += 1;
          return;
        }
        rowErrors.push({
          line,
          message: error.message || "Erro ao inserir linha.",
        });
        skipped += 1;
        return;
      }
      inserted += 1;
    }

    const items = prepared.items;
    for (let i = 0; i < items.length; i += INSERT_BATCH_SIZE) {
      const slice = items.slice(i, i + INSERT_BATCH_SIZE);
      const rows = slice.map((x) => x.row);
      const { error } = await supabase.from("registrations").insert(rows);
      if (!error) {
        inserted += slice.length;
        continue;
      }
      for (const { line, row } of slice) {
        await insertOne(line, row);
      }
    }

    const routeKey = settings.slug?.trim() || event.id;
    revalidatePath("/admin/events");
    revalidatePath(adminEventStatsPath(routeKey));
    revalidatePath(`/admin/events/${routeKey}/import`);

    return {
      ok: true,
      inserted,
      skipped,
      rowErrors,
      warnings: prepared.warnings,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha na importação.";
    return { ok: false, error: message };
  }
}

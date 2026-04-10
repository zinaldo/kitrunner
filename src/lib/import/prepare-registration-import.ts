import type { EventImportRulesState, ImportFieldKey } from "@/lib/event-import-rules";
import { IMPORT_FIELD_KEYS } from "@/lib/event-import-rules";
import type { Database } from "@/lib/supabase/types";
import { buildColumnIndexMap } from "@/lib/import/csv-header-map";
import { parseBirthDateCell } from "@/lib/import/parse-birth-date";
import {
  resolveKitTypeIdFromCell,
  type KitTypeLookupRow,
} from "@/lib/import/resolve-kit-type-id";
import {
  resolveRaceIdFromCell,
  type RaceLookupRow,
} from "@/lib/import/resolve-race-id";
import { buildRegistrationSearchText } from "@/lib/registrations/search-text";

export type RegistrationInsert = Database["public"]["Tables"]["registrations"]["Insert"];

export type PreparedImportRow = RegistrationInsert;

export type ImportRowError = {
  line: number;
  message: string;
};

function collectCell(
  row: string[],
  colMap: Map<number, ImportFieldKey>,
  key: ImportFieldKey,
  rules: EventImportRulesState,
): string {
  if (rules[key] === "off") return "";
  for (const [idx, k] of colMap) {
    if (k === key) {
      return (row[idx] ?? "").trim();
    }
  }
  return "";
}

function requiredKeysMissingFromHeader(
  colMap: Map<number, ImportFieldKey>,
  rules: EventImportRulesState,
): ImportFieldKey[] {
  const present = new Set(colMap.values());
  const missing: ImportFieldKey[] = [];
  for (const key of IMPORT_FIELD_KEYS) {
    if (rules[key] === "required" && !present.has(key)) {
      missing.push(key);
    }
  }
  return missing;
}

export function prepareRegistrationImport(args: {
  rows: string[][];
  rules: EventImportRulesState;
  races: RaceLookupRow[];
  kitTypes: KitTypeLookupRow[];
  eventId: string;
}):
  | {
      ok: false;
      errors: ImportRowError[];
    }
  | {
      ok: true;
      items: { line: number; row: PreparedImportRow }[];
      warnings: ImportRowError[];
    } {
  const { rows, rules, races, kitTypes, eventId } = args;
  if (rows.length < 2) {
    return {
      ok: false,
      errors: [{ line: 0, message: "Arquivo vazio ou só com cabeçalho." }],
    };
  }

  const headerRow = rows[0];
  const colMap = buildColumnIndexMap(headerRow);
  const headerMissing = requiredKeysMissingFromHeader(colMap, rules);
  if (headerMissing.length > 0) {
    return {
      ok: false,
      errors: [
        {
          line: 1,
          message: `Colunas obrigatórias ausentes no CSV: ${headerMissing.join(", ")}.`,
        },
      ],
    };
  }

  const dataRows = rows.slice(1);
  const out: { line: number; row: PreparedImportRow }[] = [];
  const warnings: ImportRowError[] = [];
  const seenBibs = new Set<string>();

  for (let i = 0; i < dataRows.length; i++) {
    const line = i + 2;
    const row = dataRows[i];
    if (row.every((c) => !String(c).trim())) continue;

    const bib_number = collectCell(row, colMap, "bib_number", rules).replace(/\s/g, "");
    if (seenBibs.has(bib_number)) {
      return {
        ok: false,
        errors: [{ line, message: `Peito duplicado no arquivo: ${bib_number}.` }],
      };
    }
    seenBibs.add(bib_number);
    const full_name = collectCell(row, colMap, "full_name", rules);
    const sexRaw = collectCell(row, colMap, "sex", rules);
    const document_idRaw = collectCell(row, colMap, "document_id", rules);
    const teamRaw = collectCell(row, colMap, "team", rules);
    const raceRaw = collectCell(row, colMap, "race_id", rules);
    const birthRaw = collectCell(row, colMap, "birth_date", rules);
    const ageGroupRaw = collectCell(row, colMap, "age_group", rules);
    const proofRaw = collectCell(row, colMap, "registration_proof_code", rules);
    const kitRaw = collectCell(row, colMap, "kit_type", rules);
    const shirtSizeRaw = collectCell(row, colMap, "shirt_size", rules);

    if (rules.bib_number === "required" && !bib_number) {
      return { ok: false, errors: [{ line, message: "Peito (bib_number) vazio." }] };
    }
    if (rules.full_name === "required" && !full_name.trim()) {
      return { ok: false, errors: [{ line, message: "Nome completo vazio." }] };
    }
    if (rules.sex === "required" && !sexRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Sexo vazio." }] };
    }
    if (rules.document_id === "required" && !document_idRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Documento vazio." }] };
    }
    if (rules.team === "required" && !teamRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Equipe vazia." }] };
    }
    if (rules.birth_date === "required" && !birthRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Data de nascimento vazia." }] };
    }
    if (rules.race_id === "required" && !raceRaw.trim()) {
      return {
        ok: false,
        errors: [{ line, message: "Modalidade (nome da prova) vazia." }],
      };
    }
    if (rules.age_group === "required" && !ageGroupRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Faixa etária vazia." }] };
    }
    if (rules.registration_proof_code === "required" && !proofRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Comprovante de inscrição vazio." }] };
    }
    if (rules.kit_type === "required" && !kitRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Tipo de kit vazio." }] };
    }
    if (rules.shirt_size === "required" && !shirtSizeRaw.trim()) {
      return { ok: false, errors: [{ line, message: "Tamanho da camisa vazio." }] };
    }

    let race_id: string | null = null;
    if (rules.race_id !== "off" && raceRaw) {
      const resolved = resolveRaceIdFromCell(raceRaw, races);
      if (!resolved.id) {
        if (rules.race_id === "required") {
          return {
            ok: false,
            errors: [
              {
                line,
                message: resolved.warning ?? "Não foi possível resolver a modalidade.",
              },
            ],
          };
        }
        if (resolved.warning) {
          warnings.push({ line, message: resolved.warning });
        }
      } else {
        race_id = resolved.id;
      }
    }

    let kit_type_id: string | null = null;
    if (rules.kit_type !== "off" && kitRaw) {
      const resolvedKit = resolveKitTypeIdFromCell(kitRaw, kitTypes);
      if (!resolvedKit.id) {
        if (rules.kit_type === "required") {
          return {
            ok: false,
            errors: [
              {
                line,
                message: resolvedKit.warning ?? "Não foi possível resolver o tipo de kit.",
              },
            ],
          };
        }
        if (resolvedKit.warning) {
          warnings.push({ line, message: resolvedKit.warning });
        }
      } else {
        kit_type_id = resolvedKit.id;
      }
    }

    let birth_date: string | null = null;
    if (rules.birth_date !== "off" && birthRaw) {
      birth_date = parseBirthDateCell(birthRaw);
      if (!birth_date) {
        if (rules.birth_date === "required") {
          return {
            ok: false,
            errors: [{ line, message: `Data de nascimento inválida: “${birthRaw}”.` }],
          };
        }
        warnings.push({ line, message: `Data de nascimento ignorada: “${birthRaw}”.` });
      }
    }

    const document_id =
      rules.document_id === "off" ? null : document_idRaw.trim() || null;
    const team = rules.team === "off" ? null : teamRaw.trim() || null;
    const sex = rules.sex === "off" ? null : sexRaw.trim() || null;
    const registration_proof_code =
      rules.registration_proof_code === "off"
        ? null
        : proofRaw.trim() || null;
    const shirt_size =
      rules.shirt_size === "off" ? null : shirtSizeRaw.trim() || null;

    const age_group_trimmed =
      rules.age_group === "off" ? "" : ageGroupRaw.trim();
    const metadata =
      age_group_trimmed.length > 0
        ? ({ age_group: age_group_trimmed } satisfies Record<string, string>)
        : null;

    const search_text = buildRegistrationSearchText({
      full_name: full_name.trim(),
      bib_number,
      document_id,
      registration_proof_code,
      shirt_size,
    });

    out.push({
      line,
      row: {
        event_id: eventId,
        bib_number,
        full_name: full_name.trim(),
        search_text,
        kit_status: "pending",
        race_id,
        kit_type_id,
        birth_date,
        sex,
        document_id,
        team,
        registration_proof_code,
        shirt_size,
        metadata,
      },
    });
  }

  if (out.length === 0) {
    return {
      ok: false,
      errors: [{ line: 0, message: "Nenhuma linha de dados para importar." }],
    };
  }

  return { ok: true, items: out, warnings };
}

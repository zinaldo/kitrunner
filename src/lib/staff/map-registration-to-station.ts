import type { SearchRegistrationRow } from "@/lib/queries/search-registrations";
import type { StationParticipant } from "@/components/staff/station/participant-main-card";
import type { EventImportRulesState, ImportFieldKey } from "@/lib/event-import-rules";
import { IMPORT_FIELD_KEYS } from "@/lib/event-import-rules";
import { formatDateDotBr, formatDisplayTitleCase } from "@/lib/format-display-text";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function metaString(
  metadata: SearchRegistrationRow["metadata"],
  key: string,
): string {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "";
  }
  return str((metadata as Record<string, unknown>)[key]);
}

function rawValueForKey(row: SearchRegistrationRow, key: ImportFieldKey): string {
  switch (key) {
    case "bib_number":
      return row.bib_number;
    case "full_name":
      return row.full_name;
    case "sex":
      return row.sex?.trim() ?? "";
    case "race_id":
      return row.races?.name?.trim() ?? "";
    case "document_id":
      return row.document_id?.trim() ?? "";
    case "team":
      return row.team?.trim() ?? "";
    case "birth_date":
      return row.birth_date?.trim() ?? "";
    case "age_group":
      return metaString(row.metadata, "age_group").trim();
    case "registration_proof_code":
      return row.registration_proof_code?.trim() ?? "";
    case "kit_type":
      return row.kit_types?.name?.trim() ?? "";
    case "shirt_size":
      return row.shirt_size?.trim() ?? metaString(row.metadata, "shirt_size").trim();
    default:
      return "";
  }
}

function displayValueForKey(key: ImportFieldKey, raw: string): string {
  if (!raw) return "—";
  if (key === "birth_date") return formatDateDotBr(raw);
  if (
    key === "document_id" ||
    key === "registration_proof_code" ||
    key === "bib_number" ||
    key === "shirt_size"
  ) {
    return raw;
  }
  return formatDisplayTitleCase(raw);
}

export function buildRequiredFieldLines(
  row: SearchRegistrationRow,
  ctx: Pick<
    StationParticipantContext,
    "rules" | "fieldLabels" | "requiredFieldDisplayOrder"
  >,
): { label: string; value: string }[] {
  const order =
    ctx.requiredFieldDisplayOrder.length > 0
      ? ctx.requiredFieldDisplayOrder
      : [...IMPORT_FIELD_KEYS];
  const seen = new Set<ImportFieldKey>();
  const out: { label: string; value: string }[] = [];
  for (const key of order) {
    if (seen.has(key)) continue;
    seen.add(key);
    if (ctx.rules[key] !== "required") continue;
    if (key === "bib_number" || key === "full_name") continue;
    const raw = rawValueForKey(row, key);
    out.push({
      label: ctx.fieldLabels[key],
      value: displayValueForKey(key, raw),
    });
  }
  for (const key of IMPORT_FIELD_KEYS) {
    if (seen.has(key)) continue;
    if (ctx.rules[key] !== "required") continue;
    if (key === "bib_number" || key === "full_name") continue;
    const raw = rawValueForKey(row, key);
    out.push({
      label: ctx.fieldLabels[key],
      value: displayValueForKey(key, raw),
    });
  }
  return out;
}

export type StationParticipantContext = {
  rules: EventImportRulesState;
  fieldLabels: Record<ImportFieldKey, string>;
  /** Ordem em `event_required_fields`; vazio usa IMPORT_FIELD_KEYS. */
  requiredFieldDisplayOrder: ImportFieldKey[];
};

export function mapSearchRowToStationParticipant(
  row: SearchRegistrationRow,
  ctx: StationParticipantContext,
): StationParticipant {
  const doc = row.document_id ?? metaString(row.metadata, "document_id");
  const proof =
    row.registration_proof_code ??
    metaString(row.metadata, "registration_proof_code");

  let verifiedLine = "Inscrição registrada";
  if (doc && proof) verifiedLine = `Doc · ${doc} · Comprovante · ${proof}`;
  else if (doc) verifiedLine = `Documento: ${doc}`;
  else if (proof) verifiedLine = `Comprovante: ${proof}`;

  const kitSize =
    row.shirt_size?.trim() ||
    metaString(row.metadata, "shirt_size") ||
    metaString(row.metadata, "kit_size") ||
    "—";

  const raceName = row.races?.name ?? "—";
  const wave = row.races?.wave ?? "—";

  const { headline, detail } = kitStatusCopy(row.kit_status);

  const requiredFields = buildRequiredFieldLines(row, ctx);

  return {
    bib: row.bib_number,
    name: formatDisplayTitleCase(row.full_name),
    verifiedLine,
    kitSize,
    deliveryHeadline: headline,
    deliveryDetail: `${detail} · ${raceName}${wave !== "—" ? ` · ${wave}` : ""}`,
    requiredFields,
  };
}

function kitStatusCopy(
  status: SearchRegistrationRow["kit_status"],
): { headline: string; detail: string } {
  if (status === "delivered") {
    return { headline: "Kit entregue", detail: "Registrado no sistema" };
  }
  if (status === "at_desk") {
    return {
      headline: "No guichê de retirada",
      detail: "Confirme a identidade na tela pública",
    };
  }
  return {
    headline: "Ainda não passou no guichê",
    detail: "Aguardando retirada",
  };
}

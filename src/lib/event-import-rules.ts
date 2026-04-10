export const IMPORT_FIELD_KEYS = [
  "bib_number",
  "full_name",
  "sex",
  "race_id",
  "document_id",
  "team",
  "birth_date",
  "age_group",
  "registration_proof_code",
  "kit_type",
  "shirt_size",
] as const;

export type ImportFieldKey = (typeof IMPORT_FIELD_KEYS)[number];

export type ImportColumnMode = "required" | "optional" | "off";

export type EventImportRulesState = Record<ImportFieldKey, ImportColumnMode>;

const DEFAULT_MODES: EventImportRulesState = {
  bib_number: "required",
  full_name: "required",
  sex: "required",
  race_id: "required",
  document_id: "optional",
  team: "optional",
  birth_date: "optional",
  age_group: "optional",
  registration_proof_code: "optional",
  kit_type: "optional",
  shirt_size: "optional",
};

export function defaultImportRulesState(): EventImportRulesState {
  return { ...DEFAULT_MODES };
}

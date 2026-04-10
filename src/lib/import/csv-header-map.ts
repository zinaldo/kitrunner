import type { ImportFieldKey } from "@/lib/event-import-rules";
import { IMPORT_FIELD_KEYS } from "@/lib/event-import-rules";

const KNOWN_HEADERS = new Set<string>(IMPORT_FIELD_KEYS as unknown as string[]);

function normalizeHeaderLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

/**
 * Maps normalized header labels (and common PT/EN aliases) to canonical import keys.
 */
const ALIASES: Record<string, ImportFieldKey> = {
  bib_number: "bib_number",
  peito: "bib_number",
  bib: "bib_number",
  numero_do_peito: "bib_number",
  numeropeito: "bib_number",
  n_peito: "bib_number",
  dorsal: "bib_number",
  full_name: "full_name",
  nome: "full_name",
  nome_completo: "full_name",
  name: "full_name",
  participante: "full_name",
  atleta: "full_name",
  sex: "sex",
  sexo: "sex",
  genero: "sex",
  gender: "sex",
  document_id: "document_id",
  cpf: "document_id",
  documento: "document_id",
  rg: "document_id",
  doc: "document_id",
  race_id: "race_id",
  prova: "race_id",
  modalidade: "race_id",
  race: "race_id",
  corrida: "race_id",
  id_prova: "race_id",
  nome_modalidade: "race_id",
  team: "team",
  equipe: "team",
  time: "team",
  clube: "team",
  birth_date: "birth_date",
  data_nascimento: "birth_date",
  nascimento: "birth_date",
  dt_nasc: "birth_date",
  data_nasc: "birth_date",
  dn: "birth_date",
  age_group: "age_group",
  faixa_etaria: "age_group",
  faixa: "age_group",
  faixa_etaria_categoria: "age_group",
  categoria: "age_group",
  registration_proof_code: "registration_proof_code",
  comprovante: "registration_proof_code",
  codigo_inscricao: "registration_proof_code",
  codigo_comprovante: "registration_proof_code",
  proof: "registration_proof_code",
  kit_type: "kit_type",
  kit: "kit_type",
  tipo_kit: "kit_type",
  tipo_de_kit: "kit_type",
  tipokit: "kit_type",
  shirt_size: "shirt_size",
  tamanho_camisa: "shirt_size",
  tamanho_da_camisa: "shirt_size",
  tam_camisa: "shirt_size",
  tam_camiseta: "shirt_size",
  camisa_tamanho: "shirt_size",
  tamanho_da_camiseta: "shirt_size",
  tamanho_camiseta: "shirt_size",
};

export function headerCellToFieldKey(cell: string): ImportFieldKey | null {
  const n = normalizeHeaderLabel(cell);
  if (!n) return null;
  if (KNOWN_HEADERS.has(n)) return n as ImportFieldKey;
  return ALIASES[n] ?? null;
}

export function buildColumnIndexMap(headerRow: string[]): Map<number, ImportFieldKey> {
  const map = new Map<number, ImportFieldKey>();
  headerRow.forEach((cell, i) => {
    const key = headerCellToFieldKey(cell);
    if (key) map.set(i, key);
  });
  return map;
}

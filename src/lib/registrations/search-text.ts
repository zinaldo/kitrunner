/** Documento no search_text: só letras e números (CPF/RG buscável sem pontos e traços). */
export function documentForSearchText(document_id: string | null): string | null {
  if (!document_id || !document_id.trim()) return null;
  const stripped = document_id.replace(/[^\p{L}\p{N}]/gu, "");
  return stripped.length > 0 ? stripped : null;
}

/** Montado automaticamente: nome, peito, documento, comprovante, tamanho da camisa. */
export function buildRegistrationSearchText(parts: {
  full_name: string;
  bib_number: string;
  document_id: string | null;
  registration_proof_code: string | null;
  shirt_size: string | null;
}): string {
  const chunks = [
    parts.full_name,
    parts.bib_number,
    documentForSearchText(parts.document_id),
    parts.registration_proof_code,
    parts.shirt_size,
  ]
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return chunks.length > 0 ? chunks : parts.bib_number.trim() || "—";
}

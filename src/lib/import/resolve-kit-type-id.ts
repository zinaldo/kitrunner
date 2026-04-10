import { looksLikeUuid } from "@/lib/queries/resolve-event-desk";

export type KitTypeLookupRow = { id: string; name: string };

/** Resolve célula CSV para `kit_types.id` do evento (preferência: nome; UUID aceito). */
export function resolveKitTypeIdFromCell(
  raw: string,
  kitTypes: KitTypeLookupRow[],
): { id: string | null; warning?: string } {
  const t = raw.trim();
  if (!t) return { id: null };

  if (looksLikeUuid(t)) {
    const hit = kitTypes.find((k) => k.id.toLowerCase() === t.toLowerCase());
    if (hit) return { id: hit.id };
    return { id: null, warning: "UUID de kit não pertence a este evento." };
  }

  const lower = t.toLowerCase();
  const exact = kitTypes.find((k) => k.name.trim().toLowerCase() === lower);
  if (exact) return { id: exact.id };

  const partial = kitTypes.find(
    (k) =>
      k.name.trim().toLowerCase().includes(lower) ||
      lower.includes(k.name.trim().toLowerCase()),
  );
  if (partial) return { id: partial.id };

  return {
    id: null,
    warning: `Tipo de kit não encontrado: “${t}”. Cadastre em Configuração da prova (Arquitetura de kits).`,
  };
}

import { looksLikeUuid } from "@/lib/queries/resolve-event-desk";

export type RaceLookupRow = { id: string; name: string };

/**
 * Resolve CSV cell to `races.id` for this event.
 * Preferência: nome exato da modalidade (coluna `name` em `races`); UUID ainda é aceito.
 */
export function resolveRaceIdFromCell(
  raw: string,
  races: RaceLookupRow[],
): { id: string | null; warning?: string } {
  const t = raw.trim();
  if (!t) return { id: null };

  if (looksLikeUuid(t)) {
    const hit = races.find((r) => r.id.toLowerCase() === t.toLowerCase());
    if (hit) return { id: hit.id };
    return { id: null, warning: "UUID de prova não pertence a este evento." };
  }

  const lower = t.toLowerCase();
  const exact = races.find((r) => r.name.trim().toLowerCase() === lower);
  if (exact) return { id: exact.id };

  const partial = races.find(
    (r) =>
      r.name.trim().toLowerCase().includes(lower) ||
      lower.includes(r.name.trim().toLowerCase()),
  );
  if (partial) return { id: partial.id };

  return {
    id: null,
    warning: `Modalidade não encontrada: “${t}”. Use o nome cadastrado em Configuração da prova (modalidades).`,
  };
}

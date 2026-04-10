/** Human-readable desk label for TV copy (e.g. desk-2 → "Guichê 2"). */
export function deskLabelFromId(deskId: string): string {
  const match = /^desk-(\d+)$/i.exec(deskId.trim());
  if (match) return `Guichê ${match[1]}`;
  return deskId;
}

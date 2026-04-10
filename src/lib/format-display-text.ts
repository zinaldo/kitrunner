/** Título estilo nome próprio (pt-BR), por palavra. */
export function formatDisplayTitleCase(raw: string): string {
  const s = raw.trim();
  if (!s || s === "—") return raw;
  return s
    .split(/\s+/g)
    .map((w) => {
      if (!w) return w;
      const lower = w.toLocaleLowerCase("pt-BR");
      return lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);
    })
    .join(" ");
}

/** Data na TV / posto: DD.MM.AAAA (sem barras). */
export function formatDateDotBr(iso: string | null | undefined): string {
  if (!iso?.trim()) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.trim();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/**
 * TV / wall display: pad short peito codes to 4 digits; no thousands separator.
 */
export function formatBibForDisplay(raw: string | number): string {
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return "#—";
  const padded = digits.length >= 4 ? digits : digits.padStart(4, "0");
  return `#${padded}`;
}

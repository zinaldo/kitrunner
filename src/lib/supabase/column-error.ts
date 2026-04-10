/**
 * PostgREST returns errors like "Could not find the 'col' column ... in the schema cache"
 * when the column is missing from the underlying Postgres table.
 * The same wording is used when a table/relation is missing (e.g. event_staff).
 */
export function isMissingTableColumnError(message: string, columnName: string): boolean {
  const m = message.toLowerCase();
  const c = columnName.toLowerCase();
  if (!m.includes(c)) return false;
  return (
    m.includes("schema cache") ||
    m.includes("could not find") ||
    m.includes("does not exist") ||
    m.includes("unknown column")
  );
}

/** Table or column name as returned in the error string. */
export function isMissingSchemaEntityError(message: string, name: string): boolean {
  return isMissingTableColumnError(message, name);
}

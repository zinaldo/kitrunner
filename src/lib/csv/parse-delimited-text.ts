/** Strip UTF-8 BOM */
export function stripBom(text: string): string {
  return text.replace(/^\uFEFF/, "");
}

function countDelimsOutsideQuotes(line: string, ch: string): number {
  let n = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i++;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (!inQuotes && c === ch) {
      n++;
    }
  }
  return n;
}

export function detectDelimiter(firstLine: string): "," | ";" | "\t" {
  const comma = countDelimsOutsideQuotes(firstLine, ",");
  const semi = countDelimsOutsideQuotes(firstLine, ";");
  const tab = countDelimsOutsideQuotes(firstLine, "\t");
  if (semi >= comma && semi >= tab && semi > 0) return ";";
  if (tab >= comma && tab >= semi && tab > 0) return "\t";
  return ",";
}

/**
 * RFC4180-style row split: quoted fields, "" for escaped quote.
 */
export function splitDelimitedLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      out.push(field);
      field = "";
    } else {
      field += c;
    }
  }
  out.push(field);
  return out;
}

export function parseDelimitedText(content: string): {
  delimiter: "," | ";" | "\t";
  rows: string[][];
} {
  const text = stripBom(content).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n");
  const nonEmpty: string[] = [];
  for (const line of lines) {
    if (line.trim().length > 0) nonEmpty.push(line);
  }
  if (nonEmpty.length === 0) {
    return { delimiter: ",", rows: [] };
  }
  const delimiter = detectDelimiter(nonEmpty[0]);
  const rows = nonEmpty.map((ln) => splitDelimitedLine(ln, delimiter));
  return { delimiter, rows };
}

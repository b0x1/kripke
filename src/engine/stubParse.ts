export type ParseResult =
  | { ok: true }
  | { ok: false; message: string };

export function stubParse(formula: string): ParseResult {
  let depth = 0;
  for (const ch of formula) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (depth < 0) {
      return { ok: false, message: "unmatched )" };
    }
  }
  if (depth > 0) {
    return { ok: false, message: "unmatched (" };
  }
  return { ok: true };
}

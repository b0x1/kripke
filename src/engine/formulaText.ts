import { keywordSymbols, keywordWords } from "./syntaxGuide";

export type TokenRole =
  | "not"
  | "join"
  | "quant"
  | "modal"
  | "eq"
  | "pred"
  | "name"
  | "punct";

export type FormulaToken =
  | { kind: "op"; raw: string; unicode: string; role: TokenRole }
  | { kind: "text"; raw: string; role: TokenRole };

const identStart = /[A-Za-z_]/;
const identChar = /[A-Za-z0-9_]/;
const axForm = /^[AE][a-z_][A-Za-z0-9_]*$/;

export function tokenizeFormula(src: string): FormulaToken[] {
  const tokens: FormulaToken[] = [];
  let i = 0;
  while (i < src.length) {
    const symbol = matchSymbol(src, i);
    if (symbol) {
      tokens.push({
        kind: "op",
        raw: symbol.raw,
        unicode: symbol.unicode,
        role: roleForUnicode(symbol.unicode),
      });
      i += symbol.raw.length;
      continue;
    }
    if (identStart.test(src[i] ?? "")) {
      let j = i + 1;
      while (j < src.length && identChar.test(src[j] ?? "")) {
        j += 1;
      }
      const raw = src.slice(i, j);
      const word = keywordWords[raw.toLowerCase()];
      if (word) {
        tokens.push({
          kind: "op",
          raw,
          unicode: word,
          role: roleForUnicode(word),
        });
      } else if (axForm.test(raw)) {
        const unicode = raw[0] === "A" ? "∀" : "∃";
        tokens.push({
          kind: "op",
          raw: raw[0],
          unicode,
          role: "quant",
        });
        tokens.push({ kind: "text", raw: raw.slice(1), role: "name" });
      } else {
        tokens.push({ kind: "text", raw, role: identRole(raw) });
      }
      i = j;
      continue;
    }
    const ch = src[i] ?? "";
    tokens.push({ kind: "text", raw: ch, role: "punct" });
    i += 1;
  }
  return tokens;
}

export function canonicalFormula(src: string): string {
  let out = "";
  for (const token of tokenizeFormula(src)) {
    out += token.kind === "op" ? token.unicode : token.raw;
  }
  return out
    .replace(/\s+/g, " ")
    .replace(/([¬□◇∀∃]) /g, "$1")
    .trim();
}

function identRole(raw: string): TokenRole {
  const first = raw[0] ?? "";
  return first >= "A" && first <= "Z" ? "pred" : "name";
}

function roleForUnicode(unicode: string): TokenRole {
  switch (unicode) {
    case "¬":
      return "not";
    case "∀":
    case "∃":
      return "quant";
    case "□":
    case "◇":
      return "modal";
    case "=":
      return "eq";
    default:
      return "join";
  }
}

function matchSymbol(
  src: string,
  i: number,
): { raw: string; unicode: string } | null {
  for (const [raw, unicode] of keywordSymbols) {
    if (src.startsWith(raw, i)) {
      return { raw, unicode };
    }
  }
  return null;
}

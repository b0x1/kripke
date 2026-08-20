import { describe, expect, it } from "vitest";
import { formulasEqual } from "./ast";
import { parse } from "./parse";
import { pretty } from "./pretty";
import { deReDeDicto } from "./syntaxGuide";

function mustParse(src: string) {
  const result = parse(src);
  if (!result.ok) {
    throw new Error(`${result.error.message}: ${src}`);
  }
  return result.formula;
}

describe("parse", () => {
  it("round-trips pretty(ast)", () => {
    const samples = [
      "Man(socrates)",
      "∀x (Man(x) → Mortal(x))",
      "¬Mortal(socrates)",
      "[]P",
      "nec P",
      "Ax (Man(x) -> Mortal(x))",
      "P and Q or R",
      "socrates = plato",
      deReDeDicto.dicto,
      deReDeDicto.re,
    ];
    for (const src of samples) {
      const ast = mustParse(src);
      const again = mustParse(pretty(ast));
      expect(formulasEqual(ast, again)).toBe(true);
    }
  });

  it("parses Ax Man(x) -> Mortal(x) differently from the parenthesized syllogism", () => {
    const loose = mustParse("Ax Man(x) -> Mortal(x)");
    const tight = mustParse("Ax (Man(x) -> Mortal(x))");
    expect(formulasEqual(loose, tight)).toBe(false);
    expect(loose.tag).toBe("imp");
    expect(tight.tag).toBe("all");
  });

  it("accepts not as negation", () => {
    expect(formulasEqual(mustParse("not P"), mustParse("¬P"))).toBe(true);
  });

  it("reports unmatched (", () => {
    const result = parse("Man(socrates");
    expect(result.ok).toBe(false);
  });
});

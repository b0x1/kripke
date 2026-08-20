import { describe, expect, it } from "vitest";
import { canonicalFormula, tokenizeFormula } from "./formulaText";

describe("canonicalFormula", () => {
  it("treats not and ~ as ¬", () => {
    expect(canonicalFormula("not Mortal(socrates)")).toBe(
      canonicalFormula("¬Mortal(socrates)"),
    );
    expect(canonicalFormula("~Mortal(socrates)")).toBe(
      canonicalFormula("¬Mortal(socrates)"),
    );
  });

  it("treats forall, Ax, and ∀ as the same syllogism premise", () => {
    const unicode = "∀x (Man(x) → Mortal(x))";
    expect(canonicalFormula("forall x (Man(x) -> Mortal(x))")).toBe(
      canonicalFormula(unicode),
    );
    expect(canonicalFormula("Ax (Man(x) -> Mortal(x))")).toBe(
      canonicalFormula(unicode),
    );
  });

  it("treats and / or / nec / pos words as the unicode ops", () => {
    expect(canonicalFormula("P and Q")).toBe("P ∧ Q");
    expect(canonicalFormula("P or Q")).toBe("P ∨ Q");
    expect(canonicalFormula("nec P")).toBe("□P");
    expect(canonicalFormula("pos P")).toBe("◇P");
  });
});

describe("tokenizeFormula", () => {
  it("marks not as a keyword and leaves Mortal as text", () => {
    const kinds = tokenizeFormula("not Mortal").map((t) => t.kind);
    expect(kinds).toEqual(["op", "text", "text"]);
  });

  it("does not treat nothing as not", () => {
    const tokens = tokenizeFormula("nothing");
    expect(tokens).toEqual([{ kind: "text", raw: "nothing", role: "name" }]);
  });

  it("tags Man as pred and socrates as name", () => {
    const tokens = tokenizeFormula("Man(socrates)").filter((t) => t.raw !== "");
    expect(tokens.map((t) => t.role)).toEqual([
      "pred",
      "punct",
      "name",
      "punct",
    ]);
  });
});

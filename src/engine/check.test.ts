import { describe, expect, it } from "vitest";
import type { Formula } from "./ast";
import { checkInference } from "./check";
import { defaultCheckOptions, type CheckOptions } from "./checkTypes";
import { parse } from "./parse";
import { deReDeDicto } from "./syntaxGuide";

function mustParse(src: string): Formula {
  const result = parse(src);
  if (!result.ok) {
    throw new Error(`${result.error.message}: ${src}`);
  }
  return result.formula;
}

function check(
  premises: string[],
  conclusion: string,
  options: Partial<CheckOptions> = {},
) {
  return checkInference(
    premises.map(mustParse),
    mustParse(conclusion),
    { ...defaultCheckOptions, ...options, bounds: options.bounds ?? defaultCheckOptions.bounds },
  );
}

describe("checkInference", () => {
  it("proves the Socrates syllogism in every system", () => {
    const systems = ["K", "T", "D", "B", "S4", "S5"] as const;
    for (const system of systems) {
      const result = check(
        ["Man(socrates)", "∀x (Man(x) → Mortal(x))"],
        "Mortal(socrates)",
        { system },
      );
      expect(result.status, system).toBe("correct");
    }
  });

  it("rejects affirming the consequent with a countermodel", () => {
    const result = check(["P -> Q", "Q"], "P");
    expect(result.status).toBe("false");
    expect(result.model).toBeDefined();
  });

  it("proves □(P→Q), □P ⊢ □Q in K", () => {
    const result = check(["□(P → Q)", "□P"], "□Q", { system: "K" });
    expect(result.status).toBe("correct");
  });

  it("treats □P ⊢ P as false in K and correct in T", () => {
    expect(check(["□P"], "P", { system: "K" }).status).toBe("false");
    expect(check(["□P"], "P", { system: "T" }).status).toBe("correct");
    expect(check(["□P"], "P", { system: "S4" }).status).toBe("correct");
    expect(check(["□P"], "P", { system: "S5" }).status).toBe("correct");
  });

  it("treats ◇□P ⊢ □P as correct in S5, not in K", () => {
    expect(check(["◇□P"], "□P", { system: "K" }).status).not.toBe("correct");
    expect(check(["◇□P"], "□P", { system: "S5" }).status).toBe("correct");
  });

  it("validates Barcan on constant domains and rejects it on varying", () => {
    const barcan = "∀x □P(x) → □∀x P(x)";
    expect(check([], barcan, { domain: "constant" }).status).toBe("correct");
    expect(check([], barcan, { domain: "varying", system: "K" }).status).toBe(
      "false",
    );
  });

  it("proves a = b ⊢ □(a = b)", () => {
    expect(check(["a = b"], "□(a = b)").status).toBe("correct");
  });

  it("distinguishes de dicto from de re in K", () => {
    const dicto = deReDeDicto.dicto;
    const re = deReDeDicto.re;
    expect(check([dicto], re, { system: "K" }).status).not.toBe("correct");
    expect(check([re], dicto, { system: "K", domain: "varying" }).status).not.toBe(
      "correct",
    );
  });

  it("returns incomplete when a bound stops an unsaturated search", () => {
    const result = check(["∀x P(x)", "∀y Q(y)"], "R", {
      bounds: { maxPrefixDepth: 1, maxGammaRounds: 8, maxNodes: 2 },
    });
    expect(result.status).toBe("incomplete");
  });
});

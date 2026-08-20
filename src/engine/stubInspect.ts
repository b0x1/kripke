import type { CheckResult } from "./checkTypes";
import { mockFalseRows, syllogism } from "./syntaxGuide";
import { stubParse } from "./stubParse";

export type FormulaLook = {
  parseError: string | null;
  result: CheckResult | null;
};

const man = syllogism[0].formula;
const menMortal = syllogism[1].formula;
const socratesMortal = syllogism[2].formula;
const socratesNotMortal = mockFalseRows[0].formula;

export function inspectFormula(
  formula: string,
  otherFormulas: string[] = [],
): FormulaLook {
  const text = formula.trim();
  if (text === "") {
    return { parseError: null, result: null };
  }
  const parsed = stubParse(text);
  if (!parsed.ok) {
    return { parseError: parsed.message, result: null };
  }
  return { parseError: null, result: stubCheckFormula(text, otherFormulas) };
}

function stubCheckFormula(text: string, otherFormulas: string[]): CheckResult {
  if (text === "?") {
    return {
      status: "incomplete",
      notes: ["stub: cannot decide"],
    };
  }
  if (text.toLowerCase() === "false") {
    return {
      status: "false",
      notes: ["stub: treated as not following"],
    };
  }

  const others = new Set(otherFormulas.map((f) => f.trim()).filter(Boolean));
  const hasSyllogismPremises = others.has(man) && others.has(menMortal);

  if (text === socratesMortal && hasSyllogismPremises) {
    return {
      status: "correct",
      notes: [
        "follows from the other propositions",
        "stub: engine not wired",
        "assumed system D, constant domain",
      ],
    };
  }

  if (text === socratesNotMortal && hasSyllogismPremises) {
    return {
      status: "false",
      notes: [
        "contradicts the other propositions",
        "stub: engine not wired",
      ],
    };
  }

  return {
    status: "incomplete",
    notes: [
      "does not follow from the other propositions",
      "stub: engine not wired",
    ],
  };
}

import type { CheckResult } from "./checkTypes";
import { canonicalFormula } from "./formulaText";
import { mockFalseRows, syllogism } from "./syntaxGuide";
import { stubParse } from "./stubParse";

export type FormulaLook = {
  parseError: string | null;
  result: CheckResult | null;
};

export type OtherClaim = {
  id: string;
  formula: string;
};

const man = syllogism[0].formula;
const menMortal = syllogism[1].formula;
const socratesMortal = syllogism[2].formula;
const socratesNotMortal = mockFalseRows[0].formula;

export function inspectFormula(
  formula: string,
  others: OtherClaim[] = [],
): FormulaLook {
  const text = formula.trim();
  if (text === "") {
    return { parseError: null, result: null };
  }
  const parsed = stubParse(text);
  if (!parsed.ok) {
    return { parseError: parsed.message, result: null };
  }
  return { parseError: null, result: stubCheckFormula(text, others) };
}

function stubCheckFormula(text: string, others: OtherClaim[]): CheckResult {
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

  const canon = canonicalFormula(text);
  const mortal = canonicalFormula(socratesMortal);
  const notMortal = canonicalFormula(socratesNotMortal);
  const manCanon = canonicalFormula(man);
  const menCanon = canonicalFormula(menMortal);

  const named = others
    .map((row) => ({ id: row.id, canon: canonicalFormula(row.formula) }))
    .filter((row) => row.canon !== "");
  const otherSet = new Set(named.map((row) => row.canon));
  const hasSyllogismPremises = otherSet.has(manCanon) && otherSet.has(menCanon);
  const opposite = canon === mortal ? notMortal : canon === notMortal ? mortal : null;
  const oppositeIds = opposite
    ? named.filter((row) => row.canon === opposite).map((row) => row.id)
    : [];

  if (canon === mortal && hasSyllogismPremises) {
    return {
      status: "correct",
      notes: [
        "follows from the other propositions",
        "stub: engine not wired",
        "assumed system D, constant domain",
      ],
    };
  }

  if (oppositeIds.length > 0) {
    return {
      status: "false",
      notes: ["contradicts another proposition", "stub: engine not wired"],
      contradicts: oppositeIds,
    };
  }

  if (canon === notMortal && hasSyllogismPremises) {
    const premiseIds = named
      .filter((row) => row.canon === manCanon || row.canon === menCanon)
      .map((row) => row.id);
    return {
      status: "false",
      notes: ["contradicts the other propositions", "stub: engine not wired"],
      contradicts: premiseIds,
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

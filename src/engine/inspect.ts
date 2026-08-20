import { formulasEqual, nnf, not, type Formula } from "./ast";
import { checkInference } from "./check";
import type { CheckResult } from "./checkTypes";
import { defaultCheckOptions } from "./checkTypes";
import { parse } from "./parse";

export type FormulaLook = {
  parseError: string | null;
  result: CheckResult | null;
};

export type OtherClaim = {
  id: string;
  formula: string;
};

export function inspectFormula(
  formula: string,
  others: OtherClaim[] = [],
): FormulaLook {
  const text = formula.trim();
  if (text === "") {
    return { parseError: null, result: null };
  }
  const parsed = parse(text);
  if (!parsed.ok) {
    return { parseError: parsed.error.message, result: null };
  }

  const named: { id: string; formula: Formula }[] = [];
  for (const row of others) {
    const other = parse(row.formula);
    if (!other.ok) {
      continue;
    }
    named.push({ id: row.id, formula: nnf(other.formula) });
  }

  const goal = nnf(parsed.formula);
  const opposite = nnf(not(parsed.formula));
  const oppositeIds = named
    .filter((row) => formulasEqual(row.formula, opposite))
    .map((row) => row.id);
  const rest = named
    .filter(
      (row) =>
        !formulasEqual(row.formula, opposite) && !formulasEqual(row.formula, goal),
    )
    .map((row) => row.formula);
  const premises = dropComplementaryPairs(rest);

  const follows = checkInference(premises, parsed.formula, defaultCheckOptions);
  if (follows.status === "correct") {
    return {
      parseError: null,
      result: {
        status: "correct",
        notes: follows.notes,
        proof: follows.proof,
      },
    };
  }

  const refuted = checkInference(premises, not(parsed.formula), defaultCheckOptions);
  if (refuted.status === "correct" || oppositeIds.length > 0) {
    const contradicts =
      oppositeIds.length > 0
        ? oppositeIds
        : named
            .filter((row) => premises.some((p) => formulasEqual(p, row.formula)))
            .map((row) => row.id);
    return {
      parseError: null,
      result: {
        status: "false",
        notes:
          refuted.status === "correct"
            ? refuted.notes
            : ["contradicts another proposition"],
        contradicts,
        proof: refuted.proof,
        model: follows.model,
      },
    };
  }

  if (follows.status === "incomplete" || refuted.status === "incomplete") {
    return {
      parseError: null,
      result: {
        status: "incomplete",
        notes: ["search bound"],
        issues: follows.issues ?? refuted.issues,
      },
    };
  }

  return {
    parseError: null,
    result: {
      status: "incomplete",
      notes: ["does not follow from the other propositions"],
      model: follows.model,
    },
  };
}

function dropComplementaryPairs(formulas: Formula[]): Formula[] {
  const kept: Formula[] = [];
  const skip = new Set<number>();
  for (let i = 0; i < formulas.length; i += 1) {
    if (skip.has(i)) {
      continue;
    }
    const left = formulas[i];
    if (!left) {
      continue;
    }
    const neg = nnf(not(left));
    const j = formulas.findIndex(
      (other, index) => index > i && !skip.has(index) && formulasEqual(other, neg),
    );
    if (j >= 0) {
      skip.add(i);
      skip.add(j);
      continue;
    }
    kept.push(left);
  }
  return kept;
}

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
  const rest = named.filter(
    (row) =>
      !formulasEqual(row.formula, opposite) && !formulasEqual(row.formula, goal),
  );
  const premiseRows = dropComplementaryPairs(rest);
  const premises = premiseRows.map((row) => row.formula);
  const bases = premiseRows.map((row) => row.id);

  const follows = checkInference(premises, parsed.formula, defaultCheckOptions);
  if (follows.status === "correct") {
    return {
      parseError: null,
      result: {
        status: "correct",
        notes: [],
        bases,
        proof: follows.proof,
      },
    };
  }

  const refuted = checkInference(premises, not(parsed.formula), defaultCheckOptions);
  if (refuted.status === "correct" || oppositeIds.length > 0) {
    const needed = neededPremiseIds(premiseRows, not(parsed.formula));
    const contradicts =
      oppositeIds.length > 0
        ? oppositeIds
        : needed.length > 0
          ? needed
          : bases;
    return {
      parseError: null,
      result: {
        status: "false",
        notes: [],
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
      notes:
        bases.length > 0
          ? [`not from ${bases.join(", ")}`]
          : ["does not follow"],
      bases,
      model: follows.model,
    },
  };
}

/** Judge every row. Later rows that contradict the ones above are false and are not used as premises. */
export function inspectSheet(rows: OtherClaim[]): Map<string, FormulaLook> {
  const core: OtherClaim[] = [];
  for (const row of rows) {
    const parsed = parse(row.formula.trim());
    if (!parsed.ok) {
      continue;
    }
    const premises = formulasOf(core);
    const refuted = checkInference(
      premises,
      not(parsed.formula),
      defaultCheckOptions,
    );
    if (refuted.status !== "correct") {
      core.push(row);
    }
  }
  const out = new Map<string, FormulaLook>();
  for (const row of rows) {
    out.set(
      row.id,
      inspectFormula(
        row.formula,
        core.filter((other) => other.id !== row.id),
      ),
    );
  }
  return out;
}

function formulasOf(rows: OtherClaim[]): Formula[] {
  const out: Formula[] = [];
  for (const row of rows) {
    const parsed = parse(row.formula.trim());
    if (parsed.ok) {
      out.push(nnf(parsed.formula));
    }
  }
  return out;
}

/** Premises that cannot be dropped without losing the entailment. */
function neededPremiseIds(
  rows: { id: string; formula: Formula }[],
  conclusion: Formula,
): string[] {
  const needed: string[] = [];
  for (const row of rows) {
    const rest = rows.filter((other) => other.id !== row.id).map((other) => other.formula);
    const without = checkInference(rest, conclusion, defaultCheckOptions);
    if (without.status !== "correct") {
      needed.push(row.id);
    }
  }
  return needed;
}

function dropComplementaryPairs(
  rows: { id: string; formula: Formula }[],
): { id: string; formula: Formula }[] {
  const kept: { id: string; formula: Formula }[] = [];
  const skip = new Set<number>();
  for (let i = 0; i < rows.length; i += 1) {
    if (skip.has(i)) {
      continue;
    }
    const left = rows[i];
    if (!left) {
      continue;
    }
    const neg = nnf(not(left.formula));
    const j = rows.findIndex(
      (other, index) =>
        index > i && !skip.has(index) && formulasEqual(other.formula, neg),
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

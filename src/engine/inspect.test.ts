import { describe, expect, it } from "vitest";
import { inspectFormula } from "./inspect";
import { mockFalseRows, syllogism } from "./syntaxGuide";

describe("inspectFormula", () => {
  const rows = [...syllogism, ...mockFalseRows];

  function others(id: string) {
    return rows.filter((row) => row.id !== id).map((row) => ({ id: row.id, formula: row.formula }));
  }

  it("marks P1 and P2 incomplete, P3 valid, P4 false against P3", () => {
    expect(inspectFormula(syllogism[0].formula, others("P1")).result?.status).toBe(
      "incomplete",
    );
    expect(inspectFormula(syllogism[1].formula, others("P2")).result?.status).toBe(
      "incomplete",
    );
    expect(inspectFormula(syllogism[2].formula, others("P3")).result?.status).toBe(
      "correct",
    );
    const p4 = inspectFormula(mockFalseRows[0].formula, others("P4"));
    expect(p4.result?.status).toBe("false");
    expect(p4.result?.contradicts).toContain("P3");
  });

  it("leaves the inspector blank for an empty formula", () => {
    expect(inspectFormula("", others("P1")).result).toBeNull();
  });
});

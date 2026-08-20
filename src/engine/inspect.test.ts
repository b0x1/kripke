import { describe, expect, it } from "vitest";
import { inspectFormula } from "./inspect";
import { mockFalseRows, syllogism } from "./syntaxGuide";

describe("inspectFormula", () => {
  const rows = [...syllogism, ...mockFalseRows];

  function others(id: string) {
    return rows.filter((row) => row.id !== id).map((row) => ({ id: row.id, formula: row.formula }));
  }

  it("marks P1 and P2 incomplete, P3 valid, P4 false against P3", () => {
    const p1 = inspectFormula(syllogism[0].formula, others("P1"));
    expect(p1.result?.status).toBe("incomplete");
    expect(p1.result?.notes).toEqual(["not from P2"]);
    const p2 = inspectFormula(syllogism[1].formula, others("P2"));
    expect(p2.result?.status).toBe("incomplete");
    expect(p2.result?.notes).toEqual(["not from P1"]);
    const p3 = inspectFormula(syllogism[2].formula, others("P3"));
    expect(p3.result?.status).toBe("correct");
    expect(p3.result?.bases).toEqual(["P1", "P2"]);
    expect(p3.result?.notes).toEqual([]);
    const p4 = inspectFormula(mockFalseRows[0].formula, others("P4"));
    expect(p4.result?.status).toBe("false");
    expect(p4.result?.contradicts).toContain("P3");
    expect(p4.result?.notes).toEqual([]);
  });

  it("leaves the inspector blank for an empty formula", () => {
    expect(inspectFormula("", others("P1")).result).toBeNull();
  });
});

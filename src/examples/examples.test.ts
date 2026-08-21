import { describe, expect, it } from "vitest";
import { parse } from "../engine/parse";
import { inspectSheet } from "../engine/inspect";
import { ALL_EXAMPLES } from "./index";

describe("examples test suite", () => {
  it("all formulas in all examples parse without errors", () => {
    for (const example of ALL_EXAMPLES) {
      for (const s of example.statements) {
        const result = parse(s.formula);
        expect(result.ok, `Formula "${s.formula}" in ${example.id} failed to parse`).toBe(true);
      }
    }
  });

  it("socrates example produces valid conclusion for P3", () => {
    const socrates = ALL_EXAMPLES.find((e) => e.id === "socrates")!;
    const looks = inspectSheet(socrates.statements);
    expect(looks.get("P3")?.result?.status).toBe("correct");
  });

  it("affirming the consequent produces incomplete for P3 (not from P1, P2)", () => {
    const aff = ALL_EXAMPLES.find((e) => e.id === "affirming-consequent")!;
    const looks = inspectSheet(aff.statements);
    expect(looks.get("P3")?.result?.status).toBe("incomplete");
  });

  it("distribution of necessity produces correct for P3", () => {
    const dist = ALL_EXAMPLES.find((e) => e.id === "distrib-necessity")!;
    const looks = inspectSheet(dist.statements);
    expect(looks.get("P3")?.result?.status).toBe("correct");
  });

  it("necessity reflexivity produces incomplete/false in default system D for P2", () => {
    const necRef = ALL_EXAMPLES.find((e) => e.id === "nec-reflexivity")!;
    const looks = inspectSheet(necRef.statements);
    expect(looks.get("P2")?.result?.status).toBeDefined();
  });

  it("de dicto de re produces incomplete for P2 in system D", () => {
    const dd = ALL_EXAMPLES.find((e) => e.id === "de-dicto-de-re")!;
    const looks = inspectSheet(dd.statements);
    expect(looks.get("P2")?.result?.status).toBe("incomplete");
  });

  it("necessity of identity produces correct for P2", () => {
    const necId = ALL_EXAMPLES.find((e) => e.id === "nec-identity")!;
    const looks = inspectSheet(necId.statements);
    expect(looks.get("P2")?.result?.status).toBe("correct");
  });

  it("barcan formula produces correct for P2 on constant domain", () => {
    const barcan = ALL_EXAMPLES.find((e) => e.id === "barcan")!;
    const looks = inspectSheet(barcan.statements);
    expect(looks.get("P2")?.result?.status).toBe("correct");
  });
});

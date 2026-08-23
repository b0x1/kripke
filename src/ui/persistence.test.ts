import { describe, expect, it } from "vitest";
import {
  exportStatementsToJson,
  normalizeStatements,
  parseImportedJson,
} from "./persistence";
import type { Statement } from "./types";

describe("persistence helper", () => {
  const sample: Statement[] = [
    { id: "P1", naturalLanguage: "Socrates is a man", formula: "Man(socrates)", postulate: true },
    { id: "P2", naturalLanguage: "Socrates is mortal", formula: "Mortal(socrates)", postulate: false },
  ];

  it("exports and imports JSON symmetrically", () => {
    const exported = exportStatementsToJson(sample, "Test Title", "Test Blurb");
    const imported = parseImportedJson(exported);

    expect(imported.title).toBe("Test Title");
    expect(imported.blurb).toBe("Test Blurb");
    expect(imported.statements).toEqual(sample);
  });

  it("normalizes array without ids or fields safely", () => {
    const raw = [{ naturalLanguage: "Test", formula: "P" }];
    const normalized = normalizeStatements(raw);
    expect(normalized[0]).toEqual({
      id: "P1",
      naturalLanguage: "Test",
      formula: "P",
      postulate: false,
    });
  });

  it("throws error for invalid JSON shapes", () => {
    expect(() => parseImportedJson("{}")).toThrow("JSON must contain an array of statements");
  });

  it("truncates statement fields exceeding length limits and caps statement count", () => {
    const longId = "A".repeat(150);
    const longNL = "B".repeat(2500);
    const longFormula = "C".repeat(2500);

    const manyStatements = Array.from({ length: 120 }, (_, idx) => ({
      id: `${longId}_${idx}`,
      naturalLanguage: longNL,
      formula: longFormula,
      postulate: true,
    }));

    const normalized = normalizeStatements(manyStatements);

    expect(normalized).toHaveLength(100);
    expect(normalized[0]?.id).toHaveLength(100);
    expect(normalized[0]?.naturalLanguage).toHaveLength(2000);
    expect(normalized[0]?.formula).toHaveLength(2000);
  });
});

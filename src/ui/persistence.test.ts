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

  it("safely ignores prototype pollution attempts in imported JSON", () => {
    const maliciousJson = JSON.stringify({
      statements: [
        JSON.parse('{"id": "P1", "__proto__": {"polluted": true}, "formula": "P"}'),
      ],
    });

    const imported = parseImportedJson(maliciousJson);
    expect(imported.statements[0]).toEqual({
      id: "P1",
      naturalLanguage: "",
      formula: "P",
      postulate: false,
    });
    // Ensure Global Object prototype is not polluted
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});

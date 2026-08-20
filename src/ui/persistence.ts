import type { Statement } from "./types";

const STORAGE_KEY = "kripke_statements_v1";

export type ExportData = {
  title?: string;
  blurb?: string;
  statements: {
    id: string;
    naturalLanguage: string;
    formula: string;
    postulate?: boolean;
  }[];
};

export function loadSavedStatements(): Statement[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return normalizeStatements(parsed);
    }
  } catch {
    // Ignore invalid JSON in localStorage
  }
  return null;
}

export function saveStatements(statements: Statement[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statements));
  } catch {
    // LocalStorage full or disabled
  }
}

export function clearSavedStatements(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // LocalStorage error
  }
}

export function exportStatementsToJson(
  statements: Statement[],
  title = "Kripke Workbench Claims",
  blurb?: string,
): string {
  const data: ExportData = {
    title,
    blurb,
    statements: statements.map((s) => ({
      id: s.id,
      naturalLanguage: s.naturalLanguage,
      formula: s.formula,
      postulate: s.postulate,
    })),
  };
  return JSON.stringify(data, null, 2);
}

export function parseImportedJson(jsonText: string): {
  title?: string;
  blurb?: string;
  statements: Statement[];
} {
  const data = JSON.parse(jsonText);
  if (!data || typeof data !== "object") {
    throw new Error("Invalid JSON structure");
  }
  const rawStatements = Array.isArray(data.statements)
    ? data.statements
    : Array.isArray(data)
      ? data
      : null;

  if (!rawStatements || rawStatements.length === 0) {
    throw new Error("JSON must contain an array of statements");
  }

  return {
    title: typeof data.title === "string" ? data.title : undefined,
    blurb: typeof data.blurb === "string" ? data.blurb : undefined,
    statements: normalizeStatements(rawStatements),
  };
}

export function normalizeStatements(rawList: unknown[]): Statement[] {
  return rawList
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, idx) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `P${idx + 1}`,
      naturalLanguage: typeof item.naturalLanguage === "string" ? item.naturalLanguage : "",
      formula: typeof item.formula === "string" ? item.formula : "",
      postulate: Boolean(item.postulate),
    }));
}

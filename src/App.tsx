import { useEffect, useState } from "react";
import { mockPropositions } from "./engine/syntaxGuide";
import { findExampleById } from "./examples";
import { CheatsheetDrawer } from "./ui/CheatsheetDrawer";
import { HowItWorks } from "./ui/HowItWorks";
import { LogicBar } from "./ui/LogicBar";
import {
  exportStatementsToJson,
  loadSavedStatements,
  parseImportedJson,
  saveStatements,
} from "./ui/persistence";
import { StatementList } from "./ui/StatementList";
import type { Statement } from "./ui/types";

function initialStatements(): Statement[] {
  const saved = loadSavedStatements();
  if (saved && saved.length > 0) {
    return saved;
  }
  return mockPropositions.map((row) => ({
    ...row,
    postulate: row.id === "P1" || row.id === "P2",
  }));
}

function nextStatementId(used: Statement[], seq: number): { id: string; seq: number } {
  let n = seq;
  const ids = new Set(used.map((s) => s.id));
  let id = `P${n}`;
  while (ids.has(id)) {
    n += 1;
    id = `P${n}`;
  }
  return { id, seq: n + 1 };
}

export function App() {
  const [page, setPage] = useState<"workbench" | "guide">("workbench");
  const [statements, setStatements] = useState<Statement[]>(initialStatements);
  const [seq, setSeq] = useState(() => statements.length + 1);
  const [cheatsheetOpen, setCheatsheetOpen] = useState(false);

  useEffect(() => {
    saveStatements(statements);
  }, [statements]);

  function addStatement() {
    const { id, seq: next } = nextStatementId(statements, seq);
    setSeq(next);
    setStatements((cur) => [
      ...cur,
      { id, naturalLanguage: "", formula: "", postulate: false },
    ]);
  }

  function removeStatement(id: string) {
    setStatements((cur) => cur.filter((s) => s.id !== id));
  }

  function patchStatement(
    id: string,
    patch: Partial<Pick<Statement, "naturalLanguage" | "formula" | "postulate">>,
  ) {
    setStatements((cur) =>
      cur.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  function handleSelectExample(id: string) {
    const ex = findExampleById(id);
    if (!ex) {
      return;
    }
    const loaded: Statement[] = ex.statements.map((s) => ({
      id: s.id,
      naturalLanguage: s.naturalLanguage,
      formula: s.formula,
      postulate: Boolean(s.postulate),
    }));
    setStatements(loaded);
    setSeq(loaded.length + 1);
  }

  function handleExportJson() {
    const jsonStr = exportStatementsToJson(statements);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kripke-claims.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportJson(text: string) {
    try {
      const imported = parseImportedJson(text);
      setStatements(imported.statements);
      setSeq(imported.statements.length + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to parse imported JSON");
    }
  }

  return (
    <div className="page">
      <LogicBar
        page={page}
        onPage={setPage}
        onOpenCheatsheet={() => setCheatsheetOpen(true)}
        onSelectExample={handleSelectExample}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      <CheatsheetDrawer
        open={cheatsheetOpen}
        onClose={() => setCheatsheetOpen(false)}
      />

      {page === "guide" ? (
        <HowItWorks />
      ) : (
        <main>
          <StatementList
            statements={statements}
            onChange={patchStatement}
            onAdd={addStatement}
            onRemove={removeStatement}
          />
        </main>
      )}
    </div>
  );
}

import { useState } from "react";
import { mockPropositions } from "./engine/syntaxGuide";
import { HowItWorks } from "./ui/HowItWorks";
import { LogicBar } from "./ui/LogicBar";
import { StatementList } from "./ui/StatementList";
import type { Statement } from "./ui/types";

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
  const [seq, setSeq] = useState(mockPropositions.length + 1);
  const [statements, setStatements] = useState<Statement[]>(
    mockPropositions.map((row) => ({
      ...row,
      postulate: row.id === "P1" || row.id === "P2",
    })),
  );

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

  return (
    <div className="page">
      <LogicBar page={page} onPage={setPage} />
      {page === "guide" ? (
        <HowItWorks onBack={() => setPage("workbench")} />
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

import { useState } from "react";
import { inspectSheet } from "../engine/inspect";
import { FormulaField } from "./FormulaField";
import { InspectorCell } from "./InspectorCell";
import { InspectorDrawer } from "./InspectorDrawer";
import type { Statement } from "./types";

type Props = {
  statements: Statement[];
  onChange: (
    id: string,
    patch: Partial<Pick<Statement, "naturalLanguage" | "formula" | "postulate">>,
  ) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
};

export function StatementList({ statements, onChange, onAdd, onRemove }: Props) {
  const [inspectedId, setInspectedId] = useState<string | null>(null);

  const looks = inspectSheet(
    statements.map((s) => ({ id: s.id, formula: s.formula })),
  );

  const inspectedStatement = statements.find((s) => s.id === inspectedId);
  const inspectedLook = inspectedId ? looks.get(inspectedId) : null;

  return (
    <section className="workbench">
      <h2>Claims</h2>
      <table className="propositions">
        <thead>
          <tr>
            <th>Id</th>
            <th>Natural language</th>
            <th>Formula</th>
            <th>Inspector</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {statements.map((s) => {
            const look = looks.get(s.id) ?? { parseError: null, result: null };
            return (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  <textarea
                    rows={2}
                    value={s.naturalLanguage}
                    onChange={(e) =>
                      onChange(s.id, { naturalLanguage: e.target.value })
                    }
                    aria-label={`${s.id} natural language`}
                    placeholder="Natural language claim"
                  />
                </td>
                <td>
                  <FormulaField
                    value={s.formula}
                    onChange={(formula) => onChange(s.id, { formula })}
                    invalid={Boolean(look.parseError)}
                    aria-label={`${s.id} formula`}
                    aria-describedby={
                      look.parseError ? `${s.id}-formula-error` : undefined
                    }
                    placeholder="e.g. P -> Q"
                  />
                  {look.parseError ? (
                    <p id={`${s.id}-formula-error`} className="formula-error">
                      {look.parseError}
                    </p>
                  ) : null}
                </td>
                <InspectorCell
                  id={s.id}
                  result={look.result}
                  postulate={s.postulate}
                  onPostulate={(postulate) => onChange(s.id, { postulate })}
                  onInspect={(id) => setInspectedId(id)}
                />
                <td className="row-actions">
                  <button
                    type="button"
                    className="row-remove"
                    onClick={() => onRemove(s.id)}
                    aria-label={`Remove ${s.id}`}
                    title={`Remove ${s.id}`}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button type="button" onClick={onAdd}>
        Add a claim
      </button>

      <InspectorDrawer
        open={Boolean(inspectedId)}
        onClose={() => setInspectedId(null)}
        statementId={inspectedStatement?.id ?? null}
        statementNL={inspectedStatement?.naturalLanguage ?? null}
        statementFormula={inspectedStatement?.formula ?? null}
        result={inspectedLook?.result ?? null}
        postulate={Boolean(inspectedStatement?.postulate)}
      />
    </section>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.2 1h3.6l.7 1.2H14v1.3H2V2.2h3.5L6.2 1zm.3 1.2.4-.7h2.2l.4.7H6.5zM3.4 4.8h9.2l-.7 9.1A1.4 1.4 0 0 1 10.5 15H5.5a1.4 1.4 0 0 1-1.4-1.1L3.4 4.8zm2.4 1.6v6.4h1.2V6.4H5.8zm3.2 0v6.4h1.2V6.4H9z"
      />
    </svg>
  );
}

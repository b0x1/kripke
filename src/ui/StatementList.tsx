import { inspectFormula } from "../engine/inspect";
import { FormulaField } from "./FormulaField";
import { InspectorCell } from "./InspectorCell";
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
  return (
    <section>
      <h2>Propositions</h2>
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
            const others = statements
              .filter((row) => row.id !== s.id)
              .map((row) => ({ id: row.id, formula: row.formula }));
            const look = inspectFormula(s.formula, others);
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
                  />
                </td>
                <td>
                  <FormulaField
                    value={s.formula}
                    onChange={(formula) => onChange(s.id, { formula })}
                    invalid={Boolean(look.parseError)}
                    aria-label={`${s.id} formula`}
                  />
                  {look.parseError ? (
                    <p className="formula-error">{look.parseError}</p>
                  ) : null}
                </td>
                <InspectorCell
                  id={s.id}
                  result={look.result}
                  postulate={s.postulate}
                  onPostulate={(postulate) => onChange(s.id, { postulate })}
                />
                <td>
                  <button type="button" onClick={() => onRemove(s.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button" onClick={onAdd}>
        Add proposition
      </button>
    </section>
  );
}

import { useEffect } from "react";
import type { CheckResult } from "../engine/checkTypes";
import { FormulaView } from "./FormulaField";
import { KripkeGraph } from "./KripkeGraph";
import { TableauView } from "./TableauView";
import { InspectorView } from "./InspectorCell";

type Props = {
  open: boolean;
  onClose: () => void;
  statementId: string | null;
  statementNL: string | null;
  statementFormula: string | null;
  result: CheckResult | null;
  postulate: boolean;
};

export function InspectorDrawer({
  open,
  onClose,
  statementId,
  statementNL,
  statementFormula,
  result,
  postulate,
}: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !statementId) {
    return null;
  }

  return (
    <div className="inspector-backdrop" onClick={onClose}>
      <aside
        className="inspector-drawer"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Inspection details for ${statementId}`}
      >
        <div className="inspector-drawer-header">
          <div>
            <h2>Inspection: {statementId}</h2>
            {statementNL ? (
              <p className="inspector-drawer-nl">{statementNL}</p>
            ) : null}
            {statementFormula ? (
              <div className="inspector-drawer-formula">
                <FormulaView text={statementFormula} />
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="inspector-close-btn"
            onClick={onClose}
            aria-label="Close inspection panel"
          >
            ✕
          </button>
        </div>

        <div className="inspector-drawer-body">
          <div className="inspector-drawer-status">
            <h3>Verdict</h3>
            {postulate ? (
              <div className="inspector-label">claim (postulate)</div>
            ) : (
              <InspectorView result={result} />
            )}
          </div>

          {!postulate && result?.model ? (
            <div className="inspector-drawer-section">
              <KripkeGraph model={result.model} />
            </div>
          ) : null}

          {!postulate && result?.proof ? (
            <div className="inspector-drawer-section">
              <h3>Tableau Proof</h3>
              <TableauView tree={result.proof} />
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

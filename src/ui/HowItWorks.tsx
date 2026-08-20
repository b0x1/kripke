import { mockFalseRows, syllogism } from "../engine/syntaxGuide";
import { SyntaxSection } from "./SyntaxSection";
import { verdictView } from "./verdictView";

type Props = {
  onBack: () => void;
};

export function HowItWorks({ onBack }: Props) {
  return (
    <article className="guide">
      <p>
        <button type="button" onClick={onBack}>
          Back to workbench
        </button>
      </p>
      <h1>How this site works</h1>
      <p>
        FOML is a workbench for checking arguments in first-order modal logic. You
        write claims in natural language, you formalize them, and the inspector
        judges each proposition.
      </p>

      <h2>The loop</h2>
      <ol>
        <li>
          Add <strong>propositions</strong>. Each row is one claim: natural
          language, formula, and an inspector. The site does not translate
          natural language into logic. Empty formula: inspector is blank. Bad
          formula: error under the formula, inspector blank. Otherwise the
          checker fills the inspector ({verdictView.correct.emoji}{" "}
          {verdictView.correct.label}, {verdictView.false.emoji}{" "}
          {verdictView.false.label}, {verdictView.incomplete.emoji}{" "}
          {verdictView.incomplete.label}). If valid, the cell names the statements
          it follows from. If false, the cell names the statement it contradicts.
          If incomplete, the cell says why (`not from` those statements, or
          `search bound`).
          Each row is judged
          against the other propositions. A formula that does not follow
          is incomplete; <code>{syllogism[2].formula}</code> is valid when the
          Socrates premises are present; <code>{mockFalseRows[0].formula}</code>{" "}
          is then false. Type ASCII
          keywords (<code>not</code>, <code>and</code>, <code>or</code>,{" "}
          <code>forall</code>, <code>exists</code>, <code>nec</code>,{" "}
          <code>pos</code>, <code>Ax</code>) or Unicode; keywords are bold and
          colored. An incomplete row can be marked as a{" "}
          <strong>postulate</strong>: it is assumed, not judged, and the
          inspector greys out. It still counts as a premise for other rows.
        </li>
      </ol>

      <h2>What the verdicts mean</h2>
      <ul>
        <li>
          <strong>{verdictView.correct.label}</strong> ({verdictView.correct.emoji}{" "}
          oxblood) — the proposition follows from the other propositions. The
          cell names those statements.
        </li>
        <li>
          <strong>{verdictView.false.label}</strong> ({verdictView.false.emoji}{" "}
          vermillion) — the other propositions rule it out. The cell names the
          contradicted statement.
        </li>
        <li>
          <strong>{verdictView.incomplete.label}</strong> (
          {verdictView.incomplete.emoji} amber) — it does not follow from the
          other propositions, and they do not rule it out. The cell says
          <code>not from</code> those statements, or <code>search bound</code>.
        </li>
      </ul>
      <p>
        The inspector runs a prefixed tableau (system D, constant domain). If
        search hits a bound, the verdict is incomplete, not false.
      </p>

      <h2>Assumed logic</h2>
      <p>
        Checks assume <strong>system D</strong> and a <strong>constant
        domain</strong>. Those are not user settings on this mockup.
      </p>
      <p>
        <strong>D</strong> means every possible world can see at least one world
        (no dead ends). Then necessity implies possibility: if □P, then ◇P. D
        does <em>not</em> include “if it is necessary, it is true” (that is
        system T: □P → P).
      </p>
      <p>
        <strong>Constant domain</strong> means the same individuals exist in
        every world. Quantifiers range over one fixed population. Names are
        rigid: if a = b, then □(a = b).
      </p>
      <SyntaxSection />
    </article>
  );
}

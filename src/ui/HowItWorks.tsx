import { mockFalseRows, syllogism } from "../engine/syntaxGuide";
import { FormulaView } from "./FormulaField";
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
          Back to your claims
        </button>
      </p>
      <h1>How it works</h1>
      <p>
        Kripke is a reasoning tool for debate bros. You enter claims, formalize
        them, and the inspector tells you whether each one follows from the
        others.
      </p>
      <p>
        Write the claim in natural language, then the same claim as a formula.
        The site does not translate. The formula is what gets checked.
      </p>

      <h2>One row, one claim</h2>
      <p>
        Each row has natural language, a formula, and an inspector. The inspector
        judges that formula against the other rows. It does not ask whether the
        claim is true in the world; only whether it follows, or is ruled out, given
        what you have written.
      </p>
      <p>
        An empty formula leaves the inspector blank. A formula that fails to
        parse shows an error under the formula field; the inspector stays blank.
        Otherwise the inspector reports{" "}
        {verdictView.correct.emoji} {verdictView.correct.label},{" "}
        {verdictView.false.emoji} {verdictView.false.label}, or{" "}
        {verdictView.incomplete.emoji} {verdictView.incomplete.label}.
      </p>

      <h2>Verdicts</h2>
      <ul>
        <li>
          <strong>{verdictView.correct.label}</strong> — the formula follows from
          the other claims. The cell lists the rows it used, e.g.{" "}
          <code>from P1, P2</code>.
        </li>
        <li>
          <strong>{verdictView.false.label}</strong> — the other claims entail
          its negation. The cell names the contradicted statement, e.g.{" "}
          <code>contradicts P3</code>.
        </li>
        <li>
          <strong>{verdictView.incomplete.label}</strong> — the other claims
          neither entail it nor rule it out (
          <code>not from …</code>), or the search hit a bound (
          <code>search bound</code>). Hitting a bound is not a disproof.
        </li>
      </ul>

      <h2>Claims that need no proof</h2>
      <p>
        An incomplete row can be marked <strong>claim</strong> (a postulate).
        It is then taken as given: the inspector does not judge it, but other
        rows may still use it as a premise.
      </p>

      <h2>Example</h2>
      <p>
        {syllogism[0].naturalLanguage}. {syllogism[1].naturalLanguage}. Therefore{" "}
        {syllogism[2].naturalLanguage}. The conclusion is{" "}
        {verdictView.correct.label}: it follows from P1 and P2. The denial{" "}
        <code>{mockFalseRows[0].formula}</code> is {verdictView.false.label}: it
        contradicts that conclusion.
      </p>

      <h2>Assumed logic</h2>
      <p>
        Checks use system <strong>D</strong>, a <strong>constant domain</strong>,
        and rigid designators. These assumptions are fixed for now; you cannot
        change them here.
      </p>

      <h3>System D</h3>
      <p>
        Modal claims are evaluated on possible worlds, with an accessibility
        relation: from this world, which other worlds count as alternatives?
        <strong>D</strong> requires that relation to be <em>serial</em>: every
        world has at least one successor. There are no dead ends.
      </p>
      <p>
        Seriality gives <FormulaView text="□P → ◇P" />. If P holds in every
        accessible world, and there is at least one such world, then P is
        possible. The usual illustration is deontic: read □ as “obligatory” and
        ◇ as “permitted.” If keeping a promise is obligatory, it is permitted.
        A system that allowed a world with no acceptable successor would make
        something obligatory and yet not permitted.
      </p>
      <p>
        D does <em>not</em> include T, i.e. <FormulaView text="□P → P" />. Ought
        does not imply is: that one ought to keep a promise does not mean the
        promise is kept. Likewise in the alethic reading, “necessarily P” does
        not by itself yield “P is true here.” That step wants reflexivity
        (system T).
      </p>

      <h3>Constant domain</h3>
      <p>
        The domain of individuals is the same in every world. Quantifiers range
        over one fixed population. You cannot introduce someone who exists only
        in another possibility, nor drop someone from the domain when you move
        worlds.
      </p>
      <p>
        So if every actual person is necessarily mortal, then necessarily
        everyone is mortal: <FormulaView text="∀x □Mortal(x) → □∀x Mortal(x)" />
        (Barcan). The converse holds as well. On a <em>varying</em> domain those
        can fail: “everyone who exists here is necessarily mortal” need not mean
        “in every world, whoever exists there is mortal,” if new individuals
        appear.
      </p>
      <p>
        Names are rigid designators: they pick out the same individual in every
        world. If the morning star is the evening star, that identity is
        necessary: <FormulaView text="a = b → □(a = b)" />. Socrates is Socrates
        in every alternative, even worlds where he is not a philosopher.
      </p>
      <SyntaxSection />
    </article>
  );
}

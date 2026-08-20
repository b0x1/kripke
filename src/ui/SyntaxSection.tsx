import {
  type SyntaxRow,
  atomExamples,
  connectives,
  deReDeDicto,
  languageExcludes,
  languageIncludes,
  modalOps,
  quantifiers,
  scopeNote,
  syllogism,
  typingNotes,
} from "../engine/syntaxGuide";
import { FormulaView } from "./FormulaField";

function Rows({ rows, aliases }: { rows: SyntaxRow[]; aliases: boolean }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Meaning</th>
          <th>ASCII</th>
          {aliases ? <th>Alias</th> : null}
          <th>Unicode</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.meaning}>
            <td>{row.meaning}</td>
            <td>
              <code>{row.ascii}</code>
            </td>
            {aliases ? (
              <td>{row.alias ? <code>{row.alias}</code> : "—"}</td>
            ) : null}
            <td>
              <code>{row.unicode}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SyntaxSection() {
  return (
    <section>
      <h2>Syntax</h2>
      <p>Type ASCII in the formula field. Unicode is also accepted.</p>
      <h3>Language</h3>
      <ul>
        {languageIncludes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>Not included: {languageExcludes.join(", ")}.</p>
      <h3>Modal operators</h3>
      <Rows rows={modalOps} aliases />
      <h3>Quantifiers</h3>
      <Rows rows={quantifiers} aliases />
      <h3>Connectives and identity</h3>
      <Rows rows={connectives} aliases={false} />
      <h3>Atoms</h3>
      <ul>
        {atomExamples.map((item) => (
          <li key={item}>
            <code>{item}</code>
          </li>
        ))}
      </ul>
      <h3>Notes</h3>
      <ul>
        {typingNotes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{scopeNote}</p>
      <h3>De re vs de dicto</h3>
      <ul>
        <li>
          De dicto: <FormulaView text={deReDeDicto.dicto} /> — {deReDeDicto.dictoGloss}
        </li>
        <li>
          De re: <FormulaView text={deReDeDicto.re} /> — {deReDeDicto.reGloss}
        </li>
      </ul>
      <h3>Example</h3>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Natural language</th>
            <th>Formula</th>
          </tr>
        </thead>
        <tbody>
          {syllogism.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.naturalLanguage}</td>
              <td>
                <FormulaView text={row.formula} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        P1, P2 ⊢ P3 is correct in every modal system (no modal operators fire).
      </p>
    </section>
  );
}

# UI

**Iteration 1 mockup signed off.** Engine is live: [`src/engine/inspect.ts`](../src/engine/inspect.ts)
parses and calls [`checkInference`](../src/engine/check.ts). No stub Check.

Workbench: one table, one row per proposition.

```
Id | Natural language | Formula | Inspector
```

Inspector: blank if no formula or the formula does not parse. Parse errors show in the formula column.
Else marks from [`src/ui/verdictView.ts`](../src/ui/verdictView.ts). Valid lists `bases` ids in the cell.
False lists `contradicts` ids. Incomplete lists a short why in the cell (`not from` ids, or `search bound`).
Each row is judged against the other propositions (complements dropped so a false row does not explode the rest).
Incomplete → Claim checkbox (postulate: needs no proof); checked → grey inspector (`claim`), still a premise for other rows.
Parse + tableau: unmatched `(` `)` → formula error. No inference pane. Columns NL:formula:inspector = 5:4:1.
Remove is a vermillion bin icon.

Target below is **after** mockup sign-off.

One workbench. Product name: **Kripke** (possible-worlds semantics). Tagline: “reasoning tool for debate bros.”
Audience: lycée / gymnasium, not professional logicians. Terms of art first; a short gloss in parentheses where useful.
Do not slang, do not talk down.
Logic notebook: warm paper, ink. System fonts only: sans UI, Palatino/Times serif, system mono formulas.
No webfonts. Verdict accent only: oxblood correct, vermillion false, amber incomplete.
No UI kit. No purple dashboard.

`src/ui/` parses and shows `CheckResult`. No tableau rules here. Tokens in `src/styles.css`.

## Layout (v1)

One table. No DAG. No inference pane. Inspector is the last column of each proposition row.

### Statements (`StatementList`)

Table row per claim:

- Id `P1`, `P2`, … sequential, stable until delete
- Natural language textarea
- Formula field: ASCII keywords (`not`, `and`, `or`, `forall`, `exists`, `nec`, `pos`, `Ax`) and Unicode;
  syntax highlight (bold + color) via [`formulaText.ts`](../src/engine/formulaText.ts)
- Live parse: Unicode pretty on success, span + message on fail
- Add / bin to remove

Formula palette inserts `□ ◇ ∀ ∃ → ∧ ∨ ¬ =` into the focused formula field.

Natural language is never parsed. Empty formula → blank inspector.

### Inspector

On the proposition row. Valid → `from` the `bases` ids. False → `contradicts` ids.
Incomplete → short why (`not from` ids, or `search bound`). Later: tableau/countermodel. No separate `VerdictPane`.

### LogicBar

Mockup: locked to system **D**, **constant** domain. In-app How it works (`HowItWorks`) is plain English.
No system/domain pickers. Header wordmark: Kripke. Nav: How it works / Your claims.

After sign-off, pickers may return. Target: K / T / D / B / S4 / S5, constant / varying.
Change system or domain → cached verdicts become unchecked. Do not auto-recompute.

- Load example
- Cheatsheet drawer
- Import / export JSON

## Persistence

- `localStorage`: statements only for now. Not tableau trees.
- Import / export JSON = `src/examples/*.ts` shape.

One loader path for examples and import.

## Examples

Already formalized proposition lists.

1. Socrates syllogism — valid
2. Affirming the consequent — false
3. Distribution of necessity `□(P→Q), □P ⊢ □Q` — valid in K
4. `□P ⊢ P` — false in K; blurb: T makes it valid
5. De dicto vs de re
6. Necessity of identity — `a = b` and `□(a = b)`
7. Barcan — valid on constant; blurb: toggle varying

## Cheatsheet

- Connectives, binders, de re / de dicto: [`src/engine/syntaxGuide.ts`](../src/engine/syntaxGuide.ts)
- Frame assumptions per system
- Incomplete = checker could not decide vs parse error in the formula column

## Interaction

- Formula field: ASCII from `syntaxGuide.ts`. Palette optional.
- Parse and stub check live on each row.
- First visit: seeded mock propositions.

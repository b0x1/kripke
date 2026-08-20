# UI

**Iteration 1:** mockup only. Scope in [PLAN.md](../PLAN.md). No theme, no palette, no persistence, no real prover. Stub Check ok.

Mockup workbench: one table, one row per proposition.

```
Id | Natural language | Formula | Inspector
```

Inspector: blank if no formula or the formula does not parse. Parse errors show in the formula column. Else marks from [`src/ui/verdictView.ts`](../src/ui/verdictView.ts) plus `CheckResult.notes` from the checker. Checker adds info by pushing strings onto `notes` ([`src/engine/checkTypes.ts`](../src/engine/checkTypes.ts)). Each row is judged against the other propositions. Incomplete → Postulate checkbox; checked → grey inspector (`postulate`), still a premise for other rows. Stub: does not follow → incomplete; `Mortal(socrates)` valid when Socrates premises present; `¬Mortal(socrates)` then false; `false` → false; `?` → incomplete; unmatched `(` `)` → formula error. No inference pane.

Target below is **after** mockup sign-off.

One workbench. Logic notebook: warm paper, ink, IBM Plex Sans + Serif, formulas IBM Plex Mono. Verdict accent only: oxblood correct, vermillion false, amber incomplete. No UI kit. No purple dashboard.

`src/ui/` parses and shows `CheckResult`. No tableau rules here. Tokens in `src/styles.css`.

## Layout (v1)

One table. No DAG. No inference pane. Inspector is the last column of each proposition row.

### Statements (`StatementList`)

Table row per claim:

- Id `P1`, `P2`, … sequential, stable until delete
- Natural language textarea
- Formula field
- Live parse: Unicode pretty on success, span + message on fail
- Add / remove

Formula palette inserts `□ ◇ ∀ ∃ → ∧ ∨ ¬ =` into the focused formula field.

Natural language is never parsed. Empty formula → blank inspector.

### Inspector

On the proposition row. Later: extra notes, tableau/countermodel text in `CheckResult.notes`. No separate `VerdictPane`.

### LogicBar

Mockup: locked to system **D**, **constant** domain. In-app How it works (`HowItWorks`). No system/domain pickers.

After sign-off, pickers may return. Target: K / T / D / B / S4 / S5, constant / varying. Change system or domain → cached verdicts become unchecked. Do not auto-recompute.

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

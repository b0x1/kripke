# UI

**Iteration 1:** mockup only. Scope in [PLAN.md](../PLAN.md). No theme, no palette, no persistence, no real prover. Stub Check ok.

Target below is **after** mockup sign-off.

One workbench. Logic notebook: warm paper, ink, IBM Plex Sans + Serif, formulas IBM Plex Mono. Verdict accent only: oxblood correct, vermillion false, amber incomplete. No UI kit. No purple dashboard.

`src/ui/` parses, pretty-prints, calls `checkInference`. No tableau rules here. Tokens in `src/styles.css`.

## Layout (v1)

Argument notebook. No DAG.

```
┌──────────────────────────────────────────┬─────────────────┐
│ LogicBar                                 │                 │
├──────────────────────────────────────────┤ Inspector       │
│ Statements (cards P1, P2, …)             │ (after Check:   │
│ Inferences (pickers + rows)              │  verdict /      │
│                                          │  tableau /      │
│                                          │  Kripke)        │
└──────────────────────────────────────────┴─────────────────┘
```

Wide: inspector on the right after the user Checks. Narrow: inspector below the argument. Before any Check: inspector empty state (short hint + cheatsheet link).

### Statements (`StatementList`, `FormulaField`)

Card per claim:

- Id `P1`, `P2`, … sequential, stable until delete
- English textarea
- Formula field
- Live parse: Unicode pretty on success, span + message on fail
- Add / remove

Formula palette inserts `□ ◇ ∀ ∃ → ∧ ∨ ¬ =` into the focused formula field.

English is never parsed. Empty formula → any inference using that id is **incomplete**.

### Inferences (`InferenceList`)

Declare an entailment with **pickers**, not by typing ids:

- Multi-select premises (existing statement ids)
- Dropdown conclusion (existing statement id)
- Add inference
- Premise set must be non-empty. Conclusion must not be in the premise set.
- Same premise-set + conclusion pair cannot be added twice.

Each row: `P1, P2 ⊢ P3`, Check, last verdict chip, remove.

**Check all** runs every row with current system and domain.

Click a row to select it. Inspector shows that row’s last result.

### Inspector (`VerdictPane`, `TableauView`, `KripkeView`)

Selected inference, last Check:

- **Correct**: short why, unused-premise warning if any, collapsible closed tableau
- **False**: conclusion does not follow; SVG Kripke (worlds, accessibility, hover for atoms + domain)
- **Incomplete**: blocker (empty formula, parse error, unknown id, which bound)

### LogicBar

- System: K / T / D / B / S4 / S5 (default S5)
- Domain: constant / varying (default constant)
- Load example
- Cheatsheet drawer
- Import / export JSON

Change system or domain → cached verdicts become unchecked. Do not auto-recompute.

## Persistence

- `localStorage`: statements, inferences, system, domain. Not tableau trees.
- Import / export JSON = `src/examples/*.ts` shape.

One loader path for examples and import.

## Examples

Already formalized. Each sets statements, inferences, system, domain, blurb.

1. Socrates syllogism — correct
2. Affirming the consequent — false
3. Distribution of necessity `□(P→Q), □P ⊢ □Q` — correct in K
4. `□P ⊢ P` — false in K; blurb: T makes it correct
5. De dicto vs de re — two inferences, both fail if claimed equivalent
6. Necessity of identity — `a = b ⊢ □(a = b)` correct
7. Barcan — correct on constant; blurb: toggle varying

## Cheatsheet

- Connectives: [syntax.md](syntax.md)
- De re vs de dicto: `[] Ex P(x)` vs `Ex [] P(x)`
- Frame assumptions per system
- Incomplete = missing formalization vs bound

## Interaction

- Formula field: ASCII from [syntax.md](syntax.md). Palette optional.
- Parse live. Tableau only on Check.
- One selected inference in the inspector.
- First visit: blank notebook, not auto-loaded example.

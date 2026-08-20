# Tableau engine

All logic lives under `src/engine/`. No React imports.
Ground prefixed tableau (Fitting-style prefixes as worlds), iterative deepening.
Not a free-variable unifier. Not a complete decision procedure.
Same formulas, system, domain, and bounds → same status (prefix labels are not random).

FOML is undecidable. Bounds are part of the spec: exhausting a bound is **incomplete**, never **false**.

## Modules

| File | Role |
| --- | --- |
| `src/engine/checkTypes.ts` | `CheckResult` (`status`, `notes` why, `bases` / `contradicts` ids) |
| `src/engine/ast.ts` | Formula / term AST, signature helpers |
| `src/engine/parse.ts` | Recursive-descent parser |
| `src/engine/pretty.ts` | Unicode pretty-printer with safe parentheses |
| `src/engine/frames.ts` | Frame conditions for K/T/D/B/S4/S5 |
| `src/engine/tableau.ts` | Expansion rules, saturation, bounds |
| `src/engine/countermodel.ts` | Kripke model from a saturated open branch |
| `src/engine/check.ts` | Public `checkInference` API |

## Check API

```ts
checkInference(
  premises: Formula[],
  conclusion: Formula,
  options: CheckOptions,
): CheckResult

type Status = "correct" | "false" | "incomplete"

type CheckOptions = {
  system: "K" | "T" | "D" | "B" | "S4" | "S5"
  domain: "constant" | "varying"
  bounds: { maxPrefixDepth: number; maxGammaRounds: number; maxNodes: number }
}

type CheckResult = {
  status: Status
  notes: string[]            // inspect: short why when incomplete; empty for valid/false
  bases?: string[]           // inspect: premise ids shown when valid
  contradicts?: string[]     // inspect: ids shown when false
  proof?: TableauTree        // present when correct
  model?: KripkeModel        // present when false
  issues?: Issue[]           // present when incomplete, or warnings when correct
  unusedPremises?: number[]  // warning only; status remains correct
}
```

The UI layer is responsible for mapping statement ids, missing formulas, and parse errors into **incomplete**
before calling `checkInference`. The engine assumes well-formed formulas.

Default options for the workbench: `system: "D"`, `domain: "constant"`, rigid designators.

## Prefixed tableau

A prefix `σ` is a sequence of positive integers naming a world (`1`, `1.1`, `1.2`, `1.1.1`, …).
Signed formulas (or NNF plus a truth polarity) sit at a prefix.

Start from prefix `1`:

- `T` each premise at `1`
- `F` the conclusion at `1` (equivalently `T ¬conclusion`)

Close a branch when complementary literals occur at the same prefix, or when `t = t` is false,
or when `t = s` and `t ≠ s` both hold (after congruence closure on identity).

### Propositional

Standard α / β rules for `∧ ∨ → ↔ ¬`.

### Modal (ν / π)

- `σ T □φ` (ν): for every accessible `σ.n`, add `σ.n T φ`; also apply frame-specific extra copies
- `σ T ◇φ` (π): create a fresh successor `σ.n` if the serial/possibility rule requires it,
  add accessibility `σ R σ.n`, add `σ.n T φ`
- Dual rules for `F □` / `F ◇`

Accessibility is an explicit relation on prefixes.
Frame rules add more accessibility edges or more formula copies, they do not rewrite prefixes.

### First-order (γ / δ)

- γ (`∀` true / `∃` false): instantiate with every parameter that **exists at that world**.
  Repeat across γ-rounds up to `maxGammaRounds`.
- δ (`∃` true / `∀` false): introduce a fresh parameter that exists at that world.

If the Herbrand universe is empty at a world, introduce one dummy parameter so γ can fire (empty-domain edge case).

### Identity

- Reflexivity: `t = t` is available
- Substitution of identicals in atoms at the same world
- Constants are rigid: if `a = b` at any world, `a = b` at all worlds, so `a = b ⊢ □(a = b)` is **correct**

### Domains

- **Constant**: every parameter exists at every world. Barcan `∀x □φ → □∀x φ` and converse Barcan hold.
- **Varying**: existence is world-local. γ may only use parameters that exist at `σ`.
  Barcan / converse Barcan fail in general.

## Frame conditions

| System | Extra condition | Tableau effect |
| --- | --- | --- |
| K | none | only generated π-successors |
| T | reflexive | `σ R σ`; `σ □φ` yields `σ φ` |
| D | serial | every used prefix has a successor |
| B | symmetric | `σ R τ` implies `τ R σ` |
| S4 | T + transitive (4) | close accessibility under transitivity |
| S5 | T + euclidean (5), equivalently T+B+4 | universal accessibility on the generated cluster |

S4 = T + 4. S5 = T + 5 (implement 5 or B+4, not both ad hoc). Default UI system is D.

## Bounds and saturation

Stop when:

1. Every branch closed → **correct**, return the tableau tree
2. An open branch is saturated (no rule produces a new formula, new prefix within depth, or new unused γ instance)
   → **false**, extract a model
3. `maxPrefixDepth`, `maxGammaRounds`, or `maxNodes` is hit on an unclosed unsaturated branch → **incomplete**

Never report **false** merely because search stopped.

## Countermodels

From a saturated open branch (`src/engine/countermodel.ts`):

- Worlds = prefixes that appear
- Accessibility = the R relation on those prefixes, already closed under the system’s frame conditions
- Domain = parameters existing at each world
- Interpretation = ground atoms true at each world; identity as the congruence class of `=`

The Kripke viewer reads this structure only. It does not re-run the tableau.

## Required engine tests

Vitest in `src/engine/*.test.ts` is part of the build, not optional.

| Case | Expectation |
| --- | --- |
| Socrates syllogism | correct in every system |
| Affirming the consequent | false, countermodel |
| `□(P→Q), □P ⊢ □Q` | correct in K |
| `□P ⊢ P` | false in K, correct in T (and S4/S5) |
| `◇□P ⊢ □P` | correct in S5, not in K |
| Barcan formula | correct on constant domains, false on varying |
| `a = b ⊢ □(a = b)` | correct |
| `□∃x P(x)` vs `∃x □P(x)` | not equivalent; dicto ⊬ re in K; re ⊬ dicto on varying |
| Search bound on a hard open problem | incomplete, not false |
| Parse of `Ax Man(x) -> Mortal(x)` vs parenthesized syllogism | different ASTs |

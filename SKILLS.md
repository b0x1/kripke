# Skills

How to extend the system. Rules live in [README.md](README.md) and [`architecture/`](architecture/README.md); do not restate them here.

## Add a connective or binder

1. New AST node in `src/engine/ast.ts`.
2. ASCII + Unicode in `src/engine/parse.ts`.
3. Pretty-print in `src/engine/pretty.ts` so `parse(pretty(ast))` equals `ast`.
4. Expansion in `src/engine/tableau.ts`. If the rule is not standard α/β, modal, or quantifier, update [architecture/engine.md](architecture/engine.md) first.
5. Tests: ASCII, Unicode, round-trip; one correct and one false entailment.
6. Palette glyph and cheatsheet row: add to [`src/engine/syntaxGuide.ts`](src/engine/syntaxGuide.ts) (How it works renders it).

## Add a modal system

A named bundle in `src/engine/frames.ts`, not a fork of the tableau.

1. Add the name to `CheckOptions` in [architecture/engine.md](architecture/engine.md).
2. Declare the frame property and close `R` only; copy ν-formulas along new edges, nothing else.
3. Tests: one theorem that fails in K, one K-valid that still holds.
4. Label on `LogicBar`. Changing system clears cached verdicts.

Do not stack overlapping closures (e.g. both 5 and B+4) that disagree on when a branch closes.

## Add an example

1. `src/examples/<id>.ts` in the export JSON shape: statements (`id`, `naturalLanguage`, `formula`), `blurb`.
2. Register in the `LogicBar` example index.
3. Every formula must parse. Prefer the list in [architecture/UI.md](architecture/UI.md).
4. Reuse or add the matching engine test so the demo cannot drift from the prover.

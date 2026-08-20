# Plan

Build order. Spec: [README.md](README.md), [`architecture/`](architecture/README.md). Agents: [AGENTS.md](AGENTS.md). UI target: [architecture/UI.md](architecture/UI.md).

## Iteration 1 — mockup (now)

See the loop. Then stop. User iterates before more work.

Minimal. No fancy UI. Default system fonts, plain boxes, no notebook theme, no IBM Plex, no SVG, no cheatsheet, no examples, no localStorage.

Done:

- LogicBar: locked D, constant domain
- Statement table: id, natural language, formula, inspector
- Seeded mock rows (P1 P2 incomplete; P3 valid from them; P4 `¬Mortal(socrates)` false)
- How it works (in-app)

Stub: no formula → blank inspector; unmatched `(`/`)` → error in formula column; does not follow from others → incomplete; Socrates conclusion valid when premises present; `¬Mortal(socrates)` then false and names the contradicted row; ASCII keywords (`not`, `and`, `forall`, …) same as Unicode; `false` → false; `?` → incomplete. Incomplete → Postulate checkbox, greys inspector. `CheckResult.notes` = tooltip. Formula syntax highlight (bold + color). Columns 5:4:1.

Out of this iteration: real parser, tableau, palette, persistence, examples, CSS tokens.

Stub Check is allowed here only. After sign-off, no fake engine.

## Later (after mockup sign-off)

- [x] Vite + pnpm + ESLint skeleton (no app code)
- [ ] Notebook CSS tokens
- [ ] AST, parser, pretty-printer, parse-error locations
- [ ] Prefixed ground tableau: K/T/D/B/S4/S5, constant/varying domains, identity, bounds
- [ ] `checkInference`: correct / false / incomplete, proof tree, Kripke countermodel
- [ ] Engine tests listed in [architecture/engine.md](architecture/engine.md)
- [ ] Workbench wired to real engine: live parse, palette, check-all, localStorage + JSON I/O
- [ ] Inspector: real verdict, collapsible tableau, SVG Kripke, cheatsheet, loadable examples

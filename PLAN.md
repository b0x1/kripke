# Plan

Build order. Spec: [README.md](README.md), [`architecture/`](architecture/README.md). Agents: [AGENTS.md](AGENTS.md). UI target: [architecture/UI.md](architecture/UI.md).

## Iteration 1 — mockup (now)

See the loop. Then stop. User iterates before more work.

Minimal. No fancy UI. Default system fonts, plain boxes, no notebook theme, no IBM Plex, no SVG, no cheatsheet, no examples, no localStorage.

Ship:

- LogicBar: system + domain only
- Statement cards: id, English, formula, add / remove
- Inference pickers: multi-select premises, conclusion dropdown, Add
- Inference rows: `P1, P2 ⊢ P3`, Check, remove
- Inspector: after Check, a **stub** verdict (hardcoded or random placeholder: correct / false / incomplete). No tableau. No Kripke.

Out of this iteration: parser, tableau, live parse, formula palette, persistence, examples, CSS tokens.

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

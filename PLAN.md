# Plan

Build order. Spec: [README.md](README.md), [`architecture/`](architecture/README.md). Agents: [AGENTS.md](AGENTS.md). UI target: [architecture/UI.md](architecture/UI.md).

## Iteration 1 — mockup

Done. User signed off. Stub Check gone.

## Engine (now)

Done:

- AST, parser, Unicode pretty-printer (`src/engine/ast.ts`, `parse.ts`, `pretty.ts`)
- Prefixed ground tableau: K/T/D/B/S4/S5, constant/varying, identity, bounds
- `checkInference` + countermodel (`check.ts`, `tableau.ts`, `countermodel.ts`, `frames.ts`)
- Workbench inspector uses `inspect.ts` (parse + tableau). P1 P2 incomplete; P3 valid; P4 false and names P3
- Engine tests in `src/engine/*.test.ts`

Still later: notebook CSS, palette, persistence, examples, SVG Kripke, cheatsheet, collapsible tableau in the inspector.

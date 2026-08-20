# Agents

Read [README.md](README.md), then [`architecture/`](architecture/README.md).
Build order: [PLAN.md](PLAN.md). Extend: [SKILLS.md](SKILLS.md). Spec change → update spec same change.

Iteration 1 mockup signed off. No fake engine. Tableau in `src/engine/`.

## Principles

- Docs: caveman speak. Short sentences. No fluff. Wrap at sentence or clause ends, between 80 and 120 chars.
  Not tables. Not code fences.
- DRY: code and docs. One fact, one place. Link, don't copy.
- Split: `src/engine` (logic), `src/ui` (view), `src/examples` (data).
- Layers: [eslint.config.js](eslint.config.js) is law.
  - engine ↛ ui, examples, react
  - examples ↛ ui
  - ui → engine, examples ok
  - no import cycles
- pnpm only. No `npm` / `npx`. No `package-lock.json`.

## Copyright

Do not copy other people's copyrighted work into this project.
That means code, prose, examples, and figures from books, papers, websites, or other software.
Write original material.
Public domain and CC0 material is allowed.
If you include it, name the author in a comment or in the same file.
Installing a package with pnpm is allowed.
Do not paste that package's source into `src/` or the docs.

## Verify

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
```

Smoke (once code exists): P1 P2 → claim; P3 → valid; P4 `¬Mortal(socrates)` → false;
empty formula → blank inspector; unmatched `(` → formula error.

## Git

Commit only when asked. No secrets. No git config edits.

## Do not add

- Markdown preview of natural language
- Rename statement ids that other rows still mention
- Check-all on every keystroke
- Sound on verdict
- Purple / dark dashboard default

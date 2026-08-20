# Agents

Read [README.md](README.md), then [`architecture/`](architecture/README.md). Build order: [PLAN.md](PLAN.md). Extend: [SKILLS.md](SKILLS.md). Spec change → update spec same change.

Iteration 1 (mockup): stub Check allowed. After sign-off: no fake engine.

## Principles

- Docs: caveman speak. Short sentences. No fluff.
- DRY: code and docs. One fact, one place. Link, don't copy.
- Split: `src/engine` (logic), `src/ui` (view), `src/examples` (data).
- Layers: [eslint.config.js](eslint.config.js) is law.
  - engine ↛ ui, examples, react
  - examples ↛ ui
  - ui → engine, examples ok
  - no import cycles
- pnpm only. No `npm` / `npx`. No `package-lock.json`.

## Verify

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
```

Smoke (once code exists): Socrates → correct; affirming consequent → false + model; empty formula → incomplete; bound hit → incomplete.

## Git

Commit only when asked. No secrets. No git config edits.

## Do not add

- Markdown preview of English
- Rename statement ids without updating inferences
- Check-all on every keystroke
- Sound on verdict
- Purple / dark dashboard default

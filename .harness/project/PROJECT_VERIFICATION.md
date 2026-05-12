# Project Verification

Last reviewed: 2026-05-12

## Install

```bash
npm ci
```

Evidence: `package-lock.json` observed by `.harness/scripts/inspect-project.sh`.

## Standard Checks

```bash
npm run test
npm run build
```

Evidence: `package.json` scripts.

`npm run build` runs:

```bash
tsc -b && vite build
```

## Runtime Checks

Start the Vite dev server when browser verification is needed:

```bash
npm run dev
```

Common Harness smoke command for a local Vite app:

```bash
APP_URL=http://localhost:5173 bash .harness/scripts/smoke.sh
```

## Current Test Coverage

- `src/game/rules/gameRules.test.ts`: dice, summon placement, movement, combat, and turn rules.
- `src/game/ai/aiPlanner.test.ts`: AI attack, movement legality, placement, summon skip, and no-action behavior.
- `src/components/GameScreen.test.tsx`: UI smoke flow and AI turn smoke flow.

## Known Gaps

- No dedicated `lint` script is present in `package.json`.
- No dedicated e2e or Playwright test suite is present.
- UI behavior changes may need manual or browser-level evidence beyond `npm run test` and `npm run build`.


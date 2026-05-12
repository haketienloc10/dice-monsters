# Project Verification

Last reviewed: 2026-05-12

## Package Manager

Use npm. Evidence: `package-lock.json` and `package.json`.

## Install

```bash
npm ci
```

Use this when dependencies are missing or after dependency changes.

## Development

```bash
npm run dev
```

Starts Vite. Playwright config uses `npm run dev -- --host 127.0.0.1 --port 4173` as its test web server.

## Required Checks

For gameplay, reducer, UI, AI, or TypeScript changes, run:

```bash
npm run test
npm run build
```

For browser flow changes, also run:

```bash
npm run test:e2e
```

## Evidence

- `package.json` scripts define `dev`, `build`, `test`, and `test:e2e`.
- `vitest.config.ts` uses jsdom and excludes `e2e/**`, `node_modules/**`, and `dist/**`.
- `playwright.config.ts` starts the Vite dev server on `127.0.0.1:4173`.
- Unit/rule tests exist in `src/game/rules/gameRules.test.ts` and `src/game/ai/aiPlanner.test.ts`.
- Component smoke tests exist in `src/components/GameScreen.test.tsx`.
- E2E smoke test exists in `e2e/game.spec.ts`.

## Known Gaps

- No lint script was observed in `package.json`.
- No CI configuration was observed.
- README does not document development or test workflow yet.

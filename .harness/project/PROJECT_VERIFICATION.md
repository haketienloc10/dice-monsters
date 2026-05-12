# Project Verification

Last reviewed: 2026-05-12

## Install

```bash
npm ci
```

Evidence: `package-lock.json` is present.

## Development

```bash
npm run dev
```

Runs Vite using the `dev` script from `package.json`.

## Required Checks

```bash
npm run test
npm run build
```

Evidence:

- `npm run test` maps to `vitest --run`.
- `npm run build` maps to `tsc -b && vite build`.

## Browser / E2E Check

```bash
npm run test:e2e
```

Evidence:

- `package.json` maps `test:e2e` to `playwright test`.
- `playwright.config.ts` starts `npm run dev -- --host 127.0.0.1 --port 4173` and uses `http://127.0.0.1:4173`.

## Harness Smoke Candidate

If the dev server is already running:

```bash
APP_URL=http://localhost:5173 bash .harness/scripts/smoke.sh
```

## Current Coverage Notes

- Component smoke tests cover board rendering, dice roll, turn end, and P2 AI returning control to P1.
- Playwright smoke test covers browser-visible P1 roll and P2 AI turn flow.
- Reducer and rule coverage exists under `src/game/rules/*.test.ts` and `src/game/ai/*.test.ts`.

## Unknowns

- No dedicated lint script is currently declared in `package.json`.
- No CI workflow file was observed during this sync.

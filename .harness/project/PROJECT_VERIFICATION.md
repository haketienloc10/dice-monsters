# Project Verification

Synced at: `2026-05-14T00:22:45+07:00`

## Install

- Clean install: `npm ci`
- Package-manager evidence: `package-lock.json`

## Primary Commands

- Unit/integration tests: `npm run test`
- Production build/typecheck: `npm run build`
- Browser e2e: `npm run test:e2e`

## Runtime Commands

- Dev server: `npm run dev`
- Vite default URL: `http://localhost:5173`
- Playwright configured server: `http://127.0.0.1:4173`

## Config Evidence

- `vitest.config.ts` uses `jsdom`, excludes `e2e/**`, `node_modules/**`, and `dist/**`.
- `playwright.config.ts` starts `npm run dev -- --host 127.0.0.1 --port 4173` and runs tests from `e2e`.
- `package.json` build script is `tsc -b && vite build`.

## Notes

- `.harness/scripts/inspect-project.sh` infers a generic Vite smoke URL on port `5173`; Playwright e2e evidence specifically uses port `4173`.
- No lint script is currently declared in `package.json`.

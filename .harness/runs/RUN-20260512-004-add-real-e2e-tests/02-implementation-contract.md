# Implementation Contract

## Contract Status

Approved

## Goal

Add true browser E2E verification using Playwright without changing game behaviour.

## Planned Change

- Install `@playwright/test` as a dev dependency.
- Add `test:e2e` script.
- Add Playwright config that starts Vite and runs against system Chrome.
- Add a deterministic smoke E2E test for render, roll, end turn, AI thinking, and return to P1.
- Ignore generated Playwright artifacts.

## Non-Goals

- No reducer/rule/UI behaviour changes.
- No multi-browser test matrix.
- No visual snapshot baseline in this run.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `package.json` | add script and dev dependency | expose E2E command | Low |
| `package-lock.json` | dependency lock update | reproducible install | Low |
| `playwright.config.ts` | browser/server config | run real E2E | Low |
| `vitest.config.ts` | exclude E2E files from Vitest | keep runners separated | Low |
| `e2e/game.spec.ts` | browser smoke flow | verify game in browser | Low |
| `.gitignore` | ignore reports/artifacts | avoid generated churn | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| Completed UI run | app files dirty | Not active; avoid app edits | Continue |

## Behaviour Contract

- [ ] `npm run test:e2e` uses a real browser and passes.
- [ ] E2E does not depend on internal React implementation details.
- [ ] Game rules and UI source files are unchanged by this run.

## Verification Plan

```bash
npm run test:e2e
npm run test
npm run build
```

## Manual / Runtime Checks

Playwright `webServer` starts Vite automatically; no separate manual server should be required.

## Rollback / Safety Notes

Remove Playwright dependency/config/test/script if E2E cannot be made reliable in this environment.

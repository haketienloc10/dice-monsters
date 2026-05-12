# Planner Brief

## Related Epic

None

## Goal

Add a real browser E2E smoke suite that starts the Vite app, opens it in Chrome/Chromium via Playwright, verifies the polished game renders, rolls dice, ends P1 turn, observes AI turn feedback, and waits for control to return to P1.

## Context Summary

The repo currently has Vitest/jsdom UI smoke tests but no true E2E dependency or browser automation. The host machine has `/usr/bin/google-chrome`, so Playwright can use the system Chrome channel.

## In Scope

- Add `@playwright/test`.
- Add `playwright.config.ts`.
- Add an `e2e/game.spec.ts` browser test.
- Add `test:e2e` npm script.
- Ignore Playwright generated reports/artifacts if needed.

## Out of Scope

- Game logic changes.
- UI refactors.
- Heavy multi-browser matrix.

## Acceptance Criteria

- [ ] `npm run test:e2e` launches Vite and passes in a real browser.
- [ ] E2E verifies the game board renders with 117 cells.
- [ ] E2E verifies dice roll updates visible dice results.
- [ ] E2E verifies P2 AI turn disables roll control and eventually returns control to P1.
- [ ] `npm run test` and `npm run build` still pass.

## Likely Impacted Areas

- `package.json`
- `package-lock.json`
- `playwright.config.ts`
- `e2e/game.spec.ts`
- `.gitignore`

## Risks / Unknowns

- Browser binary availability. Mitigation: use installed Google Chrome channel in config.
- Random dice can place the game in summon or action phase. Test should use stable UI states and buttons.

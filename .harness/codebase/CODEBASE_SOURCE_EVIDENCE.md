# Codebase Source Evidence

Last reviewed: 2026-05-12

## Evidence Log

| Date | Area/docs updated | Source paths inspected | Important files reviewed | Confidence | Stale/uncertain areas |
|---|---|---|---|---|---|
| 2026-05-12 | All `.harness/codebase/*` docs | `src/`, `src/components/`, `src/game/`, `src/game/ai/`, `src/game/data/`, `src/game/rules/`, `e2e/`, root configs | `src/components/GameScreen.tsx`, `src/game/types.ts`, `src/game/reducer.ts`, `src/game/initialState.ts`, `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, `src/game/data/*.ts`, test files, Vite/Vitest/Playwright configs | High for current source navigation | Visual layout details need browser inspection for pixel-level confidence. |

## Current Evidence Summary

| Source area | Evidence basis | Confidence | Notes |
|---|---|---|---|
| App/root | `index.html`, `src/main.tsx`, `src/App.tsx` | High | Simple React mount with no router observed. |
| Game screen/UI orchestration | `src/components/GameScreen.tsx` | High | Owns reducer state, AI hook, visual effects, and layout composition. |
| UI components | `src/components/*.tsx`, component test, E2E smoke | Medium-high | Component inventory is complete by file list; not every component was line-by-line reviewed. |
| Game model/reducer | `src/game/types.ts`, `src/game/reducer.ts`, `src/game/initialState.ts` | High | Core state/action/event contracts reviewed. |
| Rules | `src/game/rules/gameRules.test.ts`, rule imports/usages from reducer and AI | High | Key rule files and tests reviewed for navigation and impact. |
| Static game data | `src/game/data/*.ts` | High | Dice, monsters, and tile shapes reviewed. |
| AI | `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, `src/game/ai/aiPlanner.test.ts` | High | Controller/planner flow reviewed; scoring/utils details inferred from file boundaries and tests. |
| Styles | `src/styles/*.css`, component class usage | Medium | CSS file inventory observed; visual behavior not browser-reviewed in this sync. |
| Tests | `src/**/*.test.ts*`, `e2e/game.spec.ts`, configs | High | Main test surfaces reviewed. |

## Stale Or Uncertain Areas

- Styles: needs browser screenshot/visual inspection for layout-sensitive changes.
- README/product intent: `README.md` is minimal, so long-term product goals are not source-backed.
- Generated outputs: `dist/`, `playwright-report/`, and `test-results/` exist locally but are treated as non-source.

## Maintenance Rules

- Prefer actual source files, tests, and import usage over these notes.
- If file paths or exported contracts change, update `CODEBASE_INDEX.md`, `CODEBASE_AREAS.md`, and `CODEBASE_CHANGE_IMPACT.md`.
- Keep project-level facts in `.harness/project/*` and source-navigation facts here.

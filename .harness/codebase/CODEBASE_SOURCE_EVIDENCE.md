# Codebase Source Evidence

Purpose: record evidence used to maintain `.harness/codebase/*`.

This is not a run worklog. Keep it as durable source evidence for navigation and impact notes.

## Evidence Log

| Date | Area/docs updated | Source paths inspected | Important files reviewed | Confidence | Stale/uncertain areas |
|---|---|---|---|---|---|
| 2026-05-14 | All `.harness/codebase/*` docs | `src/`, `e2e/`, root app/test config files, `.harness/project/*`, `AGENTS.md` | `src/main.tsx`, `src/App.tsx`, `src/components/GameScreen.tsx`, `src/game/reducer.ts`, `src/game/types.ts`, `src/game/rules/*`, `src/game/ai/*`, `src/game/data/*`, component files, tests, `package.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts` | High for current source layout, entrypoints, flows, and tests | README remains minimal; `AGENTS.harness.md` was referenced by IDE context but is absent on disk; no deep visual/browser inspection performed for CSS behavior. |

## Current Evidence Summary

| Source area | Evidence basis | Confidence | Notes |
|---|---|---|---|
| Frontend bootstrap | Read `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts` | High | `App` is a direct wrapper around `GameScreen`; no client router observed. |
| Interaction shell | Read `src/components/GameScreen.tsx`; searched action/helper usages | High | Shell owns reducer wiring, animation locks, placement preview, human click handling, and AI hook call. |
| Board rendering | Read `Board.tsx`, `BoardCell.tsx`, `BoardEffects.tsx`, `CoreBase.tsx`, `MonsterToken.tsx`; searched board CSS selectors | High | Board renders `state.board.flat()` with `role="grid"` and cells with `role="gridcell"`. |
| HUD and panels | Read all `src/components/*.tsx`; searched visible labels and action dispatches | High | Panels consume `GameState` and dispatch actions through `GameScreen`. |
| Game contracts and state | Read `types.ts`, `constants.ts`, `initialState.ts`, `reducer.ts` including reducer branches | High | `GameAction`, `GameEvent`, and `GameState` are central shared contracts. |
| Pure rules | Read `src/game/rules/*.ts` and `gameRules.test.ts` | High | Rules are pure helpers consumed by reducer and AI. |
| Static game data | Read `diceCatalog.ts`, `monsters.ts`, `tileShapes.ts`; searched ID usages | High | Dice IDs connect monster and tile shape IDs; visuals are keyed separately in `MonsterToken`. |
| AI planning | Read `aiController.ts`, `aiPlanner.ts`, `aiScoring.ts`, `aiUtils.ts`, `aiTypes.ts`, `aiPlanner.test.ts` | High | AI emits reducer-compatible actions and is timer-scheduled by React hook. |
| Styles | Listed/read selector evidence from `src/styles/*.css` and component class usage | Medium | Source-level class ownership is clear; no browser screenshot/layout check was run during codebase sync. |
| Tests | Read `GameScreen.test.tsx`, `gameRules.test.ts`, `aiPlanner.test.ts`, `e2e/game.spec.ts` | High | Coverage boundaries are clear; command details belong in `.harness/project/PROJECT_VERIFICATION.md`. |

## Important Searches

| Search | Why it mattered |
|---|---|
| `find src e2e -type f` | Established current source/test file set. |
| `rg -n "from \"\\.\\.|from \"\\./|useAIController|gameReducer|createInitialState|ROLL_DICE|PLACE_DUNGEON_SHAPE|ENTER_MOVE_MODE|ENTER_ATTACK_MODE|END_TURN|RESET_GAME" src e2e` | Confirmed imports, reducer/action consumers, and central control flow. |
| `rg -n "export function|export const|export type|function " src/game src/components` | Identified exported contracts and helper symbols. |
| `rg -n "game-root|game-shell|main-layout|board-grid|board-cell|monster-token|panel|top-bar|dice-tray|crest" src/styles/*.css` | Connected component class names to CSS areas. |
| `find . -maxdepth 2 -type f \( -name 'AGENTS.harness.md' -o -name 'README.md' -o -name 'vite.config.ts' -o -name 'tsconfig*.json' -o -name 'index.html' \)` | Confirmed root entry/config files and absence of `AGENTS.harness.md`. |

## Stale Or Uncertain Areas

- `AGENTS.harness.md`: referenced by IDE context but not present in the workspace during sync.
- `README.md`: only contains `# dice-monsters`; source and tests are better behavior evidence.
- `dist/`: present on disk but treated as build output, not source-navigation evidence.
- CSS behavior: source selectors were inspected, but no Playwright screenshot or manual browser layout verification was run for this docs-only sync.

## Maintenance Rules

- Prefer actual source files, tests, route definitions, command entrypoints, and imports over memory.
- Record important searches when they affect impact confidence.
- Do not copy run-by-run implementation logs here.
- If evidence belongs to project-level profile, architecture, verification, rules, glossary, context, or open questions, update or reference `.harness/project/*` instead.

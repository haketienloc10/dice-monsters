# Codebase Index

Purpose: first codebase document to read before non-trivial coding tasks.

Project-level stack/runtime/verification live in `.harness/project/PROJECT_PROFILE.md` and `.harness/project/PROJECT_VERIFICATION.md`.

Last reviewed: 2026-05-12

## Keyword Map

| Task keywords | Source area | Read next | Inspect first |
|---|---|---|---|
| board, grid, cell, tile, highlight, placement preview | Board UI + summon/board rules | `CODEBASE_AREAS.md`, `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/components/Board.tsx`, `src/components/BoardCell.tsx`, `src/game/rules/board.ts`, `src/game/rules/summon.ts` |
| dice, roll, crests, summon candidates | Dice and summon flow | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/components/DiceTray.tsx`, `src/game/rules/dice.ts`, `src/game/data/diceCatalog.ts`, `src/game/reducer.ts` |
| move, attack, combat, target, core damage | Action/combat flow | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/rules/movement.ts`, `src/game/rules/combat.ts`, `src/game/reducer.ts`, `src/components/ActionPanel.tsx` |
| AI, P2, automated turn, planner, scoring | AI turn flow | `CODEBASE_AREAS.md`, `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, `src/game/ai/aiScoring.ts`, `src/game/ai/aiUtils.ts` |
| monster stats, dice catalog, tile shapes, balance | Static game data | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/data/monsters.ts`, `src/game/data/diceCatalog.ts`, `src/game/data/tileShapes.ts` |
| layout, HUD, animation, responsive, visual polish | UI components and styles | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/components/GameScreen.tsx`, `src/styles/*.css`, component owning the visual area |
| tests, smoke, e2e, browser flow | Verification source | `CODEBASE_CHANGE_IMPACT.md`, project verification docs | `src/components/GameScreen.test.tsx`, `src/game/rules/gameRules.test.ts`, `src/game/ai/aiPlanner.test.ts`, `e2e/game.spec.ts` |

## Common Task Shapes

| Task shape | Read next | Source inspection checklist |
|---|---|---|
| Add or change a UI interaction | `CODEBASE_ENTRYPOINTS.md`, `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | Trace `GameScreen` handler, dispatched `GameAction`, reducer branch, component disabled/ARIA state, related tests |
| Change a rule or reducer action | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | Search `GameAction` type and reducer branch, inspect rule helpers and tests, verify UI/AI callers |
| Change AI behavior | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | Inspect planner, scoring, utility legal-action helpers, fake-timer component test, e2e AI flow |
| Change styling/layout | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | Locate owning component and CSS file, check accessible labels used by tests, run browser/e2e when behavior-visible |
| Add static game content | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | Update data files consistently, check IDs referenced by dice/monsters/shapes, run unit and smoke tests |

## Source Area Shortlist

| Source area | Purpose | Likely files/folders | Notes |
|---|---|---|---|
| React app shell | Mounts app and global styles | `src/main.tsx`, `src/App.tsx` | Small, but style imports affect whole app |
| Game screen orchestration | Connects UI, reducer, AI, animations, effects | `src/components/GameScreen.tsx` | Highest UI coupling point |
| UI components | Board, panels, dice tray, log, HUD, overlays | `src/components/` | Many tests use text/roles from here |
| Game model and reducer | Shared state/actions and transition logic | `src/game/types.ts`, `src/game/reducer.ts`, `src/game/initialState.ts` | Reducer changes affect most flows |
| Rule modules | Board, dice, summon, movement, combat, turn helpers | `src/game/rules/` | Prefer focused unit tests for rule changes |
| AI modules | AI hook, planner, scoring, legal action utilities | `src/game/ai/` | Uses timers and reducer-compatible actions |
| Static game data | Dice, monster, tile-shape definitions | `src/game/data/` | ID consistency matters |
| Styles | Layout, board, HUD, game, theme, animation CSS | `src/styles/` | Visual changes may need Playwright evidence |
| Browser smoke tests | End-to-end visible flow | `e2e/game.spec.ts` | Sensitive to accessible names and visible copy |

## Staleness Signals

- New files appear under `src/` or `e2e/` but are missing here.
- `GameAction`, state shape, or reducer branches change without updating flows/impact docs.
- Playwright selectors or accessible labels change without updating impact notes.

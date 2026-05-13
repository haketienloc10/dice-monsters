# Codebase Index

Purpose: first codebase document to read before non-trivial coding tasks.

This file maps task language to source areas, focused codebase docs, and likely source files or folders to inspect.

Do not record stack, runtime, package manager, product context, business rules, or general verification here. Use:

- `.harness/project/PROJECT_PROFILE.md` for stack, runtime, package manager, and broad repository profile.
- `.harness/project/PROJECT_VERIFICATION.md` for general verification commands and evidence expectations.

## How To Use

1. Find the closest keyword or task shape below.
2. Read only the linked `.harness/codebase/*` files that help locate source.
3. Inspect the actual source files before editing.
4. Search usages before changing existing functions, classes, exported types, or action names.
5. If source evidence contradicts this document, update this file or mark stale context in `CODEBASE_FRESHNESS.md`.

## Keyword Map

| Task keywords | Source area | Read next | Inspect first |
|---|---|---|---|
| board, cell, dungeon grid, placement highlight, core tile, monster token | Board UI | `CODEBASE_AREAS.md`, `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/components/Board.tsx`, `src/components/BoardCell.tsx`, `src/components/BoardEffects.tsx`, `src/styles/board.css` |
| roll dice, summon candidate, rotate shape, skip summon | Game reducer and rules | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/reducer.ts`, `src/game/rules/dice.ts`, `src/game/rules/summon.ts`, `src/game/data/diceCatalog.ts`, `src/game/data/tileShapes.ts` |
| move, reachable cells, movement cost | Game reducer and rules | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/reducer.ts`, `src/game/rules/movement.ts`, `src/game/rules/board.ts`, `src/game/data/monsters.ts` |
| attack, damage, core HP, game over | Game reducer and rules | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/reducer.ts`, `src/game/rules/combat.ts`, `src/game/data/monsters.ts`, `src/components/CoreBase.tsx` |
| AI turn, AI thinking, planner, scoring | AI control and planning | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, `src/game/ai/aiUtils.ts`, `src/game/ai/aiScoring.ts` |
| action button, disabled state, end turn, reset | Interaction shell | `CODEBASE_ENTRYPOINTS.md`, `CODEBASE_FLOWS.md` | `src/components/GameScreen.tsx`, `src/components/ActionPanel.tsx`, `src/game/types.ts`, `src/game/reducer.ts` |
| HUD, crests, dice tray, top bar, log, monster info | HUD and panels | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/components/CrestBar.tsx`, `src/components/DiceTray.tsx`, `src/components/TopBar.tsx`, `src/components/GameLog.tsx`, `src/components/MonsterInfoPanel.tsx`, `src/styles/hud.css` |
| layout, responsive, desktop warning, visual polish | Styles | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/styles/layout.css`, `src/styles/hud.css`, `src/styles/board.css`, `src/styles/theme.css`, `src/components/GameScreen.tsx` |
| types, GameAction, GameState, event shape | Shared game contracts | `CODEBASE_CHANGE_IMPACT.md`, `CODEBASE_SOURCE_EVIDENCE.md` | `src/game/types.ts`, `src/game/reducer.ts`, `src/game/ai/aiTypes.ts`, import usages under `src/` |

## Common Task Shapes

| Task shape | Read next | Source inspection checklist |
|---|---|---|
| Change visible gameplay interaction | `CODEBASE_ENTRYPOINTS.md`, `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | Start at `GameScreen`, inspect dispatched `GameAction`, reducer branch, related rule helper, rendered state, and tests. |
| Change a pure gameplay rule | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | Inspect `src/game/rules/*`, reducer call sites, AI utilities/scoring consumers, and `src/game/rules/gameRules.test.ts`. |
| Add or rebalance a monster, die, or tile shape | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | Inspect `src/game/data/*`, `MonsterToken.monsterVisuals`, dice/summon tests, and AI scoring assumptions. |
| Change AI behavior | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | Inspect `aiController`, `aiPlanner`, `aiUtils`, `aiScoring`, reducer legality checks, and `aiPlanner.test.ts`. |
| Change UI layout or board styling | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | Inspect component structure, CSS class ownership, Playwright-visible roles/counts, and `GameScreen.test.tsx` smoke assumptions. |
| Change shared game types/actions | `CODEBASE_CHANGE_IMPACT.md`, `CODEBASE_SOURCE_EVIDENCE.md` | Search `GameAction`, action string names, `GameEvent`, `GameState`, `AIPlannedAction`, and all direct imports. |

## Source Area Shortlist

| Source area | Purpose | Likely files/folders | Notes |
|---|---|---|---|
| Frontend bootstrap | Mount React app and global styles | `src/main.tsx`, `src/App.tsx`, `index.html` | Thin entry chain into `GameScreen`. |
| Interaction shell | Own reducer, UI event dispatch, animation locks, AI turn lockout | `src/components/GameScreen.tsx` | Highest coupling point between UI, reducer, rules, and AI hook. |
| Board rendering | Render 13x9 board, cells, monsters, cores, visual effects | `src/components/Board*.tsx`, `CoreBase.tsx`, `MonsterToken.tsx`, `src/styles/board.css` | Depends on reducer highlight/target helpers and `GameEvent` shape. |
| HUD and action panels | Player controls, crests, dice results, game log, side panels | `src/components/ActionPanel.tsx`, `DiceTray.tsx`, `CrestBar.tsx`, `TopBar.tsx`, `GameLog.tsx`, `MonsterInfoPanel.tsx`, `TileShapePreview.tsx`, `src/styles/hud.css` | User-visible state mostly flows from `GameState`. |
| Game state and reducer | Central transition logic for actions and events | `src/game/types.ts`, `src/game/initialState.ts`, `src/game/reducer.ts`, `src/game/constants.ts` | Action/event changes have broad impact. |
| Pure rules | Board, dice, summon, movement, combat, turn helpers | `src/game/rules/*.ts` | Prefer testing here for gameplay changes. |
| Static data | Dice, monsters, tile shapes | `src/game/data/*.ts` | IDs connect dice to monsters and tile shapes. |
| AI planning | AI hook, legal option generation, scoring, planner | `src/game/ai/*.ts` | Planner emits reducer actions; reducer remains final legality gate. |
| Styles | Layout, board, HUD, theme, animation CSS | `src/styles/*.css` | CSS class names are manually coupled to components. |
| Tests | Component, rule, AI, browser smoke coverage | `src/components/GameScreen.test.tsx`, `src/game/rules/gameRules.test.ts`, `src/game/ai/aiPlanner.test.ts`, `e2e/game.spec.ts` | Verification command details live in `.harness/project/PROJECT_VERIFICATION.md`. |

## Staleness Signals

- `src/game/rules/*`, `src/game/ai/*`, or `src/components/*` files move without this index changing.
- New route, API, server, CLI, worker, or job entrypoints appear.
- New `GameAction`, `GameEvent`, monster/dice/tile IDs, or CSS class ownership is not represented here.
- Tests move or new test boundaries appear outside `src/**/*.test.*` and `e2e/*.ts`.

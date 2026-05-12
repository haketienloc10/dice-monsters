# Codebase Index

Last reviewed: 2026-05-12

Read this before non-trivial coding tasks. For stack and commands, use `.harness/project/PROJECT_PROFILE.md` and `.harness/project/PROJECT_VERIFICATION.md`.

## Keyword Map

| Task keywords | Source area | Read next | Inspect first |
|---|---|---|---|
| board, grid, cell, core, highlight | Board UI and board rules | `CODEBASE_AREAS.md`, `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/components/Board.tsx`, `src/components/BoardCell.tsx`, `src/game/rules/board.ts`, `src/game/constants.ts` |
| roll, dice, crest, summon candidate | Dice and summon rules | `CODEBASE_AREAS.md`, `CODEBASE_FLOWS.md` | `src/game/reducer.ts`, `src/game/rules/dice.ts`, `src/game/data/diceCatalog.ts`, `src/components/DiceTray.tsx` |
| summon, placement, tile shape, rotation | Summon placement | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/rules/summon.ts`, `src/game/data/tileShapes.ts`, `src/components/TileShapePreview.tsx`, `src/components/GameScreen.tsx` |
| move, reachable, path, dungeon tile | Movement rules | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/rules/movement.ts`, `src/game/reducer.ts`, `src/game/rules/gameRules.test.ts` |
| attack, combat, damage, range, core hit | Combat rules | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/rules/combat.ts`, `src/game/reducer.ts`, `src/game/data/monsters.ts` |
| turn, phase, game over, reset | Turn/state transitions | `CODEBASE_FLOWS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/reducer.ts`, `src/game/rules/turn.ts`, `src/game/initialState.ts` |
| AI, planner, scoring, automated P2 | AI action planning | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, `src/game/ai/aiUtils.ts`, `src/game/ai/aiScoring.ts` |
| panel, HUD, buttons, log, dice tray | UI components | `CODEBASE_ENTRYPOINTS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/components/GameScreen.tsx`, `src/components/ActionPanel.tsx`, `src/components/DiceTray.tsx`, `src/components/GameLog.tsx` |
| layout, animation, responsive, visual | Styling/effects | `CODEBASE_AREAS.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/styles/*.css`, `src/components/BoardEffects.tsx`, `src/components/GameScreen.tsx` |
| tests, smoke, Playwright, Vitest | Test coverage | `.harness/project/PROJECT_VERIFICATION.md`, `CODEBASE_CHANGE_IMPACT.md` | `src/**/*.test.ts*`, `e2e/game.spec.ts`, `vitest.config.ts`, `playwright.config.ts` |

## Source Area Shortlist

| Source area | Purpose | Likely files/folders | Notes |
|---|---|---|---|
| App/root | Mount the app and route into the game screen | `src/main.tsx`, `src/App.tsx` | No router observed. |
| Game shell/UI orchestration | Own reducer state, AI hook, interactions, visual effects | `src/components/GameScreen.tsx` | High coupling to reducer events and CSS. |
| UI components | Render board, HUD, dice, panels, log, tokens | `src/components/*.tsx` | Accessible names are used by tests. |
| Game model/state transitions | Shared types and reducer actions/events | `src/game/types.ts`, `src/game/reducer.ts`, `src/game/initialState.ts` | Contract changes ripple broadly. |
| Rules | Board, dice, summon, movement, combat, turn helpers | `src/game/rules/*.ts` | Unit tests cover important rules. |
| Static game data | Dice, monsters, tile shapes | `src/game/data/*.ts` | Data ids are referenced across dice, monsters, rules, UI. |
| AI | Legal action enumeration, scoring, planner, hook controller | `src/game/ai/*.ts` | Depends on rule helpers and reducer action sequence. |
| Styles | Layout, board, HUD, game theme, animations | `src/styles/*.css` | Visual regressions may not be fully caught by tests. |

## Staleness Signals

- New source folders under `src/` are not listed above.
- `GameAction`, `GameState`, or component props change without updating impact notes.
- Playwright accessible text/roles change but `e2e/game.spec.ts` is not updated.

# Project Architecture

Synced at: `2026-05-14T00:22:45+07:00`

## Entry Points

- `src/main.tsx`: React bootstrap.
- `src/App.tsx`: top-level app component.
- `src/components/GameScreen.tsx`: main game shell and interaction coordinator.

## UI Modules

- `src/components/Board.tsx`, `BoardCell.tsx`, `BoardEffects.tsx`: board rendering and visual effects.
- `src/components/ActionPanel.tsx`, `DiceTray.tsx`, `CrestBar.tsx`: player controls and resource display.
- `src/components/PlayerCorePanel.tsx`, `MonsterInfoPanel.tsx`, `GameLog.tsx`, `TopBar.tsx`, `TileShapePreview.tsx`: HUD and supporting game information.
- `src/styles/*`: CSS split by global, layout, board, HUD, animation, game, and theme concerns.

## Game State And Rules

- `src/game/types.ts`: canonical game types and action union.
- `src/game/initialState.ts`: initial board, players, controls, and phase.
- `src/game/reducer.ts`: central reducer for rolling, summoning, movement, attacks, turns, and reset.
- `src/game/rules/board.ts`: board utilities and cloning/log helpers.
- `src/game/rules/dice.ts`: dice rolling and crest/summon candidate rules.
- `src/game/rules/summon.ts`: dungeon tile shape placement rules.
- `src/game/rules/movement.ts`: reachable cell and movement cost rules.
- `src/game/rules/combat.ts`: damage and attack target rules.
- `src/game/rules/turn.ts`: turn transition rules.

## Data And AI

- `src/game/data/diceCatalog.ts`, `monsters.ts`, `tileShapes.ts`: static gameplay data.
- `src/game/ai/aiController.ts`: React hook that schedules AI actions.
- `src/game/ai/aiPlanner.ts`, `aiScoring.ts`, `aiUtils.ts`, `aiTypes.ts`: AI decision-making and helpers.

## Test Layout

- `src/components/GameScreen.test.tsx`: component-level game screen tests.
- `src/game/rules/gameRules.test.ts`: core rules tests.
- `src/game/ai/aiPlanner.test.ts`: AI planner tests.
- `e2e/game.spec.ts`: Playwright browser smoke flow.

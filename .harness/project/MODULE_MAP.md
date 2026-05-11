# Module Map

File này thuộc target repository sau khi install.

Target repository có quyền chỉnh sửa file này. Installer chỉ tạo file nếu chưa tồn tại và không được overwrite nội dung local đã có.

## Purpose

Ghi lại module ownership, boundaries, integration points, và khu vực thường bị ảnh hưởng khi thay đổi.

## Manual Notes

- Module: game domain
  - Files: `src/game/types.ts`, `src/game/constants.ts`, `src/game/initialState.ts`, `src/game/reducer.ts`.
  - Boundaries: owns game state shape, action reducer, phase flow, and shared constants.
  - Common tests: `src/game/rules/gameRules.test.ts`; add reducer-focused tests when changing action behaviour.
- Module: game data
  - Files: `src/game/data/diceCatalog.ts`, `src/game/data/monsters.ts`, `src/game/data/tileShapes.ts`.
  - Boundaries: static content definitions for dice, monsters, and summon shapes.
  - Common tests: rule tests that consume the catalog; add targeted tests when changing data assumptions.
- Module: game rules
  - Files: `src/game/rules/board.ts`, `combat.ts`, `dice.ts`, `movement.ts`, `summon.ts`, `turn.ts`.
  - Boundaries: pure or mostly pure helpers for mechanics. Keep UI concerns out of this layer.
  - Common tests: `src/game/rules/gameRules.test.ts`.
- Module: React UI
  - Files: `src/components/*.tsx`.
  - Boundaries: render state, dispatch game actions, and compose controls. Keep core mechanics in `src/game/**`.
  - Common tests: `src/components/GameScreen.test.tsx`; add focused component tests for user-visible flows.
- Module: styling
  - Files: `src/styles/globals.css`, `src/styles/game.css`.
  - Boundaries: visual layout and responsive CSS only.
- Integration points:
  - `GameScreen` owns `useReducer(gameReducer, undefined, createInitialState)` and routes board clicks to reducer actions.
  - `Board` and `BoardCell` consume board state, placement previews, highlighted cells, and attack targets.

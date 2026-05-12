# Project Context

Last reviewed: 2026-05-12

## Product Purpose

`dice-monsters` is a playable tactical dice-and-monster board game prototype. The app starts directly in the game screen, with `P1` as a human player and `P2` as an AI-controlled opponent by default.

Evidence: `createInitialState()` in `src/game/initialState.ts` sets `P1` to `human`, `P2` to `ai`, initializes the board, and logs "Match started. P1 begins in roll phase."

## Core Flow

- The game phases are `roll`, `summon`, `action`, and `gameOver`.
- Players roll dice, gain crests, optionally summon monsters by placing dungeon tile shapes, then move or attack during action phase.
- A player wins by reducing the opponent core HP to zero.

Evidence: `src/game/types.ts` defines phases and actions; `src/game/reducer.ts` implements `ROLL_DICE`, summon placement, movement, attacking, turn ending, and reset.

## Domain Facts

- Board size is 13 x 9 based on the UI smoke test expecting 117 grid cells.
- P1 core starts at `(0,4)` and P2 core starts at `(12,4)`.
- Starting dungeon tiles are at `(1,4)` for P1 and `(11,4)` for P2.
- Movement can traverse continuous dungeon tiles regardless of tile owner, but cannot move into cores or through occupied cells.
- Summon placement must be inside the board, avoid overlap, avoid cores and monsters, connect to the player's dungeon network, and avoid adjacency to opponent core.
- Combat uses Manhattan range and damage is at least 1 after defense.

Evidence: `src/game/initialState.ts`, `src/game/rules/summon.ts`, `src/game/rules/movement.ts`, `src/game/rules/combat.ts`, and `src/game/rules/gameRules.test.ts`.

## AI Context

The current AI acts through `useAIController()`, using delayed dispatches from `getNextAIAction()`. It rolls, chooses summon candidates and placements, prefers attacks before movement, and ends turn when no useful action exists or action limits are reached.

Evidence: `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, and `src/game/ai/aiPlanner.test.ts`.


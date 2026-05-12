# Project Architecture

Last reviewed: 2026-05-12

## High-Level Flow

`src/components/GameScreen.tsx` owns the top-level `useReducer(gameReducer, undefined, createInitialState)` state loop. UI components render slices of `GameState` and dispatch typed `GameAction` values back to `gameReducer`.

`useAIController()` observes state and dispatches delayed AI actions when the current player is AI-controlled.

Evidence: `src/components/GameScreen.tsx`, `src/game/reducer.ts`, and `src/game/ai/aiController.ts`.

## Main Modules

- `src/game/types.ts`: domain model and action union.
- `src/game/initialState.ts`: board, players, controls, starting cores, and starting tiles.
- `src/game/reducer.ts`: authoritative transition layer for roll, summon, move, attack, end turn, and reset.
- `src/game/rules/`: pure-ish rule helpers for board, dice, summon placement, movement, combat, and turn handling.
- `src/game/data/`: dice catalog, monsters, and tile shapes.
- `src/game/ai/`: AI action planning, scoring, utility enumeration, and controller hook.
- `src/components/`: rendering and interaction surfaces.
- `src/styles/`: app styling.

## Data Flow

1. Initial state is created by `createInitialState()`.
2. Player UI events dispatch `GameAction` from components.
3. `gameReducer()` clones or derives next state through rule helpers.
4. Rendered highlights, targets, selected monsters, log entries, and game phase update from state.
5. When `state.settings.controls[state.currentPlayer] === "ai"`, `useAIController()` dispatches planned actions after a delay.

## Risk Areas

- Movement rules affect both human moves and AI legal move enumeration.
- Summon placement has adjacency, overlap, board-boundary, and opponent-core constraints.
- Reducer action sequencing matters for UI interaction modes: `placing`, `moving`, and `attacking`.
- AI controller uses timers, so tests that cover AI behavior should control fake timers.
- Monster instance IDs currently include `Date.now()`, which can affect deterministic expectations if tests inspect generated IDs directly.


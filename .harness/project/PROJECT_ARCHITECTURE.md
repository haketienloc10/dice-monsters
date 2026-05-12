# Project Architecture

Last reviewed: 2026-05-12

## Overview

The app is a client-only React game. React components render the board and controls, while gameplay transitions are centralized in a TypeScript reducer and rule helper modules.

## Main Data Flow

1. `src/main.tsx` mounts React and imports global/game CSS.
2. `src/App.tsx` renders `GameScreen`.
3. `GameScreen` owns `useReducer(gameReducer, undefined, createInitialState)`.
4. UI components dispatch `GameAction` values through `GameScreen`.
5. `src/game/reducer.ts` validates phase/action rules, clones state, applies changes, and emits `lastEvent` entries.
6. `GameScreen` watches `lastEvent` to trigger visual effects and animation locks.
7. `useAIController` observes state and dispatches AI actions during AI turns.

## Core Modules

- `src/game/types.ts`: shared game model and action/event contracts.
- `src/game/constants.ts`: board dimensions, core HP, crest names, and crest icons.
- `src/game/initialState.ts`: initial board, player setup, core placement, and starting tiles.
- `src/game/reducer.ts`: authoritative state transition layer for player and AI actions.
- `src/game/rules/`: rule helpers used by reducer, AI, and tests.
- `src/game/data/`: static content for dice, monsters, and tile shapes.
- `src/game/ai/`: AI scoring, legal option enumeration, planner, and React controller hook.
- `src/components/`: presentation and interaction components.
- `src/styles/`: CSS for game layout and visuals.

## Risk Areas

- Reducer changes can affect UI, AI, tests, and event-driven visual effects.
- `GameAction`, `GameState`, `GameEvent`, and model type changes ripple through components, rules, AI, and tests.
- Placement, movement, and combat rule changes should be checked against both unit tests and E2E smoke flow.
- AI changes should be verified with `src/game/ai/aiPlanner.test.ts` and browser smoke behavior.
- CSS/layout changes should be checked visually because the UI is desktop-optimized.

## Integration Points

- Components depend on reducer selectors/helpers such as `cellHasHighlight` and `cellTargetAt`.
- AI utility functions reuse game rule helpers to enumerate legal actions.
- Playwright depends on accessible roles/text from the rendered UI.

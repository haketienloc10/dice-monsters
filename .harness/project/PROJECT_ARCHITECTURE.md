# Project Architecture

Last reviewed: 2026-05-12

## High-Level Shape

The app is a client-only React game. React components render the game board and command UI, while TypeScript modules under `src/game/` own game state, rules, AI planning, and static data.

## State Flow

1. `src/components/GameScreen.tsx` initializes state with `useReducer(gameReducer, undefined, createInitialState)`.
2. UI actions dispatch typed `GameAction` objects.
3. `src/game/reducer.ts` validates the current phase and action, clones state, applies rules, updates events/logs, and returns the next `GameState`.
4. UI reacts to `lastEvent` for animations and transient effects.
5. `useAIController` plans and dispatches delayed AI actions when the current player is AI-controlled.

## Modules

- `src/game/types.ts`: shared domain types for players, board cells, monsters, dice, phases, events, and actions.
- `src/game/constants.ts`: board dimensions, core HP, crest definitions, labels, and icons.
- `src/game/initialState.ts`: board setup, player setup, starting tiles, and initial phase.
- `src/game/reducer.ts`: central game transition logic.
- `src/game/rules/`: board helpers, dice rules, summon placement, movement, combat, and turn handling.
- `src/game/ai/`: AI control hook, planner, scoring, utilities, and tests.
- `src/game/data/`: dice catalog, monster definitions, and tile shapes.
- `src/components/`: presentation and interaction components.
- `src/styles/`: global and feature-specific CSS.

## Risk Areas

- Reducer changes can affect many user flows because phase validation, resource spending, monster lifecycle, logs, and events are centralized there.
- Board coordinate logic depends on 13 by 9 dimensions and should be verified with both rule tests and UI smoke tests.
- AI behavior involves timers in React and planner decisions in game modules; use fake timers in component tests where possible.
- Visual changes should be checked against desktop layout expectations because the UI explicitly warns that it is optimized for desktop screens.

## Integration Points

- `GameScreen` connects React UI, reducer state, AI controller, board previews, and visual event effects.
- Playwright uses accessible labels and visible text from the UI, so copy or ARIA changes can affect e2e tests.

# Codebase Flows

Last reviewed: 2026-05-12

## Roll Dice Flow

- Trigger: human clicks the roll button in `DiceTray`.
- Entrypoint: `src/components/GameScreen.tsx`.
- Path through source:
  1. `GameScreen` passes `onRoll` to `DiceTray`.
  2. `GameScreen.dispatchHumanAction` dispatches `{ type: "ROLL_DICE" }`.
  3. `gameReducer` validates roll phase, calls `rollDicePool`, `addRolledCrests`, and `getSummonCandidates`.
  4. `gameReducer` emits a `rolled` event and updates phase to summon or action.
  5. `GameScreen` observes `lastEvent` and locks dice animation.
- Data/control handoffs: `RollResult[]`, `summonCandidates`, `lastEvent`.
- Edge handling: reducer ignores roll outside roll phase.
- Tests/evidence: `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`, `src/game/rules/gameRules.test.ts`.
- Impact notes: changes may affect dice tray display, crest pool, phase banner, AI roll behavior, and smoke tests.

## Summon Placement Flow

- Trigger: user selects a summon candidate and clicks a board cell.
- Entrypoint: `src/components/GameScreen.tsx`.
- Path through source:
  1. `ActionPanel` dispatches `SELECT_SUMMON_CANDIDATE`.
  2. `gameReducer` sets `selectedSummonDiceId`, `interactionMode: "placing"`, and highlighted anchors from `getValidPlacementAnchors`.
  3. `GameScreen` computes hover preview with `getShapeCells` and `isValidDungeonPlacement`.
  4. Board cell click dispatches `PLACE_DUNGEON_SHAPE`.
  5. `gameReducer` validates placement, marks dungeon tiles, creates a `MonsterInstance`, emits `summoned`, and moves to action phase.
- Data/control handoffs: dice id, tile shape id, rotation, highlighted cells, `summoned` event.
- Edge handling: invalid phase, missing die, or invalid placement returns unchanged state.
- Tests/evidence: `src/game/rules/gameRules.test.ts`, component/E2E smoke indirectly.
- Impact notes: inspect tile shape data, board rules, reducer summon case, and UI preview together.

## Movement Flow

- Trigger: user enters move mode and clicks a highlighted destination.
- Entrypoint: `src/components/GameScreen.tsx`.
- Path through source:
  1. `ActionPanel` dispatches `ENTER_MOVE_MODE`.
  2. `gameReducer` validates selected monster ownership and move crests.
  3. `getReachableCells` computes legal destinations.
  4. Board cell click dispatches `MOVE_MONSTER`.
  5. `getMovementDistance` validates path and cost; reducer updates board occupancy, monster position, crest pool, and emits `moved`.
- Data/control handoffs: selected monster id, reachable cells, movement distance, `moved` event.
- Edge handling: no selected monster, no crests, occupied/invalid path, or core destination returns unchanged state.
- Tests/evidence: `src/game/rules/gameRules.test.ts`.
- Impact notes: movement rule changes affect AI legal moves and board highlights.

## Combat Flow

- Trigger: user enters attack mode and clicks a valid target.
- Entrypoint: `src/components/GameScreen.tsx`.
- Path through source:
  1. `ActionPanel` dispatches `ENTER_ATTACK_MODE`.
  2. `gameReducer` validates selected monster, ownership, attack crest, and attack action availability.
  3. `getValidAttackTargets` computes target cells.
  4. Board click dispatches `ATTACK_TARGET`.
  5. Reducer validates target, applies damage via `calculateMonsterDamage` or core damage, emits `attacked`, and may set `winner`.
- Data/control handoffs: `AttackTarget`, `validAttackTargets`, `attacked` event.
- Edge handling: invalid target or phase returns unchanged state; core HP clamps at 0.
- Tests/evidence: `src/game/rules/gameRules.test.ts`, `src/game/ai/aiPlanner.test.ts`.
- Impact notes: combat changes affect visual effects, AI scoring, core win condition, and E2E smoke timing.

## AI Turn Flow

- Trigger: current player's control is `ai`.
- Entrypoint: `src/game/ai/aiController.ts`.
- Path through source:
  1. `GameScreen` calls `useAIController(state, dispatch)`.
  2. `useAIController` detects AI turn and schedules a timeout.
  3. `getNextAIAction` delegates by phase to roll, summon, action, or end turn planning.
  4. AI planner uses legal option helpers and scoring helpers.
  5. Controller dispatches the planned `GameAction`; reducer applies it like any other action.
- Data/control handoffs: `GameState`, `GameAction`, AI turn memory.
- Edge handling: max actions per turn falls back to `END_TURN`; non-AI or game-over state does nothing.
- Tests/evidence: `src/game/ai/aiPlanner.test.ts`, `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Impact notes: keep AI planned actions aligned with reducer legal action sequences.

# Codebase Flows

Purpose: document technical source-level flows through files and modules.

Do not duplicate product, user-journey, or business flow descriptions from `.harness/project/PROJECT_CONTEXT.md`. This file is about how a concrete action moves through source files.

## Known Flows

### Human Roll To Next Phase

- Trigger: player clicks the `Roll Dice` button.
- Entrypoint: `src/components/GameScreen.tsx`
- Path through source:
  1. `DiceTray.onRoll`: calls `dispatchHumanAction({ type: "ROLL_DICE" }, lock)`.
  2. `GameScreen.dispatchHumanAction`: blocks AI turns and selected animation-locked actions, then dispatches to reducer.
  3. `gameReducer` `ROLL_DICE`: calls `rollDicePool`, `addRolledCrests`, `getSummonCandidates`, sets phase, sets `lastEvent`, clears interaction.
  4. `GameScreen` `state.lastEvent` effect: starts dice animation lock and phase banner update.
  5. `DiceTray`, `TopBar`, `CrestBar`, `ActionPanel`: render roll results, crests, phase/action availability.
- Data/control transfers:
  - `GameAction` string: `ROLL_DICE`.
  - `RollResult[]` stored in `latestRoll`.
  - `GameEvent` type: `rolled`.
- Error/loading/edge handling:
  - Reducer ignores roll unless phase is `roll`.
  - `dispatchHumanAction` ignores human dispatch during AI turn.
- Tests/evidence:
  - `src/components/GameScreen.test.tsx`
  - `e2e/game.spec.ts`
  - `src/game/rules/gameRules.test.ts`
- Impact notes:
  - Changing dice semantics affects reducer, `DiceTray`, `TopBar`, `CrestBar`, AI roll planning, and rule tests.

### Summon Placement

- Trigger: player or AI selects a summon candidate and places a dungeon shape.
- Entrypoint: `src/components/GameScreen.tsx` for human; `src/game/ai/aiPlanner.ts` for AI planned actions.
- Path through source:
  1. `ActionPanel`: dispatches `SELECT_SUMMON_CANDIDATE`, `ROTATE_PLACEMENT`, `SKIP_SUMMON`.
  2. `GameScreen.placementPreview`: calls `getShapeCells` and `isValidDungeonPlacement` for hover preview.
  3. `GameScreen.handleCellClick`: dispatches `PLACE_DUNGEON_SHAPE` in placing mode.
  4. `gameReducer`: validates selected dice, rotation, placement legality, writes dungeon cells, creates monster instance, sets phase to `action`, sets `lastEvent`.
  5. `BoardCell` and `BoardEffects`: render new tiles and summon effect from `lastEvent`.
  6. `TileShapePreview`, `MonsterInfoPanel`, `ActionPanel`: render selected shape/monster/action state.
- Data/control transfers:
  - Dice IDs from `diceCatalog`.
  - Tile shape IDs from `tileShapes`.
  - Monster IDs from `monsters`.
  - `GameEvent` type: `summoned`.
- Error/loading/edge handling:
  - Reducer rejects placement outside summon phase, without selected dice, with invalid dice, or illegal placement.
  - Placement rules reject overlap, core cells, monsters, out-of-board cells, and adjacency to opponent core.
- Tests/evidence:
  - `src/game/rules/gameRules.test.ts`
  - `src/game/ai/aiPlanner.test.ts`
- Impact notes:
  - Shape ID/data changes require checking dice catalog, tile preview, AI placement options, reducer summon branch, and tests.

### Movement

- Trigger: player or AI enters move mode and chooses a reachable cell.
- Entrypoint: `src/components/ActionPanel.tsx` and `src/components/GameScreen.tsx`
- Path through source:
  1. `ActionPanel`: enables `ENTER_MOVE_MODE` only in action phase with selected current-player monster and move crests.
  2. `gameReducer` `ENTER_MOVE_MODE`: calls `getReachableCells` and stores highlights.
  3. `BoardCell`: reads highlights via `cellHasHighlight`.
  4. `GameScreen.handleCellClick`: dispatches `MOVE_MONSTER` for highlighted cells.
  5. `gameReducer` `MOVE_MONSTER`: calls `getMovementDistance`, moves monster between cells, spends crests, sets `lastEvent`.
  6. `BoardEffects` and `BoardCell`: render movement trail and moved token state.
- Data/control transfers:
  - `highlightedCells` carries reachable positions from rules to UI.
  - `GameEvent` type: `moved`.
- Error/loading/edge handling:
  - `movement.ts` pathing skips non-dungeon cells, core cells, and occupied cells.
  - Reducer ignores missing/zero movement distance.
- Tests/evidence:
  - `src/game/rules/gameRules.test.ts`
  - `src/game/ai/aiPlanner.test.ts`
- Impact notes:
  - Movement changes can alter AI move options, board highlights, crest spending, and e2e timing if AI takes more/less actions.

### Attack And Game Over

- Trigger: player or AI enters attack mode and chooses a valid target.
- Entrypoint: `src/components/ActionPanel.tsx` and `src/components/GameScreen.tsx`
- Path through source:
  1. `ActionPanel`: enables `ENTER_ATTACK_MODE` only in action phase with selected current-player monster, attack crest, and unused attack.
  2. `gameReducer` `ENTER_ATTACK_MODE`: calls `getValidAttackTargets`, stores targets and highlights.
  3. `BoardCell`: resolves attack targets via `cellTargetAt`.
  4. `GameScreen.handleCellClick`: dispatches `ATTACK_TARGET`.
  5. `gameReducer` `ATTACK_TARGET`: revalidates target, spends attack crest, applies monster or core damage, deletes destroyed monsters, sets winner/gameOver if core HP reaches zero.
  6. `BoardEffects`, `CoreBase`, `MonsterToken`, `GameLog`, `TopBar`: render attack/damage/death/core hit/game-over state.
- Data/control transfers:
  - `AttackTarget` union.
  - `validAttackTargets`.
  - `GameEvent` type: `attacked`.
- Error/loading/edge handling:
  - Reducer rechecks legal targets before applying damage.
  - Core damage uses attacker ATK directly; monster damage uses `calculateMonsterDamage`.
- Tests/evidence:
  - `src/game/rules/gameRules.test.ts`
  - `src/game/ai/aiPlanner.test.ts`
- Impact notes:
  - Attack changes affect combat rules, reducer, AI scoring, visual effects, and game-over overlay.

### End Turn And AI Turn Loop

- Trigger: player clicks `End Turn`, or AI planner returns `END_TURN`.
- Entrypoint: `src/components/ActionPanel.tsx` for human; `src/game/ai/aiController.ts` for AI.
- Path through source:
  1. `ActionPanel`: dispatches `END_TURN` in summon/action phase.
  2. `gameReducer` `END_TURN`: calls `endTurn(cloneGameState(state))`, sets `turnEnded` event, logs transition.
  3. `turn.ts`: switches current player, increments turn after P2, resets phase/selection/interaction and friendly attack flags.
  4. `GameScreen`: `useAIController` observes state; if current player is AI, schedules planner action after delay.
  5. `aiPlanner`: emits the next reducer-compatible action based on phase.
  6. `aiController`: caps actions per turn with `MAX_AI_ACTIONS_PER_TURN`, then dispatches `END_TURN`.
- Data/control transfers:
  - `GameEvent` type: `turnEnded`.
  - AI memory lives in a React ref in `aiController`.
- Error/loading/edge handling:
  - Reducer ignores `END_TURN` outside summon/action phases.
  - AI hook does nothing during `gameOver`.
- Tests/evidence:
  - `src/components/GameScreen.test.tsx`
  - `src/game/ai/aiPlanner.test.ts`
  - `e2e/game.spec.ts`
- Impact notes:
  - Turn flow changes can affect fake-timer tests, e2e timeouts, current-player display, and AI action caps.

### Static Data To Rendered Monster

- Trigger: adding or editing dice, monster, or tile shape data.
- Entrypoint: `src/game/data/*.ts`
- Path through source:
  1. `diceCatalog`: maps dice ID to `monsterId` and `tileShapeId`.
  2. `monsters`: provides stats and display metadata consumed by reducer/UI/AI.
  3. `tileShapes`: provides offsets consumed by summon rules and tile preview.
  4. `reducer`: creates `MonsterInstance` from selected die and monster definition.
  5. `MonsterToken.monsterVisuals` and `MonsterInfoPanel`: render monster visuals/details.
  6. `aiScoring` and `aiUtils`: score and validate options from the same data.
- Data/control transfers:
  - Shared string IDs across data files.
- Error/loading/edge handling:
  - Several lookups return no-op/undefined if IDs are missing; UI fallbacks exist for unknown monster visuals but reducer expects valid selected die/monster mapping.
- Tests/evidence:
  - `src/game/rules/gameRules.test.ts`
  - `src/game/ai/aiPlanner.test.ts`
- Impact notes:
  - Search by ID string when renaming data IDs; update visuals and tests together.

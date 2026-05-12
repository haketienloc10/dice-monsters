# Codebase Flows

Purpose: document technical source-level flows through files and modules.

Last reviewed: 2026-05-12

## Known Flows

### App Boot To Game Screen

- Trigger: Browser loads Vite app.
- Entrypoint: `src/main.tsx`.
- Path through source:
  1. `src/main.tsx`: creates React root and renders `App`.
  2. `src/App.tsx`: renders `GameScreen`.
  3. `src/components/GameScreen.tsx`: creates reducer state with `createInitialState`.
  4. `src/components/*`: render board, panels, dice tray, log, and controls.
- Data/control handoffs:
  - `createInitialState` provides the initial `GameState`.
  - CSS imports from `main.tsx` establish global/game styling.
- Tests/evidence:
  - `src/components/GameScreen.test.tsx` expects 117 grid cells.
  - `e2e/game.spec.ts` expects the 13 by 9 board and player names.
- Impact notes:
  - Root or layout changes can break both component and e2e smoke tests.

### Human Roll Dice Flow

- Trigger: User clicks the `Roll Dice` button.
- Entrypoint: `src/components/DiceTray.tsx` via callback from `GameScreen`.
- Path through source:
  1. `GameScreen.dispatchHumanAction`: blocks input during AI turn or animation lock.
  2. `src/game/reducer.ts`: handles `ROLL_DICE`.
  3. `src/game/rules/dice.ts`: rolls dice and computes summon candidates/crests.
  4. `GameScreen` observes `lastEvent.type === "rolled"` and applies dice animation lock/banner key.
  5. Dice/UI components render latest results and enabled next actions.
- Data/control handoffs:
  - `ROLL_DICE` -> `latestRoll`, `summonCandidates`, `phase`, `lastEvent`, log.
- Tests/evidence:
  - `src/components/GameScreen.test.tsx` clicks roll and expects dice text.
  - `e2e/game.spec.ts` verifies latest dice results are no longer empty.
- Impact notes:
  - Check `diceCatalog`, `rules/dice`, reducer phase transitions, and visible dice selectors.

### Summon Placement Flow

- Trigger: User selects a summon candidate and clicks a valid board placement.
- Entrypoint: `src/components/GameScreen.tsx`.
- Path through source:
  1. `SELECT_SUMMON_CANDIDATE` reducer branch enters `placing` mode and highlights valid anchors.
  2. `GameScreen` computes `placementPreview` using `getShapeCells` and `isValidDungeonPlacement`.
  3. Board components render highlighted/preview cells.
  4. `PLACE_DUNGEON_SHAPE` reducer branch creates tiles, monster instance, event, and action phase.
- Data/control handoffs:
  - `selectedSummonDiceId`, `placementRotation`, `highlightedCells`, `summonCandidates`.
- Tests/evidence:
  - Rule tests should cover summon validity; UI smoke covers roll path.
- Impact notes:
  - Check `src/game/data/tileShapes.ts`, `src/game/rules/summon.ts`, board rendering, and reducer branch together.

### Move And Attack Flow

- Trigger: User selects a monster, enters move/attack mode, then clicks a highlighted cell/target.
- Entrypoint: `src/components/ActionPanel.tsx` and `GameScreen.handleCellClick`.
- Path through source:
  1. `ENTER_MOVE_MODE` or `ENTER_ATTACK_MODE` reducer branch computes legal cells/targets.
  2. `Board`/`BoardCell` render highlights.
  3. `MOVE_MONSTER` updates board position and spends move crests.
  4. `ATTACK_TARGET` computes damage, spends attack crest, removes destroyed monsters or damages core.
  5. `GameScreen` observes `moved`/`attacked` events and pushes visual effects.
- Data/control handoffs:
  - `selectedMonsterId`, `highlightedCells`, `validAttackTargets`, `lastEvent`.
- Tests/evidence:
  - `src/game/rules/gameRules.test.ts` for rule-level checks.
- Impact notes:
  - Reducer, movement/combat helpers, board cell ownership, and visual effects should be inspected together.

### End Turn And AI Handoff

- Trigger: User clicks `End Turn`, switching from P1 to AI-controlled P2.
- Entrypoint: `src/components/ActionPanel.tsx` and reducer `END_TURN`.
- Path through source:
  1. `src/game/rules/turn.ts` resets turn-specific state and switches player/phase.
  2. `GameScreen` calls `useAIController(state, dispatch)`.
  3. `aiController` schedules `getNextAIAction(state)` with `window.setTimeout`.
  4. `aiPlanner` chooses roll/summon/action/end turn actions using utility and scoring helpers.
  5. Reducer applies AI actions until control returns to P1.
- Data/control handoffs:
  - AI emits ordinary `GameAction` objects; UI disables human input while `isAITurn` is true.
- Tests/evidence:
  - `src/components/GameScreen.test.tsx` uses fake timers to wait for P1 control.
  - `e2e/game.spec.ts` waits for `P2 AI THINKING` and then `Current: Blue Warden`.
- Impact notes:
  - Any AI timing/action cap/planner change should run AI unit tests, component smoke, and e2e smoke when feasible.

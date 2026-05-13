# Codebase Areas

Purpose: map actual source-tree areas to coding responsibilities and edit risks.

Do not restate high-level architecture already owned by `.harness/project/PROJECT_ARCHITECTURE.md`. Keep this file concrete: paths, edit targets, tests, coupling, and source-level risks.

## Areas

### Frontend Bootstrap

- Responsibility: mount the React app and load global/game CSS.
- Important files/folders:
  - `index.html`
  - `src/main.tsx`
  - `src/App.tsx`
- Common edit targets:
  - Root app wrapping, global provider insertion, imported global CSS.
- Related tests:
  - `src/components/GameScreen.test.tsx`
  - `e2e/game.spec.ts`
- Coupling/risk notes:
  - `App` currently renders only `GameScreen`.
  - `main.tsx` imports `globals.css` and `game.css`; other CSS files are pulled through `game.css`.

### Interaction Shell

- Responsibility: coordinate `useReducer(gameReducer)`, human input, AI lockout, placement preview, animation locks, and board click routing.
- Important files/folders:
  - `src/components/GameScreen.tsx`
  - `src/game/reducer.ts`
  - `src/game/initialState.ts`
  - `src/game/types.ts`
- Common edit targets:
  - `dispatchHumanAction`
  - `handleCellClick`
  - `placementPreview`
  - `state.lastEvent` effect handling
- Related tests:
  - `src/components/GameScreen.test.tsx`
  - `e2e/game.spec.ts`
- Coupling/risk notes:
  - `GameScreen` imports rule helpers directly for placement preview and reducer helpers for highlights/targets.
  - `animationLock` prevents selected action dispatches and can affect AI/human control behavior.
  - `useAIController` returns whether the current turn is AI-controlled and gates human input.

### Board Rendering

- Responsibility: render board cells, dungeon/core ownership, monster tokens, placement/move/attack highlighting, and transient visual effects.
- Important files/folders:
  - `src/components/Board.tsx`
  - `src/components/BoardCell.tsx`
  - `src/components/BoardEffects.tsx`
  - `src/components/CoreBase.tsx`
  - `src/components/MonsterToken.tsx`
  - `src/styles/board.css`
  - `src/styles/animations.css`
- Common edit targets:
  - `BoardCell` class list and accessibility labels.
  - `MonsterToken.monsterVisuals`.
  - `VisualEffect` union and CSS effect classes.
- Related tests:
  - `src/components/GameScreen.test.tsx`
  - `e2e/game.spec.ts`
- Coupling/risk notes:
  - Board size expectations are asserted as 117 grid cells.
  - `BoardCell` depends on `cellHasHighlight`, `cellTargetAt`, `GameEvent`, and `GameState` shape.
  - Effect CSS custom properties are produced by `BoardEffects`.

### HUD And Panels

- Responsibility: render controls and status panels around the board.
- Important files/folders:
  - `src/components/ActionPanel.tsx`
  - `src/components/CrestBar.tsx`
  - `src/components/DiceTray.tsx`
  - `src/components/GameLog.tsx`
  - `src/components/MonsterInfoPanel.tsx`
  - `src/components/PlayerCorePanel.tsx`
  - `src/components/TileShapePreview.tsx`
  - `src/components/TopBar.tsx`
  - `src/styles/hud.css`
  - `src/styles/layout.css`
- Common edit targets:
  - Button enable/disable logic in `ActionPanel`.
  - Roll display in `DiceTray` and `TopBar`.
  - Selected monster display in `MonsterInfoPanel`.
  - Crest display in `CrestBar`.
- Related tests:
  - `src/components/GameScreen.test.tsx`
  - `e2e/game.spec.ts`
- Coupling/risk notes:
  - `ActionPanel` dispatches typed `GameAction`s but does not own reducer legality.
  - Tests query visible labels such as `Roll Dice`, `End Turn`, current player text, and AI thinking text.

### Game Contracts And State

- Responsibility: define shared game types, constants, initial state, and central reducer transitions.
- Important files/folders:
  - `src/game/types.ts`
  - `src/game/constants.ts`
  - `src/game/initialState.ts`
  - `src/game/reducer.ts`
- Common edit targets:
  - `GameAction`
  - `GameEvent`
  - `GameState`
  - `gameReducer`
  - `createInitialState`
- Related tests:
  - `src/game/rules/gameRules.test.ts`
  - `src/components/GameScreen.test.tsx`
  - `src/game/ai/aiPlanner.test.ts`
- Coupling/risk notes:
  - Reducer branches call pure rules and mutate cloned state from `cloneGameState`.
  - `GameEvent` drives UI animation/effect state.
  - Action string changes must be reflected in UI dispatch and AI planned actions.

### Pure Game Rules

- Responsibility: implement reusable board, dice, summon, movement, combat, and turn helpers.
- Important files/folders:
  - `src/game/rules/board.ts`
  - `src/game/rules/dice.ts`
  - `src/game/rules/summon.ts`
  - `src/game/rules/movement.ts`
  - `src/game/rules/combat.ts`
  - `src/game/rules/turn.ts`
- Common edit targets:
  - `isValidDungeonPlacement`
  - `getValidPlacementAnchors`
  - `getMovementDistanceMap`
  - `getValidAttackTargets`
  - `rollDicePool`
  - `endTurn`
- Related tests:
  - `src/game/rules/gameRules.test.ts`
  - `src/game/ai/aiPlanner.test.ts`
- Coupling/risk notes:
  - AI utilities reuse summon, movement, and combat helpers.
  - Reducer relies on these helpers for legality and state transition data.

### Static Game Data

- Responsibility: define dice, monsters, and tile shapes by shared IDs.
- Important files/folders:
  - `src/game/data/diceCatalog.ts`
  - `src/game/data/monsters.ts`
  - `src/game/data/tileShapes.ts`
- Common edit targets:
  - Dice `monsterId` and `tileShapeId` references.
  - Monster stat fields.
  - Tile shape offsets.
- Related tests:
  - `src/game/rules/gameRules.test.ts`
  - `src/game/ai/aiPlanner.test.ts`
- Coupling/risk notes:
  - `diceCatalog` IDs must align with `monsters` and `tileShapes`.
  - `MonsterToken.monsterVisuals` has visual entries keyed by monster definition IDs.
  - AI scoring reads monster stats and tile shape cell counts.

### AI Planning

- Responsibility: schedule AI turns, choose legal AI actions, score options, and cap turn action loops.
- Important files/folders:
  - `src/game/ai/aiController.ts`
  - `src/game/ai/aiPlanner.ts`
  - `src/game/ai/aiScoring.ts`
  - `src/game/ai/aiUtils.ts`
  - `src/game/ai/aiTypes.ts`
- Common edit targets:
  - `getNextAIAction`
  - `getLegalPlacementOptions`
  - `getLegalMoveOptions`
  - `scoreAttackTarget`
  - `scoreMoveOption`
  - `MAX_AI_ACTIONS_PER_TURN`
- Related tests:
  - `src/game/ai/aiPlanner.test.ts`
  - `src/components/GameScreen.test.tsx`
  - `e2e/game.spec.ts`
- Coupling/risk notes:
  - Planner emits reducer-compatible action objects.
  - Reducer remains the final legality gate.
  - `aiController` uses timers; tests use fake timers.

### Styles

- Responsibility: visual layout, theme variables, HUD, board, and animations.
- Important files/folders:
  - `src/styles/game.css`
  - `src/styles/globals.css`
  - `src/styles/layout.css`
  - `src/styles/board.css`
  - `src/styles/hud.css`
  - `src/styles/theme.css`
  - `src/styles/animations.css`
- Common edit targets:
  - Class names emitted by components.
  - Board grid dimensions and responsive layout.
  - Panel/button/token/effect styling.
- Related tests:
  - `e2e/game.spec.ts` for browser-visible smoke flow.
  - Visual/manual browser check for layout-only changes when feasible.
- Coupling/risk notes:
  - CSS class ownership is conventional, not enforced by modules.
  - `game.css` imports the other CSS files.

## Cross-Area Couplings

| From area | To area | Coupling | Check before editing |
|---|---|---|---|
| Interaction Shell | Game Contracts And State | `useReducer(gameReducer)`, `GameAction`, `GameEvent`, helper exports | Search action names and `state.lastEvent`; run component smoke tests. |
| Interaction Shell | AI Planning | `useAIController(state, dispatch)` and AI turn lockout | Inspect timer behavior and fake-timer tests. |
| Board Rendering | Game Contracts And State | `BoardCell`, `MonsterToken`, `CoreBase` read `GameState`, `GameEvent`, `MonsterInstance`, `PlayerId` | Search type usages and update render assertions if visible output changes. |
| HUD And Panels | Game Contracts And State | Buttons dispatch `GameAction`; panels read crests, phase, current player, selected monster | Inspect reducer legality and button disabled state together. |
| Game Contracts And State | Pure Game Rules | Reducer delegates dice/summon/movement/combat/turn logic | Update rule tests and reducer/UI smoke coverage where behavior changes. |
| AI Planning | Pure Game Rules | AI legal options reuse summon, movement, combat helpers | Run AI planner tests after rule changes. |
| Static Game Data | Board Rendering | `MonsterToken.monsterVisuals` keyed by monster IDs | Search monster IDs and update visuals when adding/removing monsters. |
| Static Game Data | AI Planning | Scoring and legal placement use dice, monsters, tile shapes | Inspect AI scoring and placement tests after data changes. |
| Styles | Components | Manual CSS class names | Search class names before renaming; run browser smoke for layout changes. |

## Source Boundaries

| Boundary | Paths | Notes |
|---|---|---|
| Source to inspect | `src/`, `e2e/`, root config files | Application source, tests, and config needed to locate entrypoints. |
| Harness context | `.harness/project/*`, `.harness/codebase/*`, `AGENTS.md` | Workflow/context docs only; keep project-level facts in `.harness/project/*`. |
| Usually avoid | `node_modules/`, `dist/` | Dependencies and build output; inspect only when debugging dependency/build artifacts. |
| Usually avoid | `.harness/runs/` | Run artifacts are lifecycle history, not source-navigation context. |

# Codebase Areas

Last reviewed: 2026-05-12

## Areas

### App Root

- Responsibility: mount React and render the game screen.
- Important files/folders: `src/main.tsx`, `src/App.tsx`.
- Common edit targets: global CSS imports, top-level providers if added later.
- Related tests: component and E2E tests indirectly cover app boot.
- Coupling/risk notes: CSS import order affects visual output.

### Game Screen Orchestration

- Responsibility: own reducer state, dispatch user actions, manage AI turn lockout, hover state, animation locks, and visual effects.
- Important files/folders: `src/components/GameScreen.tsx`, `src/components/BoardEffects.tsx`.
- Common edit targets: `handleCellClick`, `dispatchHumanAction`, `useEffect` that reacts to `lastEvent`.
- Related tests: `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: depends on `GameEvent` shapes from `src/game/types.ts` and reducer event emission in `src/game/reducer.ts`.

### UI Components

- Responsibility: render game controls and state views.
- Important files/folders: `src/components/ActionPanel.tsx`, `Board.tsx`, `BoardCell.tsx`, `CoreBase.tsx`, `CrestBar.tsx`, `DiceTray.tsx`, `GameLog.tsx`, `MonsterInfoPanel.tsx`, `MonsterToken.tsx`, `PlayerCorePanel.tsx`, `TileShapePreview.tsx`, `TopBar.tsx`.
- Common edit targets: button enablement, aria labels, board cell rendering, latest dice display, player/core panels.
- Related tests: `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: tests rely on roles/text such as grid, gridcell, roll dice, end turn, AI thinking, and current player text.

### Game Model And Reducer

- Responsibility: define state/action/event contracts and apply state transitions.
- Important files/folders: `src/game/types.ts`, `src/game/reducer.ts`, `src/game/initialState.ts`, `src/game/constants.ts`.
- Common edit targets: `GameAction`, `GameState`, `GameEvent`, `gameReducer`, initial player/board setup.
- Related tests: `src/game/rules/gameRules.test.ts`, `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: reducer action and event changes affect UI components, AI planner/controller, and tests.

### Rule Helpers

- Responsibility: implement source-level game rules used by reducer and AI.
- Important files/folders: `src/game/rules/board.ts`, `combat.ts`, `dice.ts`, `movement.ts`, `summon.ts`, `turn.ts`.
- Common edit targets: placement validation, reachable cells, attack targets, damage calculation, dice roll/candidate logic, turn switching.
- Related tests: `src/game/rules/gameRules.test.ts`.
- Coupling/risk notes: AI utility functions reuse rule helpers, so legal-action semantics affect automated turns.

### Static Game Data

- Responsibility: define available monsters, dice, and dungeon tile shapes.
- Important files/folders: `src/game/data/diceCatalog.ts`, `monsters.ts`, `tileShapes.ts`.
- Common edit targets: monster stats, dice faces, tile shape offsets and ids.
- Related tests: rule tests and AI tests may depend on specific ids/stats.
- Coupling/risk notes: dice `monsterId` must exist in `monsters`; dice `tileShapeId` must exist in `tileShapes`.

### AI

- Responsibility: detect AI turns, enumerate legal actions, score options, and dispatch reducer actions over time.
- Important files/folders: `src/game/ai/aiController.ts`, `aiPlanner.ts`, `aiScoring.ts`, `aiTypes.ts`, `aiUtils.ts`.
- Common edit targets: `getNextAIAction`, scoring functions, legal option helpers, turn memory.
- Related tests: `src/game/ai/aiPlanner.test.ts`, `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: AI actions must remain legal reducer sequences; timing uses browser timers in `useAIController`.

### Styles And Visual Effects

- Responsibility: presentation, layout, animations, board visuals, HUD visuals.
- Important files/folders: `src/styles/*.css`, `src/components/BoardEffects.tsx`.
- Common edit targets: board sizing, responsive warning, phase banner, dice cards, effect animations.
- Related tests: E2E smoke catches only basic visibility/interaction; visual review is still needed for layout changes.
- Coupling/risk notes: class names are shared between components and CSS; E2E checks `.die-card--empty`.

## Cross-Area Couplings

| From area | To area | Coupling | Check before editing |
|---|---|---|---|
| Game reducer | Game screen | `lastEvent`, `phase`, `interactionMode`, highlights, selected ids | `src/components/GameScreen.tsx`, component test, E2E smoke |
| Game reducer | AI | `GameAction` legality and phase transitions | `src/game/ai/*.ts`, AI tests |
| Static data | Rules/UI/AI | monster, dice, and tile shape ids | `rg "monsterId|tileShapeId|definitionId|dice-" src` |
| Rule helpers | AI planner | legal move/attack/placement semantics | `src/game/ai/aiUtils.ts`, `aiPlanner.test.ts` |
| UI text/roles | Tests | accessible names and visible text | `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts` |
| CSS classes | Components/tests | class names and layout hooks | `rg "className=|die-card--empty|game-root|board" src e2e` |

## Source Boundaries

| Boundary | Paths | Notes |
|---|---|---|
| Source to inspect | `src/`, `e2e/`, root config files | Main app, tests, and build/test config. |
| Usually avoid | `node_modules/`, `dist/`, `playwright-report/`, `test-results/` | Dependencies and generated output/cache. |

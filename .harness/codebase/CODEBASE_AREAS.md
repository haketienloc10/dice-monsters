# Codebase Areas

Purpose: map actual source-tree areas to coding responsibilities and edit risks.

Last reviewed: 2026-05-12

## Areas

### React App Shell

- Responsibility: Mount the React app and import global CSS.
- Important files/folders: `src/main.tsx`, `src/App.tsx`, `index.html`.
- Common edit targets: app providers, root component wiring, global style imports.
- Related tests: all UI tests indirectly.
- Coupling/risk notes: root CSS import order can affect every component.

### Game Screen Orchestration

- Responsibility: Own top-level reducer state, AI hook, animation locks, transient visual effects, and dispatch wrappers.
- Important files/folders: `src/components/GameScreen.tsx`.
- Common edit targets: `dispatchHumanAction`, `handleCellClick`, phase banner, layout regions, game-over overlay.
- Related tests: `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: Connects UI components to `GameAction`; changes can affect human input, AI turn disabling, animations, and Playwright-visible text.

### UI Components

- Responsibility: Render board cells, dice, action controls, player/core panels, monster info, log, crests, and previews.
- Important files/folders: `src/components/Board.tsx`, `src/components/BoardCell.tsx`, `src/components/DiceTray.tsx`, `src/components/ActionPanel.tsx`, `src/components/*Panel.tsx`, `src/components/GameLog.tsx`.
- Common edit targets: accessible labels, button disabled states, board highlight rendering, status text, visual effect rendering.
- Related tests: `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: E2E relies on roles, labels, visible text, and `.die-card--empty`.

### Game State And Reducer

- Responsibility: Define typed game state/actions and apply state transitions.
- Important files/folders: `src/game/types.ts`, `src/game/reducer.ts`, `src/game/initialState.ts`, `src/game/constants.ts`.
- Common edit targets: `GameAction`, `GameState`, reducer branches, event/log creation, initial board/player setup.
- Related tests: `src/game/rules/gameRules.test.ts`, `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: Reducer is the shared contract for UI and AI; search usages before changing action/event/state types.

### Rule Modules

- Responsibility: Provide focused helper logic for board access, dice rolls, summon placement, movement, combat, and turn ending.
- Important files/folders: `src/game/rules/board.ts`, `src/game/rules/dice.ts`, `src/game/rules/summon.ts`, `src/game/rules/movement.ts`, `src/game/rules/combat.ts`, `src/game/rules/turn.ts`.
- Common edit targets: placement validity, reachable cells, attack targets, damage calculation, turn reset.
- Related tests: `src/game/rules/gameRules.test.ts`.
- Coupling/risk notes: Rule helpers are consumed by reducer, UI previews, and AI utility functions.

### AI Modules

- Responsibility: Detect AI turns, plan legal actions, score move/attack/summon options, and dispatch delayed actions.
- Important files/folders: `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, `src/game/ai/aiScoring.ts`, `src/game/ai/aiUtils.ts`, `src/game/ai/aiTypes.ts`.
- Common edit targets: `getNextAIAction`, scoring functions, legal option generation, action delay/action cap constants.
- Related tests: `src/game/ai/aiPlanner.test.ts`, `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`.
- Coupling/risk notes: AI emits the same `GameAction` contract used by the UI and depends on reducer legality.

### Static Game Data

- Responsibility: Store dice definitions, monster definitions, and tile-shape offsets.
- Important files/folders: `src/game/data/diceCatalog.ts`, `src/game/data/monsters.ts`, `src/game/data/tileShapes.ts`.
- Common edit targets: dice faces, summon levels, monster stats, tile offsets.
- Related tests: rule tests and smoke tests.
- Coupling/risk notes: IDs link dice to monsters and shapes; broken IDs usually surface through reducer/summon flow.

### Styles

- Responsibility: Define layout, board, HUD, theme, game, and animation styles.
- Important files/folders: `src/styles/globals.css`, `src/styles/game.css`, `src/styles/layout.css`, `src/styles/board.css`, `src/styles/hud.css`, `src/styles/animations.css`, `src/styles/theme.css`.
- Common edit targets: grid sizing, HUD layout, visual states, animation classes, theme tokens.
- Related tests: Playwright/browser evidence for visible behavior.
- Coupling/risk notes: CSS class names are consumed by components and at least one e2e selector.

## Cross-Area Couplings

| From area | To area | Coupling | Check before editing |
|---|---|---|---|
| UI components | Reducer/types | Components dispatch `GameAction` and read `GameState` | `rg "GameAction|dispatch\\(|state\\." src/components src/game` |
| GameScreen | AI modules | `useAIController(state, dispatch)` can dispatch delayed actions | `src/game/ai/aiController.ts`, component fake-timer test |
| Reducer | Rule modules | Reducer delegates legality and calculations to helpers | `src/game/rules/*`, `src/game/rules/gameRules.test.ts` |
| AI modules | Rule modules | AI legal options/scoring depend on current rules | `src/game/ai/aiUtils.ts`, `src/game/ai/aiPlanner.test.ts` |
| Static data | Rules/reducer/UI | dice/monster/shape IDs and stats drive roll/summon/combat display | `rg "monsterId|tileShapeId|definitionId" src` |
| Components/styles | E2E | Visible text, roles, labels, and class selectors | `e2e/game.spec.ts` |

## Source Boundaries

| Boundary | Paths | Notes |
|---|---|---|
| Source to inspect | `src/`, `e2e/`, root config files | Inspect actual files before editing; use project docs only for navigation. |
| Usually avoid | `node_modules/`, `dist/`, `playwright-report/`, `test-results/` | Generated/vendor/tool output. |
| Harness infrastructure | `.harness/` | Workflow files, not app source; only edit for Harness/project context tasks. |

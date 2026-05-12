# Codebase Change Impact

Last reviewed: 2026-05-12

For general verification commands, reference `.harness/project/PROJECT_VERIFICATION.md`.

## Impact Map

| Changing source area | Inspect/check before edit | Search usages | Likely affected files | Related tests | Regression risks |
|---|---|---|---|---|---|
| `src/game/types.ts` | Reducer, components, AI, tests | `rg "GameAction|GameState|GameEvent|AttackTarget|GamePhase" src e2e` | Most `src/game/*`, `src/components/*` | all tests | Type contract drift, unhandled reducer/UI cases |
| `src/game/reducer.ts` | Rule helpers, data ids, `GameScreen` event effects | `rg "lastEvent|interactionMode|selectedMonsterId|dispatch\\(" src` | `GameScreen.tsx`, AI, tests | rule, component, E2E tests | Invalid state transitions, stale highlights, broken AI sequences |
| `src/game/initialState.ts` | Constants, data, tests assuming starting board | `rg "Blue Warden|Crimson Overlord|core|turnNumber|currentPlayer" src e2e` | UI panels, E2E, AI tests | component/E2E/rule tests | Starting flow or visible text changes |
| `src/game/rules/summon.ts` | Tile shapes, reducer summon case, UI preview | `rg "getShapeCells|getValidPlacementAnchors|isValidDungeonPlacement" src` | reducer, `GameScreen`, `TileShapePreview`, AI utils | rule tests, E2E | Illegal placement, mismatched preview vs reducer validation |
| `src/game/rules/movement.ts` | Board rules, reducer movement, AI legal moves | `rg "getReachableCells|getMovementDistance" src` | reducer, AI utils/tests | rule tests, AI tests | Pathing through blocked/core cells, AI illegal moves |
| `src/game/rules/combat.ts` | Monster stats, reducer attack case, AI scoring | `rg "getValidAttackTargets|calculateMonsterDamage" src` | reducer, AI scoring/tests | rule tests, AI tests | Wrong damage, range, core targeting, winner state |
| `src/game/rules/dice.ts` | Dice catalog, reducer roll case, dice UI | `rg "rollDicePool|addRolledCrests|getSummonCandidates" src` | reducer, DiceTray, tests | rule/component/E2E tests | Broken summon candidates or crest accounting |
| `src/game/data/*.ts` | Type contracts and consumers | `rg "dice-|little-swordsman|tileShapeId|definitionId|monsterId" src` | reducer, rules, UI panels, AI tests | rule and AI tests | Broken ids, unbalanced stats, missing data references |
| `src/game/ai/*.ts` | Reducer action sequence, rule helpers, timers | `rg "getNextAIAction|useAIController|score" src` | `GameScreen`, AI files, tests | AI/component/E2E tests | AI stalls, illegal action dispatch, timeout-sensitive tests |
| `src/components/GameScreen.tsx` | Reducer events/actions, child props, CSS classes | `rg "GameScreen|lastEvent|phase-banner|ai-status|dispatchHumanAction" src e2e` | child components, styles, tests | component/E2E tests | Broken input routing, animation lock, AI lockout |
| `src/components/*.tsx` | Props, accessible labels, CSS class names | `rg "getByRole|getByText|aria-label|className" src e2e` | styles and tests | component/E2E tests | Test selectors and accessibility regressions |
| `src/styles/*.css` | Component class names and E2E class selectors | `rg "className=|die-card--empty|game-root|board-area" src e2e` | components and E2E | E2E plus visual review | Layout/animation regressions not caught by unit tests |
| `e2e/game.spec.ts` | UI text/roles, Playwright config | `rg "roll dice|end turn|AI THINKING|Current:" src e2e` | components, config | `npm run test:e2e` | Flaky smoke due timing or accessible text changes |

## Shared Contract Checklist

- Search direct imports/usages before renaming exported symbols.
- Search visible text and aria labels before changing UI text used by tests.
- For reducer event changes, inspect `GameScreen` effect handling.
- For rule changes, inspect AI legal option helpers and scoring.
- For data id changes, search ids across `src/` and tests.
- Update `CODEBASE_SOURCE_EVIDENCE.md` when new durable source evidence is discovered.

## High-Risk Change Patterns

| Pattern | Extra inspection | Focused regression checks |
|---|---|---|
| New `GameAction` or phase | Reducer switch, ActionPanel, AI planner, tests | `npm run test`; E2E if UI path changes |
| New monster/dice/tile shape | Data ids, reducer summon, UI panels, tests | rule tests and AI tests |
| AI timing/planning change | `aiController`, fake timer component test, E2E timeout | component AI test and E2E |
| Board geometry/layout change | constants, board CSS, tests expecting 117 cells | component smoke and E2E |
| Accessible UI text change | Testing Library and Playwright selectors | component and E2E tests |

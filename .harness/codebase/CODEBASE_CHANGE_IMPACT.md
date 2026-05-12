# Codebase Change Impact

Purpose: impact map for coding. When changing source area X, inspect/check Y.

For general verification commands, reference `.harness/project/PROJECT_VERIFICATION.md`.

Last reviewed: 2026-05-12

## Impact Map

| Changing source area | Inspect/check before edit | Search usages | Likely affected files | Related tests | Regression risks |
|---|---|---|---|---|---|
| `src/game/types.ts` | Reducer, components, AI modules, tests | `rg "GameState|GameAction|GameEvent|AttackTarget|PlayerId" src e2e` | Most `src/game/**`, `src/components/**` | `npm run test`, `npm run build` | Type contract breakage across UI/AI/rules |
| `src/game/reducer.ts` | All rule helper imports, `GameScreen` dispatch paths, AI planner actions | `rg "dispatch\\(|GameAction|ROLL_DICE|END_TURN|ATTACK_TARGET" src` | `GameScreen`, rules, AI, tests | rule tests, component smoke, e2e smoke | Phase/resource/event/log regressions |
| `src/game/initialState.ts` / `constants.ts` | Board dimensions, starting cores, player controls, tests expecting 117 cells | `rg "BOARD_|core|controls|117|13 by 9" src e2e` | Board UI, tests, AI turn flow | component + e2e smoke | Broken board assumptions or AI handoff |
| `src/game/rules/summon.ts` | tile shapes, reducer placement branch, UI placement preview, AI legal placements | `rg "getShapeCells|isValidDungeonPlacement|getValidPlacementAnchors" src` | reducer, GameScreen, aiUtils | rule tests, smoke as needed | Invalid previews, impossible AI/human summon |
| `src/game/rules/movement.ts` / `combat.ts` | reducer action branches, AI legal options/scoring, board helpers | `rg "getReachableCells|getMovementDistance|getValidAttackTargets|calculateMonsterDamage" src` | reducer, aiUtils, aiScoring | rule + AI tests | Illegal moves/attacks, wrong core damage |
| `src/game/ai/**` | reducer action legality, AI tests, fake-timer component test | `rg "getNextAIAction|useAIController|AI_ACTION_DELAY_MS|MAX_AI_ACTIONS_PER_TURN" src` | ai modules, GameScreen tests, e2e | `src/game/ai/aiPlanner.test.ts`, component/e2e smoke | Infinite AI turns, disabled UI not restored |
| `src/game/data/**` | ID references among dice, monsters, shapes; display consumers | `rg "monsterId|tileShapeId|definitionId|diceCatalog|monsters|tileShapes" src` | reducer, rules, UI panels | build + smoke/rule tests | Missing IDs, broken summon/display |
| `src/components/GameScreen.tsx` | child component props, reducer actions, AI hook, visual effects | `rg "GameScreen|dispatchHumanAction|handleCellClick|lastEvent" src e2e` | most UI behavior | component + e2e smoke | Human input blocked/enabled incorrectly, animation side effects |
| `src/components/Board*.tsx` | ARIA roles/labels, highlights, effects, CSS classes | `rg "grid|gridcell|Board|BoardCell|highlight" src e2e` | board CSS, GameScreen, e2e | component + e2e smoke | Test selector breakage, inaccessible board |
| `src/components/DiceTray.tsx` / `ActionPanel.tsx` | callbacks, disabled states, button labels, phase assumptions | `rg "Roll Dice|End Turn|ROLL_DICE|END_TURN|disabled" src e2e` | GameScreen, reducer | component + e2e smoke | Buttons unavailable or tests fail by label |
| `src/styles/**` | owning components, CSS class consumers, e2e class selectors | `rg "className=|die-card--empty|phase-banner|game-root" src e2e` | components, visual tests | build + browser/e2e evidence | Layout overlap, hidden controls, selector breakage |
| `e2e/game.spec.ts` | UI text/roles/classes used by selectors | n/a | components and CSS selectors referenced by test | `npm run test:e2e` | False negatives or missed user-visible regressions |

## Shared Contract Checklist

- Search direct imports/usages before changing exported types, helpers, IDs, labels, or reducer actions.
- Inspect reducer and AI callers together when changing `GameAction`.
- Check Playwright selectors before changing visible text, ARIA labels, roles, or CSS classes used in `e2e/game.spec.ts`.
- For UI tasks, use browser/e2e evidence when behavior or layout changes are visible.
- Update `CODEBASE_SOURCE_EVIDENCE.md` when a run discovers durable source-navigation facts.

## High-Risk Change Patterns

| Pattern | Extra inspection | Focused regression checks |
|---|---|---|
| Reducer state/action contract change | `types.ts`, reducer, UI dispatchers, AI planner, tests | `npm run test`, `npm run build` |
| Board coordinate or dimension change | board helpers, initial state, Board/BoardCell, tests expecting 117 cells | rule tests, component smoke, e2e smoke |
| AI turn scheduling/planning change | `aiController`, `aiPlanner`, `aiTypes`, fake-timer test | AI tests, component smoke, e2e smoke |
| Visible UI copy or accessibility label change | Playwright and Testing Library selectors | component/e2e smoke update or evidence |
| Static data ID change | dice/monster/shape cross references | build, rule/smoke tests |

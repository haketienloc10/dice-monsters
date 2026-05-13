# Codebase Change Impact

Purpose: impact map for coding. When changing source area X, inspect/check Y.

This is the main reason the codebase layer exists. Keep it concrete and source-backed.

For general verification commands, reference `.harness/project/PROJECT_VERIFICATION.md` instead of duplicating them here.

## Impact Map

| Changing source area | Inspect/check before edit | Search usages | Likely affected files | Related tests | Regression risks |
|---|---|---|---|---|---|
| `src/components/GameScreen.tsx` | Reducer action contracts, AI hook behavior, board callbacks, animation locks | `rg "dispatchHumanAction|handleCellClick|useAIController|lastEvent|animationLock" src` | `src/game/reducer.ts`, `src/game/types.ts`, `src/game/ai/aiController.ts`, board/HUD components | `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts` | Human actions blocked incorrectly, AI turn leaks input, timers/effects duplicate, visible smoke flow breaks. |
| `src/game/types.ts` | Reducer branches, UI dispatches, AI planned actions, event consumers | `rg "GameAction|GameState|GameEvent|AttackTarget|InteractionMode|ROLL_DICE|END_TURN" src` | Most files under `src/components`, `src/game/reducer.ts`, `src/game/ai/*` | All current tests can be relevant | Type drift between UI, reducer, and AI; event-driven animations break. |
| `src/game/reducer.ts` | Rule helper contracts, clone behavior, event/log semantics, UI helper exports | `rg "gameReducer|cellHasHighlight|cellTargetAt|canCurrentPlayerSelectForAction|keyForPosition" src` | `GameScreen`, `BoardCell`, AI planner output, rule files | `src/components/GameScreen.test.tsx`, `src/game/rules/gameRules.test.ts`, `src/game/ai/aiPlanner.test.ts` | Illegal actions accepted, legal actions ignored, state mutation leaks, UI highlights stale. |
| `src/game/initialState.ts` | Board constants, default player/control assumptions, reset behavior | `rg "createInitialState|Blue Warden|Crimson Overlord|P2.*ai|coreHp" src e2e` | `reducer.ts`, tests, `TopBar`, `PlayerCorePanel` | `GameScreen.test.tsx`, `gameRules.test.ts`, `e2e/game.spec.ts` | Default test setup changes, AI default changes, board/core coordinates mismatch. |
| `src/game/rules/board.ts` | Board constants, reducer clone assumptions, AI/rule imports | `rg "createEmptyBoard|cloneGameState|getCell|getNeighbors|getCorePosition|positionKey|samePosition" src` | `initialState.ts`, `reducer.ts`, `summon.ts`, `movement.ts`, `combat.ts`, AI scoring/tests | `gameRules.test.ts`, `aiPlanner.test.ts` | Incorrect board bounds, clone omission causing mutation bugs, core position mismatch. |
| `src/game/rules/dice.ts` | Crest cap, dice data shape, summon candidate policy | `rg "rollDicePool|addRolledCrests|getSummonCandidates|CREST_CAP|latestRoll|summonCandidates" src` | `reducer.ts`, `DiceTray`, `TopBar`, AI planner | `gameRules.test.ts`, `GameScreen.test.tsx`, `e2e/game.spec.ts` | Phase transitions change, summon candidates unavailable, crests overflow/underflow. |
| `src/game/rules/summon.ts` | Tile shape offsets, placement preview, AI placement options | `rg "getShapeCells|isValidDungeonPlacement|getValidPlacementAnchors|placementRotation|selectedSummonDiceId" src` | `GameScreen`, `TileShapePreview`, `reducer.ts`, `aiUtils.ts`, `aiScoring.ts` | `gameRules.test.ts`, `aiPlanner.test.ts` | Preview and reducer legality diverge, AI tries illegal placements, board overlap/core adjacency bugs. |
| `src/game/rules/movement.ts` | Monster stats, crest spending, highlight behavior, AI move options | `rg "getMovementDistanceMap|getReachableCells|getMovementDistance|crestPool.move|ENTER_MOVE_MODE|MOVE_MONSTER" src` | `reducer.ts`, `aiUtils.ts`, `aiScoring.ts`, `BoardCell` | `gameRules.test.ts`, `aiPlanner.test.ts` | Movement through blockers/cores, wrong crest cost, unreachable highlights. |
| `src/game/rules/combat.ts` | Monster stats, core positions, attack target shape | `rg "calculateMonsterDamage|getValidAttackTargets|AttackTarget|ENTER_ATTACK_MODE|ATTACK_TARGET" src` | `reducer.ts`, `aiUtils.ts`, `aiScoring.ts`, `BoardCell`, `CoreBase` | `gameRules.test.ts`, `aiPlanner.test.ts` | Targeting illegal enemies/cores, damage mismatch, AI scoring stale. |
| `src/game/rules/turn.ts` | Reducer end-turn branch, AI turn loop, attack reset behavior | `rg "startTurn|endTurn|turnEnded|hasActedAttack|turnNumber|currentPlayer" src e2e` | `reducer.ts`, `aiController.ts`, `TopBar`, tests | `gameRules.test.ts`, `GameScreen.test.tsx`, `e2e/game.spec.ts` | AI never returns control, turn number off, selections/highlights persist incorrectly. |
| `src/game/data/diceCatalog.ts` | Monster/tile ID references, dice roll tests, summon UI | Search the specific dice ID plus `monsterId|tileShapeId|diceCatalog|getLegalSummonCandidates` | `monsters.ts`, `tileShapes.ts`, `ActionPanel`, `DiceTray`, AI scoring | `gameRules.test.ts`, `aiPlanner.test.ts` | Broken lookup, no legal summon, stale displayed data. |
| `src/game/data/monsters.ts` | `MonsterToken.monsterVisuals`, AI scoring, movement/combat stats | Search the specific monster ID plus `monsters\\[|monsterVisuals|definitionId` | `diceCatalog.ts`, `MonsterToken.tsx`, `MonsterInfoPanel.tsx`, rules, AI | `gameRules.test.ts`, `aiPlanner.test.ts` | Missing visuals, stat rebalance changes AI/rule behavior, invalid dice mapping. |
| `src/game/data/tileShapes.ts` | Summon rule, tile preview, dice mappings, AI scoring | Search the specific shape ID plus `tileShapes|getShapeCells|tileShapeId` | `diceCatalog.ts`, `summon.ts`, `TileShapePreview`, `aiScoring.ts` | `gameRules.test.ts`, `aiPlanner.test.ts` | Illegal shapes, preview mismatch, placement scoring shifts. |
| `src/game/ai/*` | Reducer action legality, rule helpers, fake timers, e2e AI timeout | `rg "getNextAIAction|getLegal.*Options|score.*|AI_ACTION_DELAY_MS|MAX_AI_ACTIONS_PER_TURN|isCurrentPlayerAI" src` | `GameScreen`, `reducer.ts`, `rules/*`, tests | `aiPlanner.test.ts`, `GameScreen.test.tsx`, `e2e/game.spec.ts` | AI loops too long, emits impossible actions, e2e timeout, human controls stay disabled. |
| `src/components/ActionPanel.tsx` | Reducer action names, button labels, disabled logic | `rg "ENTER_MOVE_MODE|ENTER_ATTACK_MODE|SKIP_SUMMON|ROTATE_PLACEMENT|End Turn|Reset" src e2e` | `GameScreen`, `reducer.ts`, tests | `GameScreen.test.tsx`, `e2e/game.spec.ts` | Buttons enabled in wrong phase, tests cannot find labels, dispatch type drift. |
| `src/components/Board*.tsx` and `CoreBase.tsx` | Board role/count, reducer helper usage, effect union, CSS classes | `rg "board-grid|gridcell|VisualEffect|cellHasHighlight|cellTargetAt|core-base|board-effect" src e2e` | `GameScreen`, `reducer.ts`, `board.css`, tests | `GameScreen.test.tsx`, `e2e/game.spec.ts` | Grid count/roles break, highlights/targets invisible, visual effects misplaced. |
| `src/components/MonsterToken.tsx` | Monster IDs, visual tone CSS classes, monster info fallback | `rg "monsterVisuals|monster-token--|definitionId|monsters\\[" src` | `monsters.ts`, `MonsterInfoPanel.tsx`, `board.css` | Component/browser smoke if visible behavior changes | Missing visual entry, CSS tone class absent, token text layout shifts. |
| `src/components/DiceTray.tsx` and `TopBar.tsx` | Dice result shape, visible labels used by tests | `rg "latestRoll|CREST_ICONS|Roll Dice|Latest dice results|Current:" src e2e` | `reducer.ts`, `constants.ts`, tests | `GameScreen.test.tsx`, `e2e/game.spec.ts` | Tests fail on label/text changes, roll button disabled incorrectly. |
| `src/styles/*.css` | Component class names, board dimensions, responsive assumptions | Search the specific class name in `src/styles` and `src/components` | Matching component files and e2e smoke selectors | `e2e/game.spec.ts`; manual/browser check for layout | Broken layout, hidden controls, class rename without JSX update. |
| `e2e/game.spec.ts` | User-visible labels, app timing, Playwright config | `rg "baseURL|4173|AI THINKING|gridcell|Roll Dice|Current:" . src e2e` | `playwright.config.ts`, `GameScreen`, visible components | Browser e2e itself | Test no longer tracks product flow, timeout too tight/loose. |

## Shared Contract Checklist

Use when changing exported functions, types, action names, IDs, CSS class names, or shared UI/state modules.

- Search direct imports/usages with `rg`.
- Search string-based usages for action names, monster/dice/tile IDs, visible labels used by tests, and CSS classes.
- Inspect tests around all major consumers.
- Check call sites for assumptions about phase, selection state, event shape, timer behavior, and ordering.
- Update `CODEBASE_SOURCE_EVIDENCE.md` when new important source evidence is discovered.

## High-Risk Change Patterns

| Pattern | Extra inspection | Focused regression checks |
|---|---|---|
| `GameAction` or `GameEvent` change | `src/game/types.ts`, `src/game/reducer.ts`, `src/components/GameScreen.tsx`, `src/game/ai/aiTypes.ts`, `src/game/ai/aiPlanner.ts` | Unit/component tests plus AI planner tests. |
| Board dimension/core coordinate change | `constants.ts`, `rules/board.ts`, `initialState.ts`, `GameScreen.test.tsx`, `e2e/game.spec.ts`, CSS grid sizing | Grid count assertions and placement/movement/combat rules. |
| Data ID rename | `diceCatalog.ts`, `monsters.ts`, `tileShapes.ts`, `MonsterToken.tsx`, AI/rule tests | Search old/new ID strings; rule and AI tests. |
| AI timing/action loop change | `aiController.ts`, `aiTypes.ts`, `GameScreen.test.tsx`, `e2e/game.spec.ts` | Fake-timer component test and e2e AI return-control flow. |
| Button/label/ARIA change | `ActionPanel`, `DiceTray`, `TopBar`, `Board`, e2e/component tests | Query updates in tests; browser smoke. |
| Layout/CSS class rename | Matching component and CSS files | Search class name; browser check when feasible. |

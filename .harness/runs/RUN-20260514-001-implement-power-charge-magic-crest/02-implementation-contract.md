---
artifact: 02-implementation-contract
run_id: RUN-20260514-001-implement-power-charge-magic-crest
role: planner
executor_type: subagent
executor_id: 019e2273-3358-7821-9e8b-04a64b894a4b
codex_agent_name: harness_planner
codex_agent_file: .codex/agents/harness-planner.toml
status: completed
---

# Implementation Contract

## Classification Guard

- Task classification: Normal Run
- Normal run is bounded: yes
- Oversized/Epic signals present: no

## Contract Status

Draft for Contract Reviewer. Not approved for implementation until `03-contract-review.md` ends with `- Status: approved`.

## Goal

Implement one Magic Crest action, `Power Charge`, through the existing typed action/reducer/UI/AI paths. The feature must let the active player spend 1 Magic Crest in action phase to mark one valid own board monster with `+1 ATK next attack` for the current turn, then consume or expire that effect under the requested combat and turn rules.

## Planned Change

- Extend shared game types with the minimal state/action/event data needed for an active Power Charge effect and optional log/event visibility.
- Add reducer handling for a Power Charge action that validates phase, current-player ownership, target existence, board occupancy, Magic Crest cost, and duplicate active effect before spending the crest and marking the monster.
- Update attack resolution so an active Power Charge affects only the next normal attack by that monster, then clears the effect and logs consumption.
- Preserve the Attack Crest requirement and attack target legality; Power Charge must not trigger `ATTACK_TARGET` by itself.
- Update end-turn cleanup so active Power Charge owned by the ending player is cleared when that player ends the turn.
- Update combat helper usage or damage calculation narrowly so powered monster-vs-monster damage uses `max(0, ATK + 1 - DEF)` without unintentionally changing normal, non-powered damage behavior.
- Update core/Dungeon Master attack handling so a powered attack against a core consumes Power Charge but deals exactly 1 LP damage for that attack.
- Add UI affordance in the existing action panel for Power Charge with visible cost `1 Magic`, enabled only for a current-player selected monster in action phase with enough Magic Crest and no active Power Charge on that monster.
- Add visible active effect status in existing monster UI, either on the board token, selected monster panel, or both, with text equivalent to `+1 ATK next attack`.
- Update AI planner/types so P2 can emit the same Power Charge `GameAction` before attacking only when a legal monster attack becomes lethal because of Power Charge.
- Add or update tests covering reducer/rules, UI display/action availability, and AI planner constraints.

## Non-Goals

- Do not implement Trap, Shield, or any additional Magic skill.
- Do not add a generalized card/skill framework unless strictly necessary for this single action.
- Do not change board dimensions, starting core positions, dice catalog semantics, or Dungeon Master/core LP rules outside the powered-attack exception requested here.
- Do not refactor unrelated reducer branches, AI scoring for normal attacks, movement/summon rules, or layout structure.
- Do not let AI mutate `GameState` directly or use a path unavailable to human actions.
- Do not rewrite existing tests beyond targeted additions/updates needed for Power Charge.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `src/game/types.ts` | Add minimal Power Charge state/action/event typing. | Shared contract for reducer, UI, AI, and tests. | High |
| `src/game/reducer.ts` | Add Power Charge action branch, attack consumption behavior, log entries, and core damage exception for powered attacks. | Central legality and state transition gate. | High |
| `src/game/rules/combat.ts` | Add or adapt scoped damage helper usage for powered monster attacks. | Keep damage formula testable and avoid changing normal damage accidentally. | Medium |
| `src/game/rules/turn.ts` | Clear ending player's active Power Charge effects on end turn. | Required expiry behavior. | Medium |
| `src/game/rules/board.ts` | Adjust clone support only if the chosen Power Charge state shape requires more than shallow cloning. | Prevent state mutation leakage. | Low/Medium |
| `src/components/ActionPanel.tsx` | Render/use Power Charge action with `1 Magic` cost and correct disabled logic. | Human UI action requirement. | Medium |
| `src/components/MonsterInfoPanel.tsx` | Show active Power Charge status for selected monster. | User-visible effect clarity. | Low |
| `src/components/MonsterToken.tsx` and/or `src/styles/board.css` | Add compact active-effect marker if board-level badge is chosen. | User-visible effect clarity on board. | Low/Medium |
| `src/components/GameLog.tsx` | Update icon/tone mapping only if log text needs distinct magic styling. | Optional presentation for required log events. | Low |
| `src/styles/hud.css` and/or `src/styles/board.css` | Style the new action/status marker using existing visual language. | UI clarity without layout churn. | Low/Medium |
| `src/game/ai/aiTypes.ts` | Add Power Charge action to AI planned action union. | AI must emit reducer-compatible action. | Medium |
| `src/game/ai/aiPlanner.ts` | Plan Power Charge before a lethal boosted monster attack, with guardrails for Magic Crest and core targets. | AI requirement. | Medium/High |
| `src/game/ai/aiUtils.ts` and/or `src/game/ai/aiScoring.ts` | Add helper/scoring support only if needed to keep planner simple and tested. | Avoid duplicating legality math in planner. | Medium |
| `src/game/rules/gameRules.test.ts` | Add focused tests for activation legality, cost, damage, consumption, core damage, and end-turn expiry. | Rule/reducer verification. | Low |
| `src/game/ai/aiPlanner.test.ts` | Add tests for AI using/skipping Power Charge under required conditions. | AI verification. | Low |
| `src/components/GameScreen.test.tsx` | Add smoke-level UI test for action availability/status where feasible. | UI verification. | Low |
| `e2e/game.spec.ts` | Change only if a browser-visible regression test is necessary beyond component coverage. | Optional UI smoke evidence. | Low |

## Behaviour Contract

- [ ] `USE_POWER_CHARGE` or equivalent action is a no-op unless `state.phase === "action"`.
- [ ] Successful activation spends exactly `state.players[currentPlayer].crestPool.magic -= 1`.
- [ ] Activation is legal only for a monster that exists in `state.monsters`, belongs to `currentPlayer`, occupies the corresponding board cell, is not already Power Charged, and is not a core/Dungeon Master.
- [ ] Activation is rejected without changing state for opponent monsters, removed monsters, empty/non-monster targets, duplicate active Power Charge, and insufficient Magic Crest.
- [ ] Power Charge remains on the monster until that monster attacks or its owner ends turn, whichever comes first.
- [ ] Power Charge never changes movement, range, target legality, attack availability, or `hasActedAttack` by itself.
- [ ] Entering attack mode and resolving an attack still require the existing Attack Crest path and decrement Attack Crest exactly as before.
- [ ] When a powered monster attacks a monster, damage is `max(0, attacker ATK + 1 - defender DEF)`, and the effect is cleared after the attack is resolved.
- [ ] When a powered monster attacks a core/Dungeon Master, core LP damage is exactly 1 for that attack, and the effect is cleared after the attack is resolved.
- [ ] If a powered attack destroys a monster, existing removal behavior still clears the board cell, removes `state.monsters[id]`, updates `summonedMonsterIds`, and records `destroyedMonsterId`.
- [ ] Ending a player's turn clears active Power Charge from that player's monsters only; opponent effects are not cleared until that opponent ends turn or attacks.
- [ ] Game log includes a readable activation entry and a readable consumption entry when a charged monster attacks.
- [ ] The action UI exposes Power Charge with visible `1 Magic` cost when a current-player monster is selected in action phase, and prevents use when Magic Crest is unavailable or target is invalid.
- [ ] Active effect status is visibly shown with wording equivalent to `+1 ATK next attack`.
- [ ] AI P2 may plan Power Charge only when it has Magic Crest, has a legal selected or selectable own attacker, has/retains a valid attack path, and the boost changes an enemy monster attack from non-lethal to lethal this turn.
- [ ] AI P2 must not use Power Charge for core/Dungeon Master attacks, without Magic Crest, on opponent monsters, on already charged monsters, or by mutating state directly.

## Verification Plan

```bash
# Focused unit/integration tests during development
npm run test -- src/game/rules/gameRules.test.ts src/game/ai/aiPlanner.test.ts src/components/GameScreen.test.tsx

# Full unit/integration suite
npm run test

# Production build/typecheck
npm run build

# Browser-visible smoke/e2e if UI interaction coverage is changed or component tests cannot cover the required visible behavior
npm run test:e2e
```

Evaluator should require real command evidence. For UI behavior, static build evidence alone is insufficient; at least component test evidence is expected, and Playwright evidence is expected if the implementation relies on browser-only interaction/visibility behavior.

## Rollback Notes

- Reverting should remove the Power Charge state/action/event typing, reducer branch, attack/end-turn effect handling, UI controls/status, AI planning additions, styles, and focused tests in one scoped revert.
- No migration or persisted data rollback is expected; game state is in-memory.
- Do not roll back unrelated source, test, config, or Harness files.

## Questions / Assumptions

- Assumption: `Dungeon Master` in the request maps to the existing player core target represented by `AttackTarget` type `{ type: "core" }`.
- Assumption: `current player` means `state.currentPlayer`.
- Assumption: `Target: 1 monster hợp lệ ... đang ở trên board` can be represented by selected monster or explicit monster ID action; reducer must verify both `state.monsters[targetId]` and board cell occupancy.
- Assumption: Existing non-powered core attack behavior should remain unchanged except for powered core attacks, which must deal exactly 1 LP as requested.
- Assumption: A monster with Power Charge that is destroyed before attacking does not need a separate consume log; removing the monster removes the active effect with it.

## Explicit Out of Scope

- Any implementation of Trap or Shield.
- New Magic skills beyond `Power Charge`.
- New dependency installation.
- Changes to package scripts, project config, board dimensions, default P1/P2 control setup, or dice catalog.

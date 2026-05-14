---
artifact: 02-implementation-contract
run_id: RUN-20260514-002-fix-power-charge-core-damage-regression
role: planner
executor_type: subagent
executor_id: 019e246b-4b1a-7163-864e-981d078ae6ce
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

Fix the Power Charge core damage regression so attacking an opponent core with an active Power Charge does not reduce damage below the same attacker's normal core attack damage.

## Planned Change

- Update `gameReducer` core-target attack resolution so `wasPowerCharged` no longer maps core damage to a hard-coded `1`.
- Preserve normal core attack damage as `attackerDefinition.atk`.
- Apply a clear powered core damage rule that satisfies the feature meaning and the bug report. Preferred rule: charged core damage is `attackerDefinition.atk + 1`, matching Power Charge's `+1 ATK next attack` wording for a core target with no defense.
- Preserve all existing attack bookkeeping around the damage calculation: Attack Crest spend, `hasActedAttack`, `lastEvent`, `coreOwnerHit`, log entries, Power Charge consumption, interaction cleanup, core HP floor, and game-over/winner assignment.
- Update `src/game/rules/gameRules.test.ts` by replacing the current expectation that powered core attacks deal exactly 1 damage with regression coverage proving charged core damage is not lower than normal core damage.
- Inspect `src/game/ai/aiScoring.ts`/`src/game/ai/aiPlanner.ts` for direct assumptions about charged core attacks. Change them only if necessary to keep legal already-charged core attacks from being scored or planned incorrectly.

## Non-Goals

- Do not change Power Charge activation cost, validation, UI labels, visual badges, or log wording except if a test must be updated to reflect actual damage.
- Do not change monster-vs-monster normal or Power Charge damage formulas.
- Do not change non-powered core attack damage.
- Do not change attack target legality, range rules, board dimensions, core positions, core HP constants, monster stats, dice catalog, or turn cleanup rules.
- Do not add dependencies or modify package/config files.
- Do not perform broad reducer, AI, UI, or style refactors.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `src/game/reducer.ts` | Replace the powered core damage calculation in `ATTACK_TARGET` core branch while preserving side effects. | Source of the reported damage regression. | High |
| `src/game/rules/gameRules.test.ts` | Update/add focused tests for normal vs Power Charged core damage, consumption, and event damage. | Prevent recurrence and replace stale expectation. | Medium |
| `src/game/rules/combat.ts` | Optional: add a small helper only if it makes core damage rules clearer and directly tested. | Avoid duplicating damage semantics if Generator chooses helper extraction. | Low |
| `src/game/ai/aiScoring.ts` | Optional: adjust only if already-charged core attacks are currently suppressed in a way that conflicts with fixed reducer behavior. | Current source has a charged-core scoring guard; inspect before changing. | Medium |
| `src/game/ai/aiPlanner.test.ts` | Optional: add/update only if AI scoring/planning changes are necessary. | Verify any optional AI consumer change. | Low |

## Behaviour Contract

- [ ] A normal core attack still deals `attackerDefinition.atk` damage.
- [ ] A Power Charged core attack must not deal less damage than the same attacker's normal core attack.
- [ ] Preferred exact rule: a Power Charged core attack deals `attackerDefinition.atk + 1` damage. If Generator implements a different exact rule, it must still satisfy the non-regression guarantee and document why in `04-implementation-report.md`.
- [ ] The previous hard-coded powered core damage value of `1` must be removed from attack resolution.
- [ ] Power Charge is consumed after a core attack exactly as before.
- [ ] `next.lastEvent` for a charged core attack reports the actual damage dealt and keeps `coreOwnerHit` set to the damaged player.
- [ ] Core HP is reduced by the actual damage and remains clamped at 0.
- [ ] Game-over and winner assignment still occur when the charged core attack reduces the target core to 0 HP.
- [ ] Existing invalid attack handling remains unchanged: reducer still revalidates targets and returns the original state for illegal `ATTACK_TARGET` actions.
- [ ] Existing monster-target Power Charge behavior remains unchanged.

## Verification Plan

```bash
# Focused regression test
npm run test -- src/game/rules/gameRules.test.ts

# Full unit/integration suite
npm run test

# Production build/typecheck
npm run build
```

Evaluator should require real command evidence for the focused regression test and at least one full-suite/build command. Browser e2e is not required unless Generator changes UI or browser-visible interaction logic.

## Rollback Notes

- Rollback should revert only the focused core damage calculation and associated tests.
- No migration or persisted data rollback is expected; gameplay state is in-memory.
- Do not revert unrelated source, test, config, or Harness files.

## Questions / Assumptions

- Assumption: The user's "core của đối phương" maps to existing `AttackTarget` `{ type: "core" }`.
- Assumption: Since normal core damage currently uses `attackerDefinition.atk`, the minimum acceptable fixed powered core damage is that same value.
- Assumption: Power Charge wording `+1 ATK next attack` applies to core attacks unless Contract Reviewer rejects that exact rule.

## Explicit Out of Scope

- New Magic skills or redesigning Power Charge.
- UI redesign or animation changes.
- AI strategy changes beyond preserving compatibility with fixed reducer behavior.
- Changes to Harness lifecycle files other than this planner brief and contract.

---
artifact: 01-planner-brief
run_id: RUN-20260514-002-fix-power-charge-core-damage-regression
role: planner
executor_type: subagent
executor_id: 019e246b-4b1a-7163-864e-981d078ae6ce
codex_agent_name: harness_planner
codex_agent_file: .codex/agents/harness-planner.toml
status: completed
---

# Planner Brief

## Classification Summary

- Classification: Normal Run
- Why this is bounded: The reported bug is isolated to the existing Power Charge attack resolution against an opponent core and can be fixed with a focused reducer/rules test update.
- If part of Epic, independent verification target: Not applicable.

## Related Epic

None

## Goal

Fix the regression where a monster with active Power Charge deals only 1 damage to the opponent core, while the same monster without Power Charge deals its normal ATK damage. A Power Charged core attack must not deal less damage than the equivalent normal core attack.

## Context Summary

- The app is a React + TypeScript game with `gameReducer` as the authoritative gameplay state transition layer.
- Attack target legality is provided by `src/game/rules/combat.ts` through `getValidAttackTargets`.
- `gameReducer` handles `ATTACK_TARGET`; monster targets use Power Charge damage logic, but core targets currently branch to `const damage = wasPowerCharged ? 1 : attackerDefinition.atk`.
- Existing focused coverage in `src/game/rules/gameRules.test.ts` currently asserts the regression: `"does exactly 1 core damage when consumed against a core"`.
- Codebase flow docs state non-powered core damage uses attacker ATK directly; the requested fix should preserve that normal path while correcting the powered path.

## In Scope

- Change core attack damage resolution for a monster with active Power Charge so damage is at least the same as the non-Power Charge core attack from that monster.
- Prefer applying the same `+1 ATK next attack` meaning to core attacks unless Contract Reviewer or source evidence rejects that interpretation.
- Preserve existing target validation, Attack Crest spending, `hasActedAttack`, `lastEvent`, core hit event data, game-over handling, and Power Charge consumption after the attack.
- Replace/update the focused regression test that currently expects 1 core damage.
- Add explicit coverage comparing charged core damage to equivalent normal core damage.

## Out of Scope

- Reworking Power Charge activation rules, Magic Crest cost, UI affordance, visual effects, or game log wording unless directly required by the damage fix.
- Changing monster-vs-monster damage formulas.
- Changing non-powered core attack damage.
- Changing attack range/targeting, board/core positions, core HP constants, dice catalog, monster stats, or AI strategy.
- Broad reducer, rules, UI, or AI refactors.
- Harness infrastructure changes outside the two planner artifacts for this role.

## Acceptance Criteria

- [ ] A Power Charged attack against an opponent core no longer deals a hard-coded 1 damage.
- [ ] For the same attacker and target core, charged core damage is greater than or equal to normal core damage.
- [ ] If implementing the natural `+1 ATK next attack` interpretation, charged core damage equals `attackerDefinition.atk + 1`; otherwise the contract reviewer/generator report must justify the exact damage rule while still satisfying the non-regression guarantee.
- [ ] Normal, non-Power Charge core attacks still deal `attackerDefinition.atk`.
- [ ] Power Charge is still consumed after a core attack.
- [ ] Existing attack side effects are preserved: Attack Crest decremented, attacker marked as having attacked, interaction cleared, `lastEvent.damage` reflects actual core damage, `coreOwnerHit` is set, core HP cannot go below 0, and game over still triggers at 0 HP.
- [ ] Focused automated tests cover normal and Power Charged core damage in `src/game/rules/gameRules.test.ts`.
- [ ] Full relevant verification passes with real command evidence.

## Likely Impacted Areas

- Module: `src/game/reducer.ts`, specifically `ATTACK_TARGET` core-target branch.
- Rule/helper area: `src/game/rules/combat.ts` only if Generator chooses to extract a small core damage helper.
- Test area: `src/game/rules/gameRules.test.ts`.
- Optional consumer check: `src/game/ai/aiScoring.ts` only if current scoring prevents already-charged attackers from taking legal beneficial core attacks after the reducer fix.

## Risks / Unknowns

- Prior Power Charge implementation intentionally encoded powered core damage as 1, but the new user report defines that as a regression. The new run should supersede the older expectation for core attacks.
- If charged core damage becomes `ATK + 1`, low-HP core game-over tests should ensure the existing winner/game-over behavior still works.
- AI currently avoids scoring core attacks when `attacker.powerChargeActive`; this may be acceptable if AI never uses Power Charge for core attacks, but Generator should inspect it before deciding whether an AI test/update is necessary.

## Planner Notes for Generator

- Keep `gameReducer` as the source of truth; do not patch UI-only behavior.
- Start from the failing assertion in `src/game/rules/gameRules.test.ts` and turn it into a regression test for the requested behavior.
- Avoid changing `calculatePowerChargeMonsterDamage` unless the implementation creates a clearly named helper for core damage. Monster combat semantics should remain unchanged.

---
artifact: 01-planner-brief
run_id: RUN-20260514-001-implement-power-charge-magic-crest
role: planner
executor_type: subagent
executor_id: 019e2273-3358-7821-9e8b-04a64b894a4b
codex_agent_name: harness_planner
codex_agent_file: .codex/agents/harness-planner.toml
status: completed
---

# Planner Brief

## Classification Summary

- Classification: Normal Run
- Why this is bounded: Adds one named Magic Crest action, one temporary monster status/effect, AI usage for a narrow lethal-monster case, and focused UI/log/test coverage within existing game reducer/UI/AI paths.
- If part of Epic, independent verification target: Not applicable.

## Related Epic

None

## Goal

Implement the basic Magic skill `Power Charge` so the current player can spend 1 Magic Crest during action phase to give one valid own board monster `+1 ATK` for its next normal attack in the current turn, with matching UI visibility, game log entries, and AI usage when it enables destroying an enemy monster this turn.

## Context Summary

- Existing game flow is React + TypeScript with `GameScreen` dispatching typed `GameAction`s into `gameReducer`.
- Combat legality and damage currently route through `src/game/rules/combat.ts` and `gameReducer` `ENTER_ATTACK_MODE`/`ATTACK_TARGET`.
- Turn cleanup currently lives in `src/game/rules/turn.ts`; per-monster attack reset already happens there.
- UI action availability is primarily in `src/components/ActionPanel.tsx`; selected monster state is shown by `MonsterInfoPanel` and board token state by `MonsterToken`.
- AI planner emits reducer-compatible actions from `src/game/ai/aiPlanner.ts`; reducer must remain the final legality gate.

## In Scope

- Add a single Power Charge action path usable only in action phase.
- Spend exactly 1 Magic Crest from the current player on successful activation.
- Permit targeting only one current-player monster that exists, is on the board, is not a Dungeon Master/core, and does not already have active Power Charge.
- Apply `+1 ATK` only to the monster's next normal attack during the current owner turn.
- Consume and clear the effect after that monster attacks, including attacks against Dungeon Master/core.
- Clear any active Power Charge owned by the ending player when that player ends turn.
- Preserve Attack Crest requirements and existing attack target validation.
- Show a visible Power Charge affordance/cost in the action UI for valid selected own monsters.
- Show active Power Charge state on the monster in the UI, for example `+1 ATK next attack`.
- Add game log entries for Power Charge activation and attack-time consumption.
- Update AI P2 so it may use Power Charge through the same action/reducer path when it turns a legal attack on an enemy monster into a destroy this turn.
- Add focused tests for rules/reducer behavior, UI availability/status where practical, and AI planning constraints.

## Out of Scope

- Trap implementation.
- Shield implementation.
- Additional Magic skills or a generalized multi-skill system beyond what Power Charge needs.
- Board size, core/Dungeon Master placement, or Dungeon Master LP rule changes.
- Large refactors of reducer, AI planner, combat, or UI layout.
- Direct AI state mutation or AI-only bypasses of reducer legality.

## Acceptance Criteria

- [ ] Power Charge can be activated only in action phase by the current player, costs exactly 1 Magic Crest, and is rejected without state changes when the phase, crest count, target ownership, target existence, target board presence, or duplicate active effect is invalid.
- [ ] Power Charge cannot be applied to an opponent monster, Dungeon Master/core, an empty cell, or a monster that has already been removed from `state.monsters`/board occupancy.
- [ ] A powered monster attacking another monster deals `max(0, ATK + 1 - DEF)` damage for that attack, can destroy the defender accordingly, and then loses Power Charge.
- [ ] A powered monster attacking a Dungeon Master/core still reduces core LP by exactly 1, not by `ATK + 1`, and still loses Power Charge.
- [ ] Power Charge does not initiate an attack and does not bypass the existing requirement to spend an Attack Crest before attacking.
- [ ] Ending a player's turn clears active Power Charge from that player's monsters.
- [ ] UI shows a Power Charge action with cost `1 Magic` only when a current-player monster is selected in action phase; the control is disabled or unavailable when insufficient Magic Crest or invalid target.
- [ ] UI shows a clear active Power Charge marker on affected monsters or selected monster details.
- [ ] Game log records successful Power Charge activation and attack-time consumption.
- [ ] AI P2 uses Power Charge only through the same reducer action path when it enables destroying an enemy monster this turn, and does not use it without Magic Crest or merely to attack Dungeon Master/core.
- [ ] Focused automated verification covers reducer/rule behavior, AI planner behavior, and at least smoke-level UI rendering/action availability.

## Likely Impacted Areas

- Module: `src/game/types.ts`, `src/game/reducer.ts`, `src/game/rules/combat.ts`, `src/game/rules/turn.ts`, possibly `src/game/rules/board.ts` clone coverage.
- UI: `src/components/ActionPanel.tsx`, `src/components/MonsterInfoPanel.tsx`, `src/components/MonsterToken.tsx`, possibly `src/components/GameLog.tsx` and `src/styles/*.css`.
- AI: `src/game/ai/aiPlanner.ts`, `src/game/ai/aiTypes.ts`, possibly `src/game/ai/aiUtils.ts`/`aiScoring.ts`.
- Tests: `src/game/rules/gameRules.test.ts`, `src/game/ai/aiPlanner.test.ts`, `src/components/GameScreen.test.tsx`; `e2e/game.spec.ts` only if visible browser flow changes need coverage.

## Risks / Unknowns

- Current core attacks use attacker ATK as core damage; the requested Dungeon Master/core behavior says powered attacks should deal exactly 1 LP. Generator must preserve existing non-powered core behavior unless source evidence or tests already define a different Dungeon Master LP rule.
- Current normal monster damage has a minimum of 1 via `calculateMonsterDamage`; Power Charge explicitly requires `max(0, ATK + 1 - DEF)`, so powered damage may need a scoped calculation path without changing normal damage semantics.
- `MonsterInstance` is cloned shallowly in `cloneGameState`; any new nested effect/status shape must remain clone-safe.
- AI action loops have a fixed cap; adding a pre-attack action must not cause repeated Power Charge attempts on already charged or invalid monsters.

## Planner Notes for Generator

- Keep reducer as the authoritative legality gate. UI and AI may pre-compute availability, but invalid `GameAction`s must be no-ops.
- Prefer a narrow per-monster state marker for active Power Charge over a broad skill framework.
- Use existing `crestPool.magic`, `ActionPanel` button style, and game log conventions.
- Search action/event usages before changing shared unions.

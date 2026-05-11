# Implementation Contract

## Contract Status

Approved for implementation after evaluator review in `03-evaluator-contract-review.md`.

## Goal

Update movement rules so a monster can enter opponent dungeon tiles only through a continuous dungeon path, cannot pass through occupied monster cells, cannot step into Core, and Core damage remains available only through Attack action when in range.

## Planned Change

- Adjust movement traversal to allow any `hasDungeonTile` cell regardless of `tileOwner`.
- Keep occupied cells blocked unless the occupant is the moving monster's own starting cell.
- Keep Core cells unreachable for movement.
- Add rule tests for opponent tile movement, monster blocking, Core movement blocking, and Core attack target range.

## Non-Goals

- No UI redesign.
- No changes to summon placement.
- No changes to damage formula or attack costs.
- No new dependencies.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `src/game/rules/movement.ts` | Relax tile owner restriction while retaining dungeon/core/monster blocking | Implements requested movement rule | Low |
| `src/game/rules/gameRules.test.ts` | Add/adjust rule-level tests | Verifies requested behaviours | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| Completed previous runs only | N/A | No active conflict | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] A monster can move from its own dungeon network onto an opponent-owned dungeon tile when every step is an orthogonally adjacent dungeon tile and distance is affordable.
- [ ] A monster cannot move through another monster occupying an intermediate dungeon tile.
- [ ] A monster cannot move into a Core cell.
- [ ] Opponent Core appears as an Attack target only when the attacker is within monster range.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
# Build
npm run build

# Unit tests
npm test

# Integration tests
bash .harness/scripts/verify.sh

# Smoke test
# Not required for pure rules change; no UI behaviour changed.
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
# Not required unless rule tests reveal UI wiring impact.
```

## Rollback / Safety Notes

- Rollback is a single small movement rule change plus tests.

## Questions / Assumptions

- Assumption: Continuous dungeon path means orthogonally adjacent cells with `hasDungeonTile`, regardless of owner.
- Assumption: Core cells remain non-dungeon movement blockers; attacking Core is already handled by combat rules and will be protected by tests.

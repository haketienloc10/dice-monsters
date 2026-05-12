# Implementation Contract

## Contract Status

Approved for implementation after evaluator review in `03-evaluator-contract-review.md`.

## Goal

Cập nhật `.harness/project` với notes ngắn về luật movement/Core hiện tại và guidance kiểm chứng liên quan.

## Planned Change

- Add mechanics source-of-truth notes for movement/combat.
- Add module map details for rule boundaries and common test targets.
- Add local decision documenting movement/Core invariants.
- Optionally update validation guidance for mechanics changes.

## Non-Goals

- No application code changes.
- No Harness guide/template/script changes.
- No generated discovery rewrite.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `.harness/project/SOURCE_OF_TRUTH.md` | Add specific mechanics source notes | Helps future agents locate authoritative movement/combat behaviour | Low |
| `.harness/project/MODULE_MAP.md` | Add rule module detail | Clarifies rule boundary and tests | Low |
| `.harness/project/LOCAL_DECISIONS.md` | Record local gameplay decisions | Prevents future rule drift | Low |
| `.harness/project/VALIDATION_PROFILE.md` | Add mechanics test guidance if useful | Clarifies validation for rules-only changes | Low |
| `.harness/runs/RUN-20260512-001-update-project-context-movement-rules/**` | Record lifecycle artifacts | Required by repo workflow | Low |
| `.harness/runs/RUN_INDEX.md` | Update status | Required by repo workflow | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| Completed previous runs only | `.harness/project/*` | No active conflict | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] Project adapter documents continuous dungeon movement across owner boundaries.
- [ ] Project adapter documents monster/Core movement blockers and Core attack-by-range rule.
- [ ] Project adapter points future mechanics changes at rule tests and validation commands.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
# Build
# Not required for markdown-only project adapter change.

# Unit tests
# Not required; optional `bash .harness/scripts/verify.sh` if time permits.

# Integration tests
# Not required.

# Smoke test
# Not required.
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
# Not required.
```

## Rollback / Safety Notes

- Rollback is limited to the project adapter notes and this run artifact.

## Questions / Assumptions

- Assumption: User wants project context documentation updated, not new app behaviour.
- Assumption: Manual Notes are the right place; generated discovery blocks should remain untouched.

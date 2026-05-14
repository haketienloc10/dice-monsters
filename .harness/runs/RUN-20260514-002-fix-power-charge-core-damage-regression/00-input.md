# Run Input

## Runtime Metadata

```yaml
role: Planner
runtime_mode: codex_project_subagents_required
executor_type: subagent
executor_id: <required>
agent_runtime: <required>
agent_session_id: <required>
role_agent_name: harness_planner
role_agent_file: .codex/agents/harness-planner.toml
independence: independent
```

## Task Classification

- Classification: Normal Run
- Epic required: no
- If Epic required, normal run creation is invalid: no
- Classification guide used: `.harness/guides/RUN_CLASSIFICATION.md`

## Run ID

RUN-20260514-002-fix-power-charge-core-damage-regression

## Related Epic

None

## Source

- Manual request

## Original Request

```text
report bug:
- khi dùng tính năng power charge mà tấn công core của đối phương thì chỉ trừ 1 máu, nếu không dùng tính năng đó thì core bị trừ nhiều máu hơn
```

## Business Goal

Power Charge must not reduce damage dealt to the opponent core compared with the normal non-Power Charge attack path.

## Constraints

- Tech stack: existing repo stack only
- Deadline: current run
- Không được thay đổi: unrelated gameplay systems, broad UI redesign, Harness infrastructure outside run metadata
- Chỉ được thay đổi: source/tests/docs necessary to fix and verify the Power Charge core damage regression

## Expected Output

- Code change: fix the regression where attacking an opponent core with Power Charge deals only 1 HP while normal attacks can deal more.
- Test: add or update focused automated coverage proving Power Charge core damage is not lower than the equivalent normal core attack damage.
- Document: implementation and evaluation artifacts in this run.
- Migration:
- Other:

## Parallel / Conflict Notes

- Related runs:
- Potential conflicts:
- Branch/worktree requirement:

## Notes

- Treat reducer/rule functions as the source of truth for gameplay state. UI animations/effects must remain derived from reducer events/state.

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

RUN-20260514-001-implement-power-charge-magic-crest

## Related Epic

None

## Source

- Manual request

## Original Request

```text
Implement chức năng dùng Magic Crest cho game Dice Monsters.

Mục tiêu:

Người chơi có thể dùng 1 Magic Crest trong action phase để kích hoạt kỹ năng Magic cơ bản tên là Power Charge.

Rule yêu cầu:

- Power Charge chỉ dùng được trong action phase.
- Cost: 1 Magic Crest của current player.
- Target: 1 monster hợp lệ của current player đang ở trên board.
- Không dùng được lên monster đối phương.
- Không dùng được lên Dungeon Master.
- Không dùng được lên ô trống hoặc monster đã bị remove.
- Cùng một monster không thể có nhiều hơn 1 Power Charge active cùng lúc.
- Effect: monster được +1 ATK cho lần normal attack kế tiếp trong turn hiện tại.
- Effect hết hạn sau khi monster đó attack xong.
- Effect cũng hết hạn khi owner end turn.
- Power Charge không tự attack.
- Power Charge không bỏ qua Attack Crest.
- Khi monster có Power Charge attack monster:
  - damage undefended = ATK + 1
  - damage defended = max(0, ATK + 1 - DEF)
- Khi monster có Power Charge attack Dungeon Master:
  - Dungeon Master vẫn chỉ mất đúng 1 LP
  - không dùng ATK + 1 để tính LP damage
  - Power Charge vẫn bị consume sau attack

UI yêu cầu:

- Khi current player chọn own monster hợp lệ trong action phase, hiển thị action Power Charge.
- Action phải thể hiện cost là 1 Magic Crest.
- Nếu không đủ Magic Crest hoặc target không hợp lệ thì không cho dùng.
- UI phải hiển thị rõ monster đang có Power Charge, ví dụ badge hoặc text “+1 ATK next attack”.
- Game log phải ghi event khi dùng Power Charge và khi effect được consume.

AI yêu cầu:

- AI P2 có thể dùng Power Charge nếu nó giúp destroy enemy monster trong lượt hiện tại.
- AI không được dùng Power Charge nếu không có Magic Crest.
- AI không dùng Power Charge chỉ để attack Dungeon Master, vì Dungeon Master LP damage không tăng.
- AI phải dùng cùng rule/action path như người chơi, không mutate state trực tiếp.

Không làm trong task này:

- Không implement Trap.
- Không implement Shield.
- Không thêm nhiều magic skill khác.
- Không đổi board size.
- Không đổi rule Dungeon Master LP.
- Không refactor lớn ngoài phạm vi cần thiết cho Power Charge.
```

## Business Goal

Cho phép người chơi và AI dùng Magic Crest cho Power Charge trong action phase theo đúng rule Dice Monsters, có UI/log rõ ràng và verification bao phủ rule chính.

## Constraints

- Tech stack: existing project stack.
- Deadline: none.
- Không được thay đổi: Trap, Shield, extra magic skills, board size, Dungeon Master LP rule, large unrelated refactors.
- Chỉ được thay đổi: code/tests/UI/AI/rule paths cần thiết cho Power Charge.

## Expected Output

- Code change: implement Power Charge rule/action path, UI affordance/badge/log, AI usage through same action path.
- Test: automated tests or targeted verification covering rule, damage, expiry, UI/action availability, and AI constraints where practical.
- Document: Harness implementation/evaluation artifacts only.
- Migration: none expected.
- Other: keep changes surgical and scoped.

## Parallel / Conflict Notes

- Related runs:
- Potential conflicts:
- Branch/worktree requirement:

## Notes

Assumption: “current player” means the active turn player in the existing turn/action phase model.

# Run Input

## Run ID

RUN-20260512-001-reinstall-harness-engineering

## Related Epic

None

## Source

- Manual request

## Original Request

```text
https://github.com/haketienloc10/harness-engineering
cài lại repo trên, không clone source
```

## Business Goal

Cài lại/cập nhật Harness workflow infrastructure trong repo `dice-monsters` từ seed repo `haketienloc10/harness-engineering`, nhưng không clone source repo đó vào workspace.

## Constraints

- Tech stack: repo hiện tại là Vite + React + TypeScript; task này chỉ liên quan `.harness/` và bootstrap instructions.
- Deadline: trong lượt làm việc hiện tại.
- Không được thay đổi: application source dưới `src/`, package/runtime config.
- Chỉ được thay đổi: Harness kernel/template/script files, root Harness bootstrap `AGENTS.md`, và run artifacts của task này.

## Expected Output

- Code change: không đổi app code.
- Test: chạy verification phù hợp sau khi cài lại.
- Document: cập nhật Harness run artifacts.
- Migration: ownership-safe reinstall từ upstream Harness seed.
- Other: không dùng `git clone`; dùng bootstrap/tarball chính thức.

## Parallel / Conflict Notes

- Related runs: các run trước đã completed trong `.harness/runs/RUN_INDEX.md`.
- Potential conflicts: update `.harness/guides`, `.harness/templates`, `.harness/scripts`, `AGENTS.md`.
- Branch/worktree requirement: làm trực tiếp trên current worktree `main`.

## Notes

Upstream HEAD kiểm tra bằng `git ls-remote`: `33c3714e444c255cf2dd035d5734875e63ad4bd9`.

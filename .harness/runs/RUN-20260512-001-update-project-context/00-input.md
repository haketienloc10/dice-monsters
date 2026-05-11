# Run Input

## Run ID

RUN-20260512-001-update-project-context

## Source

- Manual request

## Original Request

```text
phân tích bối cảnh project, update thông tin .harness/project đúng theo context project hiện tại
```

## Business Goal

Cập nhật project adapter của Harness để các run sau có context đúng về stack, module, source of truth, validation và quyết định local của project hiện tại.

## Constraints

- Tech stack: React + TypeScript + Vite, Vitest.
- Deadline: current turn.
- Không được thay đổi: application source code, Harness guides/templates/scripts.
- Chỉ được thay đổi: `.harness/project/*` và run artifacts của task này.

## Expected Output

- Code change: không.
- Test: chạy verification phù hợp để xác nhận adapter ghi đúng command hiện tại.
- Document: cập nhật `.harness/project/*`.
- Migration: không.
- Other: cập nhật Harness run artifacts và run index.

## Parallel / Conflict Notes

- Related runs: `RUN-20260511-001-dungeon-dice-monsters-mvp` đã completed, tạo app hiện tại.
- Potential conflicts: thấp; chỉ sửa `.harness/project/*` và run mới.
- Branch/worktree requirement: không cần.

## Notes

Discovery generated section đã được refresh bằng `.harness/scripts/inspect-project.sh`; cần bổ sung Manual Notes để mô tả context không thể suy ra đầy đủ từ script.

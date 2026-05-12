# Run Input

## Run ID

RUN-20260512-001-update-project-context-movement-rules

## Source

- Manual request

## Original Request

```text
cập nhập thêm .harness/project
```

## Business Goal

Cập nhật project adapter để phản ánh luật movement/Core hiện tại sau thay đổi gần nhất.

## Constraints

- Tech stack:
- React + TypeScript + Vite.
- Deadline:
- Không nêu.
- Không được thay đổi:
- Không đổi application source hoặc Harness scripts/guides/templates.
- Chỉ được thay đổi:
- `.harness/project/*`, run artifact hiện tại, và `RUN_INDEX.md`.

## Expected Output

- Code change:
- Không.
- Test:
- Verification nhẹ nếu cần.
- Document:
- Có.
- Migration:
- Other:

## Parallel / Conflict Notes

- Related runs:
- `RUN-20260512-001-allow-opponent-dungeon-movement` đã completed.
- Potential conflicts:
- Thấp; chỉ sửa project adapter.
- Branch/worktree requirement:
- Không cần.

## Notes

Nội dung cần cập nhật: movement rule cho dungeon tile đối phương, monster blocking, Core movement/attack rule, và test guidance.

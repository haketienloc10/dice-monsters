# Planner Brief

## Goal

Ghi lại trong `.harness/project` các quyết định/nguồn sự thật liên quan tới movement và Core attack để agent sau không phải suy luận lại từ run trước.

## Context Summary

Run `RUN-20260512-001-allow-opponent-dungeon-movement` đã đổi rule movement: monster đi được vào dungeon tile đối phương nếu path dungeon liên tục; không đi qua monster; không bước vào Core; Core bị đánh bằng Attack action khi trong range. Project adapter hiện chưa ghi rõ luật này.

## In Scope

- Thêm notes vào project adapter về mechanics hiện tại.
- Cập nhật source/test guidance cho movement/combat rules.
- Ghi run artifact cho việc cập nhật context.

## Out of Scope

- Không đổi code trong `src/**`.
- Không chạy discovery overwrite nếu không cần.
- Không sửa Harness guides/templates/scripts.

## User / Business Flow

1. Agent đọc `.harness/project/*` trước task mechanics.
2. Agent thấy movement/combat invariants hiện tại.
3. Agent dùng đúng test area/validation khi sửa mechanics.

## Acceptance Criteria

- [ ] `.harness/project` nêu rõ movement path dùng continuous dungeon tiles không phân biệt owner.
- [ ] `.harness/project` nêu rõ monster chặn movement và Core không phải movement destination.
- [ ] `.harness/project` nêu rõ Core damage qua Attack action/range và test guidance tương ứng.

## Likely Impacted Areas

> Chỉ ghi khu vực/module nghi ngờ liên quan, không ép implementation cụ thể.

- Module:
- Project adapter docs.
- Page/API:
- Không.
- Data model:
- Không.
- Test area:
- Không thêm test; có thể chạy markdown/file inspection và optional verify.

## Parallel Work Considerations

- Can this run happen in parallel?
- Có.
- Depends on:
- Completed movement run.
- May conflict with:
- Task khác đang sửa `.harness/project/*`.
- Recommended branch/worktree:
- Không cần.

## Risks / Unknowns

- Có thể over-document nếu nhắc lại quá nhiều implementation details; giữ notes ngắn, useful cho task sau.

## Planner Notes for Generator

Không sửa generated discovery block; chỉ thêm Manual Notes.

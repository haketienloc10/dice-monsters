# Run Input

## Run ID

RUN-20260512-001-allow-opponent-dungeon-movement

## Source

- Manual request

## Original Request

```text
Cho phép đi vào dungeon tile đối phương.
Nhưng chỉ khi có đường dungeon liên tục nối tới đó.
Không được đi qua monster.
Không được bước vào Core.
Đánh Core bằng Attack action khi ở trong range.
```

## Business Goal

Movement phải hỗ trợ xâm nhập dungeon tile của đối phương đúng luật đường nối, còn Core chỉ bị tác động qua Attack action.

## Constraints

- Tech stack:
- React + TypeScript + Vite.
- Deadline:
- Không nêu.
- Không được thay đổi:
- Không đổi luật summon, UI lớn, hoặc combat ngoài phần bảo vệ hành vi Core attack.
- Chỉ được thay đổi:
- Rule movement/combat tests và code rule tối thiểu cần thiết.

## Expected Output

- Code change:
- Có.
- Test:
- Có, ưu tiên rule-level tests.
- Document:
- Harness run artifacts.
- Migration:
- Other:

## Parallel / Conflict Notes

- Related runs:
- Các run hiện có đều completed.
- Potential conflicts:
- `src/game/rules/movement.ts`, `src/game/rules/gameRules.test.ts`.
- Branch/worktree requirement:
- Không cần branch/worktree riêng.

## Notes

Assumption: "đường dungeon liên tục" là chuỗi ô orthogonal có `hasDungeonTile`, không phân biệt `tileOwner`; Core không được coi là dungeon path.

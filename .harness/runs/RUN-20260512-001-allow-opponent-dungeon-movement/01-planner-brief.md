# Planner Brief

## Goal

Cho phép monster di chuyển vào dungeon tile của đối phương khi tile đó nằm trên một đường dungeon liên tục từ vị trí hiện tại, đồng thời không cho path đi qua monster và không cho move vào Core. Core vẫn chỉ bị đánh bằng Attack action khi ở trong range.

## Context Summary

`src/game/rules/movement.ts` hiện giới hạn movement ở dungeon tile cùng `tileOwner` với monster. `src/game/rules/combat.ts` hiện đã thêm opponent Core vào valid targets nếu attacker ở trong Manhattan range. Reducer dùng `getReachableCells` để highlight và `getMovementDistance` để validate move.

## In Scope

- Movement traversal trên dungeon tile liên tục của cả hai player.
- Chặn movement qua mọi monster khác.
- Chặn movement vào Core.
- Rule-level tests cho các hành vi trên và Core attack in range.

## Out of Scope

- Không đổi luật đặt dungeon/summon.
- Không đổi UI layout hoặc copy.
- Không thêm pathfinding qua non-dungeon cells.
- Không cho movement gây damage Core.

## User / Business Flow

1. Player chọn monster của mình và vào Move mode.
2. App highlight các dungeon tile reachable qua đường dungeon liên tục, kể cả tile đối phương nếu nối liền.
3. Player dùng Attack mode để target Core khi monster ở trong range.

## Acceptance Criteria

- [ ] Movement có thể vào opponent dungeon tile nếu có path dungeon orthogonal liên tục và đủ move crest/range.
- [ ] Movement không thể đi qua ô có monster khác, kể cả để tới tile phía sau.
- [ ] Movement không thể bước vào Core.
- [ ] Opponent Core là valid attack target khi attacker ở trong range, và không là valid target khi ngoài range.

## Likely Impacted Areas

> Chỉ ghi khu vực/module nghi ngờ liên quan, không ép implementation cụ thể.

- Module:
- `src/game/rules/movement.ts`, `src/game/rules/combat.ts` tests.
- Page/API:
- Board action flow gián tiếp qua reducer hiện có.
- Data model:
- Không dự kiến đổi type/state.
- Test area:
- `src/game/rules/gameRules.test.ts`.

## Parallel Work Considerations

- Can this run happen in parallel?
- Có, nếu không có task khác sửa movement/combat rules cùng lúc.
- Depends on:
- Không.
- May conflict with:
- Task khác sửa `movement.ts` hoặc `gameRules.test.ts`.
- Recommended branch/worktree:
- Không cần.

## Risks / Unknowns

- Nếu "đường dungeon liên tục" yêu cầu cùng owner trên từng segment thì khác với request "đi vào dungeon tile đối phương"; assumption hiện tại là mọi dungeon tile nối nhau đều hợp lệ.
- Core hiện không có `hasDungeonTile`, nhưng test nên khóa rõ không được bước vào Core.

## Planner Notes for Generator

Giữ thay đổi nhỏ: movement predicate từ "own dungeon tile only" sang "any dungeon tile, not core, not occupied by another monster"; thêm tests đủ mô tả.

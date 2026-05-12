# Planner Brief

## Goal

Triển khai Player 2 do AI rule-based điều khiển, tự động chơi lượt qua các reducer actions hợp lệ, để Player 1 có thể chơi như human local game.

## Context Summary

- `GameScreen` sở hữu `useReducer` và dispatch từ UI.
- Reducer đã có action flow: `ROLL_DICE`, summon select/place/skip, select monster, move, attack, end turn.
- Rule modules đã có source of truth cho placement, movement, combat target.
- Current state chưa có `settings.controls`, và UI chưa phân biệt human/AI turn.

## In Scope

- Thêm `PlayerControl`/`GameSettings` vào state với P1 human, P2 ai mặc định.
- Thêm AI module ngoài UI để tìm legal options, score, plan đúng một next action.
- Thêm controller hook/wiring để dispatch từng AI action với delay nhỏ và hard cap.
- Disable human actions/board clicks/roll during AI turn; reset vẫn dùng được.
- Cập nhật top bar/status/log để người chơi thấy P2 là AI và AI đang hành động.
- Tests cho planner/helper/scoring trọng yếu và UI flow P2 tự kết thúc lượt.

## Out of Scope

- External AI/LLM/backend.
- Difficulty `"easy"`.
- Refactor luật game ngoài phần cần expose/reuse cho AI.
- Thay đổi balance/game data không cần thiết.

## User / Business Flow

1. P1 chơi như hiện tại.
2. Khi đến lượt P2, UI hiển thị P2 `[AI]` và AI tự roll/summon/action/end turn.
3. Sau khi AI end turn, control quay lại P1.

## Acceptance Criteria

- [ ] P2 tự roll ở roll phase, summon/skip ở summon phase, attack/move/end ở action phase.
- [ ] AI chỉ dispatch reducer actions hiện có và legality đến từ rule helpers.
- [ ] AI không lặp vô hạn; có action cap theo lượt.
- [ ] Human controls/clicks không điều khiển P2 trong AI turn.
- [ ] AI actions xuất hiện trong game log đủ dễ hiểu.
- [ ] `npm test`, `npm run build`, Harness verify pass.

## Likely Impacted Areas

> Chỉ ghi khu vực/module nghi ngờ liên quan, không ép implementation cụ thể.

- Module: `src/game/types.ts`, `src/game/initialState.ts`, `src/game/reducer.ts`, new `src/game/ai/**`.
- Page/API: `src/components/GameScreen.tsx`, `TopBar`, `ActionPanel`, `DiceTray`.
- Data model: add `settings.controls`.
- Test area: `src/game/ai/*.test.ts`, `src/components/GameScreen.test.tsx`.

## Parallel Work Considerations

- Can this run happen in parallel? Có, nếu active context run không sửa app code.
- Depends on: current reducer/rule APIs.
- May conflict with: future runs touching `GameScreen`, reducer, or types.
- Recommended branch/worktree: current worktree acceptable.

## Risks / Unknowns

- Dice rolling is random, so UI AI smoke may need deterministic assertions based on eventual P1 control rather than exact summon.
- Current reducer logs do not label AI; low-risk reducer log wording changes may affect tests.
- `SELECT_MONSTER` currently permits selecting any monster; UI gating must prevent human misuse during AI turn.

## Planner Notes for Generator

Giữ AI decision logic outside React. Reuse `isValidDungeonPlacement`, `getReachableCells`/`getMovementDistance`, and `getValidAttackTargets`. Đừng duplicate legality beyond filtering by current player/current resources.

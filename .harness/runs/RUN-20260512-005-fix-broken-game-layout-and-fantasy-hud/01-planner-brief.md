# Planner Brief

## Related Epic

None

## Goal

Sửa layout màn game để toàn bộ HUD nằm trong một viewport, body không scroll khi log dài, battle log scroll nội bộ, board vẫn là trung tâm thị giác, dice tray ở dưới, top HUD ở trên, right column cố định và có phong cách fantasy strategy rõ hơn.

## Context Summary

App là React/Vite game. `GameScreen.tsx` hiện đặt `GameLog` trong `.bottom-command-deck` bên dưới board stage; CSS dùng `.game-shell { min-height: 100vh }`, `.game-layout { height: calc(100vh - 124px) }`, và breakpoint dưới 1180 chuyển `.game-layout` thành một cột với `height: auto`. `GameLog` có `overflow: auto` nhưng parent không có row/height bounded đúng nên log và bottom deck có thể làm document dài ra. Log state hiện được cap 20 trong `src/game/rules/board.ts`.

## In Scope

- Refactor top-level game screen markup thành shell có top HUD, main layout, bottom HUD.
- Chuyển hoặc ràng buộc battle log vào panel có height bounded và scroll nội bộ.
- Cập nhật CSS viewport root: `html`, `body`, `#root` height 100%, overflow hidden; `.game-shell` grid rows fixed/flexible/fixed.
- Giữ board central/dominant với bounded board frame/grid.
- Compact dice tray và crest bar trong bottom HUD.
- Polish top HUD, right sidebar, panel borders/glow theo fantasy 2D strategy reference.
- Cap log entries latest 30.

## Out of Scope

- Không đổi luật chơi, AI planner/controller, dice/summon/move/attack legality.
- Không xóa P2 AI, battle log, hoặc animation.
- Không thêm routing, backend, hoặc dependency lớn.

## User / Business Flow

1. Người chơi mở app và thấy một màn game vừa viewport với top HUD, board giữa, side panels, bottom dice/crest HUD.
2. Người chơi/P2 AI tạo nhiều log entries; chỉ battle log panel scroll, page body không scroll.
3. Người chơi vẫn roll, summon, move, attack, end turn/reset/game over như trước.

## Acceptance Criteria

- [ ] Body/page không scroll trong gameplay desktop bình thường.
- [ ] Battle log scroll nội bộ, không đẩy board, top HUD, right column, hoặc bottom HUD.
- [ ] Board vẫn lớn, visible, đúng aspect ratio và không bị dice tray che.
- [ ] Top HUD có blue/red/gold styling, P2 vẫn hiển thị `[AI]`, current player highlighted.
- [ ] Dice tray compact, crest counters giống resource badges, right panel giống game sidebar.
- [ ] Roll/summon/move/attack/P2 AI/game log/game over/animations vẫn hoạt động.
- [ ] `npm run build` pass và không có TypeScript errors.

## Likely Impacted Areas

> Chỉ ghi khu vực/module nghi ngờ liên quan, không ép implementation cụ thể.

- Module: `src/components/GameScreen.tsx`, `GameLog.tsx`, optional panel components if needed.
- Page/API: main game screen only.
- Data model: no gameplay model change; only log cap in helper if changed.
- Test area: existing component tests, browser/manual smoke, build.

## Parallel Work Considerations

- Can this run happen in parallel? Yes, if no other active UI runs touch same CSS/components.
- Depends on: current React/CSS structure.
- May conflict with: any active run editing `src/styles/*` or `src/components/GameScreen.tsx`.
- Recommended branch/worktree: current worktree is acceptable; active run index shows only this run as active.

## Risks / Unknowns

- Browser-level manual verification may be limited by available automation, but app should be run and inspected if possible.
- Some viewport widths below desktop may be impractical; acceptable to show a desktop optimization warning for very small screens.

## Planner Notes for Generator

Keep changes narrowly UI-focused. Avoid modifying game rules except the existing log retention helper. Preserve animation elements as absolute overlays and ensure all grid/flex children with scrollable content have `min-height: 0` / `min-width: 0`.

# Epic Overview

## Goal

Nâng UI game Dice Monsters thành màn hình chiến thuật fantasy 2D hoàn chỉnh: HUD ornate, dungeon board tối, hai phe xanh/đỏ, core phát sáng, monster token, dice tray, crest bar, feedback animation và game-over overlay.

## Non-Goals

- Không đổi luật gameplay hoặc AI strategy.
- Không dùng asset/logo/name chính thức hoặc copied artwork.
- Không thay reducer bằng UI state ad-hoc.

## Scope

- Layout full-viewport bằng CSS Grid.
- Board/cell/core/monster visual polish.
- Dice roll, summon, movement, attack, damage, phase, crest animation.
- Giữ reducer/rules là source of truth; UI chỉ dispatch action hợp lệ.

## Status

Completed by `RUN-20260512-002-polished-fantasy-ui-foundation`.

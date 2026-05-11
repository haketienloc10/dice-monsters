# Run Input

## Run ID

RUN-20260511-001-dungeon-dice-monsters-mvp

## Source

- Manual request

## Original Request

```text
Implement a real playable browser MVP inspired by Dungeon Dice Monsters, without official Yu-Gi-Oh! assets/names/logos. The MVP must include a tactical board, two players, cores, dice rolling, crest resources, summon candidates, dungeon tile shape placement with rotations, monster summoning, monster selection, movement on owned dungeon tiles, combat against monsters/cores, turn switching, game over, log, and polished fantasy strategy UI. Use existing project stack if present; otherwise React + TypeScript + Vite. Run npm install, npm run build, npm run dev, and add tests if setup exists.
```

## Business Goal

Tạo một game screen thật sự chơi được cho local hotseat 2-player, ưu tiên gameplay rõ ràng và trạng thái thật hơn mockup tĩnh.

## Constraints

- Tech stack: repo chưa có stack; dùng React, TypeScript, Vite, CSS thường.
- Deadline: trong current task.
- Không được thay đổi: official copyrighted assets/names/logos; không thêm backend, online multiplayer, deck builder, AI bot.
- Chỉ được thay đổi: scaffold app mới, source game/UI, config/build files, Harness run artifacts liên quan.

## Expected Output

- Code change: playable app với state machine/rules/components.
- Test: thêm unit tests nếu test tooling nhẹ phù hợp; tối thiểu `npm run build` pass.
- Document: Harness run artifacts và final summary.
- Migration: none.
- Other: chạy dev server nếu khả thi để user thử.

## Parallel / Conflict Notes

- Related runs: none observed.
- Potential conflicts: repo đang có Harness files uncommitted từ trước; không chỉnh guides/templates/scripts.
- Branch/worktree requirement: không cần worktree riêng vì app source chưa tồn tại.

## Notes

- Vì repo gần như trống, implementation sẽ scaffold mới thay vì sửa app hiện có.

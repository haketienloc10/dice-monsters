# Run Input

## Run ID

RUN-20260512-001-add-ai-controlled-player-2

## Source

- Manual request

## Original Request

```text
Add AI-controlled Player 2. Player 1 remains human-controlled. Player 2 should automatically roll, summon from legal candidates, place legal dungeon shapes, move through legal connected dungeon tiles, attack valid targets, spend crests normally, and end turn normally. AI must not directly mutate game state and must dispatch the same game actions as the UI. Add settings.controls with P1 human and P2 ai by default. Put AI logic mostly outside React components, return one planned action at a time, use small delays, prevent infinite loops with lightweight turn memory/action cap, show P2 as AI, show "AI is thinking...", disable human controls/clicks during AI turn, log AI actions, and add tests/build verification.
```

## Business Goal

Một người chơi có thể chơi local match với P2 do AI điều khiển, trong khi toàn bộ luật hiện có vẫn do reducer/rule system thực thi.

## Constraints

- Tech stack: React 19 + TypeScript + Vite + Vitest.
- Deadline: current turn.
- Không được thay đổi: không dùng backend, không dùng external AI API, không mutate state trực tiếp, không bypass reducer/rules.
- Chỉ được thay đổi: game domain/UI/tests và Harness artifacts của run này.

## Expected Output

- Code change: P2 AI controller/planner/scoring/helpers, settings controls, UI gating/status/log support.
- Test: unit tests cho AI planning/scoring/legal helper behaviour và UI smoke cho P2 auto-turn.
- Document: Harness run artifacts.
- Migration:
- Other: build/test verification.

## Parallel / Conflict Notes

- Related runs: `RUN-20260512-001-update-project-context-movement-rules` đang `implementing`, chỉ liên quan Harness project docs/run artifacts theo quan sát.
- Potential conflicts: `RUN_INDEX.md` đang có thay đổi sẵn; run này chỉ update thêm dòng/status của chính nó.
- Branch/worktree requirement: dùng current worktree `main`; không cần worktree riêng vì application files không overlap với active context run.

## Notes

Optional difficulty levels bị loại khỏi MVP để tránh tăng scope.

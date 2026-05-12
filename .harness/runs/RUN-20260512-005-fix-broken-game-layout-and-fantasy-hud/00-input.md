# Run Input

## Run ID

RUN-20260512-005-fix-broken-game-layout-and-fantasy-hud

## Related Epic

None

## Source

- Manual request

## Original Request

```text
Fix the broken game layout where battle log growth makes the whole page scroll and pushes the board/dice/HUD out of proportion.
Refactor the game screen into a strict viewport-based HUD using CSS Grid:
top player HUD, middle left/board/right layout, and bounded bottom dice/crest HUD.
Battle log must remain visible but scroll only inside its own panel, newest entries visible, and log state should be capped around 20-30 entries.
Keep gameplay rules, P2 AI, battle log, game over, and existing animations. Improve the fantasy 2D strategy game look with large central board, blue/red/gold top HUD, right monster/actions/tile/log panel, compact bottom dice tray and crest counters.
Verification requires build, no TypeScript/runtime errors, and manual/browser check that 20+ log entries do not create body scroll.
```

## Business Goal

Màn chơi phải hoạt động như một game HUD trong một viewport duy nhất, không như trang web dài bị battle log kéo giãn.

## Constraints

- Tech stack: Vite + React + TypeScript + CSS.
- Deadline: current turn.
- Không được thay đổi: gameplay rules, P2 AI, battle log visibility, reducer-driven flow, existing animation behavior.
- Chỉ được thay đổi: UI composition/styling and safe log capacity cap.

## Expected Output

- Code change: viewport grid layout, bounded right-column log, compact bottom HUD, visual polish.
- Test: `npm run build`; browser/manual check if feasible.
- Document: Harness run artifacts.
- Migration: none.
- Other: final report in requested summary format.

## Parallel / Conflict Notes

- Related runs: previous UI polish runs are completed.
- Potential conflicts: none active in RUN_INDEX besides this run.
- Branch/worktree requirement: not required.

## Notes

Manual request is UI-heavy; verification should include browser-level evidence where possible.

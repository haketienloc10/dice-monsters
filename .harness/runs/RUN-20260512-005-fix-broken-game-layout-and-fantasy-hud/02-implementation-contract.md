# Implementation Contract

## Contract Status

Approved

## Goal

Implement a viewport-locked game HUD layout that prevents battle log growth from creating body scroll, while improving fantasy game styling and preserving gameplay/AI.

## Planned Change

- Change `GameScreen.tsx` structure to `game-root > game-shell > top-hud/top-bar, main-layout, bottom-hud`.
- Put left player core panels in `.left-column`, board in `.board-area`, right sidebar cards plus `GameLog` in `.right-column`, and dice tray/crest bar in `.bottom-hud`.
- Update `GameLog.tsx` markup to use `battle-log-panel`, fixed header, and `.battle-log-list` scroll container.
- Update CSS root and layout rules to `height: 100%`, `overflow: hidden`, strict grid rows, bounded columns, and `min-height: 0`/`min-width: 0`.
- Resize board/grid CSS so board fills available center without content-driven height.
- Compact dice tray/crest resource strip; reduce unused vertical blanks.
- Update `addLog` retention from latest 20 to latest 30 entries.

## Non-Goals

- No gameplay rule changes beyond log retention length.
- No removal of P2 AI, log, HUD panels, game over, or animation features.
- No broad component rewrite unrelated to layout.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `src/components/GameScreen.tsx` | Recompose top/main/bottom layout and move log to right column | Create bounded viewport HUD | Medium |
| `src/components/GameLog.tsx` | Add header/list classes for internal scroll | Prevent log from resizing parent/page | Low |
| `src/game/rules/board.ts` | Cap log at 30 entries | Keep latest entries bounded | Low |
| `src/styles/globals.css` | Root viewport height/overflow | Stop body scroll | Medium |
| `src/styles/layout.css` | Strict grid shell/main/bottom/right layout | Primary layout fix | Medium |
| `src/styles/hud.css` | Compact panels/dice/crest/log styling | Visual match and internal scroll | Medium |
| `src/styles/board.css` | Board frame/grid bounded dominance | Keep board central/fill available area | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| None active beyond current run | n/a | No active overlap | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] Browser body/document does not scroll during normal desktop gameplay.
- [ ] Battle log remains visible, is capped to latest 30 entries, and scrolls only inside its own panel.
- [ ] Board, top HUD, right column, and bottom HUD remain fixed in their viewport layout as logs grow.
- [ ] Board is visually dominant, centered, aspect-ratio preserving, with visible tiles/cores/tokens/highlights.
- [ ] Dice tray and crest resources are compact bottom HUD elements.
- [ ] Roll, summon, move, attack, end turn, reset/game over, P2 AI, and visual effects remain functional.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
# Build
npm run build

# Unit tests
npm run test

# Integration tests
# covered by existing Vitest component/game tests

# Smoke test
npm run dev
APP_URL=http://localhost:5173 bash .harness/scripts/smoke.sh
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
# Start app
npm run dev

# Check endpoint/page
Open http://localhost:5173
Generate or play enough actions for 20+ battle log entries.
Confirm document.body/client scrollHeight does not exceed viewport and only `.battle-log-list` scrolls.
```

## Rollback / Safety Notes

- All changes are UI/CSS plus bounded log retention. Revert touched files if layout regression is severe.

## Questions / Assumptions

- Assumption 1: Desktop viewport around >= 1280px is the primary target.
- Assumption 2: Moving log from bottom deck into right column is acceptable and preferred by user request.

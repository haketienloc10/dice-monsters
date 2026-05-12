# Implementation Contract

## Contract Status

Approved

## Goal

Deepen the existing fantasy UI foundation into a more polished tactical board-game screen while preserving all gameplay rules and reducer-driven state transitions.

## Planned Change

- Enrich top HUD player panels with emblems, HP framing, dice/crest summary, current-player highlighting, and AI status.
- Improve board frame/cell textures, ownership glow, core base visuals, monster token standee depth, selection/reachable/attackable/placement readability, and effect overlays.
- Upgrade bottom HUD: dice tray as three large dice, clearer roll affordance, stronger crest jewel bar, compact battle feed.
- Upgrade side panel/action controls with card-like monster info, stat rows, skill/status badges, and command buttons that feel like fantasy game UI.
- Tune responsive layout and animations without changing game logic.

## Non-Goals

- No reducer/rule/AI behaviour rewrite.
- No new asset pipeline or official copyrighted assets.
- No heavy animation/test dependency.
- No unrelated refactor.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `src/components/TopBar.tsx` | richer HUD markup | match fantasy banner target | Low |
| `src/components/DiceTray.tsx` | dice tray markup and final-face display hooks | polished dice experience | Low |
| `src/components/ActionPanel.tsx` | action labels/states/classes | better commands and lock feedback | Medium |
| `src/components/MonsterInfoPanel.tsx` | richer card markup | selected monster card polish | Low |
| `src/components/MonsterToken.tsx` | token visual hooks | standee/token polish | Low |
| `src/components/CrestBar.tsx` | jewel crest markup | readable crest resources | Low |
| `src/components/GameLog.tsx` | feed icon classes and compact entries | battle feed polish | Low |
| `src/components/CoreBase.tsx` | core base visual hooks | glowing heart/core target | Low |
| `src/styles/*` | theme/layout/board/HUD/animation polish | main visual upgrade | Medium |
| `src/components/GameScreen.test.tsx` | only if labels change | keep smoke tests passing | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| None active | N/A | No active incomplete runs found | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] UI remains playable and dispatches only existing legal `GameAction` values.
- [ ] Animation locks prevent duplicate roll/move/attack/summon clicks while visual feedback is active.
- [ ] AI turns visibly disable human controls and show thinking/action feedback.
- [ ] Dice final faces always match `state.latestRoll`.
- [ ] Damage, core hit, death, summon, move, and attack effects are triggered from `state.lastEvent`.
- [ ] Game over overlay and reset remain functional.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
npm run test
npm run build
bash .harness/scripts/verify.sh
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
npm run dev
APP_URL=http://127.0.0.1:5173 bash .harness/scripts/smoke.sh
```

Manual flow: render game, roll dice, summon if available, move/attack when available, end turn, watch P2 AI act, verify core/game-over feedback if reached.

## Rollback / Safety Notes

- Most changes are presentational. Revert specific component/CSS edits if they break tests or layout.
- Do not revert unrelated worktree changes.

## Questions / Assumptions

- Assumption: prior `lastEvent` metadata is sufficient for action effects.
- Assumption: original symbol/emoji/CSS visuals are acceptable as non-official placeholder art when heavily styled.

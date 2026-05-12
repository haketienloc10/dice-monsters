# Implementation Contract

## Contract Status

Approved

## Goal

Upgrade the current playable UI into a polished 2D fantasy tactical board-game screen with lightweight action feedback while preserving existing game rules and reducer-driven actions.

## Planned Change

- Add UI-observable `lastEvent` metadata for legal reducer actions: roll, summon, move, attack, turn end.
- Update `GameScreen` to maintain a visual effect queue, animation lock, phase banner, AI status, and game-over overlay.
- Replace rough board/core/monster rendering with fantasy-styled components.
- Upgrade top HUD, side panel, bottom dice tray, crest bar, action buttons, monster card, and log presentation.
- Reorganize CSS into readable theme/layout/board/hud/animation files imported by `game.css`.

## Non-Goals

- Change legal movement, summon, combat, dice, AI planning, or turn rules.
- Use external image assets or official/copied fantasy franchise content.
- Add a new heavy animation or e2e dependency.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `src/game/types.ts` | Add observational `GameEvent`/`lastEvent` types | Let UI animate actual completed reducer actions | Low |
| `src/game/reducer.ts` | Populate `lastEvent` on legal actions | Action effects need reliable metadata | Medium |
| `src/components/GameScreen.tsx` | Layout/effect orchestration and duplicate input lock | Central UI state owner | Medium |
| `src/components/Board*.tsx` | Board, cell, token, core rendering | Main visual upgrade | Medium |
| `src/components/*Panel*.tsx`, `TopBar`, `DiceTray`, `CrestBar`, `GameLog` | HUD polish and improved presentation | User-visible polish | Medium |
| `src/styles/*` | Theme/layout/board/hud/animation CSS | Organized visual system | Medium |
| Existing tests if needed | Adjust accessible names/text expectations only if broken by UI copy | Keep smoke tests current | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| None active | N/A | No incomplete run found | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] Behaviour 1: Game renders as a full viewport fantasy tactical layout with top HUD, board stage, right info/actions panel, and bottom dice/log area.
- [ ] Behaviour 2: Board cells show distinct empty, dungeon, P1/P2, selected, reachable, attackable, and placement preview states.
- [ ] Behaviour 3: Core bases and monsters render as styled fantasy tokens with readable HP/level/owner indicators.
- [ ] Behaviour 4: Rolling dice dispatches the existing `ROLL_DICE`, plays a visual roll, and final die faces match `state.latestRoll`.
- [ ] Behaviour 5: Summon, move, attack, damage, core hit, phase, crest, and death/game-over feedback are shown from reducer events/effects.
- [ ] Behaviour 6: Human controls are disabled during AI turn and during short animation locks for roll/move/attack/summon.
- [ ] Behaviour 7: Existing tests/build pass without gameplay rule regressions.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
npm run test
npm run build
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
npm run dev -- --host 127.0.0.1
APP_URL=http://127.0.0.1:5173 bash .harness/scripts/smoke.sh
```

Manual browser checks:

- Start screen loads polished UI.
- Roll dice and observe animation/final results.
- Select summon candidate, placement preview, place monster.
- Move and attack when legal.
- End turn; P2 AI shows thinking and acts.
- Core hit/game-over overlay appears when applicable.

## Rollback / Safety Notes

- Since rules must remain unchanged, any failing rule/AI test after UI polish indicates a bug to fix or revert.
- `lastEvent` must be treated as display metadata only.

## Questions / Assumptions

- Assumption 1: Existing simplified rules are the intended rules to preserve.
- Assumption 2: CSS/emoji/lucide-based original tokens are acceptable because no asset pipeline was requested.

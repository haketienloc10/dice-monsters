# Planner Brief

## Goal

Build một browser-based playable MVP cho tactical dice-and-dungeon board game local hotseat 2-player: roll dice, gain crest resources, summon monsters by placing dungeon tile shapes, move on owned dungeon tiles, attack enemy monsters/cores, end game when a core reaches 0 HP.

## Context Summary

Repo hiện chỉ có README và Harness adapter. Không có Node/Vite app hiện hữu. User đã cho yêu cầu chi tiết về data model, flows, UI, acceptance criteria, và verification.

## In Scope

- Scaffold React + TypeScript + Vite app tối thiểu.
- Define game types, data, initial state, and rule functions outside JSX where practical.
- Implement reducer/state flow for roll, summon, placement, select, move, attack, end turn, reset/game over.
- Render full game UI: top bar, board, dice tray, crest bar, action panel, monster info, player core panels, tile preview, log.
- Use original monster names/data from request only.
- Add lightweight unit tests if test tooling can be added without heavy dependency.
- Verify with build and runtime smoke/manual browser check where possible.

## Out of Scope

- Online multiplayer, backend, AI bot, deck builder.
- Official Yu-Gi-Oh! assets, logos, characters, copied art.
- Perfect artwork or complex animations.
- Advanced rules beyond MVP, such as enemy tile traversal, defense/trap/magic effects, full DDM rules parity.

## User / Business Flow

1. Player starts on P1 roll phase, rolls 3 dice, gains non-summon crests, and sees summon candidates if at least 2 summon faces appear.
2. Player can select/skip summon; if selecting, board previews shape placement and valid click creates owned tiles plus monster.
3. During action phase, player selects own monsters, moves with move crests, attacks with attack crests, or ends turn.
4. Players alternate until a core is reduced to 0 HP and game over is shown.

## Acceptance Criteria

- [ ] App starts with visible board, cores, top bar, dice tray, crest bar, action panel, monster info area, and log.
- [ ] Roll dice flow updates dice tray, crest pool, summon candidates, and phase.
- [ ] Summon flow validates dungeon placement, creates tiles, summons monster, and rejects invalid placements.
- [ ] Movement flow highlights BFS reachable owned dungeon tiles and deducts move crests by distance.
- [ ] Combat flow highlights valid targets, applies damage, deducts attack crest, removes destroyed monsters, damages core, and sets winner.
- [ ] End turn switches player, resets phase to roll, resets current player attack flags, and supports both players hotseat.
- [ ] UI states make current player/phase/selection/reachable/attackable/placement validity obvious.
- [ ] Core game rules are separated from React components.
- [ ] `npm run build` passes without TypeScript errors.

## Likely Impacted Areas

- Module: new `src/game/**` rules/data/state.
- Page/API: new React app entry and game screen components.
- Data model: new TS types and static monster/dice/tile data.
- Test area: new lightweight unit tests if configured.

## Parallel Work Considerations

- Can this run happen in parallel? Yes, because no app source exists.
- Depends on: Harness run lifecycle only.
- May conflict with: future scaffold edits to `src/**`/package files.
- Recommended branch/worktree: current worktree is acceptable.

## Risks / Unknowns

- Exact UI smoke tooling may be unavailable; use Vite dev server plus curl/manual DOM checks if no Playwright exists.
- Random dice can make summon unavailable in a particular roll; gameplay still supports skip/action flow.
- Adding test tooling introduces dependency overhead; keep it to Vite-native/Vitest if used.

## Planner Notes for Generator

Ưu tiên playable core loop, không overbuild. Nếu phải chọn, gameplay correctness and build pass hơn visual polish.

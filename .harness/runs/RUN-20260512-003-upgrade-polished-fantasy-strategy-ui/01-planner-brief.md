# Planner Brief

## Related Epic

None

## Goal

Make the current React/TypeScript game screen feel closer to the supplied polished 2D fantasy tactical board mockup: ornate match HUD, board-dominant dungeon arena, readable blue/red player identity, richer dice tray, better monster/card presentation, stronger action feedback, and browser-ready responsive polish.

## Context Summary

The previous completed UI foundation already added a CSS-organized fantasy layout, `lastEvent` reducer metadata, and a UI-level effect queue. This run should deepen polish and fill visual gaps without duplicating architecture or changing game mechanics.

## In Scope

- Improve existing component markup for richer HUD, dice, monster card, log, and board visual hooks.
- Refine `theme.css`, `layout.css`, `board.css`, `hud.css`, and `animations.css`.
- Preserve and tune existing UI-only animation lock/effect behaviour.
- Update smoke tests only if accessible labels/text need minor adjustment.

## Out of Scope

- Rewriting reducer/rules/AI.
- Adding official Yu-Gi-Oh! assets, names, logos, or copied artwork.
- Adding heavy animation or E2E dependencies.
- Building a static mockup or a new game mode.

## User / Business Flow

1. Player opens the app and immediately sees a polished fantasy tactical board.
2. Player rolls dice, sees animated dice and crest resources.
3. Player summons, moves, attacks, damages cores/monsters, and sees feedback reflecting actual reducer events.
4. P2 AI acts legally with visible thinking/action feedback, then control returns to P1.

## Acceptance Criteria

- [ ] Game fills the browser viewport cleanly and board remains visually dominant.
- [ ] Top HUD, side panel, bottom HUD, dice tray, crest bar, action buttons, monster info, game log, core bases, and board cells feel cohesive and polished.
- [ ] Selected/reachable/attackable/placement states remain obvious and accessible.
- [ ] Dice, summon, movement, attack, damage, death, core hit, phase, and crest animations remain UI-only reflections of game state.
- [ ] Roll/summon/place/move/attack/end turn/AI/game over/reset behaviours still work.
- [ ] `npm run test` and `npm run build` pass.

## Likely Impacted Areas

- Module: `src/components/*`
- Styling: `src/styles/*`
- Data model: none expected beyond existing `lastEvent`.
- Test area: `src/components/GameScreen.test.tsx` only if text/labels change.

## Parallel Work Considerations

- Can this run happen in parallel? Yes, no active incomplete run was found.
- Depends on: completed UI foundation run.
- May conflict with: future UI work touching same component/style files.
- Recommended branch/worktree: current worktree is acceptable.

## Risks / Unknowns

- CSS overflow or cramped desktop/mobile layout.
- Text changes could break existing RTL queries.
- Current dependency set has no browser automation package; runtime visual checks may rely on Vite smoke/manual inspection.

## Planner Notes for Generator

Keep reducer/rules authoritative. Prefer visual hooks, CSS, and component-level presentational changes. Avoid unrelated refactors.

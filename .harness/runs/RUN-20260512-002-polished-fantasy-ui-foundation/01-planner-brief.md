# Planner Brief

## Related Epic

EPIC-20260512-001-polished-fantasy-ui

## Goal

Deliver the first complete UI/effects pass that makes the current playable game feel like a polished 2D fantasy tactical board game while preserving all reducer-driven mechanics.

## Context Summary

The app is a Vite + React + TypeScript game. `GameScreen.tsx` owns `useReducer(gameReducer, createInitialState)`, `useAIController()` dispatches delayed AI actions, and UI components dispatch typed actions. Existing UI is functional but visually prototype-like.

## In Scope

- Full-screen fantasy layout using existing component boundaries plus small new components if helpful.
- Board/cell/core/monster visual polish.
- Dice tray, crest bar, action panel, monster info, game log, phase/game-over feedback.
- Lightweight event metadata/effects to animate completed reducer actions without changing rules.
- Duplicate-action prevention while key visual animations are active.

## Out of Scope

- Rewriting game rules, AI planner, or reducer semantics.
- Adding heavy dependencies.
- Adding copyrighted/offical assets.
- Creating a marketing/landing page.

## User / Business Flow

1. Player opens the game and sees a full fantasy tactical board-game screen.
2. P1 rolls, summons, moves, attacks, and ends turn with clear feedback.
3. P2 AI acts automatically with visible thinking and action feedback.
4. Core damage and game over are visible and readable.

## Acceptance Criteria

- [ ] AC1: Visual layout is polished and fills viewport.
- [ ] AC2: Board, cells, dungeon tiles, core bases, and monster tokens are no longer plain squares/text.
- [ ] AC3: Dice, crest, phase, summon, movement, attack, damage, core hit, and death/game-over feedback exist.
- [ ] AC4: Existing actions still work and remain reducer-driven.
- [ ] AC5: Human controls are disabled during AI turn and duplicate animation clicks are guarded.
- [ ] AC6: `npm run build` passes.

## Likely Impacted Areas

- Module: `src/components/*`
- Styling: `src/styles/*`
- Data model: optional `lastEvent` metadata in `src/game/types.ts`
- Reducer: optional metadata emission in `src/game/reducer.ts`
- Test area: existing `src/components/GameScreen.test.tsx`, `src/game/*/*.test.ts`

## Parallel Work Considerations

- Can this run happen in parallel? Yes, but no active incomplete runs exist.
- Depends on: current reducer/UI architecture.
- May conflict with: any future UI refactor touching `src/components` or `src/styles`.
- Recommended branch/worktree: current clean worktree is acceptable.

## Risks / Unknowns

- Browser-level verification may be limited to dev-server smoke if no e2e tooling exists.
- Animation metadata should not become gameplay authority.
- CSS must remain maintainable despite a broad visual pass.

## Planner Notes for Generator

Prefer small components and CSS organization over a total rewrite. If reducer changes are needed, add only observational event metadata after successful legal actions.

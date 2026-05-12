# Project Context

Last reviewed: 2026-05-12

## Product Context

`dice-monsters` is a desktop-oriented tactical browser game inspired by dice, crests, dungeon tile placement, monster movement, and combat. The current implementation supports a human P1 against an automated P2 AI.

## User-Facing Flow

Observed flow from `src/components/GameScreen.tsx`, `src/game/reducer.ts`, and `e2e/game.spec.ts`:

1. P1 starts in roll phase as Blue Warden.
2. Player rolls dice.
3. If summon candidates exist, player may select a die and place a dungeon shape.
4. Player can move or attack with summoned monsters during action phase.
5. Player ends turn.
6. P2 AI acts automatically as Crimson Overlord.
7. Game ends when a player's Heart Core reaches 0 HP.

## Game Concepts

- Board size is 13 by 9 (`src/game/constants.ts`).
- P1 core starts at `(0,4)` and P2 core starts at `(12,4)` (`src/game/initialState.ts`).
- Core HP is 10 (`src/game/constants.ts`).
- Crests include summon, move, attack, defense, magic, and trap (`src/game/constants.ts`).
- Monster, dice, and tile shape data are static TypeScript data files under `src/game/data/`.

## External Systems

No backend, database, network API, auth system, or runtime infrastructure was observed. The app appears to be a client-only Vite application.

## Important Docs

- `README.md` currently contains only the project title.
- Harness workflow docs live under `.harness/` and are workflow infrastructure, not app source.

## Confidence

High confidence for stack, entrypoints, and current gameplay loop because the facts are directly backed by source files and tests. Lower confidence for product roadmap or intended long-term rules because no detailed design document was found.

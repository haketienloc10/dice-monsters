# Project Context

Last reviewed: 2026-05-12

## Product Context

`dice-monsters` is a turn-based dungeon board game UI. The current game flow supports P1 as a human-controlled "Blue Warden" and P2 as an AI-controlled "Crimson Overlord".

Evidence:

- `src/game/initialState.ts` creates a 13 by 9 board, places P1 and P2 cores, starts P1 in `roll` phase, and configures P2 as `ai`.
- `src/components/GameScreen.tsx` shows board interaction, dice rolling, summon placement, movement, attacks, game log, and game-over overlay.
- `e2e/game.spec.ts` verifies P1 roll, P2 AI thinking state, and return to P1 control.

## Core User Flows

- Roll dice during `roll` phase.
- Select summon candidates during `summon` phase and place dungeon tile shapes.
- Move and attack with summoned monsters during `action` phase.
- End turn and allow P2 AI to execute its turn.
- Win by damaging the opponent core until game over.

## Domain Model

- Players: `P1` and `P2`.
- Board: 13 by 9 grid with dungeon tiles, monster positions, and player cores.
- Phases: `roll`, `summon`, `action`, `gameOver`.
- Crests: `summon`, `move`, `attack`, `defense`, `magic`, `trap`.
- Game entities: dice definitions, monster definitions, tile shapes, monster instances, attack targets, and game events.

## External Systems

No backend API, database, or external service integration is evident in the current source. The app appears to be fully client-side.

## Documentation State

`README.md` currently only contains the project title, so source code and tests are the primary evidence for project behavior.

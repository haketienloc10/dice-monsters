# Project Glossary

Last reviewed: 2026-05-12

## Terms

- AI: automated player controller, currently used by P2.
- Blue Warden: P1 player name in initial state.
- Board: 13 by 9 dungeon grid.
- Core / Heart Core: player base with HP; destroying the opposing core wins the game.
- Crest: resource/result type from dice faces; current types are summon, move, attack, defense, magic, and trap.
- Crimson Overlord: P2 player name in initial state.
- DiceDefinition: static die data containing faces, monster link, level, and tile shape.
- Dungeon tile: placed tile cell used for summoning and movement paths.
- GameAction: reducer command union in `src/game/types.ts`.
- GameEvent: event emitted by reducer for logs and visual effects.
- GamePhase: roll, summon, action, or gameOver.
- MonsterDefinition: static monster stats and descriptive text.
- MonsterInstance: runtime monster on the board.
- TileShape: static list of offsets used when placing dungeon shapes.

## Abbreviations

- E2E: end-to-end browser test via Playwright.
- HP: hit points.
- P1: human-controlled Blue Warden by default.
- P2: AI-controlled Crimson Overlord by default.

# Project Glossary

Synced at: `2026-05-14T00:22:45+07:00`

## Terms

- `PlayerId`: `"P1"` or `"P2"`.
- `PlayerControl`: `"human"` or `"ai"`.
- `GamePhase`: `"roll"`, `"summon"`, `"action"`, or `"gameOver"`.
- `CrestType`: resource type from dice faces: `summon`, `move`, `attack`, `defense`, `magic`, `trap`.
- `CrestPool`: per-player resource counts by `CrestType`.
- `DiceDefinition`: static die config linking faces, summon level, monster, and tile shape.
- `RollResult`: one rolled die face plus associated die/monster/tile metadata.
- `TileShape`: dungeon tile offsets used when summoning.
- `BoardCell`: one board square, including dungeon tile, monster, and core ownership metadata.
- `MonsterDefinition`: static monster stats.
- `MonsterInstance`: summoned monster state on the board.
- `AttackTarget`: target union for monster or core attacks.
- `InteractionMode`: UI intent state: `none`, `placing`, `moving`, or `attacking`.

## Domain Labels

- `Blue Warden`: default `P1` display name.
- `Crimson Overlord`: default `P2` display name.
- `Dungeon Stock`: UI label for summon candidate/turn command state.
- `Heart Core`: core health objective referenced in game-over UI.

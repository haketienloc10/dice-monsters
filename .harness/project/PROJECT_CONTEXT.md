# Project Context

Synced at: `2026-05-14T00:22:45+07:00`

## Product Surface

The app is a playable single-screen board game UI. `GameScreen` composes the board, player core panels, action controls, dice tray, crest bar, monster info, tile preview, and game log.

## Gameplay Model

- Players are `P1` and `P2`; default names are `Blue Warden` and `Crimson Overlord`.
- Default controls are `P1: human` and `P2: ai`.
- Game phases are `roll`, `summon`, `action`, and `gameOver`.
- Dice rolls produce crest resources and possible summon candidates.
- Dungeon tile placement, movement, combat, turn handling, and AI planning are implemented as TypeScript modules under `src/game/`.

## User-Facing Flow

- Player starts in roll phase.
- Player rolls dice, may summon if eligible, acts with available crests, then ends turn.
- AI actions are scheduled through `useAIController` during AI turns.
- Game ends when a core is defeated.

## Existing Context Preserved

- Older adapter files in `.harness/project/` are preserved as local context:
  - `PROJECT_MAP.md`
  - `STACK_PROFILE.md`
  - `VALIDATION_PROFILE.md`
  - `SOURCE_OF_TRUTH.md`
  - `MODULE_MAP.md`
  - `LOCAL_DECISIONS.md`
- `AGENTS.harness.md` was referenced by the IDE context but is not present in this workspace.

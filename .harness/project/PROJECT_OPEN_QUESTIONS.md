# Project Open Questions

Last reviewed: 2026-05-12

## Open Questions

- Should rules intentionally follow a specific Dungeon Dice Monsters rule set, or is this an original simplified adaptation?
- Are `defense`, `magic`, and `trap` crests planned mechanics, or placeholder resource types for later work?
- Should there be a persistent game setup screen to choose human/AI controls, or is `P1 human` vs `P2 AI` the intended default for now?
- Is browser-level verification expected for every UI task, and should a dedicated e2e test suite be added?

## Current Assumptions

- `package.json` is the source of truth for available verification commands.
- Tests under `src/` are the best executable evidence for current rules.
- Existing `.harness/runs/*` history is local project context and should be preserved.


# Implementation Contract

## Contract Status

Approved

## Goal

Scaffold and implement a playable local hotseat dungeon dice tactics MVP in React/TypeScript/Vite with actual reducer-driven state, rule functions, board interactions, and clear UI.

## Planned Change

- Add Vite/React/TypeScript project files and npm scripts.
- Add explicit game domain types, constants, initial state, static data for 8 monsters, 8 dice, and 5 tile shapes.
- Add rule modules for dice rolling, summoning/placement, board helpers, movement BFS, combat, and turn transitions.
- Add reducer and React components for complete game screen.
- Add CSS for dark fantasy board/UI, player tile colors, highlights, disabled actions, and responsive desktop layout.
- Add lightweight unit tests for core rule behaviours if dependency/tooling installation succeeds.

## Non-Goals

- No backend or online multiplayer.
- No AI opponent.
- No deck builder or persistence.
- No official/copyrighted assets, logos, character names, or copied artwork.
- No full advanced DDM rules beyond requested MVP.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `package.json`, lockfile | Add npm metadata/scripts/deps | Vite app scaffold | Low |
| `index.html`, `vite.config.ts`, `tsconfig*.json` | Build config | Vite/TS runtime | Low |
| `src/main.tsx`, `src/App.tsx` | App entry | Render game screen | Low |
| `src/game/**` | Types/data/rules/reducer/initial state | Core gameplay | Low |
| `src/components/**` | UI components | Playable interface | Low |
| `src/styles/**` | Global/game CSS | Visual clarity | Low |
| `src/**/*.test.ts` or equivalent | Unit tests if feasible | Rule verification | Low |
| `.harness/runs/RUN-20260511-001-dungeon-dice-monsters-mvp/**` | Run artifacts | Required lifecycle | Low |
| `.harness/runs/RUN_INDEX.md` | Status updates | Required lifecycle | Low |

## Conflict Check

Active runs checked:

- [x] Yes

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| None observed | N/A | N/A | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] Initial screen shows 13x9 board, P1/P2 cores, starting tiles, top bar, dice tray, crest bar, action panel, info panels, and log.
- [ ] Roll Dice during roll phase rolls exactly 3 dice, displays results, adds non-summon crests capped at 5, computes summon candidates when at least 2 summon faces appear, and advances phase.
- [ ] Summon phase allows choosing a candidate or skipping; choosing enables placement preview; valid placement creates owned dungeon tiles and a monster; invalid placement is visibly rejected/no-op.
- [ ] Player can select own monsters; opponent monsters cannot be selected for movement/action by the current player.
- [ ] Move mode highlights reachable owned dungeon tiles using BFS; clicking a reachable cell moves the monster and deducts exact move crest distance.
- [ ] Attack mode highlights enemy monsters/cores within range; clicking target deducts one attack crest, applies damage formula, removes destroyed monsters, damages core, and sets winner/gameOver at 0 HP.
- [ ] End Turn switches current player, phase returns to roll, latest roll/interaction selections clear, and current player's monsters have `hasActedAttack` reset at start of their turn.
- [ ] Buttons are disabled when unavailable; selected/reachable/attackable/placement states are visually clear.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
# Dependencies
npm install

# Build
npm run build

# Unit tests, if added
npm test -- --run

# Harness verification wrapper, if compatible
bash .harness/scripts/verify.sh
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
# Start app
npm run dev -- --host 127.0.0.1

# Check endpoint/page
curl -I http://127.0.0.1:5173/
```

Browser/manual checks: page loads, board has 117 cells, Roll Dice works, End Turn works, selecting/move/attack UI states are visible when resources/targets exist.

## Rollback / Safety Notes

- New scaffold files can be removed if needed; do not revert pre-existing Harness changes.
- Keep changes scoped to expected files and avoid modifying Harness guides/templates/scripts.

## Questions / Assumptions

- Assumption: Because no app stack exists, starting with React + TypeScript + Vite follows user fallback instruction.
- Assumption: Lightweight Vitest is acceptable if tests are added; no Playwright will be introduced because it is heavier and not already present.

# Codebase Entrypoints

Purpose: list concrete code entrypoints that start execution or route work into the source tree.

Last reviewed: 2026-05-12

## Entrypoints

| Entrypoint | Path | Purpose | Inspect before editing |
|---|---|---|---|
| HTML shell | `index.html` | Provides the `#root` mount node for Vite/React | `src/main.tsx`, global CSS, Vite config |
| React bootstrap | `src/main.tsx` | Creates React root, renders `App`, imports global/game CSS | `src/App.tsx`, `src/styles/globals.css`, `src/styles/game.css` |
| Root component | `src/App.tsx` | Renders `GameScreen` | `src/components/GameScreen.tsx` |
| Main game UI | `src/components/GameScreen.tsx` | Initializes reducer state, wires UI events, AI controller, animations, layout | Child components, reducer, AI hook, related tests |
| Game reducer | `src/game/reducer.ts` | Central transition function for all `GameAction` values | `src/game/types.ts`, rule helpers, tests, UI/AI callers |
| Initial state factory | `src/game/initialState.ts` | Creates board, players, starting tiles, controls, first turn | constants, data catalogs, state-dependent tests |
| AI controller hook | `src/game/ai/aiController.ts` | Schedules delayed AI actions during AI-controlled turns | `src/game/ai/aiPlanner.ts`, fake timer tests, reducer action legality |
| AI planner | `src/game/ai/aiPlanner.ts` | Converts AI turn state into next reducer action | scoring/util modules, AI planner tests |
| Component smoke tests | `src/components/GameScreen.test.tsx` | jsdom smoke coverage for board, roll, end turn, AI handoff | `GameScreen`, user-visible roles/text |
| Browser smoke test | `e2e/game.spec.ts` | Playwright verification of visible game flow | accessible labels/text, Vite dev server config |

## Non-Entrypoints

- There is no backend server, API route, CLI command, worker, or job entrypoint evident in the current source tree.
- Static data files under `src/game/data/` are consumed by reducer/rules/UI but do not start execution.

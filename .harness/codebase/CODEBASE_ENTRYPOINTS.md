# Codebase Entrypoints

Last reviewed: 2026-05-12

For project stack/runtime context, see `.harness/project/PROJECT_PROFILE.md`.

## Entrypoints

| Entrypoint | Path | Purpose | Inspect before editing |
|---|---|---|---|
| HTML root | `index.html` | Provides the DOM root for Vite/React. | `src/main.tsx`, CSS imports if changing boot or root id. |
| React mount | `src/main.tsx` | Creates React root and imports global/game CSS. | `src/App.tsx`, `src/styles/globals.css`, `src/styles/game.css`. |
| App component | `src/App.tsx` | Renders `GameScreen`. | `src/components/GameScreen.tsx`. |
| Game screen | `src/components/GameScreen.tsx` | Main runtime entry for state, AI hook, UI layout, interaction dispatch, and visual effects. | `src/game/reducer.ts`, `src/game/types.ts`, child components, CSS used by class names. |
| Reducer | `src/game/reducer.ts` | Central action/state transition entry for user and AI actions. | `src/game/types.ts`, `src/game/rules/*`, `src/game/data/*`, AI tests and rule tests. |
| Initial state | `src/game/initialState.ts` | Creates board, cores, starting tiles, player state, and default controls. | `src/game/constants.ts`, `src/game/data/diceCatalog.ts`, tests with initial board assumptions. |
| AI controller hook | `src/game/ai/aiController.ts` | Dispatches planned actions during AI-controlled turns. | `src/game/ai/aiPlanner.ts`, `aiTypes.ts`, `aiUtils.ts`, timer-based tests. |
| Playwright smoke | `e2e/game.spec.ts` | Browser-level smoke flow through P1 roll and P2 AI turn. | UI accessible text/roles in components and `playwright.config.ts`. |

## No Entrypoints Observed

- No backend server entrypoint observed.
- No API routes observed.
- No CLI command or worker/job entrypoint observed.

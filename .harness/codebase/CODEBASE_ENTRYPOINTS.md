# Codebase Entrypoints

Purpose: list concrete code entrypoints that start execution or route work into the source tree.

Do not record project stack/runtime/package-manager facts here. Reference `.harness/project/PROJECT_PROFILE.md` for that context.

## Entrypoints

| Entrypoint | Path | Purpose | Inspect before editing |
|---|---|---|---|
| HTML app host | `index.html` | Provides the `#root` mount target and loads `/src/main.tsx`. | `src/main.tsx`, app root assumptions, browser smoke selectors. |
| React root | `src/main.tsx` | Creates the React root, wraps `App` in `StrictMode`, and imports global/game CSS. | CSS import chain, root providers, `App`, tests that render `GameScreen`. |
| App component | `src/App.tsx` | Thin top-level component that renders `GameScreen`. | `GameScreen` composition and any future app-level routing/provider needs. |
| Main game shell | `src/components/GameScreen.tsx` | Initializes game state, dispatches human actions, starts AI controller, renders all major UI regions. | Reducer actions, AI hook, board callbacks, animation locks, state event effects, component tests. |
| Reducer dispatch target | `src/game/reducer.ts` | Handles all `GameAction` transitions and exports board helper functions used by UI. | `src/game/types.ts`, rule helper imports, data IDs, AI planned action shape, focused tests. |
| Initial state factory | `src/game/initialState.ts` | Creates default board, players, controls, phase, and log. | Board constants, dice catalog, reducer reset, tests that assume default board/player state. |
| AI turn hook | `src/game/ai/aiController.ts` | Schedules AI actions through React effect timers when current player is AI-controlled. | `aiPlanner`, `aiTypes`, fake timer tests, `GameScreen` input lockout. |
| Browser e2e spec | `e2e/game.spec.ts` | Starts from page root and verifies the main browser-visible game flow. | Visible labels, roles, grid count, AI timing, Playwright config. |

## Nonexistent Entrypoint Classes

| Entrypoint class | Current evidence | Notes |
|---|---|---|
| API routes | No route-handler files observed under `src/` or root config. | Add entries here if a server/API layer appears. |
| Backend server | No server startup entry observed. | Current app is frontend-only from source evidence. |
| CLI commands | No package `bin` or CLI source observed. | Add entries if command files are introduced. |
| Workers/jobs | No worker/job source observed. | Add entries if background processing appears. |
| Client routes | No router dependency or route files observed. | `App` currently renders one screen directly. |

## Notes

- General command and tool details live in `.harness/project/PROJECT_VERIFICATION.md`.
- Runtime/product profile lives in `.harness/project/PROJECT_PROFILE.md`.
- If a new execution surface appears, update `CODEBASE_INDEX.md`, `CODEBASE_AREAS.md`, and `CODEBASE_CHANGE_IMPACT.md` in the same sync.

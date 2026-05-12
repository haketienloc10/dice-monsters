# Project Profile

Last reviewed: 2026-05-12

## Summary

`dice-monsters` is a browser game implemented as a Vite + React + TypeScript application. The current app entry point is `src/App.tsx`, which renders `src/components/GameScreen.tsx`.

Evidence:

- `package.json` declares `"type": "module"` and scripts for `vite`, `tsc -b`, `vitest --run`, and `playwright test`.
- `src/main.tsx` mounts the React app into `index.html`.
- `src/App.tsx` renders `GameScreen`.

## Stack

- Runtime/tooling: Node.js project using npm, evidenced by `package.json` and `package-lock.json`.
- Frontend: React 19 with Vite 6 and TypeScript 5.
- UI icons: `lucide-react`.
- Unit/component tests: Vitest with jsdom and Testing Library.
- Browser smoke/e2e tests: Playwright.

## Entry Points

- App shell: `index.html`
- React bootstrap: `src/main.tsx`
- Root component: `src/App.tsx`
- Main game UI: `src/components/GameScreen.tsx`
- Game state initialization: `src/game/initialState.ts`
- Game reducer: `src/game/reducer.ts`

## Repository Layout

- `src/components/`: React UI components for board, panels, dice tray, log, overlays, and HUD.
- `src/game/`: TypeScript game model, reducer, rules, AI, constants, and static game data.
- `src/styles/`: CSS files grouped by layout, board, HUD, game, animation, theme, and globals.
- `e2e/`: Playwright browser smoke tests.
- `.harness/`: Harness workflow infrastructure, not application source.

## Generated / Non-Source Boundaries

- `node_modules/`, `dist/`, `playwright-report/`, and `test-results/` are generated or tool output.
- `.harness/runs/` stores Harness run records and should not be treated as app code.

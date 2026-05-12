# Project Profile

Last reviewed: 2026-05-12

## Summary

`dice-monsters` is a browser game implemented as a Vite + React + TypeScript app.

Confidence: high. Evidence: `package.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, and `src/components/GameScreen.tsx`.

## Stack

- UI/runtime: React 19, React DOM 19, Vite 6.
- Language: TypeScript with `strict` enabled in `tsconfig.app.json`.
- Styling: CSS files under `src/styles/`.
- Icons/UI dependency: `lucide-react`.
- Tests: Vitest 2 with `jsdom`, plus React Testing Library.
- Package manager: npm. Evidence: `package-lock.json` observed by `.harness/scripts/inspect-project.sh`.

## Entry Points

- HTML shell: `index.html`.
- React mount: `src/main.tsx`.
- App root: `src/App.tsx`.
- Main playable screen: `src/components/GameScreen.tsx`.

## Repository Layout

- `src/components/`: React UI components for board, panels, dice tray, logs, and top-level game screen.
- `src/game/`: game state, reducer, rules, AI planner/controller, data catalogs, and types.
- `src/styles/`: global and game-specific CSS.
- `src/**/*.test.ts` and `src/**/*.test.tsx`: Vitest test coverage for game rules, AI planner, and UI smoke flow.
- `.harness/`: project-local Harness workflow infrastructure, not application source.


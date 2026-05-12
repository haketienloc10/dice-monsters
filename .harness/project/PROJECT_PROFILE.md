# Project Profile

Last reviewed: 2026-05-12

## Summary

`dice-monsters` is a private browser game project built with Vite, React, and TypeScript. The app renders a tactical dice-and-board game where P1 is human-controlled and P2 is AI-controlled by default.

## Evidence

- Project name and privacy: `package.json`.
- Browser entrypoint: `index.html`, `src/main.tsx`, `src/App.tsx`.
- Main screen: `src/components/GameScreen.tsx`.
- Game state and actions: `src/game/types.ts`, `src/game/reducer.ts`.
- Initial match setup: `src/game/initialState.ts`.
- AI turn automation: `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`.

## Stack

- Runtime/tooling: Node.js package project with `package-lock.json`, so use npm.
- Frontend: React 19, React DOM 19, Vite 6, TypeScript 5.
- UI dependencies: `lucide-react`.
- Unit/component tests: Vitest, Testing Library, jsdom.
- E2E tests: Playwright.

## Entry Points

- App mount: `src/main.tsx`.
- Top-level component: `src/App.tsx`.
- Game UI shell and interaction orchestration: `src/components/GameScreen.tsx`.
- Game reducer: `src/game/reducer.ts`.
- Playwright browser flow: `e2e/game.spec.ts`.

## Repository Layout

- `src/components/`: React UI components for board, HUD, panels, dice tray, log, and effects.
- `src/game/`: domain types, constants, initial state, reducer, data, rules, and AI.
- `src/game/rules/`: pure-ish rule helpers for board, dice, summon, movement, combat, and turns.
- `src/game/data/`: dice catalog, monsters, and tile shapes.
- `src/game/ai/`: AI action planning, scoring, utilities, and controller hook.
- `src/styles/`: CSS split by global, layout, board, HUD, animation, game, and theme concerns.
- `e2e/`: Playwright smoke tests.

## Source Boundaries

Application source lives under `src/`, plus test/config files at repo root and under `e2e/`.

Generated or non-source artifacts observed in the repo include `dist/`, `playwright-report/`, `test-results/`, and `node_modules/`; these should not be treated as source.

# Project Profile

Synced at: `2026-05-14T00:22:45+07:00`

## Summary

`dice-monsters` is a private React/Vite browser game implemented in TypeScript. The app presents a dice-driven dungeon board game where `P1` is human-controlled and `P2` is AI-controlled by default.

## Evidence

- `package.json` declares project name `dice-monsters`, `"type": "module"`, and scripts for `dev`, `build`, `test`, and `test:e2e`.
- `README.md` currently contains only the title `# dice-monsters`; source code is the primary evidence for behavior.
- `src/main.tsx` is the React entry point and `src/App.tsx` renders the game screen.
- `src/game/initialState.ts` sets the default players, board cores, starting tiles, and initial `roll` phase.
- `src/game/constants.ts` defines a `13x9` board and `CORE_HP = 10`.

## Stack

- Runtime/UI: React 19, React DOM 19, Vite 6.
- Language: TypeScript 5.
- Icons: `lucide-react`.
- Unit/integration tests: Vitest with `jsdom`.
- Browser smoke/e2e: Playwright.
- Package manager evidence: `package-lock.json`; prefer `npm ci` for clean installs.

## Current Confidence

- High confidence for stack, entry points, and validation commands from manifests/config files.
- Medium confidence for product intent because README has no gameplay documentation.

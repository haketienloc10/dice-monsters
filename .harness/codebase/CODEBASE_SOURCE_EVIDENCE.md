# Codebase Source Evidence

Purpose: record evidence used to maintain `.harness/codebase/*`.

Last reviewed: 2026-05-12

## Evidence Log

| Date | Area/docs updated | Source paths inspected | Important files reviewed | Confidence | Stale/uncertain areas |
|---|---|---|---|---|---|
| 2026-05-12 | Initial codebase sync after Harness install | `src/`, `e2e/`, root package/config evidence | `package.json`, `src/main.tsx`, `src/App.tsx`, `src/components/GameScreen.tsx`, `src/game/types.ts`, `src/game/reducer.ts`, `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts` | High for current app/navigation map | Source docs are new; deeper per-component props were not exhaustively audited. |

## Current Evidence Summary

| Source area | Evidence basis | Confidence | Notes |
|---|---|---|---|
| App shell | `src/main.tsx`, `src/App.tsx`, `index.html` path evidence | High | Simple Vite/React mount path. |
| GameScreen orchestration | `src/components/GameScreen.tsx` reviewed | High | Top-level UI/reducer/AI/effects coupling confirmed. |
| Game state/reducer | `src/game/types.ts`, `src/game/reducer.ts` reviewed | High | Reducer branches and typed actions are central contract. |
| AI flow | `src/game/ai/aiController.ts`, `src/game/ai/aiPlanner.ts`, AI tests listed | High | Timer-driven AI action dispatch confirmed. |
| Tests | `src/components/GameScreen.test.tsx`, `e2e/game.spec.ts`, source tree listing | High | Component and browser smoke flows confirmed. |
| UI component internals | Source tree listing and GameScreen imports | Medium | Individual component internals should still be inspected before edits. |
| Styles | Source tree listing and imports | Medium | CSS responsibilities inferred from file names and component class usage; inspect exact file before visual edits. |

## Stale Or Uncertain Areas

- Individual component prop contracts: inspect the target component before editing.
- CSS class ownership: inspect both component and CSS file before changing class names or layout.
- Full rule helper internals: source files are mapped, but each rule file should be read before altering the corresponding gameplay rule.

## Maintenance Rules

- Prefer actual source files, tests, route definitions, command entrypoints, and imports over memory.
- Record important searches when they affect impact confidence.
- Do not copy run-by-run implementation logs here.
- If evidence belongs to project-level profile, architecture, verification, rules, glossary, context, or open questions, update or reference `.harness/project/*` instead.

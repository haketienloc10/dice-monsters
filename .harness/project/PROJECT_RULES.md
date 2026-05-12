# Project Rules

Last reviewed: 2026-05-12

## Local Instructions

- Communicate with the user in Vietnamese.
- Keep code identifiers, file names, package names, API names, CLI commands, logs, stack traces, and error messages in their original language.
- Follow root `AGENTS.md` and project Harness context before non-trivial implementation work.
- `.harness/` is workflow infrastructure and not application source.

Evidence: user-provided global instructions and root `AGENTS.md`.

## Source Boundaries

- Application source lives under `src/` plus root runtime/config files such as `index.html`, `package.json`, `vite.config.ts`, `vitest.config.ts`, and `tsconfig*.json`.
- Game logic boundaries are primarily in `src/game/rules/*`, `src/game/reducer.ts`, `src/game/types.ts`, `src/game/ai/*`, and `src/game/data/*`.
- UI boundaries are primarily in `src/components/*` and `src/styles/*`.
- Do not treat `.harness/`, `node_modules/`, build output, lockfile internals, or generated/cache files as app source.

## Engineering Rules

- Preserve reducer-driven state flow; UI should dispatch typed `GameAction` values rather than mutating state directly.
- Prefer updating rule helpers and tests together when changing game mechanics.
- Keep AI behavior changes in `src/game/ai/*` unless reducer/rules need new legal action support.
- For UI changes, inspect related component and CSS together because layout and behavior are split across `src/components/*` and `src/styles/*`.
- Avoid broad refactors while changing game rules; rule regressions can be subtle.

## Harness Rules

- For non-trivial implementation tasks, create and maintain a run under `.harness/runs/`.
- Preserve existing run history and backlog entries.
- Use `project-sync` when `.harness/project/*` is missing, stale, contradictory, or low-confidence.


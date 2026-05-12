# Project Rules

Last reviewed: 2026-05-12

## Local Instructions

- Follow root `AGENTS.md` for Harness workflow rules.
- Communicate with the user in Vietnamese unless repo-specific documentation requires another language.
- Keep code identifiers, paths, commands, logs, package names, and API names in their original language.

## Source Rules

- Inspect actual source before editing; `.harness/codebase/*` is only a navigation cache.
- Treat `src/game/types.ts` as the core type contract for game state and actions.
- Search usages before changing exported reducers, rule helpers, data schemas, or component props.
- Keep application changes outside `.harness/` unless the task is specifically about Harness context or workflow.

## Non-Source Boundaries

- Do not edit `node_modules/`.
- Do not treat `dist/`, `playwright-report/`, or `test-results/` as authoritative source.
- `package-lock.json` is npm lockfile evidence and should be updated only through npm commands when dependencies change.

## Harness Context Rules

- Preserve manual notes in `.harness/project/*`.
- Old adapter files such as `PROJECT_MAP.md`, `STACK_PROFILE.md`, and `VALIDATION_PROFILE.md` are local context and should not be deleted without an explicit user request.
- If source evidence contradicts Harness docs, update the relevant Harness context file or mark the uncertainty.

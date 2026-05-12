# Codebase Freshness

Purpose: track freshness metadata for `.harness/codebase/*`.

## Last Reviewed

- Date: 2026-05-12
- Reviewer: codex-local-session
- Last known commit/hash: f85ea3f
- Review scope: `src/`, `e2e/`, root app/test config evidence, and Harness install-created codebase docs.
- Confidence: high for source navigation and entrypoints; medium for per-component internals until a target file is inspected.

## Known Stale Areas

| Area/doc | Why stale | What to inspect next |
|---|---|---|
| none known | Initial sync completed after Harness install | Re-check when source files move or new modules are added |

## Freshness Triggers

Review `.harness/codebase/*` when:

- Source directories, routes, commands, jobs, or major modules are added/removed.
- Shared functions/classes/schemas/routes are renamed.
- `GameAction`, `GameState`, `GameEvent`, board dimensions, or AI planning contracts change.
- Tests move or new test boundaries appear.
- Codebase docs contradict source evidence during a coding run.

## TODO

- Add a future periodic freshness checker or script that can detect moved/deleted indexed paths.
- Add a future report that compares `CODEBASE_SOURCE_EVIDENCE.md` with current `git` state.

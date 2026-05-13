# Codebase Freshness

Purpose: track freshness metadata for `.harness/codebase/*`.

Do not implement cron or automation here. Future freshness checker work is TODO only.

## Last Reviewed

- Date: `2026-05-14`
- Reviewer: `Codex harness-codebase-sync`
- Last known commit/hash: `d1e6067`
- Review scope: `.harness/project/*`, existing `.harness/codebase/*`, `AGENTS.md`, `src/`, `e2e/`, and root frontend/test config files.
- Confidence: `high` for source navigation, entrypoints, flows, and change impact; `medium` for visual CSS behavior because no browser layout check was run.

## Known Stale Areas

| Area/doc | Why stale | What to inspect next |
|---|---|---|
| `AGENTS.harness.md` | IDE context referenced it, but no file exists in this workspace. | `find . -name 'AGENTS.harness.md' -print`; confirm whether it should be created or ignored. |
| `README.md` behavior docs | README only contains repository title, so gameplay intent is not documented there. | Use source/tests as behavior evidence or run `harness-project-sync` if product docs are added. |
| `dist/` | Build output exists on disk but was not treated as source evidence. | Inspect only for build artifact/debugging tasks. |
| CSS visual behavior | CSS selectors and class ownership were inspected, but no browser screenshot/manual check was performed. | For layout work, run browser smoke or Playwright checks after implementation. |

## Freshness Triggers

Review `.harness/codebase/*` when:

- Source directories, routes, commands, jobs, or major modules are added/removed.
- Shared functions/classes/types/actions/routes are renamed.
- `GameAction`, `GameEvent`, `GameState`, monster/dice/tile IDs, or CSS class ownership changes.
- Tests move or new test boundaries appear.
- Codebase docs contradict source evidence during a coding run.

## TODO

- Add a future periodic freshness checker or cron that can detect moved/deleted indexed paths.
- Add a future report that compares `CODEBASE_SOURCE_EVIDENCE.md` with current `git` state.

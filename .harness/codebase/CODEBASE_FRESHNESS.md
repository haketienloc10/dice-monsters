# Codebase Freshness

## Last Reviewed

- Date: 2026-05-12
- Reviewer: Codex
- Last known commit/hash: `b496c86`
- Review scope: source tree, major game components, reducer/types, initial state, AI planner/controller, static data, tests, and root config.
- Confidence: high for source navigation; medium for visual styling details.

## Known Stale Areas

| Area/doc | Why stale | What to inspect next |
|---|---|---|
| Visual styling details | CSS was indexed for paths and coupling, not visually reviewed. | Run app and inspect desktop viewport before layout/animation changes. |
| Product roadmap | No detailed product/design doc found beyond source and tests. | Ask user or add docs if future work depends on intended rules. |

## Freshness Triggers

Review `.harness/codebase/*` when:

- Source directories, routes, commands, jobs, or major modules are added/removed.
- `GameAction`, `GameState`, `GameEvent`, reducer cases, or AI planning interfaces change.
- Tests move or new test boundaries appear.
- UI accessible labels/text used by tests change.
- Codebase docs contradict source evidence during a coding run.

## TODO

- Add a future freshness checker that detects moved/deleted indexed paths.
- Add a future report that compares `CODEBASE_SOURCE_EVIDENCE.md` with current git state.

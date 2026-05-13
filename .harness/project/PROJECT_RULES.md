# Project Rules

Synced at: `2026-05-14T00:22:45+07:00`

## Local Engineering Rules

- Follow root `AGENTS.md` for Harness lifecycle boundaries.
- Treat `.harness/` as workflow infrastructure, not application source.
- Do not edit application code outside an approved Harness implementation run.
- For project-context sync work, keep edits limited to `.harness/project/*`.

## Application Change Rules

- Match the existing React + TypeScript style.
- Keep game logic changes in `src/game/*` where possible; UI components should dispatch typed `GameAction`s rather than duplicating rules.
- Do not add speculative gameplay systems, settings, or abstractions without an explicit task.
- Preserve current human-vs-AI default unless a task says otherwise.

## Testing Rules

- Add or update focused Vitest tests for changes in `src/game/rules/*`, `src/game/ai/*`, or `src/game/reducer.ts`.
- Use Playwright e2e only for browser-visible flow or interaction regressions.
- For UI layout/interaction changes, run a browser check when feasible.

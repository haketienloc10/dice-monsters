# Project Rules

Last reviewed: 2026-05-12

## Local Instructions

- Communicate with the user in Vietnamese.
- Preserve code identifiers, file names, package names, API names, CLI commands, logs, stack traces, and error messages in their original language.
- Be concise, practical, and implementation-focused.
- When changing code, summarize what changed, why it changed, and any command the user should run next.

Evidence:

- User-provided AGENTS instructions in this session.
- Installed root `AGENTS.md` defines Harness workflow expectations.

## Source Boundaries

- Application source lives primarily in `src/`.
- Browser smoke tests live in `e2e/`.
- Build and test configuration lives in root config files such as `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `tsconfig*.json`, and `package.json`.

## Non-Source Boundaries

- Do not edit `node_modules/`, `dist/`, `playwright-report/`, or `test-results/` for application changes.
- Treat `.harness/` as workflow infrastructure. Application feature work should inspect real source and tests outside `.harness/`.
- Preserve `.harness/project/*` manual notes and local decisions when refreshing context.

## Engineering Conventions Observed

- Game state changes are centralized in `src/game/reducer.ts` and supporting rule modules under `src/game/rules/`.
- Shared game data is kept under `src/game/data/`.
- UI components consume `GameState` and dispatch typed `GameAction` values.
- Tests use Testing Library for component-level smoke coverage and Playwright for browser-level smoke coverage.

## Harness Workflow

For non-trivial implementation tasks, follow root `AGENTS.md`: create a Harness run, write planning/contract/evaluation artifacts, and verify with real commands. For small maintenance tasks such as project context refresh, keep edits scoped to `.harness/project/*`.

After the 2026-05-12 Harness seed update, source-navigation and change-impact notes live in `.harness/codebase/*`. Before non-trivial coding work, read `.harness/codebase/CODEBASE_INDEX.md` after project context, then inspect actual source files before editing.

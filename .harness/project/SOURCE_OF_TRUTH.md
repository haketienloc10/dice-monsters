# Source Of Truth

File này thuộc target repository sau khi install.

Target repository có quyền chỉnh sửa file này. Installer chỉ tạo file nếu chưa tồn tại và không được overwrite nội dung local đã có.

## Purpose

Ghi lại nguồn sự thật ưu tiên khi có xung đột: docs, tests, schemas, migrations, API specs, product requirements, hoặc owner notes.

## Manual Notes

- Primary source of truth:
  - Application behaviour: current code in `src/game/**` and `src/components/**`.
  - Game state/action contract: `src/game/types.ts`.
  - Mechanics implementation: `src/game/reducer.ts` plus rule modules in `src/game/rules/**`.
  - Static game content: `src/game/data/**`.
  - Validation commands and dependencies: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`.
- Secondary references:
  - Existing tests in `src/game/rules/gameRules.test.ts` and `src/components/GameScreen.test.tsx`.
  - Completed Harness run `RUN-20260511-001-dungeon-dice-monsters-mvp` for historical implementation notes.
  - Root `AGENTS.md` and `.harness/project/*` for workflow/project adapter guidance.
- Known stale or low-detail docs:
  - `README.md` currently contains only the project title and is not a product specification.
  - Generated discovery sections can include local artifacts such as `dist/` and `node_modules/`; verify with Manual Notes and source files before relying on them.

# Local Decisions

File này thuộc target repository sau khi install.

Target repository có quyền chỉnh sửa file này. Installer chỉ tạo file nếu chưa tồn tại và không được overwrite nội dung local đã có.

## Purpose

Ghi lại quyết định local của target repository mà agent phải tôn trọng.

## Manual Notes

- Decision: Keep mechanics in `src/game/**` and UI rendering/dispatch wiring in `src/components/**`.
  - Reason: Existing architecture separates reducer/rules/data from React components.
  - Date: 2026-05-12
- Decision: Use npm scripts for local verification: `npm test`, `npm run build`, and Harness `verify.sh`.
  - Reason: `package.json` defines test/build scripts and `package-lock.json` is present.
  - Date: 2026-05-12
- Decision: Do not treat `dist/` and `node_modules/` as source, even if generated discovery lists them as top-level directories.
  - Reason: They are build/dependency artifacts in the current Vite/npm workflow.
  - Date: 2026-05-12
- Decision: Avoid adding heavier E2E/browser tooling unless a UI task explicitly needs it and the contract approves it.
  - Reason: Current coverage uses Vitest and Testing Library; Harness smoke is curl-level.
  - Date: 2026-05-12
- Decision: Movement uses continuous dungeon paths regardless of dungeon tile owner.
  - Reason: Monsters may enter opponent dungeon tiles only when connected by orthogonally adjacent dungeon tiles.
  - Date: 2026-05-12
- Decision: Movement cannot path through occupied monster cells and cannot enter Core cells.
  - Reason: Monsters block traversal; Core interaction is combat-only.
  - Date: 2026-05-12
- Decision: Core damage is performed by Attack action when the Core is inside the attacker's range.
  - Reason: Core should not be entered or damaged by movement.
  - Date: 2026-05-12

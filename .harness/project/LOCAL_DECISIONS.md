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

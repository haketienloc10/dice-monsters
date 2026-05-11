# Stack Profile

File này thuộc target repository sau khi install.

Target repository có quyền chỉnh sửa file này. Installer chỉ tạo file nếu chưa tồn tại và không được overwrite nội dung local đã có.

## Purpose

Ghi lại stack và tooling quan sát được. Discovery output chỉ là observed facts, không phải absolute truth.

## Generated Discovery

<!-- HARNESS:GENERATED:START -->
Generated at: `2026-05-12T00:25:13+07:00`

Discovery output records observed files and directories only.

## Node

- package.json: `package.json`
- package-lock.json: `package-lock.json`
- tsconfig.json: `tsconfig.json`
- Vite config: `vite.config.ts`

## Java

- No Java indicators observed.

## Python

- No Python indicators observed.

## Runtime / Infra

- No runtime/infra indicators observed.
<!-- HARNESS:GENERATED:END -->

## Manual Notes

- Runtime/app stack:
  - Vite app using React 19, React DOM 19, and TypeScript.
  - Package manager is npm; `package-lock.json` is present, so prefer `npm ci` for clean installs.
  - Project uses ES modules via `"type": "module"` in `package.json`.
- UI/tooling dependencies:
  - `lucide-react` is available for icons.
  - Styling is plain CSS in `src/styles/`; no Tailwind or component framework is present.
- Test stack:
  - Vitest for tests.
  - Testing Library React for component smoke tests.
  - `jsdom` is installed, but current `vite.config.ts` only defines Vite React plugin; verify actual test environment before adding DOM-heavy tests.
- TypeScript/build config:
  - `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`.
  - `npm run build` runs `tsc -b && vite build`.
- Not observed:
  - No backend service, database, API schema, Docker config, CI workflow, Java, or Python project files.

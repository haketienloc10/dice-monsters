# Project Map

File này thuộc target repository sau khi install.

Target repository có quyền chỉnh sửa file này. Installer chỉ tạo file nếu chưa tồn tại và không được overwrite nội dung local đã có.

## Purpose

Ghi lại bản đồ project ở mức quan sát được: source directories, test directories, docs, app entry points, runtime surfaces, và những khu vực cần inspect trước khi làm task.

## Generated Discovery

<!-- HARNESS:GENERATED:START -->
Generated at: `2026-05-12T00:25:13+07:00`

Discovery output records observed project layout only.

## General Files and Directories

- README.md: `README.md`
- src: `src`

## Top-Level Directories

- `dist/`
- `node_modules/`
- `src/`
<!-- HARNESS:GENERATED:END -->

## Manual Notes

- App entry points:
  - `index.html` loads `src/main.tsx`.
  - `src/main.tsx` mounts `App`.
  - `src/App.tsx` renders `GameScreen`.
- Source layout:
  - `src/components/`: React UI components for board, side panels, dice tray, action controls, log, and game screen composition.
  - `src/game/`: game domain state, reducer, constants, static data, and rule modules.
  - `src/game/data/`: dice catalog, monster definitions, and dungeon tile shapes.
  - `src/game/rules/`: mostly pure rules for board helpers, combat, dice, movement, summon placement, and turn flow.
  - `src/styles/`: global and game-specific CSS.
- Tests:
  - `src/game/rules/gameRules.test.ts`: rule-level coverage.
  - `src/components/GameScreen.test.tsx`: lightweight UI smoke flow with Testing Library.
- Runtime surface:
  - Browser UI served by Vite dev server, usually `http://localhost:5173`.
  - No backend/API server is present.
- Generated/local artifacts:
  - `dist/` is build output.
  - `node_modules/` is local dependency install output.
  - Do not treat either directory as application source.

# Implementation Contract

## Contract Status

Approved

## Goal

Cập nhật project adapter files để Harness phản ánh đúng context hiện tại của Dice Monsters.

## Planned Change

- Chạy/giữ kết quả generated discovery từ `.harness/scripts/inspect-project.sh`.
- Thay placeholder Manual Notes bằng ghi chú cụ thể trong các adapter.
- Ghi rõ source layout, module boundaries, validation commands, source of truth và quyết định local cần tôn trọng.
- Cập nhật run artifacts và `RUN_INDEX.md`.

## Non-Goals

- Không sửa app source hoặc tests.
- Không sửa Harness scripts/guides/templates.
- Không thêm tooling, dependency, CI hoặc docs ngoài `.harness/project`.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `.harness/project/PROJECT_MAP.md` | Refresh generated section và Manual Notes source/runtime layout | Adapter map đang stale/placeholder | Low |
| `.harness/project/STACK_PROFILE.md` | Manual Notes stack/tooling hiện tại | Ghi rõ Vite/React/TS/Vitest | Low |
| `.harness/project/VALIDATION_PROFILE.md` | Manual Notes required/optional checks | Hướng dẫn verification cho run sau | Low |
| `.harness/project/MODULE_MAP.md` | Manual Notes module boundaries | Giúp agent biết khu vực cần inspect | Low |
| `.harness/project/SOURCE_OF_TRUTH.md` | Manual Notes source of truth priority | Tránh dựa vào README thiếu nội dung | Low |
| `.harness/project/LOCAL_DECISIONS.md` | Manual Notes local decisions | Ghi quyết định hiện có từ codebase | Low |
| `.harness/runs/RUN-20260512-001-update-project-context/*` | Run lifecycle artifacts | Bằng chứng Harness | Low |
| `.harness/runs/RUN_INDEX.md` | Status/metadata run mới | Track run | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| RUN-20260511-001-dungeon-dice-monsters-mvp | App source and completed Harness run | No active conflict; completed | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] `.harness/project` mô tả đúng app hiện tại: Vite React TypeScript game, source under `src/`, tests under `src/**/*.test.*`.
- [ ] Validation profile chỉ ra required checks phù hợp: `npm test`, `npm run build`, và `bash .harness/scripts/verify.sh`; Vite smoke cần dev server và `APP_URL`.
- [ ] Module/source-of-truth notes giúp agent sau ưu tiên inspect `src/game/**`, `src/components/**`, tests và package/config thay vì placeholder/stale docs.
- [ ] Diff không chạm app source hoặc Harness guides/templates/scripts.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
bash .harness/scripts/verify.sh
git diff -- .harness/project
git diff --name-only
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
npm run dev -- --host 127.0.0.1
APP_URL=http://127.0.0.1:5173 bash .harness/scripts/smoke.sh
```

## Rollback / Safety Notes

- Revert only this run's changes if needed; do not revert completed MVP run files.
- Runtime smoke is optional for metadata-only task, but useful to confirm documented Vite smoke command remains valid.

## Questions / Assumptions

- Assumption 1: README is not detailed enough to be primary product spec beyond project name.
- Assumption 2: `dist/` and `node_modules/` are local/generated artifacts; they should be noted but not treated as source directories.

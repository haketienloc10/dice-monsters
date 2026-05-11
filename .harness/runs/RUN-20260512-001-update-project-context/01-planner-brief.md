# Planner Brief

## Goal

Cập nhật các file `.harness/project/*` để phản ánh đúng repo hiện tại sau khi app Dice Monsters đã được scaffold và implement.

## Context Summary

Repo hiện là một Vite app dùng React 19, TypeScript, Vitest, Testing Library và `lucide-react`. Source chính nằm trong `src/`, chia thành UI components, game reducer/state, static data và pure rule modules. `.harness/project` hiện còn placeholder hoặc stale ở phần Manual Notes; generated discovery đã được refresh để nhận diện `package.json`, `src`, Vite config và validation scripts.

## In Scope

- Refresh generated discovery bằng script Harness nếu cần.
- Cập nhật Manual Notes trong `PROJECT_MAP.md`, `STACK_PROFILE.md`, `VALIDATION_PROFILE.md`, `MODULE_MAP.md`, `SOURCE_OF_TRUTH.md`, `LOCAL_DECISIONS.md`.
- Ghi rõ validation command và smoke check phù hợp với app Vite hiện tại.
- Duy trì Harness run artifacts cho task này.

## Out of Scope

- Không sửa application source, tests, package metadata hoặc build config.
- Không sửa Harness guides/templates/scripts.
- Không thêm dependency hoặc CI config.
- Không refactor README hoặc docs ngoài `.harness/project`.

## User / Business Flow

1. Agent/Harness đọc `.harness/project/*` trước task mới.
2. Adapter cung cấp đúng bối cảnh hiện tại về stack, module boundaries và source of truth.
3. Agent chọn verification đúng: `bash .harness/scripts/verify.sh`, kèm Vite smoke khi runtime UI liên quan.

## Acceptance Criteria

- [ ] AC1: Generated discovery trong `PROJECT_MAP.md`, `STACK_PROFILE.md`, `VALIDATION_PROFILE.md` nhận diện `src`, Node/Vite files, `npm test`, `npm run build`, `npm ci`.
- [ ] AC2: Manual Notes mô tả đúng source layout, modules, source of truth, stack và validation strategy hiện tại.
- [ ] AC3: Không có thay đổi application code hoặc Harness scripts/guides/templates.
- [ ] AC4: Verification chạy được và evidence được ghi trong evaluator report.

## Likely Impacted Areas

> Chỉ ghi khu vực/module nghi ngờ liên quan, không ép implementation cụ thể.

- Module: `.harness/project/*`.
- Page/API: không.
- Data model: không.
- Test area: Harness verify và optional Vite smoke.

## Parallel Work Considerations

- Can this run happen in parallel? Có, nếu task khác không sửa `.harness/project/*`.
- Depends on: app context hiện tại trong `src/`, `package.json`, configs.
- May conflict with: task khác cập nhật project adapter cùng lúc.
- Recommended branch/worktree: current worktree đủ.

## Risks / Unknowns

- `dist/` và `node_modules/` xuất hiện trong generated top-level dirs vì script chỉ quan sát filesystem; Manual Notes cần làm rõ đó là generated/local artifacts, không phải source.
- README hiện chỉ có title nên không thể dùng làm đặc tả sản phẩm chi tiết.
- Không có E2E framework; smoke hiện là curl-level, UI behaviour cần Vitest/Testing Library hoặc browser check riêng khi task UI yêu cầu.

## Planner Notes for Generator

Giữ thay đổi surgical. Không chỉnh script discovery dù nó liệt kê `dist/` và `node_modules/`; chỉ ghi chú trong Manual Notes vì user yêu cầu update context project, không yêu cầu cải tiến Harness.

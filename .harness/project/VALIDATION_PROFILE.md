# Validation Profile

File này thuộc target repository sau khi install.

Target repository có quyền chỉnh sửa file này. Installer chỉ tạo file nếu chưa tồn tại và không được overwrite nội dung local đã có.

## Purpose

Ghi lại validation commands, test strategy, smoke checks, và các điều kiện bắt buộc trước khi hoàn tất task.

## Generated Discovery

<!-- HARNESS:GENERATED:START -->
Generated at: `2026-05-12T00:25:13+07:00`

Discovery output records candidate validation commands from observed files only.

## Candidate Commands

- `npm run test` observed in `package.json` scripts.
- `npm run build` observed in `package.json` scripts.
- `npm ci` lockfile observed: `package-lock.json`.

## Smoke Candidates

- Vite config observed. Common smoke URL: `APP_URL=http://localhost:5173 bash .harness/scripts/smoke.sh`.
<!-- HARNESS:GENERATED:END -->

## Manual Notes

- Required checks for normal app/source changes:
  - `npm test`
  - `npm run build`
  - `bash .harness/scripts/verify.sh`
- Dependency setup:
  - Use `npm ci` when dependencies need to be installed from scratch.
- UI/runtime smoke:
  - Start dev server with `npm run dev -- --host 127.0.0.1`.
  - Then run `APP_URL=http://127.0.0.1:5173 bash .harness/scripts/smoke.sh`.
  - Current smoke script is curl-level only; for UI behaviour changes, also add behaviour-level evidence with Testing Library, browser/manual checks, or an E2E tool if introduced by an approved task.
- Test strategy:
  - Prefer rule/unit tests in `src/game/rules/*.test.ts` for game mechanics.
  - For movement changes, cover reachable cells and exact distance, including owner boundary crossing, monster blockers, Core blockers, and move crest/range limits.
  - For combat target changes, cover valid attack targets directly, especially Core range behaviour.
  - Prefer component tests near `src/components/*.test.tsx` for UI flows.
  - For reducer or interaction changes, test the state transition directly when feasible and add a UI smoke only for user-facing wiring.
- Known flaky checks:
  - None documented.

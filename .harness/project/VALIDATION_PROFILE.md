# Validation Profile

File này thuộc target repository sau khi install.

Target repository có quyền chỉnh sửa file này. Installer chỉ tạo file nếu chưa tồn tại và không được overwrite nội dung local đã có.

## Purpose

Ghi lại validation commands, test strategy, smoke checks, và các điều kiện bắt buộc trước khi hoàn tất task.

## Generated Discovery

<!-- HARNESS:GENERATED:START -->
Generated at: `2026-05-12T12:52:23+07:00`

Discovery output records candidate validation commands from observed files only.

## Candidate Commands

- `npm run test` observed in `package.json` scripts.
- `npm run build` observed in `package.json` scripts.
- `npm ci` lockfile observed: `package-lock.json`.

## Smoke Candidates

- Vite config observed. Common smoke URL: `APP_URL=http://localhost:5173 bash .harness/scripts/smoke.sh`.
<!-- HARNESS:GENERATED:END -->

## Manual Notes

- Required checks:
- Optional checks:
- Known flaky checks:

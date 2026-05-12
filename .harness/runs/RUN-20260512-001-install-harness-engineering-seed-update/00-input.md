# Run Input

## Runtime Metadata

- Role: Planner Agent
- Runtime session: codex-local-session
- Runtime mode: fallback_single_session
- Independence: degraded
- Reason: Separate runtime role sessions are unavailable in this environment.

## Run ID

RUN-20260512-001-install-harness-engineering-seed-update

## Related Epic

None

## Source

- Manual request

## Original Request

```text
cài đặt https://github.com/haketienloc10/harness-engineering theo hướng dẫn, không clone repo
```

## Business Goal

Cập nhật/cài Harness seed architecture từ `haketienloc10/harness-engineering` vào repository hiện tại theo hướng dẫn upstream, không dùng `git clone`.

## Constraints

- Không clone repository upstream.
- Dùng installer chính thức qua `curl`/tarball theo README upstream.
- Bảo toàn project adapter, backlog và run history local.
- Không thay đổi application source code.

## Expected Output

- Code change: Không thay application source code.
- Test: Chạy verification phù hợp sau khi cài.
- Document: `.harness` được update và run artifacts ghi evidence.
- Other: Thêm `.harness/codebase/*` nếu installer seed yêu cầu.

## Parallel / Conflict Notes

- Related runs: none.
- Potential conflicts: update kernel `.harness/*` and `AGENTS.md`.
- Branch/worktree requirement: not required for this local install.

## Notes

README upstream khuyến nghị cài nhanh bằng `curl ... scripts/install-harness.sh | bash -s -- --target "$(pwd)" --agents-mode merge`.

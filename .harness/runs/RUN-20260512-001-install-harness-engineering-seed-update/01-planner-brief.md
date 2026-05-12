# Planner Brief

## Runtime Metadata

- Role: Planner Agent
- Runtime session: codex-local-session
- Runtime mode: fallback_single_session
- Independence: degraded
- Reason: Separate runtime role sessions are unavailable in this environment.

## Related Epic

None

## Goal

Cài/update Harness seed từ upstream vào target repo bằng installer chính thức, không clone repo, đồng thời giữ an toàn cho dữ liệu local của Harness.

## Context Summary

Repo hiện đã có `.harness/`, `AGENTS.md`, project adapter, backlog và run index. Upstream README mô tả installer ownership-safe: overwrite kernel folders có chủ đích, preserve `.harness/project/*`, `.harness/runs/*`, `.harness/backlog/HARNESS_BACKLOG.md`, và tạo `.harness/codebase/*` nếu thiếu.

## In Scope

- Đọc hướng dẫn upstream qua `curl`.
- Chạy installer qua `curl` piped to `bash`, không clone.
- Dùng `--agents-mode merge --yes` theo hướng dẫn cài nhanh và tránh prompt.
- Kiểm tra kết quả bằng git status/file listing/verification scripts.

## Out of Scope

- Không sửa application source code.
- Không refactor Harness guides/templates/scripts thủ công.
- Không chạy project-sync/codebase-sync sâu ngoài phạm vi installer, trừ khi cần để hoàn tất hướng dẫn cài.

## Acceptance Criteria

- [ ] Installer upstream chạy thành công mà không dùng `git clone`.
- [ ] `.harness` có kernel mới, seeded skills và `.harness/codebase/*` nếu upstream template có.
- [ ] Local project adapter, backlog và run history không bị xóa.
- [ ] `AGENTS.md` được xử lý bằng mode rõ ràng và có backup nếu installer merge.
- [ ] Verification command phù hợp chạy xong hoặc blocker được ghi lại.

## Likely Impacted Areas

- `.harness/README.md`, `.harness/HARNESS_SKILLS.md`, `.harness/INSTALLATION.md`
- `.harness/guides/`, `.harness/templates/`, `.harness/project-templates/`, `.harness/scripts/`
- `.harness/skills/`, `.harness/codebase/`
- `AGENTS.md`

## Parallel Work Considerations

- Can this run happen in parallel? Yes, if no other active run modifies Harness kernel files.
- Depends on: network access to GitHub.
- May conflict with: any active Harness update run.
- Recommended branch/worktree: not required.

## Risks / Unknowns

- `AGENTS.md` merge may add or duplicate Harness instructions; backup should preserve previous version.
- Upstream installer may overwrite local edits in kernel folders by design.

## Planner Notes for Generator

Run dry-run first, then real install. Do not manually edit installer-managed kernel files unless required to recover from installer failure.

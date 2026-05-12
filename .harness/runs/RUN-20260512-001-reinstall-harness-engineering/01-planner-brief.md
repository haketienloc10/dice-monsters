# Planner Brief

## Related Epic

None

## Goal

Cài lại Harness từ `https://github.com/haketienloc10/harness-engineering` theo cách ownership-safe, không clone source repo vào workspace, và giữ nguyên app source cùng project-owned Harness history/context.

## Context Summary

Repo đã có `.harness/` được cài trước đó. Upstream Harness repo cung cấp bootstrap installer `scripts/install-harness.sh`; README mô tả cách cài bằng `curl` và installer tải tarball tạm thời, sau đó chạy `template/.harness/scripts/install.sh`. Installer preserve `.harness/project/*`, `.harness/runs/*`, `.harness/backlog/HARNESS_BACKLOG.md` và cập nhật kernel folders khi có `--force`.

## In Scope

- Dùng official bootstrap installer từ upstream `main`.
- Không dùng `git clone`.
- Cập nhật `.harness` kernel/template/script/skill files theo upstream.
- Cập nhật root `AGENTS.md` theo template upstream, có backup file cũ.
- Giữ project adapters, run history, backlog, và app source.

## Out of Scope

- Không thay đổi game logic/UI/runtime files.
- Không clone hoặc vendor toàn bộ `harness-engineering` source tree trong repo.
- Không tự sync project context ngoài phạm vi reinstall, trừ khi verification chứng minh cần thiết.

## User / Business Flow

1. Agent chạy reinstall từ upstream seed repo bằng bootstrap không clone.
2. Repo đích nhận Harness kernel mới nhưng vẫn giữ local run/project history.
3. Agent kiểm chứng installer chạy thành công và không động vào app source.

## Acceptance Criteria

- [ ] AC1: Không có `git clone` hoặc thư mục source `harness-engineering` được thêm vào workspace.
- [ ] AC2: `.harness` kernel files được cài lại từ upstream, project-owned files được preserve.
- [ ] AC3: `AGENTS.md` được cập nhật từ upstream template hoặc có backup rõ ràng nếu thay đổi.
- [ ] AC4: Verification command phù hợp chạy pass, hoặc nêu rõ blocker.

## Likely Impacted Areas

> Chỉ ghi khu vực/module nghi ngờ liên quan, không ép implementation cụ thể.

- Module: `.harness/`, root `AGENTS.md`.
- Page/API: none.
- Data model: none.
- Test area: Harness verification scripts and git diff inspection.

## Parallel Work Considerations

- Can this run happen in parallel? Có, nếu không có run active khác đang sửa `.harness` hoặc `AGENTS.md`.
- Depends on: network access to GitHub.
- May conflict with: active Harness infrastructure update runs.
- Recommended branch/worktree: current `main` worktree is acceptable.

## Risks / Unknowns

- `AGENTS.md` local có thể khác template upstream; dùng installer `replace` sẽ tạo backup.
- Installer mới có thể đổi layout Epic/run scripts; cần kiểm tra diff sau install.

## Planner Notes for Generator

Chỉ chạy installer sau khi contract được approved. Dùng command kiểu `curl ... | bash -s -- --target "$(pwd)" --agents-mode replace --force --yes`, không dùng `git clone`.

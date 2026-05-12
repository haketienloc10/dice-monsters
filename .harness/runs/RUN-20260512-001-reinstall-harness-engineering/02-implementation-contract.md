# Implementation Contract

## Contract Status

Approved for evaluator review

## Goal

Cài lại Harness workflow infrastructure từ `haketienloc10/harness-engineering` bằng official bootstrap installer, không clone source, preserve local project-owned Harness state.

## Planned Change

- Chạy official upstream bootstrap installer qua `curl` từ `scripts/install-harness.sh`.
- Truyền `--target "$(pwd)" --agents-mode replace --force --yes` để update kernel folders không hỏi tương tác và backup `AGENTS.md` cũ.
- Inspect diff để xác nhận chỉ `.harness`/`AGENTS.md`/run artifacts thay đổi.
- Chạy Harness verification phù hợp sau reinstall.

## Non-Goals

- Không thay đổi application source, dependencies, lockfile, build output, hoặc runtime config.
- Không tạo local clone của `harness-engineering`.
- Không reset `.harness/project/*`, `.harness/runs/*`, `.harness/backlog/HARNESS_BACKLOG.md`.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `AGENTS.md` | Replace with upstream template; backup old file | Reinstall root Harness bootstrap | Medium |
| `AGENTS.md.backup-*` | New backup file | Safety for replaced `AGENTS.md` | Low |
| `.harness/README.md`, `.harness/INSTALLATION.md`, `.harness/HARNESS_SKILLS.md` | Refresh from upstream/install timestamp | Harness reinstall metadata | Low |
| `.harness/guides/**`, `.harness/templates/**`, `.harness/project-templates/**`, `.harness/scripts/**` | Replace from upstream seed | Kernel update | Medium |
| `.harness/skills/project-sync.md` | Refresh from upstream seed | Seeded workflow skill | Low |
| `.harness/runs/RUN_INDEX.md`, current run directory | Update run evidence/status | Harness lifecycle evidence | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| Existing completed runs | `.harness/runs/*` history | No active conflict detected; history must be preserved | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] Installer path uses upstream bootstrap/tarball and no `git clone`.
- [ ] Harness kernel/template/script files are reinstalled while local project adapters, backlog, and run history remain present.
- [ ] Application source and package/runtime files are unchanged by this task.
- [ ] Verification confirms Harness scripts still run.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
# Harness verification
bash .harness/scripts/verify.sh

# Diff/source-boundary inspection
git diff --name-only
find . -maxdepth 3 -type d -name 'harness-engineering' -o -name '.git'
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
# Không cần runtime app check vì task chỉ đổi Harness infrastructure.
```

## Rollback / Safety Notes

- `AGENTS.md` cũ được backup bởi installer.
- Nếu installer fail trước khi ghi xong, inspect `git diff` và backup files trước khi quyết định rollback.

## Questions / Assumptions

- Assumption: user muốn reinstall Harness seed, không phải đổi remote origin của app repo.
- Assumption: `replace` là phù hợp vì `AGENTS.md` hiện tại là Harness bootstrap cũ; backup giữ đường lui.

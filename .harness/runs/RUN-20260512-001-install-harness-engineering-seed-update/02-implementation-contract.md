# Implementation Contract

## Runtime Metadata

- Role: Planner Agent
- Contract author session: codex-local-session
- Runtime mode: fallback_single_session
- Independence: degraded
- Reason: Separate runtime role sessions are unavailable in this environment.

## Contract Status

Approved for fallback execution after local contract review.

## Goal

Install or update Harness from `https://github.com/haketienloc10/harness-engineering` according to upstream instructions without cloning the repository.

## Planned Change

- Fetch upstream README/installer with `curl` and inspect install instructions.
- Run official bootstrap installer from upstream with `--target "$(pwd)" --agents-mode merge --yes`.
- Preserve local project adapter, backlog, and run history as the installer promises.
- Record verification evidence in run artifacts.

## Non-Goals

- Do not modify application source files.
- Do not manually rewrite Harness kernel files after installer success.
- Do not clone upstream repository.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `.harness/README.md` | overwritten by upstream template | Harness seed update | Medium |
| `.harness/HARNESS_SKILLS.md` | overwritten by upstream template | Harness skill registry update | Medium |
| `.harness/INSTALLATION.md` | rewritten by installer | install record | Low |
| `.harness/guides/` | replaced by upstream template | kernel update | Medium |
| `.harness/templates/` | replaced by upstream template | kernel update | Medium |
| `.harness/project-templates/` | replaced by upstream template | kernel update | Medium |
| `.harness/scripts/` | replaced by upstream template | kernel update | Medium |
| `.harness/skills/` | seeded skills copied without deleting local extras | add workflow skills | Low |
| `.harness/codebase/` | created if missing | source-navigation docs seed | Low |
| `AGENTS.md` | merged by installer, backup created | activate latest Harness instructions | Medium |
| `.harness/runs/RUN-20260512-001-install-harness-engineering-seed-update/` | run artifacts updated | audit trail | Low |
| `.harness/runs/RUN_INDEX.md` | run status updated | audit trail | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| none | n/a | No other active runs found before implementation | Continue |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] Installer runs via `curl`/tarball bootstrap, with no `git clone`.
- [ ] Existing local `.harness/project/*`, `.harness/backlog/HARNESS_BACKLOG.md`, and `.harness/runs/*` remain present.
- [ ] Upstream-added `.harness/codebase/*` and `codebase-sync` skill are present if included by current template.
- [ ] Repository verification command completes or any failure is documented with evidence.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
git status --short
rg --files -uu .harness/codebase .harness/skills | sort
bash .harness/scripts/verify.sh
```

## Manual / Runtime Checks

No app runtime smoke is required for this Harness installation task unless `verify.sh` indicates otherwise.

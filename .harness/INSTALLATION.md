# Harness Installation

Installed at: 2026-05-14T00:17:45+07:00

This target repository owns its installed `.harness/` tree.

## Ownership Rules

- `.harness/project/*` belongs to this target repository. The installer creates missing files only and does not overwrite existing project adapter files.
- `.harness/codebase/*` belongs to this target repository. The installer creates missing files only and does not overwrite existing source-navigation or change-impact files.
- `.harness/runs/RUN_INDEX.md`, root runs, Epic containers, and child runs belong to this target repository. The installer does not reset existing run history.
- Legacy `.harness/epics/*`, if present from older Harness installs, belongs to this target repository and is never deleted by the installer.
- `.harness/backlog/HARNESS_BACKLOG.md` belongs to this target repository. The installer does not overwrite it if it already exists.
- `.codex/config.toml` is created if missing. If it exists, the installer backs it up and merges only missing Harness `[agents]` defaults.
- `.codex/agents/*.toml` contains fixed Harness lifecycle Codex custom agents. Same-name files are backed up before overwrite.
- `.codex/skills/harness-*/SKILL.md` contains Harness workflow skills. Same-name skill directories are backed up before overwrite.
- Kernel folders may be replaced during an explicit update:
  - `.harness/guides/`
  - `.harness/workflows/`
  - `.harness/templates/`
  - `.harness/project-templates/`
  - `.harness/scripts/`
- Deprecated `.harness/subagents/` is removed during update; canonical lifecycle role definitions live in `.codex/agents/*.toml`.
- Deprecated `.harness/HARNESS_SKILLS.md` and seeded `.harness/skills/*.md` are removed during update; canonical workflow skills live in `.codex/skills/harness-*/SKILL.md`.

## Recommended Next Steps

Ask your agent:

```txt
Use `.codex/skills/harness-project-sync/SKILL.md` to refresh project context.
Then use `.codex/skills/harness-codebase-sync/SKILL.md` if source-navigation or change-impact docs are missing or stale.
```

Harness Codex lifecycle agents are installed in `.codex/agents/*.toml`.

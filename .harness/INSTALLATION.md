# Harness Installation

Installed at: 2026-05-12T12:51:24+07:00

This target repository owns its installed `.harness/` tree.

## Ownership Rules

- `.harness/project/*` belongs to this target repository. The installer creates missing files only and does not overwrite existing project adapter files.
- `.harness/runs/RUN_INDEX.md`, root runs, Epic containers, and child runs belong to this target repository. The installer does not reset existing run history.
- Legacy `.harness/epics/*`, if present from older Harness installs, belongs to this target repository and is never deleted by the installer.
- `.harness/backlog/HARNESS_BACKLOG.md` belongs to this target repository. The installer does not overwrite it if it already exists.
- Kernel folders may be replaced during an explicit update:
  - `.harness/guides/`
  - `.harness/templates/`
  - `.harness/project-templates/`
  - `.harness/scripts/`
- Seeded Harness workflow skill files are copied into `.harness/skills/` without deleting other local skill files.

## Recommended Next Steps

Ask your agent:

```txt
Read `.harness/HARNESS_SKILLS.md` and run the `project-sync` Harness workflow skill.
```

No native-agent skill installation is required.

# Harness Installation

Installed at: 2026-05-11T23:50:08+07:00

This target repository owns its installed `.harness/` tree.

## Ownership Rules

- `.harness/project/*` belongs to this target repository. The installer creates missing files only and does not overwrite existing project adapter files.
- `.harness/runs/RUN_INDEX.md` and run history belong to this target repository. The installer does not reset an existing run index and does not copy run history from the seed template.
- `.harness/backlog/HARNESS_BACKLOG.md` belongs to this target repository. The installer does not overwrite it if it already exists.
- Kernel folders may be replaced during an explicit update:
  - `.harness/guides/`
  - `.harness/templates/`
  - `.harness/project-templates/`
  - `.harness/scripts/`

## Recommended Next Steps

```bash
bash .harness/scripts/inspect-project.sh
bash .harness/scripts/verify.sh
```

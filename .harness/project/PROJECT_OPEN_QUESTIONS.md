# Project Open Questions

Synced at: `2026-05-14T00:22:45+07:00`

## Open Questions

- README does not document intended full game rules; source code is currently the best behavior reference.
- No lint command is declared. Confirm whether linting should be added to project verification in future work.
- `dist/` is present in the workspace. Confirm whether build output is intentionally tracked or just local generated output.
- `AGENTS.harness.md` was referenced by the IDE context but is missing from the workspace. Confirm whether it should exist.
- `.codex/`, `.harness/`, and `AGENTS.md` are currently untracked according to `git status --short`; confirm whether Harness files should be committed.

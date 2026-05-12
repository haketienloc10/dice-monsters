# Project Open Questions

Last reviewed: 2026-05-12

## Open Questions

- Should `README.md` eventually document gameplay rules, development setup, and verification commands? Current evidence is source/test based because README only contains the title.
- Is P2 always intended to be AI-controlled, or should player control be configurable in the UI later?
- Are `dist/`, `playwright-report/`, and `test-results/` intentionally kept in the working tree for local reference, or should they remain ignored/generated only?
- Is there a preferred browser support target beyond the current Playwright Desktop Chrome project?
- Should a lint/format command be added, or are `npm run test`, `npm run build`, and `npm run test:e2e` the intended validation set?

## Low-Confidence Areas

- Product naming and intended ruleset are inferred from code names and UI strings. There is no detailed product spec in docs.
- No deployment target or hosting workflow was observed.

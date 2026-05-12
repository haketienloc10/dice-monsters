# Project Open Questions

Last reviewed: 2026-05-12

## Open Questions

- Should the repository keep committed generated artifacts such as `dist/`, `playwright-report/`, and `test-results/`, or should they remain untracked outputs only?
- Is the intended viewport strictly desktop-only, or should future work include responsive/mobile support beyond the current desktop warning?
- Are `magic`, `trap`, and `defense` crests planned to gain additional gameplay effects beyond their current observed use in dice/resource data?
- Should `README.md` be expanded with install, dev, test, and gameplay notes?
- Is P2 always intended to be AI-controlled, or should player control settings become user-configurable?

## Assumptions To Recheck

- The current rules are source-of-truth because no separate design document was found.
- `npm run test`, `npm run build`, and `npm run test:e2e` are the main verification path because they are the only scripts defined in `package.json`.

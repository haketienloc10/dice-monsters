# Run Input

## Run ID

RUN-20260512-004-add-real-e2e-tests

## Related Epic

None

## Source

- Manual request

## Original Request

```text
hãy thêm E2E test thật để kiểm chứng giúp tôi
```

## Business Goal

Add real browser-level E2E verification for the playable game UI so key flows are tested outside jsdom.

## Constraints

- Tech stack: Vite, React, TypeScript, Vitest.
- Không được thay đổi: game rules or UI behaviour.
- Chỉ được thay đổi: E2E test infrastructure, package scripts/dependencies, test files.

## Expected Output

- Code change: Playwright config and E2E test.
- Test: E2E test runs in a real browser.
- Document: Harness run artifacts updated.

## Parallel / Conflict Notes

- Existing dirty worktree contains completed UI upgrade changes.
- This run should avoid editing UI/game files unless testability requires it.

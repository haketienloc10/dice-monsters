# Implementation Contract

## Contract Status

Approved

## Goal

Add deterministic rule-based AI for Player 2 that acts through normal `GameAction` dispatches and obeys current reducer/rule legality.

## Planned Change

- Extend game state with `settings.controls` and default `{ P1: "human", P2: "ai" }`.
- Add `src/game/ai/` modules for action type aliases, legal action discovery, scoring, and next-action planning.
- Add a small React AI controller hook/wiring in `GameScreen` that observes current state, dispatches one planned action after delay, tracks per-turn action count/attempts, and ends turn at cap.
- Update UI components to show P2 `[AI]`, show "AI is thinking..." during AI turn, and disable human controls/board clicks/roll during AI turn.
- Adjust reducer logs to label current AI player actions as `P2 AI ...` while still using existing reducer actions.
- Add focused unit tests for AI priority/legal helper behaviours and component smoke for automatic P2 turn.

## Non-Goals

- No LLM/backend/API integration.
- No `"easy"` difficulty unless it is trivial without extra branches; default MVP is `"normal"` only.
- No direct state mutation by AI.
- No game balance/data rewrite.
- No new E2E framework.

## Files / Areas Expected to Change

| Area/File | Expected Change | Reason | Conflict Risk |
|---|---|---|---|
| `src/game/types.ts` | Add settings/control types; export AI action-compatible types if needed | State contract | Medium |
| `src/game/initialState.ts` | Add default settings | Initial state | Low |
| `src/game/reducer.ts` | Preserve normal actions; AI-aware log labels only | UX/log requirement | Medium |
| `src/game/ai/**` | New planner, scoring, legal helper, controller constants/types/tests | AI logic outside UI | Low |
| `src/components/GameScreen.tsx` | Wire AI controller and ignore board clicks on AI turn | Runtime AI behaviour | Medium |
| `src/components/ActionPanel.tsx`, `DiceTray.tsx`, `TopBar.tsx` | Disable controls/status/AI label | UX gating | Medium |
| `src/components/GameScreen.test.tsx` | Add/update smoke tests for AI turn | Behaviour evidence | Low |
| `.harness/runs/RUN-20260512-001-add-ai-controlled-player-2/**` | Lifecycle artifacts | Required workflow | Low |

## Conflict Check

Active runs checked:

- [x] Yes
- [ ] No

Potential conflicts:

| Run ID | File/Area | Conflict | Decision |
|---|---|---|---|
| `RUN-20260512-001-update-project-context-movement-rules` | Harness project/run docs only by observed status/search | No application file overlap observed | Continue |
| Existing dirty worktree | `.harness/runs/RUN_INDEX.md`, `.harness/runs/RUN-20260512-001-update-project-context-movement-rules/**` | Same index file will be appended/updated | Continue carefully; do not revert unrelated lines |

## Behaviour Contract

Sau khi implement, hệ thống phải có các hành vi sau:

- [ ] P2 is AI by default via `state.settings.controls.P2 === "ai"` and P1 remains human.
- [ ] During P2 roll phase, AI dispatches `ROLL_DICE` through the reducer.
- [ ] During P2 summon phase, AI selects a legal summon candidate and places a legal shape when possible; otherwise dispatches `SKIP_SUMMON`.
- [ ] During P2 action phase, AI prioritizes valid core attack, killable/high-value monster attack, useful movement toward P1 core, then `END_TURN`.
- [ ] Legal option helpers reuse existing rule functions for placement, movement, and attack legality.
- [ ] AI movement cannot pass through occupied cells, cannot enter core cells, and only follows continuous dungeon tiles because it uses movement rules.
- [ ] AI attacks and movement spend crests via reducer actions.
- [ ] AI dispatches at most one action per controller cycle and hard-caps actions per turn.
- [ ] Human roll/action/board interactions are disabled or ignored during AI turn, except reset/game over behaviour.
- [ ] Top bar labels P2 as AI and displays AI thinking status during AI turn.
- [ ] AI-related actions are visible in game log.

## Verification Plan

Evaluator có thể kiểm chứng bằng:

```bash
# Build
npm run build

# Unit tests
npm test

# Harness aggregate
bash .harness/scripts/verify.sh

# Smoke test
npm test -- --run src/components/GameScreen.test.tsx
```

## Manual / Runtime Checks

Nếu cần chạy app thật:

```bash
# Start app
npm run dev -- --host 127.0.0.1

# Check endpoint/page
APP_URL=http://127.0.0.1:5173 bash .harness/scripts/smoke.sh
```

## Rollback / Safety Notes

- Changes are isolated to AI/UI wiring and tests. Reducer remains source of truth; AI planner never returns direct state patches.

## Questions / Assumptions

- Assumption 1: `"normal"` deterministic scoring is sufficient; optional difficulty is out of scope.
- Assumption 2: It is acceptable for reducer log strings to include `AI` based on `state.settings.controls[currentPlayer]`.
- Assumption 3: Testing Library async timer/wait assertions are sufficient behaviour-level evidence; no new Playwright dependency.

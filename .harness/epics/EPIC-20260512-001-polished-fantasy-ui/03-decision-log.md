# Epic Decision Log

| Time | Decision | Reason | Impact |
|---|---|---|---|
| 2026-05-12T00:00:00+07:00 | Use existing React/CSS structure instead of full folder rewrite. | Current component split is small and understandable; user asked not to rewrite unnecessarily. | Lower churn, easier verification. |
| 2026-05-12T00:00:00+07:00 | Keep animations UI-level with optional reducer `lastEvent` metadata only. | Rules must remain source of truth while UI needs reliable action feedback. | Minimal game-model extension without changing mechanics. |

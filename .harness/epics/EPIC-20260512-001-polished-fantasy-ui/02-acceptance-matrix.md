# Epic Acceptance Matrix

| Criteria | Required | Evidence Run | Status | Notes |
|---|---:|---|---|---|
| Game fills viewport with polished fantasy layout | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | `layout.css`, smoke passed |
| Board cells, dungeon tiles, P1/P2 ownership, and cores are visually polished | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | `board.css`, `CoreBase` |
| Monster tokens replace plain text and show owner/HP/level/selection | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | `MonsterToken` |
| Dice tray and crest bar are icon-based and animated | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | `DiceTray`, `CrestBar`, `animations.css` |
| Roll/summon/move/attack/damage/core/phase feedback animations exist | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | `lastEvent`, `BoardEffects`, `phase-banner` |
| Gameplay actions and AI turn remain reducer-driven and legal | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | 18 tests passed |
| `npm run build` passes | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | build passed |
| No official copyrighted assets/names are introduced | Yes | RUN-20260512-002-polished-fantasy-ui-foundation | Pass | CSS/lucide/original text only |

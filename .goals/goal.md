Bạn là coding agent trong repo:

https://github.com/haketienloc10/dice-monsters

Nhiệm vụ: hoàn thiện game Dice Monsters theo hướng “Dungeon Dice Monsters inspired tactical board game”, bám sát core rule của Dungeon Dice Monsters, nhưng giữ kích thước board hiện tại là 13x9.

Không mở rộng board thành 13x19. Board 13x9 là quyết định thiết kế cố định của repo này để phù hợp UI hiện tại.

Không dùng asset/copyrighted art/name/logo chính thức nếu repo chưa có quyền. Giữ tên project là dice-monsters hoặc tên generic/fan-inspired trong code/UI.

Mục tiêu sản phẩm:

Biến game hiện tại thành một bản playable core loop sát tinh thần Dungeon Dice Monsters:

1. 2 người chơi ở hai đầu bàn.
2. Bàn cờ giữ nguyên 13 x 9.
3. Mỗi người có Dungeon Master / Monster Lord đứng ở vùng xuất phát.
4. Dungeon Master có 3 Life Points, mỗi lần bị attack hợp lệ mất đúng 1 LP.
5. Người chơi roll 3 dice đầu turn.
6. Dice face gồm 6 loại crest:
   - summon
   - move / progress
   - attack
   - defense
   - magic
   - trap
7. Non-summon crest được đưa vào crest pool và có thể tích lũy.
8. Summon / Dimension chỉ hợp lệ khi roll có ít nhất 2 Summon Crest cùng level.
9. Khi summon, người chơi chọn một die hợp lệ, unfold/dimension thành dungeon path shape nối với dungeon/path hiện có của mình.
10. Monster được đặt lên một ô thuộc path vừa dimension.
11. Monster chỉ được di chuyển trên dungeon path.
12. Move tốn Movement/Progress Crest theo số ô di chuyển.
13. Attack thường tốn 1 Attack Crest.
14. Mỗi monster chỉ normal attack 1 lần mỗi turn.
15. Defense reaction tốn 1 Defense Crest.
16. Monster có HP/ATK/DEF. Damage:
    - Nếu defender không defend: defender nhận damage = attacker ATK.
    - Nếu defender defend: damage = max(0, attacker ATK - defender DEF).
    - Không dùng rule hiện tại kiểu luôn ít nhất 1 damage.
17. Monster bị HP <= 0 thì bị remove khỏi board.
18. Attack Dungeon Master / Monster Lord:
    - Dungeon Master không di chuyển.
    - Mỗi attack hợp lệ vào Dungeon Master làm mất đúng 1 LP.
    - Không dùng monster ATK làm damage trực tiếp vào Dungeon Master.
    - Khi Dungeon Master LP = 0 thì đối thủ thắng.
19. Win condition:
    - chính: đối thủ mất toàn bộ 3 LP.
    - phụ: chưa cần implement nếu chưa có rule rõ. Không tự chế rule phụ làm hỏng core loop.
20. P2 do AI điều khiển, nhưng AI phải tuân thủ đúng cùng luật với P1.

Quan trọng:

- Đây là task lớn. Không được sửa “tạm cho chạy”.
- Hãy dùng kiến trúc rule/state rõ ràng.
- Không hard-code workaround trong UI component nếu logic thuộc game rules.
- Rule phải nằm dưới `src/game/rules` hoặc module tương đương.
- UI component chỉ render state và dispatch action.

Yêu cầu trước khi sửa code:

1. Đọc:
   - AGENTS.md
   - package.json
   - src/game/**
   - src/components/**
   - e2e/**
   - .harness nếu có policy workflow
2. Xác định hiện trạng:
   - board đang là 13x9 và phải giữ nguyên
   - core/dungeon master HP hiện tại
   - reducer phase hiện tại
   - dice/summon/move/combat/AI đang xử lý thế nào
   - test hiện có
3. Không xóa UI/animation hiện có nếu có thể refactor để dùng lại.
4. Không đổi board sang 13x19.

Các vấn đề cần sửa ưu tiên:

A. Board / Dungeon Master

- Giữ board 13 x 9.
- Không đổi `BOARD_WIDTH = 13`.
- Không đổi `BOARD_HEIGHT = 9`.
- P1/P2 ở hai đầu board hiện tại.
- Đổi Dungeon Master/Core LP về 3.
- Nếu code đang dùng `coreHp`, có thể:
  - đổi thành `dungeonMasterLp`, hoặc
  - giữ `coreHp` để giảm churn nhưng UI/log phải hiển thị là Dungeon Master LP.
- Dungeon Master:
  - không move
  - không phải monster thường
  - có thể bị attack khi target hợp lệ
  - mỗi hit trừ đúng 1 LP
  - không nhận damage bằng monster ATK.

B. Dice Pool / Dice Roll

Thiết kế lại dice pool cho đúng core DDM hơn:

- Mỗi player có dice pool 12 dice.
- Có 3 dice mỗi level 1-4 trong bản MVP.
- Mỗi turn, player roll 3 dice.
- Không được luôn roll `dicePool.slice(0, 3)` cố định.
- MVP acceptable:
  - mỗi turn chọn ngẫu nhiên 3 dice từ dicePool.
- Better:
  - player có current dice hand 3 dice và refill mỗi turn.
- Mỗi die có `level`.
- Summon crest count theo level:
  - Level 1 die: 4 summon faces
  - Level 2 die: 3 summon faces
  - Level 3 die: 2 summon faces
  - Level 4 die: 1 summon face
- Các face còn lại là move/attack/defense/magic/trap.
- Non-summon crest đi vào crest pool.
- Summon crest không lưu vào crest pool.

C. Summon / Dimension Rule

Sửa summon candidate logic:

- Chỉ summon nếu có ít nhất 2 dice roll ra Summon Crest cùng `summonLevel`.
- Nếu nhiều level cùng hợp lệ, cho phép chọn nhóm level hợp lệ.
- Monster được summon phải thuộc die đã roll summon crest trong group hợp lệ.
- Không cho summon nếu 2 summon crest khác level.
- Khi summon, die/dimension path phải được đặt nối với dungeon/path của player.
- Không cho overlap:
  - dungeon master/core
  - existing dungeon tile
  - monster
  - ngoài board
- Monster spawn trên một ô thuộc dimension shape:
  - MVP: spawn tại anchor/first cell của shape.
  - Better: cho chọn spawn cell sau khi đặt shape.
- Dimension/path phải tạo thành network nối với dungeon/path hiện có của player.
- Không cho đặt path rời rạc không nối mạng.
- Không cho đặt path liền kề trực tiếp vào enemy Dungeon Master nếu điều đó bypass rule attack/path; nếu game hiện tại đã có rule này thì giữ.
- Thêm `dimensionsUsed` vào player state nếu chưa có.
- Giới hạn dimension:
  - MVP: tối đa 10 dimensions/player.
  - UI hiển thị số dimension còn lại.

D. Dungeon Path / Movement

- Monster chỉ move trên dungeon path hợp lệ.
- Không đi vào ô không có dungeon tile.
- Không đi xuyên monster khác.
- Không đi xuyên Dungeon Master.
- Move cost = số ô đi.
- Mỗi ô đi tốn 1 move/progress crest.
- Pathfinding phải dùng BFS trên dungeon tiles.
- Reachable cells:
  - là dungeon tiles cùng network
  - không occupied
  - distance <= available move/progress crest
  - nếu giữ `monster.move` thì distance <= min(monster.move, available move crest)
- Không dùng teleport hoặc direct Manhattan nếu không qua path.

E. Combat / Defense Reaction

Sửa combat:

- Attack chỉ được nếu:
  - phase action
  - selected monster thuộc current player
  - monster chưa attack turn này
  - current player có >= 1 attack crest
  - target hợp lệ theo range/adjacency
- Normal attack target:
  - mặc định chỉ orthogonal adjacent: up/down/left/right.
  - Nếu monster có `range > 1`, cho ranged theo monster data.
- Khi attack monster:
  - spend 1 attack crest
  - set `hasActedAttack = true`
  - defender có thể defend nếu có Defense Crest.
- Defense rule:
  - Defend tốn 1 Defense Crest của defender.
  - Nếu defender defend: damage = max(0, attacker.atk - defender.def).
  - Nếu defender không defend: damage = attacker.atk.
- Nếu chưa kịp làm manual defense reaction UI:
  - AI defender tự defend nếu có lợi.
  - Human defender có thể có toggle/auto-defend đơn giản.
  - Nhưng combat rule function phải hỗ trợ cả defended và undefended.
- Không còn rule `Math.max(1, atk - def)` cho combat thường.
- Monster HP <= 0 thì remove khỏi board và khỏi summoned list.

F. Dungeon Master Attack

- Attack target có thể là `dungeonMaster` hoặc `core` tùy type hiện tại.
- Khi monster attack Dungeon Master:
  - Spend 1 attack crest.
  - Mark monster attacked.
  - Defender LP -= 1.
  - Ignore monster ATK value for LP damage.
  - If LP reaches 0 => gameOver.
- Dungeon Master không được treated như normal monster HP.

G. Turn Lifecycle

Chuẩn hóa phase:

- Có thể dùng phase hiện tại nếu đủ rõ:
  - roll
  - summon
  - action
  - gameOver
- Hoặc tách rõ hơn:
  - roll
  - summonDecision
  - dimensionPlacement
  - action
  - defenseReaction
  - gameOver

Turn flow bắt buộc:

1. Start player turn:
   - reset own monsters `hasActedAttack = false`
   - prepare 3 dice for turn
2. Roll dice.
3. Add non-summon crest to crest pool.
4. Nếu summon available:
   - allow summon hoặc skip summon
5. Action phase:
   - select monster
   - move
   - attack
   - use ability nếu implemented
   - end turn
6. End turn:
   - switch player
   - go to roll phase.

H. Magic / Trap / Special Abilities

MVP không cần full ability phức tạp, nhưng phải thiết kế extensible:

- Thêm `ability` field rõ nếu chưa có:
  - id
  - name
  - cost: crest type/count
  - timing: action/attack/defense/passive
  - effect handler optional
- Implement tối thiểu nếu scope cho phép:
  1. Magic ability: spend 1 magic crest to add temporary +1 attack hoặc +10 attack tùy scale stat hiện tại.
  2. Trap/defense ability: spend 1 trap crest when attacked to reduce/cancel damage.
- Nếu chưa đủ thời gian:
  - tạo type/schema + docs + tests cho ability framework
  - core loop vẫn phải playable.

I. AI P2

AI không được cheat.

AI priority:

1. Nếu có attack target là enemy Dungeon Master, attack.
2. Nếu có attack có thể destroy monster, attack.
3. Nếu summon available, choose legal summon that extends path toward P1 Dungeon Master.
4. Move closest monster toward enemy Dungeon Master along dungeon path.
5. Nếu không có action hữu ích, end turn.

AI phải dùng cùng reducer actions như human:

- ROLL_DICE
- SELECT_SUMMON_CANDIDATE
- PLACE_DUNGEON_SHAPE
- SELECT_MONSTER
- ENTER_MOVE_MODE
- MOVE_MONSTER
- ENTER_ATTACK_MODE
- ATTACK_TARGET
- END_TURN

Không được mutate state trực tiếp trong AI.

J. UI/UX Requirements

Giữ fantasy 2D board style hiện tại nếu có.

Cần cải thiện UI để người chơi hiểu DDM hơn:

- Board giữ 13x9.
- Board không vỡ layout.
- Game log không được làm vỡ layout khi dài:
  - fixed height
  - overflow-y auto
  - newest event visible
- Hiển thị rõ:
  - current player
  - phase
  - Dungeon Master LP: 3 hearts hoặc 3 pips
  - crest pool từng người hoặc current player
  - dice rolled this turn
  - summon candidates by level
  - remaining dimensions
  - selected monster HP/ATK/DEF/range/ability
- Placement preview:
  - valid cells màu hợp lệ
  - invalid cells màu lỗi
  - rotation button
- Attack/move highlights:
  - move cells
  - attack targets
  - Dungeon Master target highlight
- Animations:
  - dice roll animation
  - dimension/path placement animation
  - monster move animation
  - attack projectile/slash
  - damage number
  - monster destroyed effect
  - Dungeon Master LP hit effect
- Không dùng hình ảnh official/copyrighted. Dùng CSS/icon/generic fantasy art.

K. Data Model

Refactor types nếu cần.

Suggested model:

```ts
type PlayerState = {
  id: PlayerId;
  name: string;
  dungeonMasterLp: number; // 3
  dicePool: DiceDefinition[];
  crestPool: CrestPool;
  summonedMonsterIds: string[];
  dimensionsUsed: number;
};

type DiceDefinition = {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4;
  monsterId: string;
  faces: DiceFace[];
  tileShapeId: string;
};

type DiceFace = {
  crest: CrestType;
  summonLevel?: 1 | 2 | 3 | 4;
  amount?: number;
};

type MonsterDefinition = {
  id: string;
  name: string;
  type: string;
  level: 1 | 2 | 3 | 4;
  hp: number;
  atk: number;
  def: number;
  range: number;
  move?: number;
  movementType?: "normal" | "flying" | "tunnel";
  ability?: MonsterAbilityDefinition;
};
````

Nếu muốn giảm churn, có thể giữ `coreHp` trong code nhưng phải đảm bảo semantic là Dungeon Master LP = 3 và attack core trừ đúng 1.

L. Tests Required

Không được chỉ sửa UI rồi build pass.

Cần thêm/chỉnh unit test cho rules:

1. Board:

   * create board 13x9
   * không đổi sang 13x19
   * Dungeon Masters placed correctly
   * Dungeon Master LP = 3
2. Dice:

   * level 1 has 4 summon faces
   * level 2 has 3 summon faces
   * level 3 has 2 summon faces
   * level 4 has 1 summon face
   * non-summon crests go to crest pool
   * summon crest not added to crest pool
   * roll 3 dice không phải luôn `dicePool.slice(0, 3)`
3. Summon:

   * cannot summon with fewer than 2 summon crests
   * cannot summon with 2 summon crests of different levels
   * can summon with 2 same-level summon crests
   * placement must connect to own dungeon/path
   * placement cannot overlap existing tile/core/monster
   * dimension count limit enforced
4. Movement:

   * can move on own dungeon path
   * cannot move off path
   * cannot move through occupied cell
   * move spends exact movement crest count
5. Combat:

   * attack spends attack crest
   * monster can attack once per turn
   * undefended damage = ATK
   * defended damage = max(0, ATK - DEF)
   * destroyed monster removed
6. Dungeon Master:

   * attack Dungeon Master reduces LP by exactly 1
   * ATK does not change Dungeon Master LP damage
   * LP 0 triggers gameOver and winner
7. AI:

   * AI uses legal actions only
   * AI attacks Dungeon Master if available
   * AI ends turn if no legal action

E2E Playwright tests required:

1. App loads.
2. Player can roll dice.
3. If summon candidate appears, UI can select/skip summon.
4. Game log container does not grow layout infinitely.
5. Board remains visible and playable after many log entries.
6. A deterministic scenario can attack Dungeon Master and show LP decrease.
7. Reset game works after game over.

Nếu random khiến E2E khó ổn định:

* Thêm deterministic test seed hoặc dev/test mode.
* Không mock toàn bộ game; chỉ inject deterministic dice results.

M. Verification Required

Chạy và ghi evidence:

```bash
npm run build
npm run test
npm run test:e2e
```

Nếu có Harness scripts:

```bash
bash .harness/scripts/verify.sh
```

hoặc nếu repo dùng path khác, đọc AGENTS.md để chạy đúng.

Nếu UI cần smoke:

```bash
npm run dev -- --host 127.0.0.1
```

Rồi dùng Playwright hoặc browser smoke phù hợp.

N. Documentation Required

Cập nhật hoặc tạo docs:

* `README.md`:

  * mô tả game
  * cách chạy
  * cách test
  * tóm tắt luật implemented
* Tạo `docs/rules.md` hoặc `src/game/rules/README.md`:

  * board 13x9 là intentional adaptation
  * dice/crest
  * summon/dimension
  * movement
  * combat/defense
  * Dungeon Master win condition
  * known deviations from original DDM inspiration
* Ghi rõ:

  * Đây là inspired implementation, không dùng official copyrighted assets.
  * Board giữ 13x9 để phù hợp UI/game balance hiện tại.
  * Những rule chưa implement để backlog.

O. Acceptance Criteria

Task chỉ được coi là xong khi:

* Game playable từ đầu tới win/loss.
* Board logical vẫn là 13x9.
* Không có thay đổi nào đổi board sang 13x19.
* Dungeon Master LP là 3.
* Dice/summon rule yêu cầu 2 summon crests cùng level.
* Monster move trên dungeon path và tốn movement crest.
* Attack/defense damage đúng rule.
* Attack Dungeon Master trừ đúng 1 LP.
* P2 AI có thể chơi turn hợp lệ.
* UI không vỡ khi board/log dài.
* Unit tests pass.
* E2E tests pass hoặc có bằng chứng rõ nếu môi trường không chạy được.
* Docs cập nhật rõ luật và deviation.
import { describe, expect, it } from "vitest";
import { diceCatalog } from "../data/diceCatalog";
import { monsters } from "../data/monsters";
import { createInitialState } from "../initialState";
import type { GameState, MonsterInstance, PlayerId } from "../types";
import { gameReducer } from "../reducer";
import { calculateMonsterDamage, calculatePowerChargeMonsterDamage, getValidAttackTargets } from "./combat";
import { getCell } from "./board";
import { getSummonCandidates, rollDicePool } from "./dice";
import { getMovementDistance, getReachableCells } from "./movement";
import { isValidDungeonPlacement } from "./summon";
import { endTurn } from "./turn";

function addMonster(state: GameState, monster: MonsterInstance): void {
  state.monsters[monster.instanceId] = monster;
  const cell = getCell(state.board, monster);
  if (cell) cell.monsterId = monster.instanceId;
  state.players[monster.owner].summonedMonsterIds.push(monster.instanceId);
}

function markDungeonTile(state: GameState, x: number, y: number, owner: PlayerId): void {
  state.board[y][x] = { ...state.board[y][x], hasDungeonTile: true, tileOwner: owner, owner };
}

describe("dice rules", () => {
  it("maps deterministic roll results and summon candidates", () => {
    const roll = rollDicePool(diceCatalog, 3, () => 0);

    expect(roll).toHaveLength(3);
    expect(roll.map((result) => result.face.crest)).toEqual(["summon", "summon", "summon"]);
    expect(getSummonCandidates(roll)).toEqual([
      "dice-little-swordsman",
      "dice-stone-guardian",
      "dice-skyblade-avian"
    ]);
  });
});

describe("dungeon placement rules", () => {
  it("allows a shape adjacent to the current player's dungeon network", () => {
    const state = createInitialState();

    expect(isValidDungeonPlacement(state, "P1", "straight2", { x: 2, y: 4 }, 0)).toBe(true);
  });

  it("rejects overlap with existing tiles and opponent core adjacency", () => {
    const state = createInitialState();

    expect(isValidDungeonPlacement(state, "P1", "straight2", { x: 1, y: 4 }, 0)).toBe(false);
    expect(isValidDungeonPlacement(state, "P1", "straight2", { x: 10, y: 4 }, 0)).toBe(false);
  });
});

describe("movement rules", () => {
  it("finds reachable owned dungeon cells and exact distance", () => {
    const state = createInitialState();
    markDungeonTile(state, 2, 4, "P1");
    markDungeonTile(state, 3, 4, "P1");
    state.players.P1.crestPool.move = 2;
    addMonster(state, {
      instanceId: "test-swordsman",
      definitionId: "little-swordsman",
      owner: "P1",
      x: 1,
      y: 4,
      hp: monsters["little-swordsman"].hp,
      hasActedAttack: false
    });

    expect(getReachableCells(state, "test-swordsman")).toEqual([
      { x: 2, y: 4 },
      { x: 3, y: 4 }
    ]);
    expect(getMovementDistance(state, "test-swordsman", { x: 3, y: 4 })).toBe(2);
  });

  it("allows entering opponent dungeon tiles through a continuous dungeon path", () => {
    const state = createInitialState();
    markDungeonTile(state, 2, 4, "P1");
    markDungeonTile(state, 3, 4, "P2");
    state.players.P1.crestPool.move = 2;
    addMonster(state, {
      instanceId: "test-swordsman",
      definitionId: "little-swordsman",
      owner: "P1",
      x: 1,
      y: 4,
      hp: monsters["little-swordsman"].hp,
      hasActedAttack: false
    });

    expect(getReachableCells(state, "test-swordsman")).toEqual([
      { x: 2, y: 4 },
      { x: 3, y: 4 }
    ]);
    expect(getMovementDistance(state, "test-swordsman", { x: 3, y: 4 })).toBe(2);
  });

  it("does not path through another monster", () => {
    const state = createInitialState();
    markDungeonTile(state, 2, 4, "P1");
    markDungeonTile(state, 3, 4, "P2");
    state.players.P1.crestPool.move = 3;
    addMonster(state, {
      instanceId: "test-swordsman",
      definitionId: "little-swordsman",
      owner: "P1",
      x: 1,
      y: 4,
      hp: monsters["little-swordsman"].hp,
      hasActedAttack: false
    });
    addMonster(state, {
      instanceId: "blocking-imp",
      definitionId: "shadow-imp",
      owner: "P2",
      x: 2,
      y: 4,
      hp: monsters["shadow-imp"].hp,
      hasActedAttack: false
    });

    expect(getMovementDistance(state, "test-swordsman", { x: 3, y: 4 })).toBeUndefined();
  });

  it("does not allow moving into a core", () => {
    const state = createInitialState();
    state.players.P1.crestPool.move = 1;
    addMonster(state, {
      instanceId: "test-swordsman",
      definitionId: "little-swordsman",
      owner: "P1",
      x: 11,
      y: 4,
      hp: monsters["little-swordsman"].hp,
      hasActedAttack: false
    });

    expect(getMovementDistance(state, "test-swordsman", { x: 12, y: 4 })).toBeUndefined();
    expect(getReachableCells(state, "test-swordsman")).not.toContainEqual({ x: 12, y: 4 });
  });
});

describe("combat rules", () => {
  it("calculates minimum 1 damage after defense", () => {
    expect(calculateMonsterDamage(2, 2)).toBe(1);
    expect(calculateMonsterDamage(4, 1)).toBe(3);
  });

  it("calculates Power Charge monster damage with +1 ATK and no minimum damage", () => {
    expect(calculatePowerChargeMonsterDamage(2, 2)).toBe(1);
    expect(calculatePowerChargeMonsterDamage(2, 5)).toBe(0);
  });

  it("targets the opponent core only through attack range", () => {
    const state = createInitialState();
    addMonster(state, {
      instanceId: "near-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 10,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });
    addMonster(state, {
      instanceId: "far-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 9,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });

    expect(getValidAttackTargets(state, "near-mage")).toContainEqual({ type: "core", playerId: "P2", x: 12, y: 4 });
    expect(getValidAttackTargets(state, "far-mage")).not.toContainEqual({ type: "core", playerId: "P2", x: 12, y: 4 });
  });
});

describe("Power Charge", () => {
  it("spends 1 Magic and marks a valid current-player board monster", () => {
    const state = { ...createInitialState(), phase: "action" as const };
    state.players.P1.crestPool.magic = 1;
    addMonster(state, {
      instanceId: "p1-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 1,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });

    const next = gameReducer(state, { type: "USE_POWER_CHARGE", monsterId: "p1-mage" });

    expect(next.players.P1.crestPool.magic).toBe(0);
    expect(next.monsters["p1-mage"].powerChargeActive).toBe(true);
    expect(next.lastEvent?.type).toBe("powerCharged");
    expect(next.log[0]).toMatch(/Power Charge/);
  });

  it("rejects invalid Power Charge targets without changing state", () => {
    const state = { ...createInitialState(), phase: "action" as const };
    state.players.P1.crestPool.magic = 1;
    addMonster(state, {
      instanceId: "p2-imp",
      definitionId: "shadow-imp",
      owner: "P2",
      x: 11,
      y: 4,
      hp: monsters["shadow-imp"].hp,
      hasActedAttack: false
    });

    expect(gameReducer(state, { type: "USE_POWER_CHARGE", monsterId: "p2-imp" })).toBe(state);
    const rollState = { ...state, phase: "roll" as const };
    expect(gameReducer(rollState, { type: "USE_POWER_CHARGE", monsterId: "p2-imp" })).toBe(rollState);
  });

  it("uses boosted monster damage once and clears the effect", () => {
    const state = { ...createInitialState(), phase: "action" as const };
    state.players.P1.crestPool.attack = 1;
    addMonster(state, {
      instanceId: "p1-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 4,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false,
      powerChargeActive: true
    });
    addMonster(state, {
      instanceId: "p2-avian",
      definitionId: "skyblade-avian",
      owner: "P2",
      x: 5,
      y: 4,
      hp: 2,
      hasActedAttack: false
    });
    state.selectedMonsterId = "p1-mage";
    state.interactionMode = "attacking";

    const next = gameReducer(state, {
      type: "ATTACK_TARGET",
      target: { type: "monster", monsterId: "p2-avian", x: 5, y: 4 }
    });

    expect(next.monsters["p1-mage"].powerChargeActive).toBeUndefined();
    expect(next.monsters["p2-avian"]).toBeUndefined();
    expect(next.lastEvent?.type === "attacked" ? next.lastEvent.damage : 0).toBe(2);
    expect(next.log.some((entry) => entry.includes("Power Charge was consumed"))).toBe(true);
  });

  it("does exactly 1 core damage when consumed against a core", () => {
    const state = { ...createInitialState(), phase: "action" as const };
    state.players.P1.crestPool.attack = 1;
    addMonster(state, {
      instanceId: "p1-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 10,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false,
      powerChargeActive: true
    });
    state.selectedMonsterId = "p1-mage";
    state.interactionMode = "attacking";

    const next = gameReducer(state, {
      type: "ATTACK_TARGET",
      target: { type: "core", playerId: "P2", x: 12, y: 4 }
    });

    expect(next.players.P2.coreHp).toBe(createInitialState().players.P2.coreHp - 1);
    expect(next.monsters["p1-mage"].powerChargeActive).toBeUndefined();
  });
});

describe("turn rules", () => {
  it("switches current player and increments turn after P2", () => {
    const p2State = { ...createInitialState(), currentPlayer: "P2" as const, phase: "action" as const };
    const next = endTurn(p2State);

    expect(next.currentPlayer).toBe("P1");
    expect(next.turnNumber).toBe(2);
    expect(next.phase).toBe("roll");
  });

  it("clears only the ending player's active Power Charge effects", () => {
    const state = { ...createInitialState(), phase: "action" as const };
    addMonster(state, {
      instanceId: "p1-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 1,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false,
      powerChargeActive: true
    });
    addMonster(state, {
      instanceId: "p2-imp",
      definitionId: "shadow-imp",
      owner: "P2",
      x: 11,
      y: 4,
      hp: monsters["shadow-imp"].hp,
      hasActedAttack: false,
      powerChargeActive: true
    });

    const next = endTurn(state);

    expect(next.monsters["p1-mage"].powerChargeActive).toBeUndefined();
    expect(next.monsters["p2-imp"].powerChargeActive).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { diceCatalog } from "../data/diceCatalog";
import { monsters } from "../data/monsters";
import { createInitialState } from "../initialState";
import type { GameState, MonsterInstance, PlayerId } from "../types";
import { calculateMonsterDamage, getValidAttackTargets } from "./combat";
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

describe("turn rules", () => {
  it("switches current player and increments turn after P2", () => {
    const p2State = { ...createInitialState(), currentPlayer: "P2" as const, phase: "action" as const };
    const next = endTurn(p2State);

    expect(next.currentPlayer).toBe("P1");
    expect(next.turnNumber).toBe(2);
    expect(next.phase).toBe("roll");
  });
});
